# TC-003 — Dado el modal "Nueva Tarea" abierto, cuando el usuario intenta crear la Tarea sin ingresar un Nombre, entonces el sistema rechaza la creación

**Perspectiva**: Error
**Automatización**: Automatizable (Unit)
**Prioridad**: Alta
**Criterio de aceptación**: AC-002 — No permitir crear Tarea sin Nombre
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación está corriendo en entorno local de desarrollo, sin backend, con persistencia en almacenamiento local.
- Existe al menos un Proyecto previamente creado.
- El modal "Nueva Tarea" está abierto (o se invoca directamente la función/acción de creación de Tarea de la capa de estado).

## Datos de prueba

| Campo           | Valor                        | Notas                                    |
| --------------- | ---------------------------- | ---------------------------------------- |
| Proyecto        | "Proyecto Alpha" [propuesto] | Válido, para aislar el campo bajo prueba |
| Nombre de Tarea | "" (vacío) [propuesto]       | Campo obligatorio omitido                |

## Pasos de ejecución

| #   | Actor   | Acción                                                               | Resultado esperado del paso     |
| --- | ------- | -------------------------------------------------------------------- | ------------------------------- |
| 1   | usuario | Selecciona el Proyecto "Proyecto Alpha" y deja el campo Nombre vacío | El campo Nombre permanece vacío |
| 2   | usuario | Intenta confirmar la creación de la Tarea                            | El sistema NO crea la Tarea     |

## Resultado esperado final

La Tarea no se crea ni se persiste. El sistema mantiene el modal abierto e indica que el Nombre es obligatorio (validación bloqueante).

## Observaciones

Complementario de TC-002, que cubre la ausencia de Proyecto. Ambos verifican AC-002.
