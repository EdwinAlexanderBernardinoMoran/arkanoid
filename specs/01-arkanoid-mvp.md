# SPEC 01 — MVP jugable de Arkanoid

> **Estado:** Aprobado
> **Depende de:** ninguno
> **Fecha:** 2026-11-08
> **Objetivo:** Un Arkanoid de un nivel, jugable en el navegador con teclado o mouse, con vidas, puntaje, pausa y pantallas de Game Over y Victoria.

## Alcance

**Dentro:**

- `index.html` con un `<canvas>` de 800x600 lógicos, centrado y escalado por CSS sin deformarse.
- Paddle controlado con teclado (← → / A D) y mouse.
- Una bola que se lanza con Espacio o clic, rebota en paredes, techo, paddle y bloques.
- Rebote en el paddle con ángulo según el punto de impacto y velocidad constante.
- 60 bloques (6 filas x 10 columnas), 1 golpe cada uno, un color por fila.
- 3 vidas; perder la bola cuesta una vida y reinicia la bola sobre el paddle.
- Puntaje (HUD) y vidas (HUD) visibles.
- Pausa con `P` o `Esc`.
- Pantalla Game Over (0 vidas) y pantalla Victoria (0 bloques); ambas se reinician con Espacio o clic.
- Uso de `assets/spritesheet.js` para dibujar paddle, bola y bloques.

**Fuera de alcance (para otros specs):**

- Sonidos (`assets/sounds/*.mp3` existen pero no se usan).
- Animación de explosión (`EXPLOSION_FRAMES`).
- Bloque `gray` y bloques de varios golpes.
- Más de un nivel.
- Power-ups, puntajes máximos persistentes, menú inicial.
- Control táctil y versión móvil.

## Modelo de datos

```js
// src/config.js
const CONFIG = {
  width: 800,
  height: 600,
  paddle: { w: 128, h: 14, y: 560, speed: 8 }, // px/frame
  ball: { size: 16, speed: 6, maxBounceAngle: 60 }, // grados desde la vertical
  blocks: { rows: 6, cols: 10, w: 64, h: 32, offsetX: 80, offsetY: 80 },
  rowColors: ["red", "yellow", "cyan", "magenta", "hotpink", "green"],
  lives: 3,
  pointsPerBlock: 10,
};

// Estado del juego (src/game.js)
const state = {
  status: "ready", // 'ready' | 'playing' | 'paused' | 'gameover' | 'won'
  score: 0,
  lives: 3,
  paddle: { x: 0, y: 0, w: 0, h: 0 },
  ball: { x: 0, y: 0, vx: 0, vy: 0, size: 16 },
  blocks: [
    /* { x, y, w, h, color, alive } */
  ],
};
```

Convenciones:

- Coordenadas en píxeles lógicos, origen arriba a la izquierda.
- Velocidades en px/frame, loop con `requestAnimationFrame`.
- `state.status === 'ready'` significa bola pegada al paddle, esperando lanzamiento.

## Plan de implementación

1. Crear `index.html`, `style.css` y `src/game.js` vacío: canvas 800x600 centrado y escalado por CSS; cargar `assets/spritesheet.js` antes de los scripts de `src/`; iniciar desde `loadSpritesheet`. Prueba: abrir `index.html`, ver el canvas con fondo, sin errores en consola.
2. Crear `src/config.js` con `CONFIG`. Prueba: `CONFIG` accesible desde consola.
3. Crear `src/input.js`: estado de teclas (← → A D Espacio P Esc) y posición del mouse en coordenadas lógicas. Prueba: log en consola al presionar teclas y mover el mouse.
4. Crear `src/paddle.js`: crear, actualizar (teclado + mouse, limitado a las paredes) y dibujar con `drawSprite`. Prueba: el paddle se mueve y no sale del canvas.
5. Crear `src/ball.js`: crear, pegada al paddle en `ready`, lanzar con Espacio o clic, mover y rebotar en paredes y techo. Prueba: la bola rebota en tres lados.
6. Añadir rebote bola–paddle con ángulo según el punto de impacto y velocidad constante. Prueba: golpear en los bordes cambia el ángulo; el centro rebota casi vertical.
7. Crear `src/blocks.js`: generar la grilla de 6x10, dibujar con `block_<color>`, colisión bola–bloque (invierte `vx` o `vy` según el eje de menor penetración), marcar `alive = false`. Prueba: los bloques desaparecen al golpearlos.
8. Añadir puntaje y vidas con HUD: +10 por bloque; si la bola cae bajo el canvas, `lives--` y vuelve a `ready`. Prueba: el HUD se actualiza.
9. Añadir estados `paused`, `gameover` y `won` con sus pantallas y reinicio. Prueba: jugar hasta perder, hasta ganar y reiniciar.

## Criterios de aceptación

- [ ] Abrir `index.html` en el navegador muestra el juego sin errores en consola.
- [ ] El canvas mantiene la proporción 4:3 al redimensionar la ventana.
- [ ] El paddle se mueve con ← →, con A D y con el mouse, y no sale del canvas.
- [ ] La bola empieza pegada al paddle y se lanza con Espacio o clic.
- [ ] La bola rebota en paredes laterales, techo y paddle.
- [ ] Golpear el paddle en el borde izquierdo manda la bola hacia la izquierda; en el derecho, hacia la derecha.
- [ ] La rapidez de la bola es la misma antes y después de cada rebote.
- [ ] Hay 60 bloques en 6 filas de 10, con los colores de `CONFIG.rowColors`.
- [ ] Un bloque golpeado desaparece y suma exactamente 10 puntos.
- [ ] El HUD muestra puntaje y vidas actuales.
- [ ] Si la bola cae bajo el canvas, las vidas bajan en 1 y la bola vuelve al paddle.
- [ ] Con 0 vidas aparece Game Over; Espacio o clic reinicia con puntaje 0 y 3 vidas.
- [ ] Al romper los 60 bloques aparece Victoria; Espacio o clic reinicia.
- [ ] `P` o `Esc` pausa y reanuda; en pausa la bola y el paddle no se mueven.

## Decisiones

- **Sí:** scripts globales ordenados en `index.html`, sin módulos ES. Coincide con `assets/spritesheet.js` y funciona abriendo el archivo con `file://`.
- **Sí:** módulos separados en `src/` (config, input, paddle, ball, blocks, game). Cada archivo queda pequeño y revisable.
- **Sí:** canvas lógico fijo 800x600 escalado con CSS. La física no depende del tamaño de ventana.
- **Sí:** ángulo de rebote según el punto de impacto y velocidad constante. Da control al jugador.
- **Sí:** 1 nivel, 1 golpe por bloque. Mantiene el MVP pequeño.
- **Sí:** teclado y mouse. Ambos son baratos de implementar.
- **No:** sonidos y explosiones. Se pospone a otro spec; los assets ya existen.
- **No:** bloque `gray` de 2 golpes. Añade lógica sin ser necesario para jugar.
- **No:** vidas infinitas ni 1 vida. 3 vidas es el estándar del género.
- **No:** frameworks ni build. Cero dependencias, según el README.

## Riesgos

| Riesgo                                                       | Mitigación                                                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Bola atraviesa bloques o paddle a alta velocidad (tunneling) | Velocidad 6 px/frame con bola de 16 px; no hace falta subdivisión en el MVP.               |
| Velocidad depende de la tasa de refresco del monitor         | Documentado: el MVP asume 60 Hz. Delta time queda para otro spec.                          |
| Mouse con canvas escalado da coordenadas erróneas            | Convertir con `getBoundingClientRect()` y la razón `width / rect.width`.                   |
| Spritesheet no carga                                         | `drawSprite` no dibuja nada; el juego arranca solo desde el callback de `loadSpritesheet`. |

## Qué **no** entra en este spec

- Sonidos.
- Animación de explosión.
- Varios niveles y bloques de varios golpes.
- Power-ups.
- Puntajes máximos persistentes.
- Menú inicial.
- Control táctil / móvil.

Cada uno, si se hace, va en su propio spec.
