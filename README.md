# Arkanoid

Juego de bloques estilo Arkanoid hecho con HTML, CSS y JavaScript puros: sin frameworks, librerías, npm ni paso de build.

## Cómo jugar

1. Clona o descarga el repositorio.
2. Abre `index.html` con doble clic en tu navegador (funciona directamente con `file://`, no necesita servidor).

### Controles

| Acción | Teclado | Mouse |
| --- | --- | --- |
| Mover la paleta | `←` / `→` o `A` / `D` | Mover el cursor sobre el canvas |
| Lanzar la bola / continuar / reiniciar | `Espacio` | Clic |
| Pausar y reanudar | `P` o `Esc` | — |

### Reglas

- Empiezas con 3 vidas. Pierdes una cuando la bola cae por debajo de la paleta.
- Cada bloque destruido suma 10 puntos.
- Al romper todos los bloques pasas al siguiente nivel. Al completar el nivel 5 ganas.
- Con 0 vidas la partida termina (`GAME OVER`) y puedes reiniciar.
- El ángulo de rebote de la bola depende del punto de la paleta donde golpea (máximo 60° desde la vertical).

### Niveles

Hay 5 niveles con diseños distintos. Por cada nivel la bola va 0,5 px/frame más rápida y la paleta es 16 px más estrecha.

## Características

- Bloques de seis colores con animación de explosión (150 ms).
- Efectos de sonido al rebotar la bola y al romper bloques.
- HUD con puntaje, nivel y vidas.
- Estados de juego: listo, jugando, pausa, nivel completado, game over y victoria.

## Estructura del proyecto

```
arkanoid/
├── index.html          # Canvas de 800x600 y carga de scripts
├── style.css           # Estilos de la página
├── assets/
│   ├── spritesheet-breakout.png
│   ├── spritesheet.js  # Sprites, frames de explosión y carga del spritesheet
│   └── sounds/         # ball-bounce.mp3, break-sound.mp3
├── src/
│   ├── config.js       # CONFIG: dimensiones, paleta, bola, bloques, vidas, puntos
│   ├── levels.js       # LEVELS: cada nivel es una grilla de texto
│   ├── sound.js        # playSound( name )
│   ├── input.js        # Teclado y mouse
│   ├── paddle.js       # Paleta
│   ├── ball.js         # Bola
│   ├── blocks.js       # Bloques y colisiones
│   └── game.js         # Estado, bucle principal y HUD
└── specs/              # Specs del flujo spec-driven
```

El orden de los `<script>` en `index.html` importa; todo vive en scope global (sin módulos ES). Un archivo nuevo en `src/` debe registrarse allí.

## Agregar o modificar niveles

Los niveles son datos en `src/levels.js`. Cada nivel es una lista de filas de 10 caracteres, donde cada letra es un color y `.` es un hueco:

| Letra | Color |
| --- | --- |
| `r` | red |
| `y` | yellow |
| `c` | cyan |
| `m` | magenta |
| `h` | hotpink |
| `g` | green |

Para añadir un nivel, agrega un objeto `{ name, rows }` a `LEVELS`. Los parámetros globales (velocidad, tamaño de paleta, vidas, puntos) están en `src/config.js`.

## Convenciones de código

- Indentación de 2 espacios, punto y coma y comillas simples.
- Espacios dentro de paréntesis y corchetes: `foo( a, b )`, `[ x ]`.
- Un archivo por responsabilidad.
- Textos de la interfaz y documentación en español.

## Desarrollo spec-driven

Toda feature nueva pasa primero por un spec en `specs/NN-slug.md` y se desarrolla en una rama `spec-NN-slug` que entra a `main` por PR. Los specs actuales, todos implementados:

| Spec | Contenido |
| --- | --- |
| `01-arkanoid-mvp` | Juego base: paleta, bola, bloques, vidas y puntaje |
| `02-block-explosion-animation` | Animación de explosión de bloques |
| `03-sound-effects` | Efectos de sonido |
| `04-levels` | 5 niveles progresivos |

## Verificación

No hay tests ni lint. Se prueba abriendo `index.html` en el navegador y revisando que la consola de DevTools no muestre errores de carga del spritesheet ni de los sonidos.
