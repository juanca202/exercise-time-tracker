# TC-009 — Dado un Proyecto existente, Cuando el usuario edita su Nombre y Descripción desde el modal reutilizado, Entonces los cambios se guardan y se reflejan en el listado

**Perspectiva**: Happy Path
**Automatización**: Automatizable (E2E)
**Prioridad**: Alta
**Criterio de aceptación**: AC-005 — Permitir editar Nombre y Descripción de un Proyecto existente reutilizando el modal de creación precargado
**Artefacto padre**: US-001
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación Time Tracker está corriendo en entorno local de desarrollo.
- Existe un Proyecto previamente creado: Nombre `Proyecto Original`, Descripción `Descripción original`.

## Datos de prueba

| Campo                  | Valor                                 | Notas           |
| ---------------------- | ------------------------------------- | --------------- |
| Nombre (original)      | `Proyecto Original` [propuesto]       | Precondición    |
| Descripción (original) | `Descripción original` [propuesto]    | Precondición    |
| Nombre (nuevo)         | `Proyecto Renombrado` [propuesto]     | Valor a guardar |
| Descripción (nueva)    | `Descripción actualizada` [propuesto] | Valor a guardar |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                       | Resultado esperado del paso                                                                                                        |
| --- | ------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Usuario | Selecciona la acción "Editar" sobre `Proyecto Original`                                      | Se abre el mismo modal usado para "Nuevo Proyecto", precargado con Nombre `Proyecto Original` y Descripción `Descripción original` |
| 2   | Usuario | Verifica el título del modal y la etiqueta del botón principal                               | Ambos muestran "Editar Proyecto" en lugar de "Nuevo Proyecto"                                                                      |
| 3   | Usuario | Reemplaza el Nombre por `Proyecto Renombrado` y la Descripción por `Descripción actualizada` | Los campos reflejan los nuevos valores                                                                                             |
| 4   | Usuario | Confirma la edición                                                                          | El modal se cierra sin errores                                                                                                     |
| 5   | Sistema | Persiste los cambios en el almacenamiento local                                              | El listado de Proyectos muestra `Proyecto Renombrado` con la Descripción `Descripción actualizada`                                 |

## Resultado esperado final

El Proyecto queda actualizado con el nuevo Nombre y Descripción, el modal de edición se comportó como el de creación (mismo componente) precargado y con el título/botón adaptados a "Editar Proyecto", y los cambios persisten en el almacenamiento local.

## Observaciones

Depende de que exista al menos un Proyecto previo (ver TC-001 para su creación). Relacionado con TC-010 (edición dejando la Descripción vacía).
