# US-001: Proyectos

**Estado**: Ready
**Fecha de creación**: 2026-07-13
**Última actualización**: 2026-07-13

## Descripción

**COMO** usuario de Time Tracker
**QUIERO** crear, editar y visualizar mis Proyectos
**PARA** organizar el tiempo que dedico a las Tareas relacionadas entre sí

## Contexto

Time Tracker es una aplicación de uso personal "offline-first": todos los datos (incluidos los Proyectos) se persisten exclusivamente en el almacenamiento local del dispositivo, sin backend ni sincronización externa. Un Proyecto es la agrupación lógica bajo la cual se crean las Tareas (ver [US-002](../US-002-tareas/README.md)).

## Reglas de negocio

- **BR-01:** El sistema DEBE requerir un Nombre para crear o editar un Proyecto. → verificado por AC-001, AC-002, AC-005
- **BR-02:** La Descripción del Proyecto ES OPCIONAL. → verificado por AC-001
- **BR-03:** El sistema DEBE persistir los datos de cada Proyecto exclusivamente en el almacenamiento local del dispositivo. → verificado por AC-003

## Referencias

- **Diseño / prototipo:** [Figma - Exercise · Time Tracker (pantalla Proyectos)](https://www.figma.com/design/YYHDIH7CBsZrZ4VKXvbzkR/Exercise---Time-Tracker)
- **Especificación funcional:** [SRS-001: Especificación de Requisitos - Time Tracker](../../requirements/SRS-001-timetracker-app/README.md) (sección 3.2.1)

## Criterios de aceptación

- **AC-001 (Reglas de negocio):** El sistema DEBE permitir crear un Proyecto solicitando un Nombre obligatorio y una Descripción opcional.
  Casos de prueba: [TC-001](./test-cases/TC-001-crear-proyecto-nombre-y-descripcion-happy.md) · [TC-002](./test-cases/TC-002-crear-proyecto-solo-nombre-limite.md)
- **AC-002 (Procesamiento de datos):** El sistema NO DEBE permitir guardar un Proyecto si el campo Nombre está vacío.
  Casos de prueba: [TC-003](./test-cases/TC-003-nombre-vacio-bloquea-guardado-error.md) · [TC-004](./test-cases/TC-004-nombre-solo-espacios-bloquea-guardado-limite.md)
- **AC-003 (Fiabilidad):** El sistema DEBE persistir los datos del Proyecto (Nombre, Descripción) en el almacenamiento local del dispositivo, garantizando su disponibilidad tras un cierre inesperado de la aplicación o un reinicio.
  Casos de prueba: [TC-005](./test-cases/TC-005-persistencia-proyecto-tras-recarga-happy.md) · [TC-006](./test-cases/TC-006-persistencia-multiples-proyectos-limite.md)
- **AC-004 (Salidas del sistema):** El sistema DEBE mostrar el listado de todos los Proyectos creados.
  Casos de prueba: [TC-007](./test-cases/TC-007-listado-proyectos-creados-happy.md) · [TC-008](./test-cases/TC-008-listado-vacio-sin-proyectos-limite.md)
- **AC-005 (Reglas de negocio):** El sistema DEBE permitir editar el Nombre y la Descripción de un Proyecto existente en cualquier momento, reutilizando el mismo modal de creación ("Nuevo Proyecto") precargado con los datos existentes del Proyecto y con el título y la etiqueta del botón principal cambiados a "Editar Proyecto".
  Casos de prueba: [TC-009](./test-cases/TC-009-editar-proyecto-nombre-descripcion-happy.md) · [TC-010](./test-cases/TC-010-editar-proyecto-descripcion-vacia-limite.md)
- **AC-006 (Procesamiento de datos):** El sistema NO DEBE permitir guardar la edición de un Proyecto si el campo Nombre queda vacío.
  Casos de prueba: [TC-011](./test-cases/TC-011-edicion-nombre-vacio-bloquea-guardado-error.md) · [TC-012](./test-cases/TC-012-edicion-nombre-solo-espacios-limite.md)
- **AC-007 (Interacción de usuario):** La interfaz de la pantalla de Proyectos DEBE adherirse al sistema de diseño DESIGN.md (tema Precision Focus) e implementar el diseño de referencia (ver Referencias).
  Casos de prueba: [TC-013](./test-cases/TC-013-adherencia-sistema-diseno-precision-focus-happy.md)
- **AC-008 (Usabilidad):** La interfaz DEBE proporcionar navegación lateral para acceder a la sección de Proyectos desde cualquier otra sección de la aplicación.
  Casos de prueba: [TC-014](./test-cases/TC-014-navegacion-lateral-acceso-proyectos-happy.md)
- **AC-009 (Interacción de usuario):** La implementación de la pantalla de Proyectos DEBE ser visualmente fiel (layout, colores, tipografía, espaciado y componentes) al prototipo de alta fidelidad en Figma referenciado.
  Casos de prueba: [TC-015](./test-cases/TC-015-fidelidad-visual-prototipo-figma-happy.md)

---

## Complejidad sugerida

- **Story points:** 3
- **Justificación:** Alcance acotado a un único modelo de datos (Proyecto) con creación, edición y listado; sin integraciones externas ni lógica de negocio compleja. El único riesgo menor es ajustar la UI al sistema de diseño DESIGN.md.

## Repositorios

- exercise-time-tracker

## Validación

### INVEST

| Letra | Criterio      | Resultado | Notas                                                                                                                          |
| ----- | ------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **I** | Independiente | Cumple    | No depende de otra US para implementarse; es la base sobre la que se apoya [US-002 (Tareas)](../US-002-tareas/README.md).      |
| **N** | Negociable    | Cumple    | El detalle de edición (campos editables, momento) se acordó con el usuario y admite ajuste posterior en planificación técnica. |
| **V** | Valiosa       | Cumple    | Permite al usuario organizar su trabajo por Proyecto, base para el resto del flujo.                                            |
| **E** | Estimable     | Cumple    | Alcance y reglas suficientemente claros para estimar.                                                                          |
| **S** | Pequeña       | Cumple    | Cabe en un incremento único (CRUD simple de un solo modelo).                                                                   |
| **T** | Testeable     | Cumple    | Cada AC-XXX es verificable de forma objetiva.                                                                                  |

### Definition of Ready (DoR)

| Criterio DoR                       | Estado | Notas                                                                                                                                    |
| ---------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Dependencias listas                | Cumple | Ninguna dependencia externa; es la primera US del flujo.                                                                                 |
| Inputs/outputs claros              | Cumple | Input: Nombre (obligatorio) y Descripción (opcional). Output: Proyecto persistido y listado visible.                                     |
| Repositorios definidos             | Cumple | exercise-time-tracker.                                                                                                                   |
| Sin decisiones técnicas pendientes | Cumple | El mecanismo concreto de almacenamiento local es detalle técnico a resolver en `work-plan`/`TK-XXX`, no condiciona el alcance funcional. |
| Referencias de UI                  | Cumple | Prototipo de alta fidelidad en Figma referenciado.                                                                                       |
| Sin aclaraciones pendientes        | Cumple | Ninguna.                                                                                                                                 |

## Observaciones

- El SRS-001 (sección 2.2) mencionaba "edición" de Proyectos como función del producto sin detallar reglas (RF-001/RF-002 solo cubrían creación y almacenamiento). Por decisión del usuario, se incorporó edición libre de Nombre y Descripción (AC-005, AC-006) sin restricciones adicionales.
- El prototipo Figma de referencia no incluye un modal ni una pantalla específica de "Editar Proyecto" (solo existe "Nuevo Proyecto"). Por decisión del usuario, AC-005 especifica que la edición reutiliza ese mismo modal precargado con los datos existentes.
- En el prototipo Figma, cada tarjeta de Proyecto muestra además el texto "Tiempo registrado" (total acumulado). Ese cálculo corresponde a [US-003 (Historial de registros)](../US-003-historial-de-registros/README.md), AC-003; AC-004 de esta historia cubre únicamente el listado de Proyectos, sin duplicar la regla de cálculo.
