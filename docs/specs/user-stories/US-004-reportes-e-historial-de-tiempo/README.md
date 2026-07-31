# US-004: Reportes e Historial de Tiempo

**Estado:** Ready
**Fecha de creación:** 2026-07-30
**Última actualización:** 2026-07-30

## Descripción

**COMO** usuario de Time Tracker
**QUIERO** visualizar el historial de mis Registros de Tiempo, los totales acumulados por Tarea, Proyecto y mes, y mi avance hacia una meta semanal de horas
**PARA** entender en qué he invertido mi tiempo y monitorear mi productividad personal

## Contexto

Esta historia consume los Registros de Tiempo generados por el temporizador y por el ingreso manual, ambos entregados en [US-003 (Gestión de Tareas y Registro de Tiempo)](../US-003-gestion-de-tareas-y-registro-de-tiempo/README.md), y las Tareas/Proyectos de [US-002 (Gestión de Proyectos)](../US-002-gestion-de-proyectos/README.md)/US-003. El cálculo de totales está documentado en [timetracker.md#fl-04-cálculo-de-totales-de-tiempo-tarea-proyecto-mes](../../technical-docs/timetracker.md#fl-04-cálculo-de-totales-de-tiempo-tarea-proyecto-mes).

El wireframe [figma-tareas.png](../../requirements/SRS-001-timetracker-app/assets/figma-tareas.png) muestra un indicador de avance hacia una "meta semanal" (ej. "Has alcanzado el 84% de tu meta semanal") que ningún RF del SRS-001 definía. Se investigó en [research/RS-001-meta-semanal-no-especificada](research/RS-001-meta-semanal-no-especificada/README.md) y producto confirmó que la meta semanal es un valor **fijo de 40 horas** (jornada de referencia de 8 horas × 5 días laborables), no configurable por el usuario; el porcentaje se deriva directamente del "Total semanal" ya calculado por esta misma historia (AC-002 a AC-004 cubren Tarea/Proyecto/mes; el Total semanal es una variante de esa misma agregación acotada a la semana en curso).

## Reglas de negocio

- **BR-01:** La meta semanal DEBE ser un valor fijo de 40 horas (8 horas × 5 días laborables), no configurable por el usuario. → verificado por AC-007

## Referencias

- **SRS:** [SRS-001-timetracker-app](../../requirements/SRS-001-timetracker-app/README.md) — RF-014 a RF-017, RIU-002, RD-003, RP-003.
- **Diseño / prototipo:** [Figma – exercise-time-tracker](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker) — pantallas "Tareas" (totales y meta semanal) e "Historial de registros".
- **Wireframes:** [figma-tareas.png](../../requirements/SRS-001-timetracker-app/assets/figma-tareas.png), [figma-historial.png](../../requirements/SRS-001-timetracker-app/assets/figma-historial.png), [figma-proyectos.png](../../requirements/SRS-001-timetracker-app/assets/figma-proyectos.png)
- **Sistema de diseño:** [DESIGN.md](../../../../DESIGN.md) — tema Precision Focus.
- **Documentación técnica:** [timetracker.md#fl-04-cálculo-de-totales-de-tiempo-tarea-proyecto-mes](../../technical-docs/timetracker.md#fl-04-cálculo-de-totales-de-tiempo-tarea-proyecto-mes) — cálculo de totales por Tarea, Proyecto y mes.
- **Investigación:** [research/RS-001-meta-semanal-no-especificada](research/RS-001-meta-semanal-no-especificada/README.md) — origen de la constante de 40 horas y de la fórmula del porcentaje.

## Criterios de aceptación

- **AC-001 (Salidas del sistema):** el sistema DEBE leer y mostrar en la interfaz el historial completo de Registros de Tiempo. (RF-014)
- **AC-002 (Procesamiento de datos):** el sistema DEBE calcular y mostrar el total de tiempo acumulado por Tarea, mostrando `0` cuando la Tarea no tenga Registros de Tiempo. (RF-015)
- **AC-003 (Procesamiento de datos):** el sistema DEBE calcular y mostrar el total de tiempo acumulado por Proyecto, como la suma de los totales de sus Tareas, mostrando `0` cuando el Proyecto no tenga Registros de Tiempo. (RF-016)
- **AC-004 (Procesamiento de datos):** el sistema DEBE calcular y mostrar el total de tiempo acumulado por mes, mostrando `0` cuando no existan Registros de Tiempo en el mes seleccionado. (RF-017)
- **AC-005 (Interacción de usuario):** la pantalla "Historial de registros" DEBE listar cada Registro de Tiempo con su Fecha, Proyecto, Tarea y Duración, permitiendo navegar entre periodos mensuales, fiel al wireframe [figma-historial.png](../../requirements/SRS-001-timetracker-app/assets/figma-historial.png). (RIU-002, RD-003)
- **AC-006 (Interacción de usuario):** el panel principal de "Tareas" DEBE mostrar los totales "Total semanal" y "Total mensual" acumulados, fiel al wireframe [figma-tareas.png](../../requirements/SRS-001-timetracker-app/assets/figma-tareas.png). (RIU-002, RD-003)
- **AC-007 (Reglas de negocio):** la meta semanal DEBE ser un valor fijo de 40 horas, no configurable por el usuario. (BR-01)
- **AC-008 (Procesamiento de datos):** el sistema DEBE calcular el porcentaje de avance hacia la meta semanal como (Total semanal ÷ 40 horas) × 100, mostrando como máximo **100%** aunque el Total semanal supere las 40 horas. (BR-01)
- **AC-009 (Interacción de usuario):** el panel principal de "Tareas" DEBE mostrar el porcentaje de avance hacia la meta semanal (p. ej. "Has alcanzado el 84% de tu meta semanal"), fiel al wireframe [figma-tareas.png](../../requirements/SRS-001-timetracker-app/assets/figma-tareas.png). (RIU-002, RD-003)
- **AC-010 (Interacción de usuario):** la pantalla "Proyectos" DEBE mostrar el tiempo total acumulado de cada Proyecto (AC-003), fiel al wireframe [figma-proyectos.png](../../requirements/SRS-001-timetracker-app/assets/figma-proyectos.png). (RIU-002, RD-003)
- **AC-011 (Eficiencia de rendimiento):** la visualización de los reportes de tiempo (por Tarea, Proyecto y mes) DEBE cargarse en menos de 2 segundos para un volumen de hasta 1000 Registros de Tiempo. (RP-003)

---

## Complejidad sugerida

- **Story points:** 5
- **Justificación:** Requiere agregaciones sobre múltiples entidades (Tarea, Proyecto, mes), navegación entre periodos y cumplir un requisito de rendimiento explícito (RP-003) sobre un volumen de datos considerable. El indicador de meta semanal (AC-007 a AC-009) no incrementa la complejidad de forma relevante: reutiliza el "Total semanal" ya calculado y aplica una división por una constante fija (40 horas).

## Repositorios

- exercise-time-tracker

## Validación

### INVEST

| Letra | Criterio      | Resultado | Notas                                                                                                                                                                                                  |
| ----- | ------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **I** | Independiente | Parcial   | Depende de que existan Registros de Tiempo (generados en US-003) para tener datos que mostrar; puede desarrollarse y probarse con datos de prueba (seed) antes de que esa historia esté en producción. |
| **N** | Negociable    | Cumple    | El alcance de agregaciones y layout admite ajuste sin cambiar el valor central.                                                                                                                        |
| **V** | Valiosa       | Cumple    | Es el objetivo final del producto: entender en qué se invirtió el tiempo registrado y qué tan cerca está el usuario de su meta semanal.                                                                |
| **E** | Estimable     | Cumple    | Cálculo de totales documentado en technical-docs (FL-04); el cálculo de la meta semanal es una división por una constante, sin nueva entidad de datos.                                                 |
| **S** | Pequeña       | Parcial   | Agrupa tres agregaciones distintas (Tarea, Proyecto, mes) más el historial y el indicador de meta semanal; si el equipo lo prefiere, puede dividirse en historias más pequeñas por tipo de reporte.    |
| **T** | Testeable     | Cumple    | AC-001 a AC-011 son verificables de forma objetiva.                                                                                                                                                    |

### Definition of Ready (DoR)

| Criterio DoR                       | Estado  | Notas                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dependencias listas                | Parcial | Depende de que existan Registros de Tiempo (US-003); no bloquea la definición ni la implementación con datos semilla.                                                                                                                                                                                                                                                        |
| Inputs/outputs claros              | Cumple  | Registros de Tiempo, Tareas y Proyectos existentes como entrada; historial, totales y porcentaje de meta semanal como salida.                                                                                                                                                                                                                                                |
| Repositorios definidos             | Cumple  | exercise-time-tracker (repositorio único, monorepo).                                                                                                                                                                                                                                                                                                                         |
| Sin decisiones técnicas pendientes | Cumple  | Cálculo documentado en [timetracker.md#fl-04-cálculo-de-totales-de-tiempo-tarea-proyecto-mes](../../technical-docs/timetracker.md#fl-04-cálculo-de-totales-de-tiempo-tarea-proyecto-mes); el criterio de estado vacío (mostrar `0`) se resolvió en AC-002 a AC-004; la meta semanal (BR-01) se confirmó en [RS-001](research/RS-001-meta-semanal-no-especificada/README.md). |
| Referencias de UI                  | Cumple  | Wireframes [figma-historial.png](../../requirements/SRS-001-timetracker-app/assets/figma-historial.png), [figma-tareas.png](../../requirements/SRS-001-timetracker-app/assets/figma-tareas.png) y [figma-proyectos.png](../../requirements/SRS-001-timetracker-app/assets/figma-proyectos.png) disponibles.                                                                  |
| Sin aclaraciones pendientes        | Cumple  | La laguna de la meta semanal (no cubierta por ningún RF) quedó resuelta en [RS-001](research/RS-001-meta-semanal-no-especificada/README.md): valor fijo de 40 horas.                                                                                                                                                                                                         |

## Observaciones

- Depende de que US-003 (Gestión de Tareas y Registro de Tiempo) esté implementada o disponible con datos de prueba, para tener Registros de Tiempo que mostrar.
- Ninguna.
- Si el equipo prefiere no entregar las tres agregaciones (Tarea, Proyecto, mes) en un solo incremento, considerar dividir esta historia en `work-plan` por tipo de reporte (dimensión S de INVEST en Parcial).
- Ninguna.
