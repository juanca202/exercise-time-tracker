# US-002: Gestión de Tareas

Estado: Ready
Fecha de creación: 2026-07-06
Última actualización: 2026-07-06

## Descripción

**COMO** usuario
**QUIERO** crear Tareas asociadas a un Proyecto existente
**PARA** registrar tiempo sobre unidades de trabajo específicas dentro de ese Proyecto

## Contexto

Historia derivada de [SRS-001-timetracker-app](../../requirements/SRS-001-timetracker-app/README.md), sección 3.1.1 (Gestión de Proyectos y Tareas). Una Tarea es una unidad de trabajo específica asociada obligatoriamente a un único Proyecto (SRS §1.3, Restricción §2.4). Requiere que exista al menos un Proyecto creado — ver [US-001](../US-001-gestion-de-proyectos/README.md).

## Reglas de negocio

- **BR-01:** Una Tarea DEBE pertenecer obligatoriamente a un único Proyecto → verificado por AC-002

## Criterios de aceptación

- **AC-001 (Casos de uso):** El sistema DEBE permitir al usuario crear una nueva Tarea, asociándola a un Proyecto existente y proporcionando un Nombre para la Tarea. [RF-003]
- **AC-002 (Reglas de negocio):** El sistema NO DEBE permitir crear una Tarea sin asociarla a un Proyecto existente. [RF-003, Restricción §2.4, BR-01]
- **AC-003 (Procesamiento de datos):** El sistema DEBE almacenar los datos de la Tarea en el almacenamiento local del dispositivo, incluyendo su asociación al Proyecto. [RF-004]
- **AC-004 (Interacción de usuario):** La interfaz DEBE presentar el modal "Nueva Tarea" conforme al wireframe de referencia, incluyendo el selector de Proyecto y el campo Nombre. [RIU-002]
- **AC-005 (Interacción de usuario):** La interfaz DEBE mostrar las Tareas creadas en el panel principal "Tareas". [RIU-002, RIU-003]
- **AC-006 (Fiabilidad):** El sistema DEBE recuperar las Tareas almacenadas, junto con su asociación al Proyecto, de forma consistente tras un reinicio de la aplicación. [RFB-001, RFB-002]

---

## Complejidad sugerida

- **Story points:** 3
- **Justificación:** CRUD acotado (crear + listar) similar a US-001, con una regla de asociación obligatoria a Proyecto. Complejidad equivalente, sin lógica adicional.

## Repositorios

- exercise-time-tracker

## Validación

### INVEST

| Letra | Criterio      | Resultado | Notas                                                                                                                                |
| ----- | ------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **I** | Independiente | Parcial   | Requiere que exista al menos un Proyecto (US-001) para poder probarse de punta a punta; ambas historias se definen en el mismo lote. |
| **N** | Negociable    | Cumple    | El detalle de campos adicionales de la Tarea admite ajuste.                                                                          |
| **V** | Valiosa       | Cumple    | Habilita la unidad mínima sobre la que se registra tiempo.                                                                           |
| **E** | Estimable     | Cumple    | RF-003/RF-004 son suficientes para estimar.                                                                                          |
| **S** | Pequeña       | Cumple    | Un único CRUD parcial (crear + listar), cabe en un incremento pequeño.                                                               |
| **T** | Testeable     | Cumple    | AC-001 a AC-006 son verificables de forma objetiva.                                                                                  |

### Definition of Ready (DoR)

| Criterio DoR                       | Estado  | Notas                                                                                                                                                                                                                                                |
| ---------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dependencias listas                | Parcial | Depende de US-001 (Gestión de Proyectos), incluida en el mismo lote de definición.                                                                                                                                                                   |
| Inputs/outputs claros              | Cumple  | Entrada: Proyecto existente + Nombre de la Tarea. Salida: listado de Tareas.                                                                                                                                                                         |
| Repositorios definidos             | Cumple  | exercise-time-tracker.                                                                                                                                                                                                                               |
| Sin decisiones técnicas pendientes | Cumple  | Ninguna.                                                                                                                                                                                                                                             |
| Referencias de UI                  | Cumple  | Wireframes "Tareas (panel principal)" y "Nueva Tarea" — ![Wireframes de Tareas](../../requirements/SRS-001-timetracker-app/assets/LB-TT-img-1.png), ![Wireframes de Nueva Tarea](../../requirements/SRS-001-timetracker-app/assets/LB-TT-img-2.png). |
| Sin aclaraciones pendientes        | Cumple  | Ninguna.                                                                                                                                                                                                                                             |

## Observaciones

- Depende de que US-001 (Gestión de Proyectos) esté implementada o definida en el mismo lote, para disponer de Proyectos donde asociar Tareas.
- Fuera de alcance: edición y eliminación de Tareas. El SRS-001 menciona "edición" en la descripción general (§2.2) pero no define un requisito funcional (RF-XXX) para esa operación; si se requiere, deberá definirse en una historia adicional.
