# US-001: Gestión de Tareas y registro de tiempo

Estado: Ready
Fecha de creación: 2026-07-08
Última actualización: 2026-07-08
ADO Work Item: [AB#30272](https://dev.azure.com/BayteqDev/Bayteq%20IA/_workitems/edit/30272)

## Descripción

**COMO** usuario de Time Tracker
**QUIERO** crear tareas asociadas a un proyecto y registrar el tiempo dedicado a cada una, ya sea mediante un temporizador en tiempo real o de forma manual
**PARA** llevar un control preciso de en qué invierto mi tiempo dentro de cada proyecto

## Contexto

Time Tracker es una aplicación de uso personal y offline-first: toda la información (Proyectos, Tareas, Registros de Tiempo) se persiste exclusivamente en el almacenamiento local del dispositivo, sin autenticación ni sincronización externa. Esta historia cubre la pantalla principal "Tareas", donde conviven la creación de tareas, el temporizador y el ingreso manual de tiempo.

## Reglas de negocio

- **BR-01:** Una Tarea DEBE pertenecer obligatoriamente a un único Proyecto. → verificado por AC-001
- **BR-02:** El sistema DEBE permitir un (1) único temporizador activo ("en ejecución") a la vez en toda la aplicación. → verificado por AC-005
- **BR-03:** El sistema NO DEBE aceptar duraciones menores o iguales a cero para ningún Registro de Tiempo, ya sea por temporizador o manual. → verificado por AC-008, AC-011

## Referencias

- **Especificación de origen:** [SRS-001: Time Tracker](../../../requirements/SRS-001-timetracker-app/README.md)
- **Diseño / prototipo (alta fidelidad) — Tareas (panel principal):** [Figma — Tareas](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker?node-id=1-1374)
- **Diseño / prototipo (alta fidelidad) — Modal Nueva Tarea:** [Figma — Tareas / Diálogo Nueva Tarea](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker?node-id=1-1539)

## Criterios de aceptación

- **AC-001 (Casos de uso):** El sistema DEBE permitir al usuario crear una nueva Tarea ingresando un Nombre y asociándola a un Proyecto existente mediante el modal "Nueva Tarea".
  Casos de prueba: [TC-001](./test-cases/TC-001-crear-tarea-nombre-proyecto-happy.md) · [TC-002](./test-cases/TC-002-crear-tarea-nombre-vacio-error.md) · [TC-003](./test-cases/TC-003-crear-tarea-sin-proyecto-error.md)
- **AC-002 (Procesamiento de datos):** El sistema DEBE almacenar los datos de la Tarea, incluyendo su asociación al Proyecto, en el almacenamiento local del dispositivo.
  Casos de prueba: [TC-004](./test-cases/TC-004-persistencia-tarea-proyecto-happy.md)
- **AC-003 (Interacción de usuario):** La interfaz DEBE presentar el modal "Nueva Tarea" con los campos Proyecto y Nombre, y las acciones "Cancelar" / "Crear Tarea", conforme al prototipo de alta fidelidad.
  Casos de prueba: [TC-005](./test-cases/TC-005-modal-nueva-tarea-presentacion-happy.md) · [TC-006](./test-cases/TC-006-modal-nueva-tarea-cancelar-happy.md)
- **AC-004 (Casos de uso):** El sistema DEBE permitir al usuario iniciar un temporizador para una Tarea específica desde el panel de Tareas.
  Casos de prueba: [TC-007](./test-cases/TC-007-iniciar-temporizador-tarea-happy.md)
- **AC-005 (Reglas de negocio):** Si el usuario inicia un temporizador mientras otro está activo en una Tarea diferente, el sistema DEBE detener automáticamente el temporizador anterior, calcular y guardar su Registro de Tiempo antes de iniciar el nuevo.
  Casos de prueba: [TC-008](./test-cases/TC-008-cambio-temporizador-activo-happy.md) · [TC-009](./test-cases/TC-009-cambio-temporizador-duracion-minima-limite.md)
- **AC-006 (Casos de uso):** El sistema DEBE permitir al usuario detener el temporizador activo mediante la acción "Detener Sesión".
  Casos de prueba: [TC-010](./test-cases/TC-010-detener-temporizador-sesion-happy.md) · [TC-011](./test-cases/TC-011-detener-temporizador-sin-activo-error.md)
- **AC-007 (Procesamiento de datos):** Al detener el temporizador, el sistema DEBE calcular la Duración (Hora Fin − Hora Inicio) y persistir el Registro de Tiempo de forma inmediata en el almacenamiento local.
  Casos de prueba: [TC-012](./test-cases/TC-012-calculo-duracion-persistencia-temporizador-happy.md)
- **AC-008 (Reglas de negocio):** El sistema DEBE validar que la Duración calculada por el temporizador sea mayor que cero.
  Casos de prueba: [TC-013](./test-cases/TC-013-duracion-temporizador-cero-error.md) · [TC-014](./test-cases/TC-014-duracion-temporizador-minima-valida-limite.md)
- **AC-009 (Casos de uso):** El sistema DEBE permitir al usuario crear un Registro de Tiempo manual para una Tarea, ingresando Fecha, Proyecto/Tarea y Duración mediante el formulario "Entrada Manual".
  Casos de prueba: [TC-015](./test-cases/TC-015-crear-registro-manual-valido-happy.md) · [TC-016](./test-cases/TC-016-crear-registro-manual-campo-obligatorio-error.md)
- **AC-010 (Procesamiento de datos):** El sistema DEBE persistir el Registro de Tiempo manual en el almacenamiento local al confirmar la acción "Guardar Registro".
  Casos de prueba: [TC-017](./test-cases/TC-017-persistencia-registro-manual-happy.md)
- **AC-011 (Reglas de negocio):** El sistema DEBE validar que la Duración ingresada manualmente sea mayor que cero.
  Casos de prueba: [TC-018](./test-cases/TC-018-duracion-manual-negativa-error.md) · [TC-019](./test-cases/TC-019-duracion-manual-cero-error.md) · [TC-020](./test-cases/TC-020-duracion-manual-minima-valida-limite.md)
- **AC-012 (Eficiencia de rendimiento):** El sistema DEBE iniciar el temporizador en menos de 1 segundo desde la acción del usuario.
  Casos de prueba: [TC-021](./test-cases/TC-021-rendimiento-inicio-temporizador-happy.md)
- **AC-013 (Eficiencia de rendimiento):** El sistema DEBE detener el temporizador y persistir el registro correspondiente en menos de 1 segundo desde la acción del usuario.
  Casos de prueba: [TC-022](./test-cases/TC-022-rendimiento-detener-temporizador-happy.md)

---

## Complejidad sugerida

- **Story points:** 8
- **Justificación:** Agrupa la creación de tareas, la lógica de concurrencia del temporizador único (detener e iniciar en cadena), el ingreso manual y sus validaciones. Alcance amplio y con reglas de negocio no triviales (BR-02), aunque el riesgo de incertidumbre es bajo por estar bien delimitado en la SRS y en el prototipo de alta fidelidad.

## Repositorios

- exercise-time-tracker

## Validación

### INVEST

| Letra | Criterio      | Resultado | Notas                                                                                                                                                                                      |
| ----- | ------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **I** | Independiente | Parcial   | Requiere que exista al menos un Proyecto (US-002) para poder asociar una Tarea; no bloquea el desarrollo del temporizador ni del ingreso manual, pero sí las pruebas end-to-end completas. |
| **N** | Negociable    | Cumple    | El detalle de campos y validaciones puede ajustarse sin afectar el valor central de la historia.                                                                                           |
| **V** | Valiosa       | Cumple    | Es el flujo principal de la aplicación: registrar tiempo dedicado al trabajo.                                                                                                              |
| **E** | Estimable     | Cumple    | RF-003 a RF-013 y el prototipo de alta fidelidad dan suficiente detalle para estimar.                                                                                                      |
| **S** | Pequeña       | Parcial   | Agrupa CRUD de tarea + temporizador + ingreso manual por decisión explícita del usuario, ya que comparten la misma pantalla "Tareas"; es la historia más grande de las tres.               |
| **T** | Testeable     | Cumple    | AC-001 a AC-013 son verificables objetivamente.                                                                                                                                            |

### Definition of Ready (DoR)

| Criterio DoR                       | Estado  | Notas                                                                                                                                                      |
| ---------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dependencias listas                | Parcial | Depende de que US-002 (Gestión de Proyectos) exista para poder asociar Tareas a un Proyecto; orden de implementación natural, no una aclaración pendiente. |
| Inputs/outputs claros              | Cumple  | RF-003 a RF-013 y RP-001/RP-002 documentados en la SRS.                                                                                                    |
| Repositorios definidos             | Cumple  | exercise-time-tracker.                                                                                                                                     |
| Sin decisiones técnicas pendientes | Cumple  | No hay decisiones técnicas abiertas que condicionen el alcance funcional.                                                                                  |
| Referencias de UI                  | Cumple  | Prototipo Figma de alta fidelidad (frames Tareas y Diálogo Nueva Tarea).                                                                                   |
| Sin aclaraciones pendientes        | Cumple  | Ninguna.                                                                                                                                                   |

## Observaciones

- Ninguna.
