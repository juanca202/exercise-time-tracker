# US-002: Control de Tiempo Automatizado (Temporizador)

Estado: Ready
Fecha de creación: 2026-07-03
Última actualización: 2026-07-03

## Descripción

**COMO** usuario de Time Tracker
**QUIERO** iniciar y detener un temporizador para una Tarea específica
**PARA** registrar en tiempo real cuánto tiempo dedico a cada tarea sin tener que anotarlo manualmente

## Contexto

Depende de [US-001](../US-001-gestion-proyectos-tareas/README.md): requiere que existan Proyectos y Tareas para poder iniciar un temporizador sobre una de ellas.

Restricción central del dominio (SRS §2.4): solo puede existir **un (1) temporizador activo** a la vez en toda la aplicación. Si el usuario inicia un temporizador para una Tarea mientras otro está corriendo en una Tarea distinta, el sistema debe detener automáticamente el anterior, calcular y persistir su Registro de Tiempo, y luego iniciar el nuevo (RF-007) — no se permite pausar, solo iniciar/detener (ver decisión de alcance en US-001: la "pausa" mencionada en SRS §2.2 no tiene RF-XXX que la respalde y queda fuera de alcance).

Estado de temporizador activo: `{ taskId, startedAt } | null` (único, global, en el store de Zustand — [ADR-003](../../../adr/ADR-003-zustand-state-management.md)). Al detener, se genera un `TimeEntry { id, taskId, date, durationSeconds, source: 'timer', startTime, endTime, createdAt }` con `durationSeconds > 0` (RF-010, restricción 2.4). Si por un caso extremo (doble clic, reloj del sistema) la duración calculada resultara `<= 0`, el sistema NO DEBE persistir el registro.

## Reglas de negocio

- **BR-01:** El sistema DEBE permitir al usuario iniciar un temporizador para una Tarea específica. → verificado por AC-001
- **BR-02:** Al iniciar un temporizador, el sistema DEBE guardar localmente el estado "En Ejecución" junto con la hora de inicio y el identificador de la Tarea. → verificado por AC-002
- **BR-03:** El sistema DEBE permitir un único temporizador activo en toda la aplicación; si se inicia uno nuevo mientras otro está activo en una Tarea diferente, DEBE detener automáticamente el anterior, calcular y guardar su Registro de Tiempo antes de iniciar el nuevo. → verificado por AC-003
- **BR-04:** El sistema DEBE permitir al usuario detener el temporizador activo. → verificado por AC-004
- **BR-05:** Al detener el temporizador, el sistema DEBE registrar la Hora Fin, calcular la Duración (Hora Fin - Hora Inicio) y persistir el Registro de Tiempo de forma inmediata en el almacenamiento local. → verificado por AC-005
- **BR-06:** El sistema NO DEBE persistir un Registro de Tiempo con Duración menor o igual a cero. → verificado por AC-006
- **BR-07:** La interfaz DEBE mostrar claramente el estado del temporizador (activo/inactivo) y la Tarea asociada. → verificado por AC-007
- **BR-08:** El sistema DEBE iniciar el temporizador en menos de 1 segundo desde la acción del usuario. → verificado por AC-008
- **BR-09:** El sistema DEBE detener el temporizador y persistir el Registro de Tiempo en menos de 1 segundo desde la acción del usuario. → verificado por AC-009

## Referencias

- **Diseño / sistema de diseño:** [DESIGN.md — Precision Focus](https://github.com/HectorAndradeBayteq/taller-sdd/blob/master/etapa-2/assets/DESIGN.md)
- **Wireframe — Panel de Tareas (temporizador activo):** [assets/wireframe-panel-tareas-temporizador.png](assets/wireframe-panel-tareas-temporizador.png)
- **Historia base:** [US-001: Gestión de Proyectos y Tareas](../US-001-gestion-proyectos-tareas/README.md)

## Criterios de aceptación

- **AC-001 (Casos de uso):** El sistema DEBE permitir al usuario iniciar un temporizador para una Tarea específica desde la interfaz (p. ej. seleccionando una tarea o desde el listado de tareas recientes).
- **AC-002 (Procesamiento de datos):** Al iniciar el temporizador, el sistema DEBE guardar localmente el estado "En Ejecución", la hora de inicio y el identificador de la Tarea.
- **AC-003 (Reglas de negocio):** SI el usuario inicia un temporizador mientras otro está activo en una Tarea diferente, ENTONCES el sistema DEBE detener automáticamente el temporizador anterior, calcular y persistir su Registro de Tiempo antes de iniciar el nuevo.
- **AC-004 (Casos de uso):** El sistema DEBE permitir al usuario detener el temporizador activo mediante una acción explícita ("Detener Sesión").
- **AC-005 (Procesamiento de datos):** Al detener el temporizador, el sistema DEBE calcular la Duración como la diferencia entre la Hora Fin y la Hora de Inicio, y persistir el Registro de Tiempo de forma inmediata en almacenamiento local.
- **AC-006 (Reglas de negocio):** El sistema NO DEBE persistir un Registro de Tiempo generado por el temporizador cuya Duración calculada sea menor o igual a cero.
- **AC-007 (Interacción de usuario):** La interfaz DEBE mostrar de forma visible si hay un temporizador activo o inactivo, el Proyecto y la Tarea asociada, la hora de inicio y el tiempo transcurrido en formato HH:MM:SS, conforme al wireframe de referencia.
- **AC-008 (Eficiencia de rendimiento):** El sistema DEBE iniciar el temporizador en menos de 1 segundo desde la acción del usuario.
- **AC-009 (Eficiencia de rendimiento):** El sistema DEBE detener el temporizador y persistir el Registro de Tiempo en menos de 1 segundo desde la acción del usuario.

### Escenarios de comportamiento

```gherkin
Escenario: SC-01 - Iniciar temporizador sin ningún temporizador activo
DADO que no hay ningún temporizador activo
CUANDO el usuario inicia el temporizador para una Tarea existente
ENTONCES el sistema DEBE guardar el estado "En Ejecución" con la hora de inicio y la Tarea, y la interfaz DEBE mostrarlo como activo

Escenario: SC-02 - Iniciar temporizador con otro ya activo en una tarea distinta
DADO que hay un temporizador activo para la Tarea A
CUANDO el usuario inicia un temporizador para la Tarea B
ENTONCES el sistema DEBE detener y persistir el Registro de Tiempo de la Tarea A, y luego iniciar el temporizador para la Tarea B

Escenario: SC-03 - Detener el temporizador activo
DADO que hay un temporizador activo para una Tarea
CUANDO el usuario detiene el temporizador
ENTONCES el sistema DEBE calcular la Duración, persistir el Registro de Tiempo con origen "timer" y la interfaz DEBE mostrar el temporizador como inactivo

Escenario: SC-04 - Duración calculada no positiva
DADO que se detiene un temporizador y la Duración calculada resulta menor o igual a cero
CUANDO el sistema evalúa el Registro de Tiempo antes de persistirlo
ENTONCES el sistema NO DEBE persistir dicho Registro de Tiempo
```

---

## Complejidad sugerida

- **Story points:** 5
- **Justificación:** Lógica de temporizador con estado global único, regla de auto-detención concurrente (RF-007), validaciones de duración y requisitos de rendimiento explícitos (RP-001, RP-002). Riesgo moderado por el manejo de tiempo real y la sincronización entre UI y store.

## Repositorios

- exercise-time-tracker

## Validación

### INVEST

| Letra | Criterio      | Resultado | Notas                                                                                                                                                                     |
| ----- | ------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **I** | Independiente | Parcial   | Depende funcionalmente de que exista al menos una Tarea (US-001), pero es una dependencia de secuencia normal en el backlog, no un bloqueo: US-001 se implementa primero. |
| **N** | Negociable    | Cumple    | El detalle de cómo se selecciona la tarea a iniciar (lista reciente vs. selector) queda abierto a `work-plan`.                                                            |
| **V** | Valiosa       | Cumple    | Es la funcionalidad central del producto: registrar tiempo en tiempo real.                                                                                                |
| **E** | Estimable     | Cumple    | RF-005 a RF-010 y RP-001/RP-002 son suficientemente específicos.                                                                                                          |
| **S** | Pequeña       | Cumple    | Alcance acotado a iniciar/detener con auto-stop; sin pausa ni edición de registros.                                                                                       |
| **T** | Testeable     | Cumple    | AC-001 a AC-009 son verificables (incluye tests de store con temporizadores simulados).                                                                                   |

### Definition of Ready (DoR)

| Criterio DoR                       | Estado | Notas                                                                                       |
| ---------------------------------- | ------ | ------------------------------------------------------------------------------------------- |
| Dependencias listas                | Cumple | Depende de US-001 (Project/Task), ya definida y secuenciada antes que esta historia.        |
| Inputs/outputs claros              | Cumple | Entradas (taskId al iniciar) y salidas (TimeEntry persistido) definidas en RF-005 a RF-010. |
| Repositorios definidos             | Cumple | exercise-time-tracker.                                                                      |
| Sin decisiones técnicas pendientes | Cumple | Forma del estado de temporizador y del TimeEntry documentada en Contexto.                   |
| Referencias de UI                  | Cumple | Wireframe del panel de Tareas con temporizador activo adjunto en `assets/`.                 |
| Sin aclaraciones pendientes        | Cumple | Ambigüedad de "pausa" (SRS §2.2) resuelta como fuera de alcance en US-001.                  |

## Observaciones

Ninguna.
