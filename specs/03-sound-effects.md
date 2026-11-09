# SPEC 03 — Efectos de sonido de rebote y rotura

> **Estado:** Aprobado
> **Depende de:** SPEC 01, SPEC 02
> **Fecha:** 2026-11-09
> **Objetivo:** Reproducir `ball-bounce.mp3` cuando la bola rebota en la pared izquierda, la derecha, el techo o el paddle, y `break-sound.mp3` cuando golpea un bloque.

## Alcance

**Dentro:**

- Sonido `assets/sounds/ball-bounce.mp3` en cada rebote contra los 4 "bordes": pared izquierda, pared derecha, techo y paddle.
- Sonido `assets/sounds/break-sound.mp3` en cada golpe a un bloque, en el momento del golpe (cuando empieza la explosión del SPEC 02).
- El golpe a un bloque reproduce **únicamente** `break-sound.mp3`; no suena `ball-bounce.mp3`.
- Un solo objeto `Audio` por sonido; en cada reproducción se rebobina (`currentTime = 0`) y se llama a `play()`.
- Volumen fijo (el del archivo). Los errores de `play()` (autoplay bloqueado, archivo ausente) se ignoran sin romper el juego.
- Los sonidos usan solo los archivos existentes en `assets/sounds/`; no se crean ni modifican assets.

**Fuera de alcance (para otros specs):**

- Mute, control de volumen o tecla `M`.
- Música de fondo.
- Sonidos de perder vida, Game Over, Victoria, lanzamiento o pausa.
- Sonido al caer la bola bajo el canvas.
- Solapamiento de sonidos (clonar `Audio`), Web Audio API, variación de tono.
- Precarga con indicador de progreso.

## Modelo de datos

Un módulo nuevo con dos objetos `Audio` y una función; sin cambios en `CONFIG` ni en `state`.

```js
// src/sound.js
const SOUNDS = {
  bounce: new Audio("assets/sounds/ball-bounce.mp3"),
  break: new Audio("assets/sounds/break-sound.mp3"),
};

function playSound(name) {
  const sound = SOUNDS[name];
  sound.currentTime = 0;
  const result = sound.play();
  if (result && result.catch) result.catch(() => {});
}
```

Convenciones:

- Nombres de sonido: `'bounce'` y `'break'`.
- Rutas relativas a `index.html`, igual que `assets/spritesheet-breakout.png`.
- `playSound` se llama solo desde la lógica de colisión (no desde `draw()`), por lo que no suena en pausa, Game Over ni Victoria.

## Plan de implementación

1. Crear `src/sound.js` con `SOUNDS` y `playSound( name )`, y cargarlo en `index.html` después de `src/config.js` y antes de `src/ball.js`. Prueba: abrir `index.html` sin errores; `playSound( 'bounce' )` y `playSound( 'break' )` desde la consola suenan.
2. En `updateBall()` (`src/ball.js`), llamar `playSound( 'bounce' )` en los tres rebotes: pared izquierda, pared derecha y techo. Prueba: lanzar la bola y oír un sonido en cada uno de esos tres lados.
3. En `bounceBallOnPaddle()` (`src/ball.js`), llamar `playSound( 'bounce' )` cuando el rebote se aplica (después del `return` de no-colisión). Prueba: la bola suena al golpear el paddle y no suena cuando lo atraviesa o pasa de largo.
4. En `collideBallBlocks()` (`src/blocks.js`), llamar `playSound( 'break' )` una vez por bloque golpeado, sin llamar a `'bounce'`. Prueba: cada bloque golpeado suena una sola vez con `break-sound.mp3` y sin `ball-bounce.mp3`.
5. Verificar pausa, Game Over, Victoria y reinicio. Prueba: en pausa no suena nada; tras reiniciar los sonidos siguen funcionando.

## Criterios de aceptación

- [x] Abrir `index.html` no produce errores en consola (ni con el sonido bloqueado por el navegador).
- [x] Al rebotar en la pared izquierda suena `ball-bounce.mp3`.
- [x] Al rebotar en la pared derecha suena `ball-bounce.mp3`.
- [x] Al rebotar en el techo suena `ball-bounce.mp3`.
- [x] Al rebotar en el paddle suena `ball-bounce.mp3`.
- [x] Al golpear un bloque suena `break-sound.mp3` exactamente una vez y no suena `ball-bounce.mp3`.
- [x] La bola atravesando una explosión (SPEC 02) no produce ningún sonido.
- [x] Al caer la bola bajo el canvas no suena nada.
- [x] En pausa, Game Over y Victoria no se reproduce ningún sonido.
- [x] Rebotes seguidos muy rápidos reinician el sonido sin errores en consola.
- [x] `assets/spritesheet.js` y los archivos de `assets/sounds/` quedan sin cambios.
- [x] Los criterios de aceptación de los SPEC 01 y 02 siguen cumpliéndose.

## Decisiones

- **Sí:** interpretar "4 bordes" como pared izquierda, pared derecha, techo y paddle. El borde inferior es pérdida de vida, no rebote.
- **Sí:** solo `break-sound.mp3` en los bloques, como se pidió. Evita doble sonido en un mismo golpe.
- **Sí:** un `Audio` por sonido con `currentTime = 0` en cada reproducción. Simple, sin dependencias; un rebote nuevo corta el anterior.
- **Sí:** módulo `src/sound.js` con script global. Coincide con la arquitectura del SPEC 01 y funciona con `file://`.
- **Sí:** reproducir desde la lógica de colisión. Pausa, Game Over y Victoria no tienen colisiones, así que quedan en silencio sin código extra.
- **Sí:** ignorar el rechazo de `play()`. El primer sonido ocurre después de un gesto del usuario (Espacio o clic para lanzar), pero un fallo no debe romper el juego.
- **No:** mute o volumen. Amplía el alcance con input y estado nuevos; va en otro spec.
- **No:** clonar `Audio` para solapar sonidos. Crea muchos objetos y no hace falta con la velocidad actual de la bola.
- **No:** Web Audio API. Sobredimensionado para dos efectos.

## Riesgos

| Riesgo                                                               | Mitigación                                                                                               |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| El navegador bloquea el audio hasta un gesto del usuario             | El lanzamiento (Espacio o clic) ocurre antes de cualquier colisión; `play()` se captura con `.catch`.    |
| Latencia al reproducir un MP3 aún no cargado en el primer golpe      | Los `Audio` se crean al cargar `sound.js`, por lo que empiezan a descargarse antes de jugar.             |
| Varios bloques golpeados en el mismo frame reinician el mismo sonido | Aceptado: suena una vez; `collideBallBlocks()` ya golpea como máximo un bloque por llamada.              |
| Rebote que suena dos frames seguidos por solape bola–paddle          | `bounceBallOnPaddle()` ya exige `vy > 0` y recoloca la bola, así que no se repite en el frame siguiente. |

## Qué **no** entra en este spec

- Mute y control de volumen.
- Música de fondo.
- Sonidos de vidas, Game Over, Victoria, lanzamiento o pausa.
- Web Audio API y solapamiento de sonidos.

Cada uno, si se hace, va en su propio spec.
