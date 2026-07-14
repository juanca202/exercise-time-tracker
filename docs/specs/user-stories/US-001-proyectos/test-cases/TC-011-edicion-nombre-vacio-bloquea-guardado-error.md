# TC-011 — Dado un Proyecto existente en edición, Cuando el usuario vacía el campo Nombre e intenta confirmar, Entonces el sistema bloquea el guardado de la edición

**Perspectiva**: Error
**Automatización**: Automatizable (Unit/Integration)
**Prioridad**: Alta
**Criterio de aceptación**: AC-006 — No permitir guardar la edición de un Proyecto si el Nombre queda vacío
**Artefacto padre**: US-001
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- Existe un Proyecto previamente creado: Nombre `Proyecto a Editar`, Descripción `Descripción cualquiera`.
- El modal/función de edición del Proyecto está disponible para ser ejercitado.

## Datos de prueba

| Campo                    | Valor                           | Notas                   |
| ------------------------ | ------------------------------- | ----------------------- |
| Nombre (original)        | `Proyecto a Editar` [propuesto] | Precondición            |
| Nombre (nuevo, inválido) | `` (vacío) [propuesto]          | Valor inválido a probar |

## Pasos de ejecución

| #   | Actor   | Acción                                                       | Resultado esperado del paso                                                                                                               |
| --- | ------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Usuario | Abre la edición de `Proyecto a Editar`                       | El modal precarga los datos existentes                                                                                                    |
| 2   | Usuario | Borra completamente el contenido del campo Nombre            | El campo Nombre queda vacío                                                                                                               |
| 3   | Usuario | Intenta confirmar la edición                                 | El sistema no persiste ningún cambio                                                                                                      |
| 4   | Sistema | Muestra retroalimentación de error/campo requerido en Nombre | El modal permanece abierto con el error visible; el Proyecto conserva su Nombre original (`Proyecto a Editar`) en el almacenamiento local |

## Resultado esperado final

La edición no se guarda mientras el campo Nombre esté vacío; el Proyecto conserva sus datos previos intactos en el almacenamiento local.

## Observaciones

Corresponde al caso simétrico de TC-003 (misma regla aplicada en creación, AC-002).
