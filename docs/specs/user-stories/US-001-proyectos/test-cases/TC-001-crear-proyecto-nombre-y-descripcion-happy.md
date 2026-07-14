# TC-001 — Dado que el usuario abre el modal "Nuevo Proyecto", Cuando completa Nombre y Descripción y confirma, Entonces el Proyecto se crea y aparece en el listado

**Perspectiva**: Happy Path
**Automatización**: Automatizable (E2E)
**Prioridad**: Alta
**Criterio de aceptación**: AC-001 — Permitir crear un Proyecto con Nombre obligatorio y Descripción opcional
**Artefacto padre**: US-001
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación Time Tracker está corriendo en entorno local de desarrollo (`npm run dev`).
- El almacenamiento local del navegador no contiene Proyectos previos (estado limpio) o puede contener otros Proyectos sin que afecten el resultado.
- El usuario se encuentra en la sección "Proyectos".

## Datos de prueba

| Campo       | Valor                                                                      | Notas                                        |
| ----------- | -------------------------------------------------------------------------- | -------------------------------------------- |
| Nombre      | `Proyecto Cliente Acme` [propuesto]                                        | Cadena no vacía dentro de longitud razonable |
| Descripción | `Desarrollo de la migración de infraestructura para Acme Corp` [propuesto] | Campo opcional, aquí se completa             |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                           | Resultado esperado del paso                                                                    |
| --- | ------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| 1   | Usuario | Hace clic en el botón/acción "Nuevo Proyecto"                                                    | Se abre el modal "Nuevo Proyecto" con los campos Nombre y Descripción vacíos                   |
| 2   | Usuario | Completa el campo Nombre con `Proyecto Cliente Acme`                                             | El campo refleja el valor ingresado                                                            |
| 3   | Usuario | Completa el campo Descripción con `Desarrollo de la migración de infraestructura para Acme Corp` | El campo refleja el valor ingresado                                                            |
| 4   | Usuario | Confirma la creación (botón principal del modal)                                                 | El modal se cierra sin mostrar errores                                                         |
| 5   | Sistema | Persiste el Proyecto en el almacenamiento local                                                  | El nuevo Proyecto aparece en el listado de Proyectos con el Nombre y la Descripción ingresados |

## Resultado esperado final

El Proyecto `Proyecto Cliente Acme` queda creado y visible en el listado de Proyectos, con su Nombre y Descripción exactamente como fueron ingresados, y persistido en el almacenamiento local del dispositivo.

## Observaciones

Complementa a TC-002 (creación solo con Nombre, sin Descripción) y depende del mismo modal reutilizado en la edición (AC-005, ver TC-009).
