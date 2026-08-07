# Entre líneas — juego-otome

Demo técnica de novela visual/otome web con **Javi, Sue y Smokey**.

## Estado

Versión `0.1.0` · 08/08/2026.

Esta primera demo sirve como base para sustituir después la historia provisional por personajes, rutas, diálogos y situaciones definitivas.

## Incluye

- Motor de escenas y diálogos en JavaScript sin dependencias.
- Tres personajes con tres expresiones cada uno a partir de los modelos visuales aprobados.
- Dos decisiones simples y sistema de afinidad.
- Zoom de cámara, foco de personaje, sacudidas, emotes y onomatopeyas animadas.
- Sonidos sencillos generados con Web Audio (sin archivos externos).
- Guardado y continuación mediante `localStorage`.
- Historial de diálogos.
- Ajustes de velocidad, reducción de movimiento y sonido.
- Diseño responsive para PC y móvil.
- GitHub Pages listo desde la rama `main`.

## Estructura

```text
assets/       Fondos, key art y hojas de sprites
data/story.js Historia y decisiones provisionales
game.js       Motor de la novela visual
styles.css    Interfaz, responsive y animaciones
index.html    Aplicación
```

## Desarrollo de la historia

La historia está separada en `data/story.js` para poder añadir capítulos y rutas sin rehacer el motor. Cada nodo puede indicar hablante, texto, foco, expresiones, efectos, decisiones y afinidad.

## Publicación

https://javidei.github.io/juego-otome/
