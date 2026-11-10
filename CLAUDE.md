# CLAUDE.md

Este archivo proporciona guía a Claude Code (claude.ai/code) cuando trabaja con código en este repositorio.

## Proyecto

Arkanoid: juego de bloques en HTML, CSS y JavaScript puros. Implementado hasta el SPEC 04 (MVP, animación de explosión, efectos de sonido, 5 niveles). Repo git, rama principal `main`.
## Stack y estructura

- HTML, CSS y JavaScript puros: sin frameworks, librerías, npm, bundler ni build.
- Se juega abriendo `index.html` con doble clic (`file://`): nada de módulos ES (`type="module"`), `fetch` a archivos locales ni nada que requiera servidor.
- `index.html`: un `<canvas id="game">` de 800x600 y los `<script>` globales. **El orden importa**: `assets/spritesheet.js`, `src/config.js`, `levels.js`, `sound.js`, `input.js`, `paddle.js`, `ball.js`, `blocks.js`, `game.js`. Un archivo nuevo en `src/` se agrega aquí.
- `style.css`: estilos de la página.
- `src/`: un archivo por responsabilidad, todo en scope global.
  - `config.js`: `CONFIG` (dimensiones, paddle, bola, bloques, `levels`, vidas, puntos).
  - `levels.js`: `LEVEL_COLORS` y `LEVELS` (cada nivel es una grilla de texto de 10 columnas).
  - `sound.js`: `SOUNDS` y `playSound( name )`.
  - `input.js`: objeto `input` (teclado y mouse).
  - `paddle.js`, `ball.js`, `blocks.js`: `createX( level )`, `updateX`, `drawX` por entidad.
  - `game.js`: `state`, `loadLevel`, `resetGame`, bucle `update`/`draw`/`loop`.
- `assets/`: `spritesheet-breakout.png`, `spritesheet.js` y `sounds/` (`ball-bounce.mp3`, `break-sound.mp3`).
- `specs/`: specs del flujo spec-driven. `.claude/skills/`: skills `spec` y `spec-impl` (fijadas en `skills-lock.json`).

## Convenciones

- Textos de la interfaz y del repo (specs, docs, commits de specs) en español.
- Estilo de código: espacios dentro de paréntesis/corchetes (`foo( a, b )`, `[ x ]`), indentación de 2 espacios, punto y coma y comillas simples.
- Un archivo por responsabilidad; no mezclar lógica de entidades en `game.js`.
- Commits al estilo `feat: ...`. Una rama por spec: `spec-NN-slug`; `main` recibe el merge por PR.

## Estados y assets (fácil equivocarse)

- `state.status` solo toma: `ready`, `playing`, `paused`, `levelcomplete`, `gameover`, `won`.
- Bloques: ciclo `alive` / `exploding` / eliminado; la explosión dura `EXPLOSION_DURATION = 150` ms.
- `assets/spritesheet.js` define `SPRITES`, `EXPLOSION_FRAMES` (4 frames por color; `gray` reutiliza los de red), `loadSpritesheet( cb )`, `drawFrame( ctx, frame, x, y, w, h )` y `drawSprite( ctx, name, x, y, w, h )` (`'block_<color>'` para bloques).
- `drawFrame` y `drawSprite` no hacen nada hasta que el spritesheet cargue; `game.js` arranca el bucle desde el callback de `loadSpritesheet`.
- La ruta del PNG es fija (`assets/spritesheet-breakout.png`, relativa a la página).
- Los niveles son datos: agregar uno es editar `src/levels.js` (y `CONFIG.levels` si cambian velocidad o paddle), sin tocar la lógica.

## Flujo spec-driven

- Toda feature nueva pasa por un spec en `specs/NN-slug.md` antes de escribir código. No implementar features fuera de un spec.
- `/spec <feature>`: hace preguntas aclaratorias y escribe el spec con estado `Borrador`. No escribe código. Usa el siguiente número libre.
- `/spec-impl <NN-slug>` (acepta nombre completo, número o slug): corre solo si el estado es `Aprobado`. Ese cambio lo hace el usuario a mano, nunca el agente.
  - Si hay cambios sin commit, pregunta antes de seguir (sin stash ni commit propios).
  - Crea o retoma la rama `spec-NN-slug` (`specs/.spec-config.yml`: `AutoCreateBranch`).
  - Muestra objetivo, alcance, plan y criterios, y espera confirmación.
  - Implementa un paso del plan a la vez, pausando para revisar el diff. Nunca hace commit automático.
  - Ante ambigüedad se detiene y ofrece opciones.
  - Al terminar, el usuario verifica los criterios, cambia el estado a `Implementado` y hace el commit final.
- Estados válidos: `Borrador` → `En revisión` → `Aprobado` → `Implementado` (u `Obsoleto`).
- Formato: cabecera en blockquote (`Estado`, `Depende de`, `Fecha`, `Objetivo`) y secciones en orden: `Alcance` (Dentro y Fuera de alcance), `Modelo de datos`, `Plan de implementación`, `Criterios de aceptación`, `Decisiones`, `Riesgos` (opcional), `Qué **no** entra en este spec`. Plantilla en `.claude/skills/spec/template.md`.
- Plan: pasos numerados, cada uno deja el juego ejecutable y es commiteable (máx. ~30-50 líneas). Criterios: checklist booleano y verificable. Nombres concretos, sin TODOs.
- Specs existentes (todos `Implementado`): `01-arkanoid-mvp`, `02-block-explosion-animation`, `03-sound-effects`, `04-levels`.
- Si cambia el comportamiento, actualiza también el spec correspondiente: los cambios van al spec, no al código por sorpresa.

## Forma de trabajar

- Haz solo lo que se pide: no añadas funcionalidades por tu cuenta.
- Cambios pequeños y enfocados; no reescribas lo que ya funciona.
- Al terminar, resume qué has cambiado y cualquier decisión que deba revisar.
- Responde siempre en español.

## Memoria

- Al empezar, lee `MEMORY.md` para conocer el estado del proyecto y las decisiones tomadas.
- Al terminar una tarea, actualízalo: estado actual, decisiones importantes (con su porqué) y errores a evitar.
- Mantenlo breve (máximo ~50 líneas): resume o elimina lo que ya no aporte.
- Si algo se convierte en una regla permanente, propón moverlo a este `CLAUDE.md` en lugar de dejarlo en la memoria.
- No guardes nunca datos sensibles (claves, tokens, datos personales).

## Límites

- ✅ Siempre: seguir el flujo spec-driven, respetar el estilo de código, mantener los textos en español.
- ✅ Siempre: actualizar `MEMORY.md` al terminar cada tarea.
- ⚠️ Pregunta antes: crear archivos nuevos (y registrarlos en `index.html` en el orden correcto), cambiar `CONFIG` o el comportamiento ya implementado, hacer commit.
- 🚫 Nunca: añadir dependencias, frameworks, módulos ES o un paso de build.
- 🚫 Nunca: cambiar a `Aprobado` el estado de un spec ni hacer commit automático.

## Verificación

- No hay tests ni lint. Probar abriendo `index.html` en el navegador.
- Revisar la consola de DevTools: sin errores de carga del spritesheet ni de los sonidos.
- Comprobar los criterios de aceptación del spec activo antes de marcarlo `Implementado`.
