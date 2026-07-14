# TC-002 — Dado que el usuario abre el modal "Nuevo Proyecto", Cuando completa únicamente el Nombre y omite la Descripción, Entonces el Proyecto se crea correctamente sin Descripción

**Perspectiva**: Límite
**Automatización**: Automatizable (Unit/Integration)
**Prioridad**: Media
**Criterio de aceptación**: AC-001 — Permitir crear un Proyecto con Nombre obligatorio y Descripción opcional
**Artefacto padre**: US-001
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- El componente/formulario "Nuevo Proyecto" (o la función de creación del store) está disponible para ser ejercitado de forma aislada.
- No existe restricción previa que impida crear un Proyecto sin Descripción.

## Datos de prueba

| Campo       | Valor                                   | Notas                                          |
| ----------- | --------------------------------------- | ---------------------------------------------- |
| Nombre      | `Proyecto Interno` [propuesto]          | Cadena no vacía, único campo obligatorio       |
| Descripción | `` (vacío / no se completa) [propuesto] | Verifica el límite inferior del campo opcional |

## Pasos de ejecución

| #   | Actor   | Acción                                                                            | Resultado esperado del paso                                                    |
| --- | ------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 1   | Usuario | Completa el campo Nombre con `Proyecto Interno` y deja el campo Descripción vacío | El formulario no muestra error de validación                                   |
| 2   | Usuario | Confirma la creación                                                              | La acción de guardado se ejecuta sin bloqueo                                   |
| 3   | Sistema | Crea el Proyecto con Descripción vacía/ausente                                    | El Proyecto queda registrado con Nombre `Proyecto Interno` y Descripción vacía |

## Resultado esperado final

El Proyecto se crea exitosamente únicamente con el Nombre, confirmando que la Descripción es verdaderamente opcional (no bloquea el guardado en su valor límite vacío).

## Observaciones

Cubre el límite inferior (ausencia total) del campo opcional Descripción, complementando a TC-001 que valida el caso con ambos campos completos.
