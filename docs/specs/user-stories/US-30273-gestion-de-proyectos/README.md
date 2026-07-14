# US-002: Gestión de Proyectos

Estado: Ready
Fecha de creación: 2026-07-08
Última actualización: 2026-07-08
ADO Work Item: [AB#30273](https://dev.azure.com/BayteqDev/Bayteq%20IA/_workitems/edit/30273)

## Descripción

**COMO** usuario de Time Tracker
**QUIERO** crear y visualizar mis Proyectos
**PARA** organizar las tareas relacionadas y ver de un vistazo el tiempo total registrado en cada uno

## Contexto

Un Proyecto es una agrupación lógica de Tareas relacionadas y puede contener múltiples Tareas (ver definiciones en la SRS, sección 1.3). Esta historia cubre exclusivamente la creación y visualización de Proyectos; la asociación de Tareas a un Proyecto se cubre en [US-001: Gestión de Tareas y registro de tiempo](../US-001-gestion-de-tareas/README.md).

## Referencias

- **Especificación de origen:** [SRS-001: Time Tracker](../../../requirements/SRS-001-timetracker-app/README.md)
- **Diseño / prototipo (alta fidelidad) — Proyectos:** [Figma — Proyectos](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker?node-id=1-1571)
- **Diseño / prototipo (alta fidelidad) — Modal Nuevo Proyecto:** [Figma — Proyectos / Diálogo Nuevo proyecto](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker?node-id=1-1642)

## Criterios de aceptación

- **AC-001 (Casos de uso):** El sistema DEBE permitir al usuario crear un nuevo Proyecto ingresando un Nombre (obligatorio) y una Descripción (opcional).
  Casos de prueba: [TC-001](./test-cases/TC-001-crear-proyecto-nombre-descripcion-happy.md) · [TC-002](./test-cases/TC-002-crear-proyecto-solo-nombre-happy.md) · [TC-003](./test-cases/TC-003-crear-proyecto-sin-nombre-error.md)
- **AC-002 (Procesamiento de datos):** El sistema DEBE almacenar los datos del Proyecto en el almacenamiento local del dispositivo.
  Casos de prueba: [TC-004](./test-cases/TC-004-almacenamiento-local-proyecto-happy.md)
- **AC-003 (Interacción de usuario):** La interfaz DEBE listar los Proyectos existentes en tarjetas que muestren Nombre, Descripción y Tiempo Registrado, conforme al prototipo de alta fidelidad.
  Casos de prueba: [TC-005](./test-cases/TC-005-listado-proyectos-tarjetas-happy.md) · [TC-006](./test-cases/TC-006-listado-proyectos-vacio-limite.md)
- **AC-004 (Interacción de usuario):** La interfaz DEBE ofrecer una acción visible ("Nuevo Proyecto" / "Crear Nuevo Proyecto") para iniciar la creación de un Proyecto.
  Casos de prueba: [TC-007](./test-cases/TC-007-accion-nuevo-proyecto-happy.md)
- **AC-005 (Salidas del sistema):** El sistema DEBE calcular y mostrar el tiempo total registrado por Proyecto como la suma de los tiempos de sus Tareas.
  Casos de prueba: [TC-008](./test-cases/TC-008-tiempo-total-proyecto-suma-tareas-happy.md) · [TC-009](./test-cases/TC-009-tiempo-total-proyecto-sin-tareas-limite.md)

---

## Complejidad sugerida

- **Story points:** 3
- **Justificación:** Alcance acotado a un CRUD simple de creación/listado de Proyectos, con un cálculo de agregación (suma de tiempos de sus Tareas). Bajo riesgo e incertidumbre.

## Repositorios

- exercise-time-tracker

## Validación

### INVEST

| Letra | Criterio      | Resultado | Notas                                                                                                          |
| ----- | ------------- | --------- | -------------------------------------------------------------------------------------------------------------- |
| **I** | Independiente | Cumple    | No depende de que otra historia esté completa; otras historias (US-001, US-003) dependen de esta, no al revés. |
| **N** | Negociable    | Cumple    | El detalle visual de la tarjeta de Proyecto puede ajustarse sin afectar el valor central.                      |
| **V** | Valiosa       | Cumple    | Permite organizar el trabajo en unidades con sentido de negocio para el usuario.                               |
| **E** | Estimable     | Cumple    | RF-001, RF-002, RF-016 y el prototipo de alta fidelidad dan suficiente detalle.                                |
| **S** | Pequeña       | Cumple    | Alcance acotado a crear y visualizar Proyectos.                                                                |
| **T** | Testeable     | Cumple    | AC-001 a AC-005 son verificables objetivamente.                                                                |

### Definition of Ready (DoR)

| Criterio DoR                       | Estado | Notas                                                                          |
| ---------------------------------- | ------ | ------------------------------------------------------------------------------ |
| Dependencias listas                | Cumple | Sin dependencias previas; es la base sobre la que se apoyan US-001 y US-003.   |
| Inputs/outputs claros              | Cumple | RF-001, RF-002 y RF-016 documentados en la SRS.                                |
| Repositorios definidos             | Cumple | exercise-time-tracker.                                                         |
| Sin decisiones técnicas pendientes | Cumple | No hay decisiones técnicas abiertas que condicionen el alcance funcional.      |
| Referencias de UI                  | Cumple | Prototipo Figma de alta fidelidad (frames Proyectos y Diálogo Nuevo proyecto). |
| Sin aclaraciones pendientes        | Cumple | Ninguna.                                                                       |

## Observaciones

- Ninguna.
