# SPEC 04 — Niveles con diseños, velocidad y paddle progresivos

> **Estado:** Aprovado
> **Depende de:** SPEC 01, SPEC 02
> **Fecha:** 2026-11-10
> **Objetivo:** Añadir 5 niveles definidos como datos, cada uno con su diseño de bloques, bola más rápida y paddle más pequeño, con pantalla "Nivel completado" entre niveles y Victoria al terminar el quinto.

## Alcance

**Dentro:**

- 5 niveles definidos en `src/levels.js` como un array `LEVELS`; cada nivel es una grilla de texto de 10 columnas donde cada carácter es un color de bloque o un hueco.
- Estado `state.level` (1 a 5) y HUD con el texto `Nivel N`.
- Dificultad creciente por nivel: la velocidad de la bola sube y el ancho del paddle baja, con valores en `CONFIG.levels`.
- Nuevo estado `levelcomplete`: al romper el último bloque (y terminar su explosión) aparece el overlay `NIVEL COMPLETADO` con `Espacio o clic para continuar`.
- Al continuar, se carga el siguiente nivel con la bola pegada al paddle (`ready`), conservando puntaje y vidas.
- Al completar el nivel 5 se muestra `VICTORIA` (estado `won` del SPEC 01).
- Perder una vida repite el mismo nivel sin restaurar los bloques ya rotos.
- Game Over y Victoria reinician en nivel 1, con puntaje 0 y 3 vidas.
- La velocidad de la bola pasa a leerse de `ball.speed` en lugar de `CONFIG.ball.speed` directamente.

**Fuera de alcance (para otros specs):**

- Bloques `gray` o de varios golpes.
- Selector de nivel o menú inicial.
- Guardar el nivel alcanzado entre sesiones.
- Sonido propio al completar nivel.
- Power-ups, editor de niveles y niveles generados por código.
- Bonus de puntaje por nivel o por vidas restantes.

## Modelo de datos

Un módulo nuevo `src/levels.js` y campos nuevos en `CONFIG` y `state`.

```js
// src/levels.js
// Cada fila tiene 10 caracteres. '.' = hueco.
// r = red, y = yellow, c = cyan, m = magenta, h = hotpink, g = green
const LEVEL_COLORS = {
  r: 'red', y: 'yellow', c: 'cyan', m: 'magenta', h: 'hotpink', g: 'green',
};

const LEVELS = [
  { name: 'Nivel 1', rows: [ 'rrrrrrrrrr', 'yyyyyyyyyy', /* ... */ ] },
  // ... 5 niveles en total
];

// src/config.js (campo nuevo)
levels: { speedStep: 0.5, paddleStep: 16 }, // por nivel; ver abajo

// src/game.js (estado)
const state = {
  status: 'ready', // 'ready' | 'playing' | 'paused' | 'gameover' | 'won' | 'levelcomplete'
  level: 1,        // 1..LEVELS.length
  // score, lives, paddle, ball, blocks: sin cambios
};

// El bola gana un campo: velocidad del nivel actual
// ball: { x, y, vx, vy, size, speed }
```

Valores por nivel (derivados de `CONFIG.levels`):

| Nivel | Velocidad de la bola (px/frame) | Ancho del paddle (px) |
| ----- | ------------------------------- | --------------------- |
| 1     | 6.0                             | 128                   |
| 2     | 6.5                             | 112                   |
| 3     | 7.0                             | 96                    |
| 4     | 7.5                             | 80                    |
| 5     | 8.0                             | 64                    |

Fórmulas: `speed = CONFIG.ball.speed + ( level - 1 ) * CONFIG.levels.speedStep` y `paddle.w = CONFIG.paddle.w - ( level - 1 ) * CONFIG.levels.paddleStep`.

Convenciones:

- `LEVELS` es 0-indexado; `state.level` es 1-indexado. El nivel actual es `LEVELS[ state.level - 1 ]`.
- Cada fila de un nivel mide exactamente `CONFIG.blocks.cols` caracteres; un nivel tiene como máximo 8 filas.
- Posición de los bloques: igual que en el SPEC 01 (`offsetX`, `offsetY`, `w`, `h`); un hueco no crea bloque.
- Los bloques mantienen los campos `alive`, `exploding` y `explodeTick` del SPEC 02.
- `CONFIG.rows` y `CONFIG.rowColors` dejan de usarse para crear bloques; `createBlocks( level )` lee `LEVELS`.

## Plan de implementación

1. Crear `src/levels.js` con `LEVEL_COLORS` y `LEVELS` (5 niveles), y cargarlo en `index.html` después de `src/config.js`. Prueba: abrir `index.html` sin errores; `LEVELS.length === 5` y cada fila mide 10 caracteres desde la consola.
2. Añadir `CONFIG.levels` en `src/config.js` y `state.level = 1`. Modificar `createBlocks( level )` en `src/blocks.js` para leer `LEVELS[ level - 1 ]` y omitir los `.`. Prueba: el nivel 1 se ve con el diseño definido y se juega igual que antes.
3. Añadir `ball.speed` en `createBall( level )` y usarlo en `launchBall()` y `bounceBallOnPaddle()` en lugar de `CONFIG.ball.speed`. Hacer que `createPaddle( level )` calcule el ancho con `paddleStep`. Prueba: con `state.level = 3` por consola y reinicio de bola/paddle, la bola es más rápida y el paddle más estrecho.
4. Añadir la función `loadLevel( n )` en `src/game.js` que fija `state.level`, recrea paddle, bola y bloques, y pone `status = 'ready'`, sin tocar puntaje ni vidas. `resetGame()` pasa a llamar `loadLevel( 1 )` tras poner puntaje 0 y vidas 3. Prueba: Game Over reinicia en nivel 1 con puntaje 0 y 3 vidas.
5. Añadir el estado `levelcomplete`: cuando todos los bloques están rotos y sin explosión, pasar a `levelcomplete` si `state.level < LEVELS.length`, o a `won` si es el último. Dibujar el overlay `NIVEL COMPLETADO` y, con Espacio o clic, llamar `loadLevel( state.level + 1 )`. Prueba: completar el nivel 1 lleva al 2 conservando puntaje y vidas.
6. Mostrar `Nivel N` en el HUD (`drawHud()`), centrado entre puntaje y vidas. Prueba: el HUD cambia al avanzar de nivel.
7. Diseñar los 5 diseños finales en `LEVELS` y comprobar que ninguno quede vacío ni imposible. Prueba: jugar de nivel 1 a Victoria sin errores en consola.

## Criterios de aceptación

- [ ] Abrir `index.html` muestra el nivel 1 sin errores en consola.
- [ ] `LEVELS.length === 5` y cada fila de cada nivel mide exactamente 10 caracteres.
- [ ] Cada uno de los 5 niveles tiene un diseño de bloques distinto y al menos un bloque.
- [ ] El HUD muestra `Nivel N` con el nivel actual.
- [ ] La velocidad de la bola es 6, 6.5, 7, 7.5 y 8 px/frame en los niveles 1 a 5, y es constante antes y después de cada rebote.
- [ ] El ancho del paddle es 128, 112, 96, 80 y 64 px en los niveles 1 a 5.
- [ ] Al romper el último bloque del nivel 1 (y terminar su explosión) aparece `NIVEL COMPLETADO`; no aparece antes de que termine la explosión.
- [ ] En `NIVEL COMPLETADO` la bola y el paddle no se mueven.
- [ ] Espacio o clic en `NIVEL COMPLETADO` carga el nivel siguiente con la bola pegada al paddle.
- [ ] Al pasar de nivel, puntaje y vidas se conservan.
- [ ] Perder una vida repite el mismo nivel y los bloques ya rotos siguen rotos.
- [ ] Completar el nivel 5 muestra `VICTORIA`, no `NIVEL COMPLETADO`.
- [ ] Game Over y Victoria reinician en nivel 1, con puntaje 0 y 3 vidas.
- [ ] Pausa con `P` o `Esc` sigue funcionando en todos los niveles.
- [ ] `assets/spritesheet.js` y `assets/sounds/` quedan sin cambios.
- [ ] Los criterios de aceptación de los SPEC 01, 02 y 03 siguen cumpliéndose.

## Decisiones

- **Sí:** 5 niveles. Suficiente para sentir progresión sin una carga grande de diseño.
- **Sí:** niveles como datos en `src/levels.js` (grillas de texto). Se editan a mano y se ven en el código como el dibujo del nivel.
- **Sí:** dificultad por velocidad de bola y tamaño del paddle, además de un diseño distinto por nivel. Se pidió combinar las tres; la opción "solo cambia el diseño" es compatible porque el diseño siempre cambia.
- **Sí:** velocidad de 6 a 8 px/frame (+0.5 por nivel). Con bola de 16 px no hay tunneling; mantiene la decisión del SPEC 01.
- **Sí:** paddle de 128 a 64 px (−16 por nivel). El mínimo de 64 px sigue siendo jugable con el ángulo de rebote por punto de impacto.
- **Sí:** estado nuevo `levelcomplete` con overlay y confirmación. Da un respiro al jugador y reutiliza `Espacio` o clic.
- **Sí:** puntaje y vidas se conservan entre niveles. Game Over reinicia en nivel 1.
- **Sí:** perder una vida repite el nivel sin restaurar bloques, igual que el SPEC 01.
- **Sí:** `ball.speed` como campo de la bola. Evita que `launchBall()` y el rebote del paddle dependan del nivel global.
- **Sí:** valores numéricos de dificultad en `CONFIG.levels`. Se pueden ajustar sin tocar la lógica.
- **No:** bloques `gray` de 2 golpes. Se mantiene fuera como en el SPEC 01; añade lógica nueva.
- **No:** persistir el nivel alcanzado. Necesita `localStorage` y decisiones de versionado; va en otro spec.
- **No:** bonus de puntaje por nivel o vidas. No se pidió.
- **No:** generar niveles por código. Menos control sobre el diseño.

## Riesgos

| Riesgo                                                      | Mitigación                                                                                          |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Paddle de 64 px demasiado difícil en el nivel 5             | Valores en `CONFIG.levels`; ajustar `paddleStep` sin tocar la lógica.                               |
| Bola de 8 px/frame atraviesa bloques o paddle               | Bola de 16 px: 8 px por frame sigue siendo menor que la mitad de su tamaño. Sin subdivisión.        |
| Fila con longitud distinta de 10 desalinea o ignora bloques | Criterio de aceptación verifica longitud; `createBlocks` solo lee los primeros `cols` caracteres.   |
| Carácter de color desconocido en una grilla                 | `createBlocks` omite el bloque; el criterio de aceptación exige un diseño visible sin huecos extra. |
| `CONFIG.rows` y `rowColors` quedan sin uso y confunden      | Se documenta en el modelo de datos; se pueden retirar en un spec de limpieza.                       |
| Perder la última vida justo al romper el último bloque      | Se mantiene el orden del SPEC 01: la victoria/nivel completo se evalúa antes de la pérdida de vida. |

## Qué **no** entra en este spec

- Bloques de varios golpes o `gray`.
- Selector de nivel o menú inicial.
- Persistencia del nivel o del puntaje máximo.
- Sonido al completar nivel.
- Power-ups y editor de niveles.
- Bonus de puntaje.

Cada uno, si se hace, va en su propio spec.
