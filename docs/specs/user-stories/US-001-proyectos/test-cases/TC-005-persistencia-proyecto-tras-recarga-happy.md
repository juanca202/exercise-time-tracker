# TC-005 — Dado un Proyecto creado, Cuando se recarga la aplicación (simulando un cierre y reinicio), Entonces el Proyecto sigue disponible con sus datos íntegros

**Perspectiva**: Happy Path
**Automatización**: Automatizable (E2E)
**Prioridad**: Alta
**Criterio de aceptación**: AC-003 — Persistir los datos del Proyecto en el almacenamiento local, garantizando disponibilidad tras cierre inesperado o reinicio
**Artefacto padre**: US-001
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación Time Tracker está corriendo en entorno local de desarrollo.
- No hay Proyectos previos en el almacenamiento local (estado limpio) para aislar el resultado.

## Datos de prueba

| Campo       | Valor                                            | Notas |
| ----------- | ------------------------------------------------ | ----- |
| Nombre      | `Proyecto Persistencia` [propuesto]              | —     |
| Descripción | `Verifica persistencia tras recarga` [propuesto] | —     |

## Pasos de ejecución

| #   | Actor   | Acción                                                                             | Resultado esperado del paso                                              |
| --- | ------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 1   | Usuario | Crea un Proyecto con Nombre `Proyecto Persistencia` y la Descripción indicada      | El Proyecto aparece en el listado                                        |
| 2   | Usuario | Recarga completamente la página/aplicación (equivalente a cerrar y reabrir la app) | La aplicación vuelve a cargar la sección de Proyectos                    |
| 3   | Sistema | Lee los datos desde el almacenamiento local del dispositivo                        | El listado de Proyectos se reconstruye a partir de los datos persistidos |

## Resultado esperado final

Tras la recarga, el Proyecto `Proyecto Persistencia` sigue visible en el listado con el mismo Nombre y Descripción, confirmando que los datos sobrevivieron al cierre/reinicio sin backend externo.

## Observaciones

Se apoya en el almacenamiento local del navegador (localStorage/IndexedDB, según decisión técnica de implementación); no requiere backend.
