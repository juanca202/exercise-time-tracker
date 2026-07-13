# TC-008 — Dado que existe un Registro de Tiempo asociado a una Tarea cuyo Proyecto ya no existe, Cuando el sistema calcula el total acumulado por Proyecto, Entonces el registro huérfano no corrompe el cálculo de los Proyectos válidos

**Perspectiva**: Error
**Automatización**: Automatizable (Integration)
**Prioridad**: Alta
**Criterio de aceptación**: AC-003 (Procesamiento de datos)
**Artefacto padre**: US-003
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La función de cálculo de total por Proyecto está disponible, integrando Proyectos, Tareas y Registros de Tiempo.
- Existe una Tarea cuyo `proyectoId` referencia un Proyecto inexistente (huérfana), con al menos un Registro de Tiempo asociado.
- Existe además al menos un Proyecto válido con Tareas y Registros de Tiempo normales.

## Datos de prueba

| Campo                        | Valor                                        | Notas                                     |
| ---------------------------- | -------------------------------------------- | ----------------------------------------- |
| Tarea "Huérfana" [propuesto] | proyectoId: "P-999" (no existe)              | Tarea con Proyecto eliminado/ inexistente |
| RT-05 [propuesto]            | tareaId: "Huérfana", duración: 40 min        |                                           |
| Proyecto "Beta" [propuesto]  | id: "P-2", con Tarea "Backend API" (120 min) | Proyecto válido de control                |

## Pasos de ejecución

| #   | Actor          | Acción                                                                                                             | Resultado esperado del paso                                  |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| 1   | Sistema (test) | Invoca la función de cálculo de total por Proyecto incluyendo la Tarea huérfana y el Proyecto "Beta"               | El cálculo se ejecuta sin lanzar una excepción no controlada |
| 2   | Sistema        | Excluye el Registro de la Tarea huérfana de cualquier total de Proyecto (no tiene Proyecto válido al cual sumarse) | El total del Proyecto "Beta" no se ve afectado               |
| 3   | Sistema (test) | Verifica el total devuelto para el Proyecto "Beta"                                                                 | El total es 120 minutos, sin alteración                      |

## Resultado esperado final

El cálculo de totales por Proyecto se completa correctamente para todos los Proyectos válidos (Proyecto "Beta" = 120 min); el Registro de la Tarea huérfana no se suma a ningún Proyecto y no interrumpe el proceso de agregación.

## Observaciones

El tratamiento exacto de Tareas huérfanas (excluir del cálculo, agrupar en "Sin proyecto", etc.) es una decisión técnica de `work-plan`/`TK-XXX`; este TC exige, como mínimo, que no corrompa los totales de los Proyectos válidos.
