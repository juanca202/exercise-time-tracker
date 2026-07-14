# TC-010 — Dado un Proyecto existente con Descripción, Cuando el usuario edita el Proyecto y vacía el campo Descripción, Entonces la edición se guarda con la Descripción vacía

**Perspectiva**: Límite
**Automatización**: Automatizable (Unit/Integration)
**Prioridad**: Media
**Criterio de aceptación**: AC-005 — Permitir editar Nombre y Descripción de un Proyecto existente reutilizando el modal de creación precargado
**Artefacto padre**: US-001
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- Existe un Proyecto previamente creado: Nombre `Proyecto Con Descripción`, Descripción `Texto a eliminar`.
- El modal/función de edición del Proyecto está disponible para ser ejercitado.

## Datos de prueba

| Campo                  | Valor                                  | Notas                                                             |
| ---------------------- | -------------------------------------- | ----------------------------------------------------------------- |
| Nombre (se mantiene)   | `Proyecto Con Descripción` [propuesto] | No se modifica                                                    |
| Descripción (original) | `Texto a eliminar` [propuesto]         | Precondición                                                      |
| Descripción (nueva)    | `` (vacío) [propuesto]                 | Verifica el límite inferior del campo opcional también en edición |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                | Resultado esperado del paso                                                     |
| --- | ------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 1   | Usuario | Abre la edición de `Proyecto Con Descripción`                                         | El modal precarga Nombre y Descripción existentes                               |
| 2   | Usuario | Borra completamente el contenido del campo Descripción, dejando el Nombre sin cambios | El campo Descripción queda vacío                                                |
| 3   | Usuario | Confirma la edición                                                                   | No se muestra ningún error de validación                                        |
| 4   | Sistema | Persiste el Proyecto con Descripción vacía                                            | El Proyecto se guarda con Nombre `Proyecto Con Descripción` y Descripción vacía |

## Resultado esperado final

La edición se guarda correctamente con la Descripción vacía, confirmando que el carácter opcional del campo también aplica al flujo de edición (BR-01/BR-02).

## Observaciones

Cubre el límite inferior (vaciado) del campo opcional Descripción en el flujo de edición, análogo a TC-002 para creación.
