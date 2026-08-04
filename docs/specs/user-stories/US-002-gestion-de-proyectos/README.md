# US-002: Gestión de Proyectos

**Estado:** Ready
**Fecha de creación:** 2026-07-30
**Última actualización:** 2026-07-30

## Descripción

**COMO** usuario de Time Tracker
**QUIERO** crear, editar, eliminar y visualizar mis Proyectos
**PARA** organizar en una agrupación lógica las Tareas relacionadas sobre las que luego registraré tiempo, y mantener esa organización al día

## Contexto

Un Proyecto es la agrupación lógica de nivel superior del dominio: contiene Tareas (ver [US-003](../US-003-gestion-de-tareas-y-registro-de-tiempo/README.md)), que a su vez acumulan Registros de Tiempo. Esta historia cubre el ciclo de vida completo de un Proyecto (crear, editar, eliminar, visualizar) y se apoya en el shell de navegación entregado por [US-001 (Layout de la Aplicación)](../US-001-layout-de-la-aplicacion/README.md).

La app es de uso personal, sin autenticación y sin backend: todos los datos (incluidos los Proyectos) se persisten exclusivamente en el almacenamiento local del dispositivo (offline-first), según la Restricción 2.4 del SRS y [ADR-011](../../../adr/ADR-011-persistencia-local-con-web-storage-api.md).

La edición y eliminación de Proyectos no estaban originalmente definidas por un RF explícito del SRS-001 (solo mencionadas de forma general en la sección 2.2); se incorporan a esta historia como ampliación de alcance confirmada en conversación con producto, incluyendo la política de bloqueo de eliminación cuando el Proyecto tiene Tareas asociadas (ver Reglas de negocio).

## Fuera de alcance

- **Cálculo y visualización del total de tiempo por Proyecto** (campo "Tiempo registrado" del wireframe de Proyectos): corresponde a RF-016 y se cubre en [US-004 (Reportes e Historial de Tiempo)](../US-004-reportes-e-historial-de-tiempo/README.md). Esta historia entrega la tarjeta de Proyecto sin ese dato calculado (o con un valor por defecto de `0`) hasta que US-004 esté implementada.
- **Navegación lateral y encabezado de sección:** cubiertos por [US-001 (Layout de la Aplicación)](../US-001-layout-de-la-aplicacion/README.md).
- **Reasignación o eliminación en cascada de Tareas al eliminar un Proyecto:** por decisión de producto, eliminar un Proyecto con Tareas asociadas está bloqueado (ver BR-01); esta historia no ofrece una acción de "reasignar Tareas a otro Proyecto" ni eliminación en cascada. El usuario debe eliminar o reasignar las Tareas del Proyecto primero desde [US-003](../US-003-gestion-de-tareas-y-registro-de-tiempo/README.md).

## Reglas de negocio

- **BR-01:** Un Proyecto NO DEBE poder eliminarse si tiene una o más Tareas asociadas. → verificado por AC-005

## Referencias

- **SRS:** [SRS-001-timetracker-app](../../requirements/SRS-001-timetracker-app/README.md) — RF-001, RF-002, RIU-001, RIU-002, RD-001, RD-003.
- **Diseño / prototipo:** [Figma – exercise-time-tracker](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker) — pantalla "Proyectos".
- **Wireframe:** [figma-proyectos.png](../../requirements/SRS-001-timetracker-app/assets/figma-proyectos.png)
- **Sistema de diseño:** [DESIGN.md](../../../../DESIGN.md) — tema Precision Focus.
- **Documentación técnica:** [timetracker.md#md-01-proyecto-project](../../technical-docs/timetracker.md#md-01-proyecto-project) — modelo de datos de Proyecto; [#fl-05-editar-proyecto](../../technical-docs/timetracker.md#fl-05-editar-proyecto) — flujo de edición; [#fl-06-eliminar-proyecto](../../technical-docs/timetracker.md#fl-06-eliminar-proyecto) — flujo de eliminación con bloqueo si tiene Tareas.
- **Glosario:** [glossary.md](../../glossary.md) — término "Proyecto".

## Criterios de aceptación

- **AC-001 (Reglas de negocio):** el sistema DEBE permitir crear un Proyecto ingresando un Nombre obligatorio y una Descripción opcional. (RF-001)
- **AC-002 (Procesamiento de datos):** el sistema DEBE almacenar los datos del Proyecto en el almacenamiento local del dispositivo. (RF-002)
- **AC-003 (Reglas de negocio):** el sistema DEBE permitir editar el Nombre y/o la Descripción de un Proyecto existente.
- **AC-004 (Reglas de negocio):** el sistema DEBE permitir eliminar un Proyecto que no tenga Tareas asociadas.
- **AC-005 (Reglas de negocio):** el sistema NO DEBE permitir eliminar un Proyecto que tenga una o más Tareas asociadas, y DEBE informar al usuario el motivo del bloqueo. (BR-01)
- **AC-006 (Interacción de usuario):** la pantalla "Proyectos" DEBE listar los Proyectos existentes mostrando su Nombre y Descripción, y ofrecer acciones para editar y eliminar cada Proyecto, fiel al wireframe [figma-proyectos.png](../../requirements/SRS-001-timetracker-app/assets/figma-proyectos.png). (RIU-002, RD-003)
- **AC-007 (Usabilidad):** la interfaz DEBE adherirse a la paleta de colores, tipografía, espaciado y patrones de componentes de [DESIGN.md](../../../../DESIGN.md) (tema Precision Focus). (RIU-001, RD-001)
- **AC-008 (Fiabilidad):** el sistema DEBE recuperar de forma consistente los Proyectos almacenados —incluyendo ediciones y eliminaciones— tras un reinicio de la aplicación o un cierre inesperado. (RFB-001, RFB-002)

---

## Complejidad sugerida

- **Story points:** 3
- **Justificación:** Al CRUD simple original (crear + listar) se suma editar y eliminar con una regla de negocio de bloqueo (no eliminar si tiene Tareas), que exige verificar la relación con Tarea antes de eliminar. Sigue siendo un alcance acotado, sin lógica de negocio compleja adicional.

## Repositorios

- exercise-time-tracker

## Validación

### INVEST

| Letra | Criterio      | Resultado | Notas                                                                                                                                                                                                                                                                                                                    |
| ----- | ------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **I** | Independiente | Parcial   | La lógica de creación/edición/listado es independiente; la validación de bloqueo de eliminación (BR-01) depende de que existan Tareas (US-003) para poder probarse de punta a punta, aunque puede implementarse antes con datos de prueba. La experiencia de navegación completa depende del shell entregado por US-001. |
| **N** | Negociable    | Cumple    | El alcance (crear/editar/eliminar/listar) admite ajuste de detalle visual sin cambiar el valor central.                                                                                                                                                                                                                  |
| **V** | Valiosa       | Cumple    | Sin Proyectos no existen Tareas ni Registros de Tiempo; poder editarlos y eliminarlos mantiene la organización del usuario al día.                                                                                                                                                                                       |
| **E** | Estimable     | Cumple    | Alcance acotado y modelo de datos y flujos documentados en technical-docs.                                                                                                                                                                                                                                               |
| **S** | Pequeña       | Cumple    | Cabe en un incremento pequeño (CRUD completo de una entidad con una regla de bloqueo).                                                                                                                                                                                                                                   |
| **T** | Testeable     | Cumple    | AC-001 a AC-008 son verificables de forma objetiva.                                                                                                                                                                                                                                                                      |

### Definition of Ready (DoR)

| Criterio DoR                       | Estado  | Notas                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dependencias listas                | Parcial | Depende del shell de navegación de US-001 para la experiencia completa; la validación de bloqueo de eliminación se prueba de punta a punta una vez existan Tareas (US-003), aunque no bloquea el desarrollo.                                                                                                                                                                                                                                                                                                    |
| Inputs/outputs claros              | Cumple  | Nombre (obligatorio) / Descripción (opcional) como entrada para crear/editar; acción eliminar como entrada; listado de Proyectos actualizado como salida.                                                                                                                                                                                                                                                                                                                                                       |
| Repositorios definidos             | Cumple  | exercise-time-tracker (repositorio único, monorepo).                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Sin decisiones técnicas pendientes | Cumple  | Modelo de datos y flujos de edición/eliminación documentados en [timetracker.md#md-01-proyecto-project](../../technical-docs/timetracker.md#md-01-proyecto-project), [#fl-05-editar-proyecto](../../technical-docs/timetracker.md#fl-05-editar-proyecto) y [#fl-06-eliminar-proyecto](../../technical-docs/timetracker.md#fl-06-eliminar-proyecto); quedan detalles menores (mensaje exacto del aviso de bloqueo, longitud/unicidad de nombre) registrados ahí, que no condicionan el alcance de esta historia. |
| Referencias de UI                  | Cumple  | Wireframe [figma-proyectos.png](../../requirements/SRS-001-timetracker-app/assets/figma-proyectos.png) disponible para creación/listado; edición y confirmación de eliminación reutilizan el patrón de modal ya definido en [figma-nueva-tarea.png](../../requirements/SRS-001-timetracker-app/assets/figma-nueva-tarea.png) y los componentes de [DESIGN.md](../../../../DESIGN.md).                                                                                                                           |
| Sin aclaraciones pendientes        | Cumple  | La política de eliminación (bloquear si tiene Tareas) quedó confirmada; no hay reasignación/cascada en el alcance de esta historia.                                                                                                                                                                                                                                                                                                                                                                             |

## Observaciones

- Se apoya en US-001 (Layout de la Aplicación) para la navegación lateral y el encabezado; no bloquea el desarrollo del CRUD de Proyecto en sí.
- Ninguna.
- Ninguna.
- El mensaje exacto que se muestra al usuario al bloquear una eliminación (AC-005) queda como detalle de implementación a resolver en TK-XXX, documentado en [timetracker.md#fl-06-eliminar-proyecto](../../technical-docs/timetracker.md#fl-06-eliminar-proyecto).
