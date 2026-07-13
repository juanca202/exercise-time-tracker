# TC-002 — Dado el modal "Nueva Tarea" abierto, cuando el usuario intenta crear la Tarea sin seleccionar un Proyecto, entonces el sistema rechaza la creación

**Perspectiva**: Error
**Automatización**: Automatizable (Unit)
**Prioridad**: Alta
**Criterio de aceptación**: AC-002 — No permitir crear Tarea sin Proyecto asociado
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación está corriendo en entorno local de desarrollo, sin backend, con persistencia en almacenamiento local.
- Existe al menos un Proyecto previamente creado.
- El modal "Nueva Tarea" está abierto (o se invoca directamente la función/acción de creación de Tarea de la capa de estado).

## Datos de prueba

| Campo           | Valor                                 | Notas                                    |
| --------------- | ------------------------------------- | ---------------------------------------- |
| Proyecto        | (vacío / sin seleccionar) [propuesto] | Campo obligatorio omitido                |
| Nombre de Tarea | "Revisar backlog" [propuesto]         | Válido, para aislar el campo bajo prueba |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                | Resultado esperado del paso       |
| --- | ------- | ------------------------------------------------------------------------------------- | --------------------------------- |
| 1   | usuario | Ingresa "Revisar backlog" en el campo Nombre y deja el campo Proyecto sin seleccionar | El campo Proyecto permanece vacío |
| 2   | usuario | Intenta confirmar la creación de la Tarea                                             | El sistema NO crea la Tarea       |

## Resultado esperado final

La Tarea no se crea ni se persiste. El sistema mantiene el modal abierto e indica que el Proyecto es obligatorio (validación bloqueante).

## Observaciones

Verifica BR-01 ("Una Tarea DEBE pertenecer obligatoriamente a un único Proyecto existente"). Complementario de TC-003, que cubre la ausencia de Nombre.
