# TC-015 — Dado el prototipo de alta fidelidad en Figma de la pantalla de Proyectos, Cuando se compara con la implementación, Entonces layout, colores, tipografía, espaciado y componentes son visualmente fieles al prototipo

**Perspectiva**: Happy Path
**Automatización**: Automatizable (Visual Test)
**Prioridad**: Baja
**Criterio de aceptación**: AC-009 — La implementación de la pantalla de Proyectos DEBE ser visualmente fiel al prototipo de alta fidelidad en Figma referenciado
**Artefacto padre**: US-001
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación Time Tracker está corriendo en entorno local de desarrollo.
- Se cuenta con acceso al prototipo de Figma referenciado ("Exercise · Time Tracker", pantalla Proyectos).
- Existen datos de ejemplo (Proyectos) para poblar la pantalla y reflejar un estado equivalente al mostrado en el prototipo.

## Datos de prueba

| Campo               | Valor                                                                        | Notas                                                                     |
| ------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Proyecto de ejemplo | Nombre y Descripción representativos según el prototipo de Figma [propuesto] | Usado únicamente para poblar la pantalla y permitir la comparación visual |

## Pasos de ejecución

| #   | Actor                                | Acción                                                                                        | Resultado esperado del paso                                                                                                                      |
| --- | ------------------------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Usuario                              | Obtiene una captura del prototipo de Figma de la pantalla de Proyectos                        | Se cuenta con la referencia visual objetivo                                                                                                      |
| 2   | Usuario                              | Navega a la sección Proyectos de la aplicación implementada con datos de ejemplo equivalentes | La pantalla se renderiza completamente                                                                                                           |
| 3   | Sistema/Herramienta de prueba visual | Compara la captura de la implementación contra la captura del prototipo de Figma              | El layout, la paleta de colores, la tipografía, el espaciado y los componentes coinciden entre ambas capturas dentro de una tolerancia aceptable |

## Resultado esperado final

La pantalla de Proyectos implementada es visualmente fiel al prototipo de alta fidelidad en Figma: no se detectan diferencias significativas de layout, color, tipografía, espaciado o componentes.

## Observaciones

Complementa a TC-013, que valida la adherencia al sistema de diseño DESIGN.md en términos de reglas/tokens generales, mientras que este TC valida la fidelidad puntual frente al prototipo Figma específico de esta pantalla.
