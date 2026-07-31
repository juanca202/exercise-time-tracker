# US-003: Gestión de Tareas y Registro de Tiempo

**Estado:** Ready
**Fecha de creación:** 2026-07-30
**Última actualización:** 2026-07-30

## Descripción

**COMO** usuario de Time Tracker
**QUIERO** crear, editar y eliminar Tareas asociadas a mis Proyectos, y registrar el tiempo dedicado a ellas mediante un temporizador en tiempo real o mediante ingreso manual
**PARA** llevar, desde el panel principal de Tareas, un registro completo y actualizado de mi trabajo, sin importar si lo hago mientras trabajo o de forma diferida

## Contexto

Esta historia fusiona intencionalmente varias capacidades que el wireframe [figma-tareas.png](../../requirements/SRS-001-timetracker-app/assets/figma-tareas.png) presenta como un único panel principal: gestión de Tareas (creación, edición, eliminación), temporizador (registro automatizado) y entrada manual de tiempo. Se agruparon en una sola US por decisión explícita de planificación (ver dimensión **S** de INVEST más abajo), en lugar de mantenerlas como historias separadas.

Depende de que existan Proyectos creados ([US-002](../US-002-gestion-de-proyectos/README.md)) y se apoya en el shell de navegación de [US-001 (Layout de la Aplicación)](../US-001-layout-de-la-aplicacion/README.md). Una Tarea es la unidad de trabajo específica del dominio, asociada obligatoriamente a un único Proyecto; sobre cada Tarea se acumulan Registros de Tiempo, generados por el temporizador o de forma manual, que alimentan los reportes de [US-004](../US-004-reportes-e-historial-de-tiempo/README.md).

La edición y eliminación de Tareas no estaban originalmente definidas por un RF explícito del SRS-001 (solo mencionadas de forma general en la sección 2.2); se incorporan a esta historia como ampliación de alcance confirmada en conversación con producto, incluyendo la política de bloqueo de eliminación cuando la Tarea tiene Registros de Tiempo asociados, y la posibilidad de reasignar una Tarea a otro Proyecto al editarla (ver Reglas de negocio).

## Fuera de alcance

- **Pausar el temporizador:** la sección 2.2 del SRS menciona "Inicio, **pausa** y detención de temporizadores", pero ningún requisito funcional (RF-005 a RF-010) define un estado o comportamiento de pausa distinto de Iniciar/Detener. Esta historia implementa únicamente Iniciar y Detener. Queda pendiente de una historia futura, sujeta a que producto confirme el requisito.
- **Edición y eliminación de Registros de Tiempo individuales:** esta historia cubre editar/eliminar Proyectos ([US-002](../US-002-gestion-de-proyectos/README.md)) y Tareas; el ciclo de vida de un Registro de Tiempo ya persistido (por temporizador o manual) no se modifica ni se elimina aquí una vez creado. Fuera de alcance salvo indicación futura de producto.
- **Reasignación o eliminación en cascada de Registros de Tiempo al eliminar una Tarea:** por decisión de producto, eliminar una Tarea con Registros de Tiempo asociados está bloqueado (ver BR-06); esta historia no ofrece eliminación en cascada. El usuario debe resolver esos Registros de Tiempo antes de poder eliminar la Tarea (ver punto anterior sobre por qué esa acción no está disponible en este alcance).

## Reglas de negocio

- **BR-01:** Una Tarea DEBE pertenecer obligatoriamente a un único Proyecto existente. → verificado por AC-001, AC-006
- **BR-02:** El sistema NO DEBE permitir más de un (1) temporizador activo a la vez en toda la aplicación. → verificado por AC-013
- **BR-03:** La Duración calculada por el temporizador DEBE ser mayor que cero. → verificado por AC-016
- **BR-04:** Un Registro de Tiempo (generado por temporizador o de forma manual) DEBE pertenecer obligatoriamente a una única Tarea. → verificado por AC-015, AC-021
- **BR-05:** La Duración ingresada manualmente NO DEBE ser menor o igual a cero. → verificado por AC-022
- **BR-06:** Una Tarea NO DEBE poder eliminarse si tiene uno o más Registros de Tiempo asociados. → verificado por AC-008

## Referencias

- **SRS:** [SRS-001-timetracker-app](../../requirements/SRS-001-timetracker-app/README.md) — RF-003 a RF-013, RIU-002, RIU-004, RD-003, RP-001, RP-002, Restricción 2.4.
- **Diseño / prototipo:** [Figma – exercise-time-tracker](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker) — modal "Nueva Tarea" y panel principal de la pantalla "Tareas" (sesión activa + entrada manual + tareas recientes).
- **Wireframes:** [figma-nueva-tarea.png](../../requirements/SRS-001-timetracker-app/assets/figma-nueva-tarea.png), [figma-tareas.png](../../requirements/SRS-001-timetracker-app/assets/figma-tareas.png)
- **Sistema de diseño:** [DESIGN.md](../../../../DESIGN.md) — tema Precision Focus.
- **Documentación técnica:** [timetracker.md#md-02-tarea-task](../../technical-docs/timetracker.md#md-02-tarea-task), [#fl-01-iniciar-temporizador-para-una-tarea](../../technical-docs/timetracker.md#fl-01-iniciar-temporizador-para-una-tarea), [#fl-02-detener-temporizador-activo](../../technical-docs/timetracker.md#fl-02-detener-temporizador-activo), [#fl-03-registrar-tiempo-manual](../../technical-docs/timetracker.md#fl-03-registrar-tiempo-manual), [#fl-07-editar-tarea](../../technical-docs/timetracker.md#fl-07-editar-tarea), [#fl-08-eliminar-tarea](../../technical-docs/timetracker.md#fl-08-eliminar-tarea), [#dg-01-diagrama-de-estados-del-temporizador](../../technical-docs/timetracker.md#dg-01-diagrama-de-estados-del-temporizador).
- **Glosario:** [glossary.md](../../glossary.md) — términos "Tarea", "Registro de Tiempo", "Temporizador".

## Criterios de aceptación

### Gestión de Tareas

- **AC-001 (Reglas de negocio):** el sistema DEBE requerir que toda Tarea se asocie, en el momento de su creación, a un Proyecto existente seleccionado por el usuario. (RF-003, BR-01)
- **AC-002 (Reglas de negocio):** el sistema DEBE requerir un Nombre para crear la Tarea. (RF-003)
- **AC-003 (Procesamiento de datos):** el sistema DEBE almacenar los datos de la Tarea en el almacenamiento local, incluyendo la referencia a su Proyecto asociado. (RF-004)
- **AC-004 (Interacción de usuario):** la interfaz DEBE presentar un modal "Nueva Tarea" con un selector de Proyecto y un campo de Nombre, con acciones "Cancelar" y "Crear Tarea", fiel al wireframe [figma-nueva-tarea.png](../../requirements/SRS-001-timetracker-app/assets/figma-nueva-tarea.png). (RIU-002, RD-003)
- **AC-005 (Reglas de negocio):** el sistema DEBE permitir editar el Nombre de una Tarea existente y/o reasignarla a otro Proyecto existente. (BR-01)
- **AC-006 (Reglas de negocio):** al reasignar una Tarea a otro Proyecto, el sistema DEBE validar que el Proyecto seleccionado exista. (BR-01)
- **AC-007 (Reglas de negocio):** el sistema DEBE permitir eliminar una Tarea que no tenga Registros de Tiempo asociados.
- **AC-008 (Reglas de negocio):** el sistema NO DEBE permitir eliminar una Tarea que tenga uno o más Registros de Tiempo asociados, y DEBE informar al usuario el motivo del bloqueo. (BR-06)
- **AC-009 (Interacción de usuario):** la pantalla "Tareas" DEBE mostrar un listado de "Tareas Recientes" con el nombre de cada Tarea, su Proyecto asociado, y acciones para editarla y eliminarla. (RIU-002, RD-003)
- **AC-010 (Fiabilidad):** el sistema DEBE recuperar de forma consistente las Tareas y su asociación al Proyecto —incluyendo ediciones y eliminaciones— tras un reinicio de la aplicación o un cierre inesperado. (RFB-001, RFB-002)

### Temporizador

- **AC-011 (Casos de uso):** el sistema DEBE permitir al usuario iniciar un temporizador para una Tarea específica. (RF-005)
- **AC-012 (Procesamiento de datos):** al iniciar el temporizador, el sistema DEBE guardar localmente el estado "En Ejecución" junto con la hora de inicio y el identificador de la Tarea. (RF-006)
- **AC-013 (Reglas de negocio):** si el usuario inicia un temporizador mientras otro está activo en una Tarea diferente, el sistema DEBE detener automáticamente el temporizador anterior, calcular y guardar su Registro de Tiempo, antes de iniciar el nuevo. (RF-007, BR-02)
- **AC-014 (Casos de uso):** el sistema DEBE permitir al usuario detener el temporizador activo. (RF-008)
- **AC-015 (Procesamiento de datos):** al detener el temporizador, el sistema DEBE registrar la Hora Fin, calcular la Duración (Hora Fin − Hora Inicio) y persistir el Registro de Tiempo de forma inmediata en el almacenamiento local. (RF-009, BR-04)
- **AC-016 (Reglas de negocio):** el sistema DEBE validar que la Duración calculada sea mayor que cero. (RF-010, BR-03)
- **AC-017 (Interacción de usuario):** la interfaz DEBE mostrar claramente el estado del temporizador (activo/inactivo), la Tarea asociada y el tiempo transcurrido, fiel al wireframe [figma-tareas.png](../../requirements/SRS-001-timetracker-app/assets/figma-tareas.png). (RIU-004, RD-003)
- **AC-018 (Eficiencia de rendimiento):** el sistema DEBE iniciar el temporizador en menos de 1 segundo desde la acción del usuario. (RP-001)
- **AC-019 (Eficiencia de rendimiento):** el sistema DEBE detener el temporizador y persistir el Registro de Tiempo en menos de 1 segundo desde la acción del usuario. (RP-002)

### Registro Manual

- **AC-020 (Casos de uso):** el sistema DEBE permitir crear un Registro de Tiempo manual para una Tarea, ingresando la Tarea (asociada a su Proyecto), la Fecha y la Duración. (RF-011)
- **AC-021 (Procesamiento de datos):** el sistema DEBE persistir el Registro de Tiempo manual en el almacenamiento local. (RF-012, BR-04)
- **AC-022 (Reglas de negocio):** el sistema DEBE validar que la Duración ingresada manualmente sea mayor que cero. (RF-013, BR-05)
- **AC-023 (Interacción de usuario):** la interfaz DEBE presentar el formulario "Entrada Manual" con los campos Fecha, Proyecto/Tarea y Duración, y una acción "Guardar Registro", fiel al wireframe [figma-tareas.png](../../requirements/SRS-001-timetracker-app/assets/figma-tareas.png). (RIU-002, RD-003)
- **AC-024 (Fiabilidad):** el sistema DEBE recuperar de forma consistente los Registros de Tiempo (por temporizador o manuales) tras un reinicio de la aplicación o un cierre inesperado. (RFB-001, RFB-002)

---

## Complejidad sugerida

- **Story points:** 21
- **Justificación:** Combina cinco flujos (creación de Tareas, edición/reasignación de Tareas, eliminación de Tareas con regla de bloqueo, temporizador con restricción de unicidad global y detención automática, y registro manual con validación), cada uno con su propia lógica y persistencia, entregados en un solo incremento por decisión explícita de agrupación. El riesgo de coordinar cinco flujos y sus validaciones cruzadas en un mismo incremento justifica escalar a 21 en la serie Fibonacci.

## Repositorios

- exercise-time-tracker

## Validación

### INVEST

| Letra | Criterio      | Resultado | Notas                                                                                                                                                                                                                                                                                                                                                            |
| ----- | ------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **I** | Independiente | Parcial   | Requiere Proyectos existentes (US-002) para poder asociar/reasignar una Tarea; puede desarrollarse con datos de prueba antes de que US-002 esté en producción.                                                                                                                                                                                                   |
| **N** | Negociable    | Cumple    | El alcance de cada sub-flujo admite ajuste de detalle visual sin cambiar el valor central.                                                                                                                                                                                                                                                                       |
| **V** | Valiosa       | Cumple    | Es el panel principal del producto: crear y mantener al día las unidades de trabajo, y registrar tiempo sobre ellas por las dos vías soportadas.                                                                                                                                                                                                                 |
| **E** | Estimable     | Cumple    | Los cinco flujos están documentados individualmente en technical-docs (MD-02, FL-01, FL-02, FL-03, FL-07, FL-08).                                                                                                                                                                                                                                                |
| **S** | Pequeña       | No cumple | Agrupa cinco flujos independientes (creación, edición y eliminación de Tarea; temporizador; registro manual) en un solo incremento por decisión explícita de negocio/planificación. Se recomienda que `work-plan` descomponga esta US en TK-XXX independientes por sub-flujo para no perder la trazabilidad ni entregar todo en un único paso de implementación. |
| **T** | Testeable     | Cumple    | AC-001 a AC-024 son verificables de forma objetiva.                                                                                                                                                                                                                                                                                                              |

### Definition of Ready (DoR)

| Criterio DoR                       | Estado  | Notas                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Dependencias listas                | Parcial | Depende de que existan Proyectos (US-002); no bloquea la definición ni la implementación con datos semilla.                                                                                                                                                                                                                                                                                                        |
| Inputs/outputs claros              | Cumple  | Entradas: Proyecto+Nombre (crear Tarea), Nombre/Proyecto (editar), acción eliminar, acción Iniciar/Detener (temporizador), Tarea+Fecha+Duración (manual). Salidas: Tarea persistida/actualizada/eliminada, estado del temporizador, Registro de Tiempo persistido.                                                                                                                                                 |
| Repositorios definidos             | Cumple  | exercise-time-tracker (repositorio único, monorepo).                                                                                                                                                                                                                                                                                                                                                               |
| Sin decisiones técnicas pendientes | Cumple  | Los cinco flujos están documentados en [timetracker.md](../../technical-docs/timetracker.md) (FL-01, FL-02, FL-03, FL-07, FL-08); quedan casos borde (duración ≤ 0 por desfase de reloj, reinicio de la misma Tarea activa, fallo de escritura en localStorage, mensaje exacto de validación manual y de bloqueo de eliminación) registrados en sus Observaciones, que no condicionan el alcance de esta historia. |
| Referencias de UI                  | Cumple  | Wireframes [figma-nueva-tarea.png](../../requirements/SRS-001-timetracker-app/assets/figma-nueva-tarea.png) y [figma-tareas.png](../../requirements/SRS-001-timetracker-app/assets/figma-tareas.png) disponibles; edición y confirmación de eliminación de Tarea reutilizan el mismo patrón de modal/diálogo de [DESIGN.md](../../../../DESIGN.md).                                                                |
| Sin aclaraciones pendientes        | Cumple  | Las ambigüedades sobre "pausa" del temporizador y sobre el ciclo de vida de Registros de Tiempo individuales se resolvieron declarándolas Fuera de alcance; la política de eliminación de Tarea (bloquear si tiene Registros) quedó confirmada.                                                                                                                                                                    |

## Observaciones

- Depende de que US-002 (Gestión de Proyectos) esté implementada o disponible con datos de prueba.
- Ninguna.
- Al planificar con `work-plan`, considerar dividir esta US en TK-XXX independientes por sub-flujo (Gestión de Tareas / Temporizador / Registro Manual) dado que la dimensión **S** de INVEST está en `No cumple` por la fusión intencional de varias capacidades en una sola historia.
- Casos borde de manejo de errores (duración ≤ 0 al detener automáticamente el temporizador anterior, reinicio del temporizador para la misma Tarea ya activa, fallo de escritura en `localStorage`, mensaje exacto de validación manual y de bloqueo de eliminación, Tarea no seleccionada, rango de Fecha) quedan documentados en [timetracker.md](../../technical-docs/timetracker.md) para resolverse a nivel de TK-XXX; no condicionan los AC de esta historia.
