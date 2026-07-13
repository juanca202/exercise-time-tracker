# TC-003 — Dado que no existen Registros de Tiempo en el almacenamiento local, Cuando el usuario abre la pantalla de Historial de registros, Entonces el sistema muestra un estado vacío sin errores

**Perspectiva**: Límite
**Automatización**: Automatizable (E2E)
**Prioridad**: Baja
**Criterio de aceptación**: AC-001 (Salidas del sistema)
**Artefacto padre**: US-003
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación Time Tracker está corriendo en entorno local de desarrollo (`npm run dev`).
- El almacenamiento local del navegador no contiene Registros de Tiempo (clave ausente o arreglo vacío).
- No se requiere autenticación.

## Datos de prueba

| Campo                                        | Valor                  | Notas                                |
| -------------------------------------------- | ---------------------- | ------------------------------------ |
| localStorage["registros-tiempo"] [propuesto] | `[]` (o clave ausente) | Cero Registros de Tiempo persistidos |

## Pasos de ejecución

| #   | Actor   | Acción                                                                    | Resultado esperado del paso                                                   |
| --- | ------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1   | Usuario | Navega a la pantalla "Historial de registros" con el almacenamiento vacío | El sistema inicia la carga del historial                                      |
| 2   | Sistema | Lee los Registros de Tiempo desde el almacenamiento local                 | El sistema obtiene un conjunto vacío                                          |
| 3   | Usuario | Observa la pantalla                                                       | Se muestra un estado vacío (ej. "No hay registros de tiempo aún") sin errores |

## Resultado esperado final

La pantalla de Historial de registros renderiza un estado vacío legible, sin tabla/lista con filas fantasma, sin totales erróneos (NaN/undefined) y sin errores en la consola del navegador.

## Observaciones

Ninguna.
