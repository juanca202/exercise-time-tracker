# US-001: Gestión de Proyectos

Estado: Ready
Fecha de creación: 2026-07-06
Última actualización: 2026-07-06

## Descripción

**COMO** usuario
**QUIERO** crear Proyectos y ver el listado de los que ya existen
**PARA** organizar las Tareas y el tiempo que voy a registrar

## Contexto

Historia derivada de [SRS-001-timetracker-app](../../requirements/SRS-001-timetracker-app/README.md), sección 3.1.1 (Gestión de Proyectos y Tareas). Un Proyecto es la agrupación lógica de Tareas relacionadas (SRS §1.3); esta historia cubre exclusivamente la creación y visualización del Proyecto en sí — la creación de Tareas asociadas se cubre en [US-002](../US-002-gestion-de-tareas/README.md).

## Criterios de aceptación

- **AC-001 (Casos de uso):** El sistema DEBE permitir al usuario crear un Proyecto ingresando un Nombre (obligatorio) y una Descripción (opcional). [RF-001]
- **AC-002 (Reglas de negocio):** El sistema NO DEBE permitir guardar un Proyecto si el campo Nombre está vacío. [RF-001, Restricción §2.4]
- **AC-003 (Procesamiento de datos):** El sistema DEBE almacenar los datos del Proyecto creado en el almacenamiento local del dispositivo. [RF-002]
- **AC-004 (Interacción de usuario):** La interfaz DEBE mostrar el listado de Proyectos existentes en la pantalla "Proyectos" conforme al wireframe de referencia. [RIU-002]
- **AC-005 (Fiabilidad):** El sistema DEBE recuperar los Proyectos almacenados de forma consistente tras un cierre inesperado o un reinicio de la aplicación. [RFB-001, RFB-002]

---

## Complejidad sugerida

- **Story points:** 3
- **Justificación:** CRUD acotado (crear + listar) con persistencia local y una única regla de validación; sin lógica de negocio compleja. El riesgo principal es ajustarse al wireframe y al sistema de diseño DESIGN.md.

## Repositorios

- exercise-time-tracker

## Validación

### INVEST

| Letra | Criterio      | Resultado | Notas                                                                                |
| ----- | ------------- | --------- | ------------------------------------------------------------------------------------ |
| **I** | Independiente | Cumple    | No depende de otra US; es la base sobre la que se apoya US-002.                      |
| **N** | Negociable    | Cumple    | El detalle de campos (p. ej. si se agregan más atributos al Proyecto) admite ajuste. |
| **V** | Valiosa       | Cumple    | Habilita la organización base de todo el sistema.                                    |
| **E** | Estimable     | Cumple    | Alcance acotado y RF-001/RF-002 son suficientes para estimar.                        |
| **S** | Pequeña       | Cumple    | Un único CRUD parcial (crear + listar), cabe en un incremento pequeño.               |
| **T** | Testeable     | Cumple    | AC-001 a AC-005 son verificables de forma objetiva.                                  |

### Definition of Ready (DoR)

| Criterio DoR                       | Estado | Notas                                                                                                                              |
| ---------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Dependencias listas                | Cumple | Ninguna dependencia externa o de otra US.                                                                                          |
| Inputs/outputs claros              | Cumple | Entrada: Nombre (obligatorio) y Descripción (opcional). Salida: listado de Proyectos.                                              |
| Repositorios definidos             | Cumple | exercise-time-tracker.                                                                                                             |
| Sin decisiones técnicas pendientes | Cumple | Ninguna.                                                                                                                           |
| Referencias de UI                  | Cumple | Wireframe "Pantalla de proyectos" — ![Wireframes de Proyectos](../../requirements/SRS-001-timetracker-app/assets/LB-TT-img-5.png). |
| Sin aclaraciones pendientes        | Cumple | Ninguna.                                                                                                                           |

## Observaciones

- Fuera de alcance: edición y eliminación de Proyectos. El SRS-001 menciona "edición" en la descripción general (§2.2) pero no define un requisito funcional (RF-XXX) para esa operación; si se requiere, deberá definirse en una historia adicional.
