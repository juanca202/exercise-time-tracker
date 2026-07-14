# TC-015 — Dado que la pantalla de Historial de registros está implementada, Cuando se inspeccionan sus estilos y componentes visuales, Entonces corresponden a los tokens del sistema de diseño DESIGN.md (tema Precision Focus)

**Perspectiva**: Happy Path
**Automatización**: Automatizable (Visual Test)
**Prioridad**: Baja
**Criterio de aceptación**: AC-006 (Interacción de usuario)
**Artefacto padre**: US-003
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación Time Tracker está corriendo en entorno local de desarrollo (`npm run dev`).
- La pantalla de Historial de registros está implementada y renderiza con datos de prueba (ver TC-001).
- Se cuenta con acceso a `DESIGN.md` (tokens de Colors, Typography, Layout & Spacing, Elevation & Depth, Shapes) como referencia de comparación.

## Datos de prueba

N/A — este TC valida estilos y tokens visuales, no datos de dominio.

## Pasos de ejecución

| #   | Actor              | Acción                                                                                                          | Resultado esperado del paso                                              |
| --- | ------------------ | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 1   | Tester/herramienta | Navega a la pantalla "Historial de registros"                                                                   | La pantalla renderiza completamente                                      |
| 2   | Tester/herramienta | Inspecciona los estilos computados de los componentes clave (colores, tipografía, espaciado, elevación, formas) | Se obtiene el conjunto de valores de estilo efectivamente aplicados      |
| 3   | Tester             | Compara los valores obtenidos contra los tokens definidos en `DESIGN.md` (tema Precision Focus)                 | No se detectan discrepancias respecto a los tokens del sistema de diseño |

## Resultado esperado final

Los valores de color, tipografía, espaciado, elevación y forma usados en la pantalla de Historial de registros coinciden con los tokens definidos en `DESIGN.md`; no existen estilos hardcodeados que se aparten del sistema de diseño.

## Observaciones

Puede automatizarse mediante pruebas de regresión visual (snapshot) o una auditoría programática de estilos computados; alternativamente, ejecutarse como checklist manual de QA de diseño si el equipo no automatiza pruebas visuales.
