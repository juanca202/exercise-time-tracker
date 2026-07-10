# US-003: Historial de Registros

Estado: Ready
Fecha de creación: 2026-07-08
Última actualización: 2026-07-08
ADO Work Item: [AB#30274](https://dev.azure.com/BayteqDev/Bayteq%20IA/_workitems/edit/30274)

## Descripción

**COMO** usuario de Time Tracker
**QUIERO** consultar el historial de mis Registros de Tiempo y los totales acumulados por Tarea, Proyecto y mes
**PARA** entender en qué he invertido mi tiempo y tomar decisiones sobre mi productividad

## Contexto

Esta historia cubre exclusivamente la visualización del historial y los totales de tiempo ya registrados (mediante temporizador o de forma manual, ver [US-001: Gestión de Tareas y registro de tiempo](../US-001-gestion-de-tareas/README.md)). No incluye la creación ni edición de Registros de Tiempo.

## Referencias

- **Especificación de origen:** [SRS-001: Time Tracker](../../../requirements/SRS-001-timetracker-app/README.md)
- **Diseño / prototipo (alta fidelidad) — Historial de registros:** [Figma — Historial de registros](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker?node-id=1-1740)

## Criterios de aceptación

- **AC-001 (Casos de uso):** El sistema DEBE leer y mostrar en la interfaz el historial de todos los Registros de Tiempo.
  Casos de prueba: [TC-001](./test-cases/TC-001-historial-registros-happy.md) · [TC-002](./test-cases/TC-002-historial-vacio-limite.md)
- **AC-002 (Salidas del sistema):** El sistema DEBE calcular y mostrar el total de tiempo acumulado por Tarea.
  Casos de prueba: [TC-003](./test-cases/TC-003-total-por-tarea-happy.md) · [TC-004](./test-cases/TC-004-total-tarea-sin-registros-limite.md)
- **AC-003 (Salidas del sistema):** El sistema DEBE calcular y mostrar el total de tiempo acumulado por Proyecto dentro del periodo seleccionado.
  Casos de prueba: [TC-005](./test-cases/TC-005-total-por-proyecto-happy.md) · [TC-006](./test-cases/TC-006-total-proyecto-sin-registros-periodo-limite.md)
- **AC-004 (Salidas del sistema):** El sistema DEBE calcular y mostrar el total de tiempo acumulado por mes, permitiendo navegar entre periodos (mes anterior / mes siguiente).
  Casos de prueba: [TC-007](./test-cases/TC-007-mes-actual-happy.md) · [TC-008](./test-cases/TC-008-navegacion-mes-anterior-siguiente-happy.md) · [TC-009](./test-cases/TC-009-mes-sin-registros-limite.md)
- **AC-005 (Interacción de usuario):** La interfaz DEBE listar cada Registro de Tiempo con Fecha, Proyecto, Tarea y Duración, conforme al prototipo de alta fidelidad.
  Casos de prueba: [TC-010](./test-cases/TC-010-listado-registro-campos-happy.md) · [TC-011](./test-cases/TC-011-duracion-minima-registro-limite.md)
- **AC-006 (Interacción de usuario):** La interfaz DEBE mostrar un resumen del periodo seleccionado con el total de registros encontrados, la cantidad de proyectos involucrados y el total de horas.
  Casos de prueba: [TC-012](./test-cases/TC-012-resumen-periodo-happy.md) · [TC-013](./test-cases/TC-013-resumen-periodo-sin-registros-limite.md)
- **AC-007 (Eficiencia de rendimiento):** La visualización del historial DEBE cargarse en menos de 2 segundos para un volumen de hasta 1000 Registros de Tiempo.
  Casos de prueba: [TC-014](./test-cases/TC-014-carga-volumen-pequeno-happy.md) · [TC-015](./test-cases/TC-015-carga-1000-registros-limite.md)

---

## Complejidad sugerida

- **Story points:** 5
- **Justificación:** Requiere agregaciones sobre múltiples dimensiones (tarea, proyecto, mes), navegación entre periodos y una restricción de rendimiento explícita (RP-003) sobre volúmenes de datos considerables.

## Repositorios

- exercise-time-tracker

## Validación

### INVEST

| Letra | Criterio      | Resultado | Notas                                                                                                                                         |
| ----- | ------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **I** | Independiente | Parcial   | Depende de que existan Registros de Tiempo generados por US-001 para mostrar datos reales; sin ellos la pantalla solo exhibe el estado vacío. |
| **N** | Negociable    | Cumple    | El detalle de agrupación y presentación del resumen puede ajustarse sin afectar el valor central.                                             |
| **V** | Valiosa       | Cumple    | Da visibilidad histórica sobre la productividad del usuario.                                                                                  |
| **E** | Estimable     | Cumple    | RF-014 a RF-017, RP-003 y el prototipo de alta fidelidad dan suficiente detalle.                                                              |
| **S** | Pequeña       | Cumple    | Alcance acotado a lectura y agregación; no incluye creación ni edición de registros.                                                          |
| **T** | Testeable     | Cumple    | AC-001 a AC-007 son verificables objetivamente.                                                                                               |

### Definition of Ready (DoR)

| Criterio DoR                       | Estado  | Notas                                                                                                                                    |
| ---------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Dependencias listas                | Parcial | Depende de que US-001 genere Registros de Tiempo para poblar el historial; orden de implementación natural, no una aclaración pendiente. |
| Inputs/outputs claros              | Cumple  | RF-014 a RF-017 y RP-003 documentados en la SRS.                                                                                         |
| Repositorios definidos             | Cumple  | exercise-time-tracker.                                                                                                                   |
| Sin decisiones técnicas pendientes | Cumple  | No hay decisiones técnicas abiertas que condicionen el alcance funcional.                                                                |
| Referencias de UI                  | Cumple  | Prototipo Figma de alta fidelidad (frame Historial de registros).                                                                        |
| Sin aclaraciones pendientes        | Cumple  | Ninguna.                                                                                                                                 |

## Observaciones

- Ninguna.
