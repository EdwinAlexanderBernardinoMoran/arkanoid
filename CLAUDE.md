# CLAUDE.md

Este archivo proporciona guía a Claude Code (claude.ai/code) cuando trabaja con código en este repositorio.

## Proyecto

Juego de Arkanoid en HTML, CSS y JavaScript puros. Cero dependencias, sin paso de build, sin gestor de paquetes. Jugable en el navegador. El README (en español) indica que el juego **aún no está implementado**: por ahora solo existen assets (sin `index.html`, sin código del juego, sin tests/lint, no es un repo git).

## Assets (`assets/`)

- `spritesheet-breakout.png` — spritesheet único.
- `spritesheet.js` — script global simple (sin módulos). Define:
  - `SPRITES` (`paddle`, `ball`, `blocks.{gray,red,yellow,cyan,magenta,hotpink,green}`) y `EXPLOSION_FRAMES` (4 frames por color; `gray` reutiliza los frames de red), `EXPLOSION_DURATION = 150` ms.
  - `loadSpritesheet(cb)` — carga el PNG (ruta fija `assets/spritesheet-breakout.png`, relativa a la página HTML) en un canvas offscreen; los callbacks se encolan hasta que cargue.
  - `drawFrame(ctx, frame, x, y, w, h)` y `drawSprite(ctx, name, x, y, w, h)` (`'block_<color>'` para bloques). Ambas no hacen nada hasta que el spritesheet cargue.
  - Debe cargarse con `<script>` antes del código del juego; iniciar el juego desde el callback de `loadSpritesheet`.
- `sounds/ball-bounce.mp3`, `sounds/break-sound.mp3`.

## Estilo de código

El JS existente usa espacios dentro de paréntesis/corchetes (`foo( a, b )`, `[ x ]`), indentación de 2 espacios, punto y coma y comillas simples. Respetarlo.

## Flujo spec-driven

Skills en `.agents/skills/` (enlazados simbólicamente desde `.claude/skills/`; fijados en `skills-lock.json`, fuente `Klerith/fernando-skills`):

- `/spec <feature>` — hace preguntas aclaratorias y escribe `specs/NN-slug.md` (estado `Draft`). Sin código. Usa el idioma de los specs existentes/del prompt.
- `/spec-impl <NN-slug>` — solo corre si el estado del spec es Approved (el usuario lo cambia manualmente). Crea la rama `spec-NN-slug` (config: `specs/.spec-config.yml`, `AutoCreateBranch`), implementa paso a paso pausando para revisión. Nunca hace commit automático. Requiere un repo git (actualmente no lo es).

`specs/` todavía no existe.
