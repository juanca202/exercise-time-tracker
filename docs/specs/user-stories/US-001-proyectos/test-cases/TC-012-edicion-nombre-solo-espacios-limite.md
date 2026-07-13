# TC-012 — Dado un Proyecto existente en edición, Cuando el usuario reemplaza el Nombre únicamente por espacios en blanco, Entonces el sistema lo trata como Nombre vacío y bloquea el guardado

**Perspectiva**: Límite
**Automatización**: Automatizable (Unit/Integration)
**Prioridad**: Media
**Criterio de aceptación**: AC-006 — No permitir guardar la edición de un Proyecto si el Nombre queda vacío
**Artefacto padre**: US-001
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- Existe un Proyecto previamente creado: Nombre `Proyecto a Editar`, Descripción `Descripción cualquiera`.
- El modal/función de edición del Proyecto está disponible para ser ejercitado.

## Datos de prueba

| Campo                    | Valor                             | Notas                                                                |
| ------------------------ | --------------------------------- | -------------------------------------------------------------------- |
| Nombre (original)        | `Proyecto a Editar` [propuesto]   | Precondición                                                         |
| Nombre (nuevo, inválido) | `   ` (tres espacios) [propuesto] | Valor límite: no vacío en longitud, pero sin contenido significativo |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                            | Resultado esperado del paso                                                                                         |
| --- | ------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 1   | Usuario | Abre la edición de `Proyecto a Editar`                                                            | El modal precarga los datos existentes                                                                              |
| 2   | Usuario | Reemplaza el contenido del campo Nombre únicamente por espacios en blanco (`   `)                 | El campo muestra los espacios ingresados                                                                            |
| 3   | Usuario | Intenta confirmar la edición                                                                      | El sistema no persiste ningún cambio                                                                                |
| 4   | Sistema | Evalúa el Nombre como vacío tras normalizar espacios (trim) y muestra el error de campo requerido | El modal permanece abierto con el error visible; el Proyecto conserva su Nombre original en el almacenamiento local |

## Resultado esperado final

Un Nombre compuesto solo por espacios en blanco es tratado como vacío también en edición: no se persiste el cambio y el Proyecto conserva su Nombre original.

## Observaciones

Corresponde al caso simétrico de TC-004 (misma regla en creación, AC-002). Si la implementación no normaliza espacios, este TC debe fallar y reportarse como hallazgo.
