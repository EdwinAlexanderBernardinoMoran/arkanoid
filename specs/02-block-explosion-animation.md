# SPEC 02 — Animación de destrucción de bloques

> **Estado:** Implementado
> **Depende de:** SPEC 01
> **Fecha:** 2026-11-09
> **Objetivo:** Al golpear un bloque, reproducir su animación de explosión de 4 frames (`EXPLOSION_FRAMES`) en lugar de hacerlo desaparecer de golpe.

## Alcance

**Dentro:**

- Al golpear un bloque, este pasa a un estado "explotando" y dibuja los 4 frames de `EXPLOSION_FRAMES[ block.color ]` en su posición, con el tamaño del bloque (64x32).
- Los frames salen **únicamente** de `EXPLOSION_FRAMES` en `assets/spritesheet.js` (4 frames de 32x16 por color, ya recortados del spritesheet, p. ej. `red` en `sy: 176`, `sx: 256..352`). Se dibujan con `drawFrame`. No se crean sprites, recortes ni animaciones propias.
- La duración total es `EXPLOSION_DURATION` (150 ms), medida en frames del loop (~9 frames a 60 Hz).
- Un bloque que explota deja de colisionar de inmediato: el rebote y los +10 puntos se aplican en el momento del golpe y la bola lo atraviesa mientras dura la animación.
- La animación se congela en pausa.
- La pantalla de Victoria aparece cuando no quedan bloques vivos **ni** explotando (se ve la última explosión completa).
- `resetGame()` descarta cualquier explosión en curso.

**Fuera de alcance (para otros specs):**

- Sonidos (`assets/sounds/break-sound.mp3` sigue sin usarse).
- Partículas, pantalla temblando u otros efectos.
- Bloque `gray` y bloques de varios golpes.
- Delta time (la animación asume 60 Hz, igual que el resto del MVP).
- Animaciones de otros elementos (paddle, bola, transiciones de pantalla).

## Modelo de datos

Cada bloque gana dos campos; `alive` conserva su significado ("sólido, colisionable y visible normal").

```js
// src/config.js
const CONFIG = {
  // ...
  blocks: { /* ... */ explosionTicks: 9 }, // Math.round( EXPLOSION_DURATION / 1000 * 60 )
};

// Bloque (src/blocks.js)
// { x, y, w, h, color, alive, exploding, explodeTick }
// alive:       true  → sólido y visible con su sprite normal
// exploding:   true  → ya golpeado, reproduciendo la animación (alive === false)
// explodeTick: 0..explosionTicks, frames transcurridos de la animación
```

Convenciones:

- Estados de un bloque: vivo (`alive`), explotando (`!alive && exploding`), eliminado (`!alive && !exploding`).
- Frame mostrado: `Math.min( 3, Math.floor( explodeTick * 4 / CONFIG.blocks.explosionTicks ) )`.
- Al llegar `explodeTick` a `explosionTicks`, `exploding` pasa a `false`.

## Plan de implementación

1. En `src/config.js`, añadir `blocks.explosionTicks` derivado de `EXPLOSION_DURATION`. En `createBlocks()` (`src/blocks.js`) inicializar `exploding: false` y `explodeTick: 0`. Prueba: el juego se ve y juega igual que antes; inspeccionar un bloque en consola.
2. En `collideBallBlocks()`, al golpear: `alive = false`, `exploding = true`, `explodeTick = 0` (mantener el retorno del bloque). Prueba: el puntaje y el rebote siguen igual; el bloque sigue desapareciendo.
3. Crear `updateBlocks( blocks )` en `src/blocks.js`: incrementa `explodeTick` de cada bloque explotando y pone `exploding = false` al completar. Llamarla desde `update()` en `src/game.js` en los estados `ready` y `playing` (no en `paused`). Prueba: en consola, un bloque golpeado pasa a `exploding: false` tras ~9 frames.
4. Modificar `drawBlocks()` para dibujar con `drawFrame( ctx, EXPLOSION_FRAMES[ block.color ][ i ], block.x, block.y, block.w, block.h )` a los bloques explotando, calculando `i` según la convención. Prueba: al golpear un bloque se ven los 4 frames y luego desaparece; en pausa la explosión queda quieta.
5. Cambiar la condición de victoria en `src/game.js` a `state.blocks.every( ( b ) => !b.alive && !b.exploding )`. Prueba: al romper el último bloque se ve su explosión completa y luego aparece Victoria; reiniciar deja 60 bloques normales.

## Criterios de aceptación

- [x] Abrir `index.html` no produce errores en consola.
- [x] Un bloque golpeado muestra 4 frames de explosión distintos, en orden, antes de desaparecer.
- [x] La explosión usa los frames de `EXPLOSION_FRAMES[ block.color ]` (`red`, `yellow`, `cyan`, `magenta`, `hotpink`, `green`) y `assets/spritesheet.js` queda sin cambios.
- [x] La animación dura 9 frames del loop (`CONFIG.blocks.explosionTicks`), unos 150 ms a 60 Hz.
- [x] La explosión ocupa exactamente la posición y el tamaño del bloque (64x32).
- [x] El golpe suma exactamente 10 puntos, una sola vez por bloque.
- [x] La bola rebota una sola vez al golpear un bloque y atraviesa la explosión sin rebotar de nuevo.
- [x] Con `P` o `Esc` la explosión se congela y continúa al reanudar.
- [x] Tras romper el último bloque, la pantalla de Victoria aparece solo cuando termina su explosión.
- [x] Al reiniciar tras Game Over o Victoria no queda ninguna explosión en pantalla y hay 60 bloques vivos.
- [x] Los criterios de aceptación del SPEC 01 siguen cumpliéndose.

## Decisiones

- **Sí:** reutilizar `EXPLOSION_FRAMES` y `drawFrame` tal cual están en `assets/spritesheet.js`, sin modificar ese archivo. Los 6 colores de `CONFIG.rowColors` ya tienen sus 4 frames.
- **No:** efectos dibujados por código (círculos, partículas, fundido) en lugar de los sprites existentes.
- **Sí:** medir la animación en frames del loop. Coherente con el SPEC 01 (px/frame, sin delta time) y se congela sola en pausa.
- **Sí:** derivar `explosionTicks` de `EXPLOSION_DURATION`. Una sola fuente de verdad para la duración.
- **Sí:** el bloque deja de colisionar al instante. Evita doble puntaje y rebotes extra; la animación es solo visual.
- **Sí:** mantener `alive` y añadir `exploding` / `explodeTick`. No rompe el código existente que ya lee `alive`.
- **Sí:** Victoria al terminar la última explosión. La animación se ve completa en lugar de quedar tapada por el overlay.
- **Sí:** avanzar la animación también en `ready`, para que una explosión no quede congelada tras perder una vida.
- **No:** tiempo real con `performance.now()`. Obliga a compensar la pausa manualmente.
- **No:** bloque sólido durante la explosión. Añade lógica sin beneficio de juego.
- **No:** sonido de rotura. Va en su propio spec.

## Riesgos

| Riesgo                                                                | Mitigación                                                                                                                                                 |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Monitores a 120/144 Hz reproducen la animación en la mitad del tiempo | Documentado: se asume 60 Hz, igual que el MVP. Delta time queda para otro spec.                                                                            |
| La bola cae bajo el canvas mientras explota el último bloque          | La victoria tiene prioridad sobre la pérdida de vida en `update()`; con ~9 frames de animación y la bola lejos del paddle no es alcanzable en la práctica. |
| `EXPLOSION_FRAMES.gray` reutiliza frames de `red`                     | Sin impacto: `gray` no se usa (fuera de alcance del SPEC 01).                                                                                              |

## Qué **no** entra en este spec

- Sonidos.
- Partículas y otros efectos visuales.
- Bloques `gray` y de varios golpes.
- Delta time.
- Power-ups, niveles, puntajes persistentes, menú inicial, control táctil.

Cada uno, si se hace, va en su propio spec.
