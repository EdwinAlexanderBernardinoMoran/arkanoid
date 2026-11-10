# MEMORY.md — Arkanoid
Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no
aporte.

## Estado actual
- Juego completo en HTML, CSS y JS puros (SPEC 01 a 04): paddle, bola, bloques, vidas,
puntaje, pausa, animación de explosión, sonidos y 5 niveles.
- Rama de trabajo: `spec-04-levels` (commits de niveles hechos; cambios sin commit en
`CLAUDE.md` y en los specs 02, 03 y 04).
- `README.md` desactualizado: todavía dice que el juego no está implementado.
- No hay `.gitignore`. No hay `node_modules`/`dist` porque no hay npm ni build.

## Decisiones (y por qué)
- Sin dependencias ni build: se juega abriendo `index.html` con doble clic.
- Scripts globales sin módulos: el orden en `index.html` importa; un archivo nuevo en
`src/` se agrega ahí.
- Flujo spec-driven: toda feature pasa por `specs/NN-slug.md` (`/spec`, `/spec-impl`).
Los cambios de comportamiento se reflejan en el spec, no se hacen por sorpresa en código.
- Niveles como datos (`src/levels.js`, grilla de texto de 10 columnas): agregar un nivel
no toca la lógica.
- Respuestas en español y estilo de código con espacios en paréntesis (ver `CLAUDE.md`).

## Aprendizajes y errores a evitar
- Comprobar la documentación contra el código antes de darla por buena (el `README.md`
ya quedó desfasado).
- El estado `Aprobado` de un spec lo cambia el usuario a mano, nunca el agente.
- Nunca hacer commit automático; un paso del plan a la vez.

## Próximos pasos
- Commitear los cambios pendientes y hacer PR de `spec-04-levels` a `main`.
- Actualizar `README.md`.
