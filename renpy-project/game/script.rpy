# Esta demo usa exactamente el CG conjunto aprobado de Javi, Sue y Smokey.
# Las hojas originales de cada personaje siguen guardadas en images/characters
# para preparar sprites individuales más adelante sin regenerar los modelos.
image cg cafe_group = Transform("images/cg/key-art.jpg", xysize=(1600, 900))
image bg cafe_empty = Transform("images/backgrounds/cafe.jpg", xysize=(1600, 900))

label start:
    $ afinidad_javi = 0
    $ afinidad_sue = 0
    $ afinidad_smokey = 0

    scene cg cafe_group at escena_general
    show screen chapter_badge("Prólogo · Una noche cualquiera")
    with fade

    narrador "Una noche tranquila. Música, café y tres personas con demasiado tiempo para opinar."

    show cg cafe_group at foco_javi
    with dissolve
    javi "Vale, una última canción y paro. Lo prometo."

    show text "{size=52}{color=#f3d18f}{b}ras ras{/b}{/color}{/size}" at sfx_javi
    pause 0.75
    hide text

    show cg cafe_group at foco_sue
    with dissolve
    sue "Eso dijiste hace tres canciones."

    show cg cafe_group at foco_smokey
    with dissolve
    smokey "Yo estoy esperando a que alguien proponga algo más interesante."

    show cg cafe_group at escena_general
    with dissolve

    menu:
        "Escuchar otra canción de Javi":
            $ afinidad_javi += 2
            jump ruta_javi

        "Sentarte junto a Sue":
            $ afinidad_sue += 2
            jump ruta_sue

        "Preguntarle a Smokey qué propone":
            $ afinidad_smokey += 2
            jump ruta_smokey

label ruta_javi:
    show cg cafe_group at foco_javi
    with dissolve
    javi "Sabía que alguien apreciaría mi arte."

    show text "{size=60}{color=#fff1be}{b}♪ TIN-TIN ♪{/b}{/color}{/size}" at sfx_javi
    pause 0.75
    hide text

    show cg cafe_group at foco_sue
    with dissolve
    sue "No le animes demasiado."

    $ afinidad_sue += 1
    jump segunda_decision

label ruta_sue:
    show cg cafe_group at foco_sue
    with dissolve
    sue "Al fin alguien toma una decisión sensata."

    show text "{size=58}{color=#f7cf76}{b}♥{/b}{/color}{/size}" at sfx_sue
    pause 0.7
    hide text

    show cg cafe_group at foco_javi
    with dissolve
    javi "Eh, yo sigo aquí."

    $ afinidad_javi += 1
    jump segunda_decision

label ruta_smokey:
    show cg cafe_group at foco_smokey
    with dissolve
    smokey "Tengo una idea. No digo que sea buena, pero sí memorable."

    show text "{size=66}{color=#f4d4bc}{b}?!{/b}{/color}{/size}" at sfx_smokey
    pause 0.7
    hide text

    show cg cafe_group at foco_sue
    with dissolve
    sue "Eso no me tranquiliza."

    $ afinidad_sue += 1
    jump segunda_decision

label segunda_decision:
    show cg cafe_group at escena_general
    with dissolve

    narrador "En la mesa hay una taza mal colocada al borde. Nadie parece haberla visto."

    menu:
        "Mover la taza antes de que caiga":
            $ afinidad_sue += 1
            narrador "La apartas justo a tiempo. Por una vez, la noche continúa sin desastre."

        "No tocar nada":
            show text "{size=74}{color=#ffd7a0}{b}¡CLONK!{/b}{/color}{/size}" at sfx_centro
            with vpunch
            pause 0.8
            hide text
            smokey "Bueno. Ya tenemos acontecimiento de la noche."
            $ afinidad_smokey += 1

    show cg cafe_group at escena_general
    with dissolve
    narrador "La conversación continúa. Esta vez, las siguientes decisiones tendrán consecuencias de verdad."

    hide screen chapter_badge
    show screen affinity_summary
    $ renpy.pause(hard=True)
    return
