# TC-017 — Dado que se creó un Registro de Tiempo manual, cuando se recarga la aplicación, entonces el registro persiste en el almacenamiento local del dispositivo

**Perspectiva**: Happy Path
**Automatización**: Automatizable (Integration)
**Prioridad**: Media
**Criterio de aceptación**: AC-015 — Persistir el Registro de Tiempo manual en el almacenamiento local del dispositivo
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- Se creó exitosamente el Registro de Tiempo manual para "Diseñar wireframes" con Fecha 2026-07-10 y Duración 1h 30min (ver TC-014).
- La aplicación está corriendo en entorno local de desarrollo, sin backend.

## Datos de prueba

| Campo    | Valor                            | Notas                                   |
| -------- | -------------------------------- | --------------------------------------- |
| Tarea    | "Diseñar wireframes" [propuesto] | Con Registro de Tiempo manual ya creado |
| Fecha    | 2026-07-10 [propuesto]           | Del registro creado                     |
| Duración | 1h 30min [propuesto]             | Del registro creado                     |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                 | Resultado esperado del paso                                             |
| --- | ------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1   | sistema | Persiste el Registro de Tiempo manual en el almacenamiento local al momento de crearlo | El registro queda disponible en el almacenamiento local                 |
| 2   | usuario | Recarga la aplicación (F5)                                                             | La aplicación se reinicia leyendo del almacenamiento local, sin backend |
| 3   | usuario | Consulta la información de la Tarea "Diseñar wireframes"                               | El Registro de Tiempo manual sigue presente con sus datos originales    |

## Resultado esperado final

El Registro de Tiempo manual (Fecha 2026-07-10, Duración 1h 30min) permanece disponible tras la recarga, confirmando su persistencia en el almacenamiento local.

## Observaciones

Depende de TC-014 para la creación previa del registro.
