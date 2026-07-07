# US-004: Registro manual de tiempo

Estado: Ready
Fecha de creación: 2026-07-06
Última actualización: 2026-07-06

## Descripción

**COMO** usuario
**QUIERO** ingresar manualmente un Registro de Tiempo para una Tarea
**PARA** registrar tiempo que no pude cronometrar en el momento en que ocurrió

## Contexto

Historia derivada de [SRS-001-timetracker-app](../../requirements/SRS-001-timetracker-app/README.md), sección 3.1.3 (Ingreso Manual y Reportes) — parte de ingreso manual. Requiere que exista al menos una Tarea a la que asociar el registro — ver [US-002](../US-002-gestion-de-tareas/README.md).

## Reglas de negocio

- **BR-01:** La Duración ingresada manualmente NO DEBE ser menor o igual a cero → verificado por AC-002

## Criterios de aceptación

- **AC-001 (Casos de uso):** El sistema DEBE permitir al usuario crear un Registro de Tiempo manual para una Tarea, ingresando la Tarea, la Fecha y la Duración. [RF-011]
- **AC-002 (Reglas de negocio):** El sistema DEBE validar que la Duración ingresada manualmente sea mayor que cero antes de persistir el registro. [RF-013, BR-01]
- **AC-003 (Procesamiento de datos):** El sistema DEBE persistir el Registro de Tiempo manual en el almacenamiento local. [RF-012]
- **AC-004 (Interacción de usuario):** La interfaz DEBE permitir seleccionar la Tarea, la Fecha y la Duración mediante controles conformes al sistema de diseño DESIGN.md. [RIU-001]
- **AC-005 (Fiabilidad):** El sistema DEBE recuperar los Registros de Tiempo manuales de forma consistente tras un reinicio de la aplicación. [RFB-001, RFB-002]

---

## Complejidad sugerida

- **Story points:** 2
- **Justificación:** Formulario simple con una única regla de validación (duración > 0) y persistencia local; sin lógica de concurrencia ni cálculos adicionales.

## Repositorios

- exercise-time-tracker

## Validación

### INVEST

| Letra | Criterio      | Resultado | Notas                                                                                           |
| ----- | ------------- | --------- | ----------------------------------------------------------------------------------------------- |
| **I** | Independiente | Parcial   | Requiere que exista al menos una Tarea (US-002) a la que asociar el registro manual.            |
| **N** | Negociable    | Cumple    | El detalle del formulario admite ajuste.                                                        |
| **V** | Valiosa       | Cumple    | Cubre el caso de tiempo no cronometrado en el momento, complementario al temporizador (US-003). |
| **E** | Estimable     | Cumple    | RF-011 a RF-013 son suficientes para estimar.                                                   |
| **S** | Pequeña       | Cumple    | Un único formulario con una regla de validación.                                                |
| **T** | Testeable     | Cumple    | AC-001 a AC-005 son verificables de forma objetiva.                                             |

### Definition of Ready (DoR)

| Criterio DoR                       | Estado  | Notas                                                                                                                                                                     |
| ---------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dependencias listas                | Parcial | Depende de US-002 (Gestión de Tareas), incluida en el mismo lote de definición.                                                                                           |
| Inputs/outputs claros              | Cumple  | Entrada: Tarea, Fecha y Duración. Salida: Registro de Tiempo persistido.                                                                                                  |
| Repositorios definidos             | Cumple  | exercise-time-tracker.                                                                                                                                                    |
| Sin decisiones técnicas pendientes | Cumple  | Ninguna.                                                                                                                                                                  |
| Referencias de UI                  | Cumple  | No hay un wireframe específico para este formulario en los apéndices del SRS-001; debe seguir los patrones de componentes de formulario definidos en DESIGN.md (RIU-001). |
| Sin aclaraciones pendientes        | Cumple  | Ninguna.                                                                                                                                                                  |

## Observaciones

- Depende de que exista al menos una Tarea (US-002, incluida en este mismo lote) para poder registrar tiempo manual sobre ella.
- No existe un wireframe específico para el formulario de ingreso manual en los apéndices del SRS-001 (solo se referencian las vistas "Tareas", "Nueva Tarea" y "Proyectos"); el formulario debe seguir los patrones de componentes de DESIGN.md.
