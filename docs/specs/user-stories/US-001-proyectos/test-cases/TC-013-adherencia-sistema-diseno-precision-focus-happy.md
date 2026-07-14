# TC-013 — Dado el sistema de diseño DESIGN.md (tema Precision Focus), Cuando se renderiza la pantalla de Proyectos, Entonces sus estilos (colores, tipografía, espaciado, componentes) cumplen dicho sistema

**Perspectiva**: Happy Path
**Automatización**: Automatizable (Visual Test)
**Prioridad**: Baja
**Criterio de aceptación**: AC-007 — La interfaz de la pantalla de Proyectos DEBE adherirse al sistema de diseño DESIGN.md (tema Precision Focus) e implementar el diseño de referencia
**Artefacto padre**: US-001
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación Time Tracker está corriendo en entorno local de desarrollo.
- El documento DESIGN.md (tema Precision Focus) del proyecto está disponible como referencia de tokens de diseño (colores, tipografía, espaciados, componentes base).

## Datos de prueba

N/A — se compara la pantalla renderizada contra los tokens/reglas definidos en DESIGN.md.

## Pasos de ejecución

| #   | Actor                                | Acción                                                                                                                      | Resultado esperado del paso                                                                                                    |
| --- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Usuario                              | Navega a la sección Proyectos                                                                                               | La pantalla se renderiza completamente                                                                                         |
| 2   | Sistema/Herramienta de prueba visual | Captura la pantalla de Proyectos y la compara contra los tokens y componentes definidos en DESIGN.md (tema Precision Focus) | Los estilos observados (paleta de colores, tipografía, espaciados, componentes Base UI) coinciden con lo definido en DESIGN.md |

## Resultado esperado final

La pantalla de Proyectos implementa consistentemente el sistema de diseño DESIGN.md (tema Precision Focus): no se detectan desviaciones de color, tipografía, espaciado o componentes respecto a lo documentado.

## Observaciones

Complementa a TC-015, que valida la fidelidad visual específica contra el prototipo de Figma. Se recomienda ejecutar mediante pruebas de regresión visual (p. ej. Playwright + comparación de capturas) o revisión manual guiada por checklist de DESIGN.md si no hay tooling de regresión visual configurado.
