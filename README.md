# Entre líneas — juego-otome

Novela visual / otome construida con **Ren'Py** y protagonizada inicialmente por Javi, Sue y Smokey.

## Estado

Versión `0.2.0` · 08/08/2026 · migración desde la demo HTML/JavaScript a Ren'Py 8.5.3.

La historia actual es deliberadamente corta y genérica: sirve para validar el motor, las decisiones, el enfoque de cámara, los efectos y el guardado antes de escribir las rutas reales.

## Tecnología

- Ren'Py 8.5.3.
- Proyecto fuente en `renpy-project/`.
- Compilación Web automática con GitHub Actions.
- Publicación mediante GitHub Pages.
- Rama `backup-html-demo` como respaldo de la demo web anterior.

## Demo

Incluye:

- Javi, Sue y Smokey con los modelos visuales ya aprobados.
- Escena principal del café musical.
- Diálogos y elecciones.
- Afinidad básica.
- Zoom y foco de cámara.
- Sacudidas y transiciones.
- Onomatopeyas y pequeños efectos visuales.
- Guardado/carga e historial proporcionados por Ren'Py.
- Menú y preferencias estándar de Ren'Py.

## Estructura

```text
renpy-project/
├── game/
│   ├── characters.rpy
│   ├── options.rpy
│   ├── screens_extra.rpy
│   ├── script.rpy
│   ├── transforms.rpy
│   └── images/
└── progressive_download.txt

web/                  Build Web generado automáticamente
.github/workflows/    Compilación Ren'Py Web
```

Los antiguos archivos HTML/JavaScript se mantienen temporalmente en `main` durante la migración y quedan además preservados en `backup-html-demo`.

## Publicación

https://javidei.github.io/juego-otome/
