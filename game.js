(() => {
  "use strict";

  const STORY = window.OTOME_STORY;
  const SAVE_KEY = "juego-otome-demo-save-v1";
  const SETTINGS_KEY = "juego-otome-demo-settings-v1";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const els = {
    menu: $("#screen-menu"),
    game: $("#screen-game"),
    ending: $("#screen-ending"),
    scene: $("#scene"),
    dialogue: $("#dialogue"),
    dialogueTap: $("#dialogue-tap"),
    speaker: $("#speaker-name"),
    text: $("#dialogue-text"),
    choices: $("#choice-panel"),
    historyModal: $("#modal-history"),
    settingsModal: $("#modal-settings"),
    historyList: $("#history-list"),
    toast: $("#toast"),
    sfxWord: $("#sfx-word"),
    affinity: $("#affinity-summary"),
    btnContinue: $("#btn-continue"),
    speed: $("#setting-speed"),
    motion: $("#setting-motion"),
    sound: $("#setting-sound")
  };

  const sprites = {
    javi: $("#sprite-javi"),
    sue: $("#sprite-sue"),
    smokey: $("#sprite-smokey")
  };

  const wraps = Object.fromEntries(Object.keys(sprites).map((key) => [key, $(`[data-character="${key}"]`)]));

  let state = freshState();
  let settings = loadSettings();
  let typingTimer = null;
  let typingFullText = "";
  let isTyping = false;
  let currentNode = null;
  let audioContext = null;

  function freshState() {
    return {
      nodeId: STORY.start,
      affinity: { javi: 0, sue: 0, smokey: 0 },
      history: [],
      expressions: { javi: "neutral", sue: "neutral", smokey: "neutral" },
      startedAt: Date.now()
    };
  }

  function showScreen(name) {
    [els.menu, els.game, els.ending].forEach((screen) => screen.classList.remove("is-active"));
    ({ menu: els.menu, game: els.game, ending: els.ending })[name].classList.add("is-active");
  }

  function startNewGame() {
    state = freshState();
    persist();
    showScreen("game");
    goTo(state.nodeId, false);
  }

  function continueGame() {
    const loaded = readSave();
    if (!loaded) return startNewGame();
    state = loaded;
    showScreen("game");
    goTo(state.nodeId, false);
    toast("Partida cargada");
  }

  function goTo(id, addToHistory = true) {
    clearTyping();
    clearChoices();
    clearTemporaryEffects();

    if (id === "__END__") return finishDemo();

    const node = STORY.nodes[id];
    if (!node) {
      console.error("Nodo no encontrado:", id);
      toast("Ha ocurrido un error en la escena");
      return;
    }

    state.nodeId = id;
    currentNode = node;

    if (node.show) {
      Object.keys(wraps).forEach((character) => {
        wraps[character].classList.toggle("is-hidden", !node.show.includes(character));
      });
    } else {
      Object.values(wraps).forEach((wrap) => wrap.classList.remove("is-hidden"));
    }

    if (node.expressions) {
      Object.entries(node.expressions).forEach(([character, expression]) => {
        state.expressions[character] = expression;
      });
    }
    renderExpressions();
    setFocus(node.focus || "all");

    els.speaker.textContent = node.speaker || "Narrador";
    typeText(node.text || "");

    if (addToHistory) addHistory(node.speaker || "Narrador", node.text || "");
    if (node.effect) window.setTimeout(() => playEffect(node.effect), 180);

    persist();
  }

  function renderExpressions() {
    Object.entries(state.expressions).forEach(([character, expression]) => {
      sprites[character].dataset.expression = expression;
    });
  }

  function setFocus(focus) {
    Object.entries(wraps).forEach(([character, wrap]) => {
      wrap.classList.toggle("is-focus", focus === "all" || focus === character);
    });
  }

  function typeText(text) {
    typingFullText = text;
    els.text.textContent = "";
    isTyping = true;
    let i = 0;
    const speed = Number(settings.speed || 30);

    if (document.body.classList.contains("reduce-motion")) {
      els.text.textContent = text;
      isTyping = false;
      onTypingFinished();
      return;
    }

    const tick = () => {
      const step = text.length > 135 ? 2 : 1;
      i = Math.min(text.length, i + step);
      els.text.textContent = text.slice(0, i);
      if (i < text.length) {
        typingTimer = window.setTimeout(tick, speed);
      } else {
        isTyping = false;
        onTypingFinished();
      }
    };
    tick();
  }

  function completeTyping() {
    if (!isTyping) return false;
    clearTyping();
    els.text.textContent = typingFullText;
    isTyping = false;
    onTypingFinished();
    return true;
  }

  function clearTyping() {
    if (typingTimer) window.clearTimeout(typingTimer);
    typingTimer = null;
  }

  function onTypingFinished() {
    if (currentNode?.choices) renderChoices(currentNode.choices);
  }

  function advance() {
    if (!els.game.classList.contains("is-active")) return;
    if (completeTyping()) return;
    if (!currentNode || currentNode.choices) return;
    if (currentNode.next) goTo(currentNode.next);
  }

  function renderChoices(choices) {
    els.choices.innerHTML = "";
    choices.forEach((choice) => {
      const button = document.createElement("button");
      button.className = "choice-btn";
      button.type = "button";
      button.textContent = choice.label;
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        choose(choice);
      });
      els.choices.appendChild(button);
    });
    requestAnimationFrame(() => els.choices.classList.add("is-visible"));
  }

  function clearChoices() {
    els.choices.classList.remove("is-visible");
    els.choices.innerHTML = "";
  }

  function choose(choice) {
    if (choice.affinity) {
      Object.entries(choice.affinity).forEach(([character, amount]) => {
        state.affinity[character] = (state.affinity[character] || 0) + amount;
        toast(`${displayName(character)} +${amount} afinidad`);
      });
    }
    state.history.push({ type: "choice", text: choice.label });
    playUiTone();
    goTo(choice.next);
  }

  function addHistory(speaker, text) {
    const last = state.history[state.history.length - 1];
    if (last && last.type === "line" && last.speaker === speaker && last.text === text) return;
    state.history.push({ type: "line", speaker, text });
    if (state.history.length > 100) state.history = state.history.slice(-100);
  }

  function openHistory() {
    els.historyList.innerHTML = "";
    if (!state.history.length) {
      els.historyList.innerHTML = '<div class="history-entry">Todavía no hay líneas en el historial.</div>';
    } else {
      state.history.forEach((entry) => {
        const div = document.createElement("div");
        if (entry.type === "choice") {
          div.className = "history-entry history-entry--choice";
          div.textContent = `Decisión: ${entry.text}`;
        } else {
          div.className = "history-entry";
          const strong = document.createElement("strong");
          strong.textContent = `${entry.speaker}: `;
          div.append(strong, document.createTextNode(entry.text));
        }
        els.historyList.appendChild(div);
      });
    }
    openModal(els.historyModal);
    requestAnimationFrame(() => { els.historyList.scrollTop = els.historyList.scrollHeight; });
  }

  function playEffect(effect) {
    if (!effect) return;
    if (effect.type === "sfx" || effect.type === "shake") {
      els.sfxWord.textContent = effect.text || "!";
      els.sfxWord.classList.remove("is-show");
      void els.sfxWord.offsetWidth;
      els.sfxWord.classList.add("is-show");
    }
    if (effect.type === "shake") {
      els.scene.classList.remove("is-shaking");
      void els.scene.offsetWidth;
      els.scene.classList.add("is-shaking");
      window.setTimeout(() => els.scene.classList.remove("is-shaking"), 520);
    }
    if (effect.type === "emote" && effect.character) {
      const emote = $(`#emote-${effect.character}`);
      emote.textContent = effect.text || "!";
      emote.classList.remove("is-pop");
      void emote.offsetWidth;
      emote.classList.add("is-pop");
    }
    if (effect.type === "zoom" && effect.character) {
      els.scene.classList.add(`zoom-${effect.character}`);
      window.setTimeout(() => els.scene.classList.remove(`zoom-${effect.character}`), 900);
    }
    if (effect.sound === "strum") playStrum();
    if (effect.sound === "clonk") playClonk();
  }

  function clearTemporaryEffects() {
    els.scene.classList.remove("zoom-javi", "zoom-sue", "zoom-smokey", "is-shaking");
    els.sfxWord.classList.remove("is-show");
    $$(".emote").forEach((emote) => emote.classList.remove("is-pop"));
  }

  function getAudioContext() {
    if (!settings.sound) return null;
    if (!audioContext) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioContext = new Ctx();
    }
    if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
    return audioContext;
  }

  function tone(freq, duration = .08, offset = 0, volume = .035, type = "sine") {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = ctx.currentTime + offset;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + .012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + .02);
  }

  function playUiTone() { tone(520, .07, 0, .025); tone(760, .08, .045, .018); }
  function playStrum() { [196,247,294,392,494].forEach((f,i) => tone(f,.25,i*.026,.025,"triangle")); }
  function playClonk() { tone(105,.18,0,.055,"square"); tone(68,.28,.03,.03,"triangle"); }

  function persist() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (_) {}
    updateContinueButton();
  }

  function readSave() {
    try {
      const parsed = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (!parsed?.nodeId || !parsed?.affinity) return null;
      return { ...freshState(), ...parsed, expressions: { ...freshState().expressions, ...(parsed.expressions || {}) } };
    } catch (_) { return null; }
  }

  function saveGame() {
    persist();
    toast("Partida guardada en este dispositivo");
    playUiTone();
  }

  function loadSettings() {
    const defaults = { speed: "30", motion: false, sound: true };
    try { return { ...defaults, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") }; }
    catch (_) { return defaults; }
  }

  function applySettings() {
    els.speed.value = String(settings.speed);
    els.motion.checked = !!settings.motion;
    els.sound.checked = settings.sound !== false;
    document.body.classList.toggle("reduce-motion", !!settings.motion);
  }

  function saveSettings() {
    settings = { speed: els.speed.value, motion: els.motion.checked, sound: els.sound.checked };
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (_) {}
    applySettings();
  }

  function finishDemo() {
    persist();
    renderAffinity();
    showScreen("ending");
  }

  function renderAffinity() {
    els.affinity.innerHTML = "";
    ["javi", "sue", "smokey"].forEach((character) => {
      const points = Math.min(2, state.affinity[character] || 0);
      const item = document.createElement("div");
      item.className = "affinity__item";
      item.innerHTML = `<span class="affinity__name">${displayName(character)}</span><span class="affinity__hearts">${"♥".repeat(points)}${"♡".repeat(2-points)}</span>`;
      els.affinity.appendChild(item);
    });
  }

  function displayName(character) {
    return ({ javi: "Javi", sue: "Sue", smokey: "Smokey" })[character] || character;
  }

  function toast(message) {
    els.toast.textContent = message;
    els.toast.classList.remove("is-show");
    void els.toast.offsetWidth;
    els.toast.classList.add("is-show");
  }

  function openModal(modal) { modal.classList.add("is-open"); modal.setAttribute("aria-hidden", "false"); }
  function closeModal(modal) { modal.classList.remove("is-open"); modal.setAttribute("aria-hidden", "true"); }
  function anyModalOpen() { return !!$(".modal.is-open"); }

  function updateContinueButton() { els.btnContinue.disabled = !readSave(); }

  $("#btn-new").addEventListener("click", () => { playUiTone(); startNewGame(); });
  els.btnContinue.addEventListener("click", () => { playUiTone(); continueGame(); });
  $("#btn-settings").addEventListener("click", () => openModal(els.settingsModal));
  $("#btn-replay").addEventListener("click", startNewGame);
  $("#btn-menu").addEventListener("click", () => showScreen("menu"));

  els.dialogueTap.addEventListener("click", advance);
  $$('[data-action="history"]').forEach((btn) => btn.addEventListener("click", openHistory));
  $$('[data-action="save"]').forEach((btn) => btn.addEventListener("click", saveGame));
  $$('[data-action="settings"]').forEach((btn) => btn.addEventListener("click", () => openModal(els.settingsModal)));

  $$('[data-close="history"]').forEach((btn) => btn.addEventListener("click", () => closeModal(els.historyModal)));
  $$('[data-close="settings"]').forEach((btn) => btn.addEventListener("click", () => closeModal(els.settingsModal)));
  [els.historyModal, els.settingsModal].forEach((modal) => modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(modal); }));
  [els.speed, els.motion, els.sound].forEach((control) => control.addEventListener("change", saveSettings));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (els.historyModal.classList.contains("is-open")) closeModal(els.historyModal);
      if (els.settingsModal.classList.contains("is-open")) closeModal(els.settingsModal);
      return;
    }
    if ((event.key === " " || event.key === "Enter") && !anyModalOpen()) {
      const active = document.activeElement;
      if (active && (active.tagName === "BUTTON" || active.tagName === "SELECT" || active.tagName === "INPUT")) return;
      event.preventDefault();
      advance();
    }
  });

  window.addEventListener("beforeunload", persist);
  applySettings();
  updateContinueButton();
})();
