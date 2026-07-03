# US-001: Gestión de Proyectos y Tareas

Estado: Ready
Fecha de creación: 2026-07-03
Última actualización: 2026-07-03

## Descripción

**COMO** usuario de Time Tracker
**QUIERO** crear proyectos y crear tareas asociadas a un proyecto existente
**PARA** organizar mi trabajo en proyectos y tareas antes de registrar el tiempo que dedico a cada una

## Contexto

Time Tracker es una aplicación personal, offline-first, sin backend ni autenticación: todos los datos se persisten exclusivamente en el almacenamiento local del dispositivo (SRS §2.1, §2.4, §3.4-RD-002). Un Proyecto agrupa Tareas relacionadas; una Tarea pertenece obligatoriamente a un único Proyecto (SRS §1.3, §2.4).

Esta historia es la base del dominio: establece las entidades `Project` y `Task` y su persistencia, de las que dependen el temporizador ([US-002](../US-002-control-tiempo-automatizado/README.md)) y el registro manual/reportes ([US-003](../US-003-ingreso-manual-reportes/README.md)).

Decisiones de alcance ya tomadas (SRS es ambiguo entre la visión general §2.2 y los requisitos funcionales §3.1; estos últimos son la autoridad):

- La sección §2.2 del SRS menciona "edición" de Proyectos y Tareas, pero ningún RF-XXX ni wireframe cubre edición. Se **excluye edición** de Proyectos/Tareas de esta historia (YAGNI); solo se implementa creación y visualización.
- El wireframe del panel de Tareas muestra tarjetas "Total Semanal" con un mensaje de "meta semanal" (p. ej. "Has alcanzado el 84% de tu meta semanal"). No existe ningún RF ni entidad de "meta/objetivo" en el SRS. Se **excluye** esa barra de progreso; queda fuera del alcance de esta historia y de todo el producto salvo decisión futura explícita.
- Entidades de dominio: `Project { id, name, description?, createdAt }`, `Task { id, projectId, name, createdAt }`.
- Persistencia: `localStorage`, capa de store/lib (Zustand, [ADR-003](../../../adr/ADR-003-zustand-state-management.md)), sin middleware prescrito por el ADR.

## Reglas de negocio

- **BR-01:** El sistema DEBE permitir crear un Proyecto ingresando un Nombre obligatorio y una Descripción opcional. → verificado por AC-001
- **BR-02:** El sistema DEBE almacenar los datos del Proyecto en el almacenamiento local del dispositivo. → verificado por AC-002
- **BR-03:** El sistema DEBE permitir crear una Tarea asociándola a un Proyecto existente y proporcionando un Nombre obligatorio para la Tarea. → verificado por AC-003
- **BR-04:** El sistema NO DEBE permitir crear una Tarea sin que el usuario haya seleccionado un Proyecto existente. → verificado por AC-004
- **BR-05:** El sistema DEBE almacenar los datos de la Tarea en el almacenamiento local del dispositivo, incluyendo su asociación al Proyecto. → verificado por AC-005

## Referencias

- **Diseño / sistema de diseño:** [DESIGN.md — Precision Focus](https://github.com/HectorAndradeBayteq/taller-sdd/blob/master/etapa-2/assets/DESIGN.md)
- **Wireframe — Vista Proyectos:** [assets/wireframe-vista-proyectos.png](assets/wireframe-vista-proyectos.png)
- **Wireframe — Modal Nuevo Proyecto:** [assets/wireframe-modal-nuevo-proyecto.png](assets/wireframe-modal-nuevo-proyecto.png)
- **Wireframe — Modal Nueva Tarea:** [assets/wireframe-modal-nueva-tarea.png](assets/wireframe-modal-nueva-tarea.png)
- **Wireframe — Panel de Tareas (referencia de navegación y listado):** [assets/wireframe-panel-tareas-referencia.png](assets/wireframe-panel-tareas-referencia.png)

## Criterios de aceptación

- **AC-001 (Reglas de negocio):** El sistema DEBE permitir crear un Proyecto ingresando un Nombre (obligatorio) y una Descripción (opcional) mediante el modal "Nuevo Proyecto".
- **AC-002 (Procesamiento de datos):** El sistema DEBE persistir el Proyecto creado en el almacenamiento local del dispositivo, de forma que el proyecto siga disponible tras recargar la aplicación.
- **AC-003 (Reglas de negocio):** El sistema DEBE permitir crear una Tarea seleccionando un Proyecto existente e ingresando un Nombre (obligatorio) mediante el modal "Nueva Tarea".
- **AC-004 (Reglas de negocio):** El sistema NO DEBE permitir confirmar la creación de una Tarea si no se ha seleccionado un Proyecto existente o si el Nombre está vacío; DEBE mostrar retroalimentación de error al usuario.
- **AC-005 (Procesamiento de datos):** El sistema DEBE persistir la Tarea creada en el almacenamiento local del dispositivo, incluyendo su asociación al Proyecto seleccionado.
- **AC-006 (Interacción de usuario):** La interfaz DEBE mostrar la vista "Proyectos" como una cuadrícula de tarjetas, cada una con el nombre, la descripción y el tiempo total registrado del proyecto, más una tarjeta para crear un nuevo proyecto, conforme al wireframe de referencia.
- **AC-007 (Interacción de usuario):** La interfaz DEBE proveer una navegación lateral persistente con accesos a las secciones "Tareas", "Proyectos" e "Historial de Registros".
- **AC-008 (Interacción de usuario):** La interfaz DEBE adherirse a la paleta de colores, tipografía, espaciado y patrones de componentes del sistema de diseño "Precision Focus" (DESIGN.md).

### Escenarios de comportamiento

```gherkin
Escenario: SC-01 - Crear un proyecto con nombre y descripción
DADO que el usuario abre el modal "Nuevo Proyecto"
CUANDO ingresa un Nombre válido y una Descripción y confirma la creación
ENTONCES el sistema DEBE crear el Proyecto, persistirlo en almacenamiento local y mostrarlo en la vista "Proyectos"

Escenario: SC-02 - Crear una tarea asociada a un proyecto existente
DADO que existe al menos un Proyecto y el usuario abre el modal "Nueva Tarea"
CUANDO selecciona un Proyecto existente, ingresa un Nombre válido y confirma la creación
ENTONCES el sistema DEBE crear la Tarea asociada a ese Proyecto y persistirla en almacenamiento local

Escenario: SC-03 - Intento de crear una tarea sin seleccionar proyecto
DADO que el usuario abre el modal "Nueva Tarea"
CUANDO intenta confirmar la creación sin haber seleccionado un Proyecto
ENTONCES el sistema NO DEBE crear la Tarea y DEBE mostrar un mensaje de error indicando que el Proyecto es obligatorio
```

---

## Complejidad sugerida

- **Story points:** 5
- **Justificación:** Introduce dos entidades de dominio nuevas (Project, Task), la capa de persistencia local compartida (store Zustand + `localStorage`) que reutilizarán US-002 y US-003, dos modales con Base UI y una vista de cuadrícula completa. Riesgo bajo (sin lógica de concurrencia ni cálculos), pero alcance moderado por ser la base de todo el dominio.

## Repositorios

- exercise-time-tracker

## Validación

### INVEST

| Letra | Criterio      | Resultado | Notas                                                                                                                       |
| ----- | ------------- | --------- | --------------------------------------------------------------------------------------------------------------------------- |
| **I** | Independiente | Cumple    | No depende de otra US; es la historia base de la que dependen US-002 y US-003.                                              |
| **N** | Negociable    | Cumple    | El wireframe guía el layout, no es un contrato pixel-perfect; detalles de composición visual quedan abiertos a `work-plan`. |
| **V** | Valiosa       | Cumple    | Permite al usuario organizar su trabajo, prerrequisito de valor para registrar tiempo.                                      |
| **E** | Estimable     | Cumple    | RF-001 a RF-004 y wireframes dan información suficiente para estimar.                                                       |
| **S** | Pequeña       | Cumple    | Alcance acotado a creación y visualización de dos entidades; sin edición ni lógica de tiempo.                               |
| **T** | Testeable     | Cumple    | AC-001 a AC-008 son verificables de forma objetiva (unit + component tests).                                                |

### Definition of Ready (DoR)

| Criterio DoR                       | Estado | Notas                                                                                                              |
| ---------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------ |
| Dependencias listas                | Cumple | Historia base; sin dependencias de otras US.                                                                       |
| Inputs/outputs claros              | Cumple | Campos de entrada (Nombre, Descripción, Proyecto) y salidas (persistencia, listados) definidos en RF-001 a RF-004. |
| Repositorios definidos             | Cumple | exercise-time-tracker.                                                                                             |
| Sin decisiones técnicas pendientes | Cumple | Stack fijado por ADR-001 a ADR-007; forma de las entidades documentada en Contexto.                                |
| Referencias de UI                  | Cumple | Wireframes de Proyectos, Nuevo Proyecto, Nueva Tarea y Panel de Tareas adjuntos en `assets/`.                      |
| Sin aclaraciones pendientes        | Cumple | Ambigüedades del SRS (edición, meta semanal) resueltas y documentadas en Contexto.                                 |

## Observaciones

Ninguna.
