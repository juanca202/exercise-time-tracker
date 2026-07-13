# TC-016 — Dado el prototipo de alta fidelidad en Figma de la pantalla de Historial de registros, Cuando se compara la implementación con dicho prototipo, Entonces son visualmente fieles en layout, colores, tipografía, espaciado y componentes

**Perspectiva**: Happy Path
**Automatización**: Automatizable (Visual Test)
**Prioridad**: Baja
**Criterio de aceptación**: AC-007 (Interacción de usuario)
**Artefacto padre**: US-003
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación Time Tracker está corriendo en entorno local de desarrollo (`npm run dev`).
- La pantalla de Historial de registros está implementada y renderiza con datos de prueba (ver TC-001).
- Se cuenta con acceso al prototipo Figma referenciado en US-003 ([Exercise · Time Tracker](https://www.figma.com/design/YYHDIH7CBsZrZ4VKXvbzkR/Exercise---Time-Tracker), pantalla Historial de registros).

## Datos de prueba

| Campo                             | Valor                                                                    | Notas                                     |
| --------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------- |
| Captura de referencia [propuesto] | Export del frame "Historial de registros" del archivo Figma referenciado | Usada como baseline de comparación visual |

## Pasos de ejecución

| #   | Actor              | Acción                                                                                                                            | Resultado esperado del paso                            |
| --- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 1   | Tester             | Exporta/obtiene la captura del frame "Historial de registros" del prototipo Figma referenciado                                    | Se cuenta con la imagen de referencia                  |
| 2   | Tester/herramienta | Captura un screenshot de la implementación real de la pantalla de Historial de registros en el mismo viewport                     | Se cuenta con la imagen de la implementación           |
| 3   | Tester/herramienta | Compara ambas imágenes evaluando layout, colores, tipografía, espaciado y componentes (comparación visual/diff o revisión manual) | Se identifican coincidencias/discrepancias entre ambas |

## Resultado esperado final

La implementación de la pantalla de Historial de registros no presenta discrepancias visuales significativas respecto al prototipo Figma referenciado: el layout, los colores, la tipografía, el espaciado y los componentes coinciden con el diseño de alta fidelidad.

## Observaciones

Puede automatizarse con pruebas de regresión visual (comparación de capturas Figma vs. implementación); alternativamente, ejecutarse como revisión manual de QA de diseño si el equipo no automatiza pruebas visuales.
