# TC-003 — Dado que el usuario deja el campo Nombre vacío en el modal "Nuevo Proyecto", Cuando intenta confirmar la creación, Entonces el sistema bloquea el guardado

**Perspectiva**: Error
**Automatización**: Automatizable (Unit/Integration)
**Prioridad**: Alta
**Criterio de aceptación**: AC-002 — No permitir guardar un Proyecto si el Nombre está vacío
**Artefacto padre**: US-001
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- El formulario/modal "Nuevo Proyecto" (o la función de validación/creación del store) está disponible para ser ejercitado.

## Datos de prueba

| Campo       | Valor                            | Notas                                                                        |
| ----------- | -------------------------------- | ---------------------------------------------------------------------------- |
| Nombre      | `` (vacío) [propuesto]           | Valor inválido a probar                                                      |
| Descripción | `Proyecto de prueba` [propuesto] | Irrelevante al resultado, solo para aislar la causa del bloqueo en el Nombre |

## Pasos de ejecución

| #   | Actor   | Acción                                                         | Resultado esperado del paso                                            |
| --- | ------- | -------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 1   | Usuario | Abre el modal "Nuevo Proyecto" y deja el campo Nombre vacío    | El campo Nombre permanece vacío                                        |
| 2   | Usuario | Completa opcionalmente la Descripción con `Proyecto de prueba` | El campo refleja el valor ingresado                                    |
| 3   | Usuario | Intenta confirmar la creación (botón principal del modal)      | El sistema no persiste ningún Proyecto nuevo                           |
| 4   | Sistema | Muestra retroalimentación de error/campo requerido en Nombre   | El modal permanece abierto y el error es visible junto al campo Nombre |

## Resultado esperado final

Ningún Proyecto se crea ni se persiste en el almacenamiento local mientras el campo Nombre esté vacío; el sistema informa al usuario que el Nombre es obligatorio.

## Observaciones

Corresponde al caso simétrico de TC-011 (misma regla aplicada en edición, AC-006).
