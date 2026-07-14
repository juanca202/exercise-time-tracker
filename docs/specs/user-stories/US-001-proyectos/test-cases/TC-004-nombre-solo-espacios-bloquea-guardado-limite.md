# TC-004 — Dado que el usuario completa el campo Nombre únicamente con espacios en blanco, Cuando intenta confirmar la creación, Entonces el sistema lo trata como Nombre vacío y bloquea el guardado

**Perspectiva**: Límite
**Automatización**: Automatizable (Unit/Integration)
**Prioridad**: Media
**Criterio de aceptación**: AC-002 — No permitir guardar un Proyecto si el Nombre está vacío
**Artefacto padre**: US-001
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- El formulario/modal "Nuevo Proyecto" (o la función de validación/creación del store) está disponible para ser ejercitado.

## Datos de prueba

| Campo       | Valor                             | Notas                                                                          |
| ----------- | --------------------------------- | ------------------------------------------------------------------------------ |
| Nombre      | `   ` (tres espacios) [propuesto] | Valor límite: no vacío en longitud de cadena, pero sin contenido significativo |
| Descripción | `` (vacío) [propuesto]            | N/A al resultado                                                               |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                            | Resultado esperado del paso                                           |
| --- | ------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 1   | Usuario | Completa el campo Nombre únicamente con espacios en blanco (`   `)                                | El campo muestra los espacios ingresados                              |
| 2   | Usuario | Intenta confirmar la creación                                                                     | El sistema no persiste ningún Proyecto nuevo                          |
| 3   | Sistema | Evalúa el Nombre como vacío tras normalizar espacios (trim) y muestra el error de campo requerido | El modal permanece abierto con el error visible junto al campo Nombre |

## Resultado esperado final

Un Nombre compuesto solo por espacios en blanco es tratado como vacío: no se crea ni persiste ningún Proyecto, preservando la integridad de los datos.

## Observaciones

Cubre el límite entre "cadena no vacía" y "contenido significativo"; corresponde al caso simétrico de TC-012 (misma regla en edición, AC-006). Si la implementación no normaliza espacios, este TC debe fallar y reportarse como hallazgo.
