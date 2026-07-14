## ADDED Requirements

### Requirement: Iniciar temporizador para una Tarea específica

El sistema SHALL permitir al usuario iniciar un temporizador para una Tarea específica seleccionándola desde el listado de Tareas mediante el ícono ▷ junto a cada Tarea, guardando localmente el estado "En Ejecución", la hora de inicio y el identificador de la Tarea (AC-006).

#### Scenario: Inicio de temporizador sin ningún temporizador activo previo

- **WHEN** el usuario hace clic en el ícono ▷ junto a "Diseñar wireframes" y no hay ningún temporizador activo en la aplicación
- **THEN** el sistema registra la hora de inicio actual y persiste localmente el estado "En Ejecución" junto con el identificador de la Tarea, quedando visible como "En Ejecución" en la interfaz

### Requirement: Un único temporizador activo en toda la aplicación con auto-detención del anterior

El sistema SHALL permitir un (1) único temporizador activo ("En Ejecución") a la vez en toda la aplicación (BR-02). Si el usuario inicia un temporizador mientras otro está activo en una Tarea diferente, el sistema SHALL detener automáticamente el temporizador anterior, calcular su Duración y persistir su Registro de Tiempo antes de iniciar el nuevo temporizador (BR-03).

#### Scenario: Auto-detención del temporizador anterior al iniciar uno nuevo en otra Tarea

- **WHEN** el temporizador de la Tarea A ("Diseñar wireframes") está "En Ejecución" y el usuario hace clic en el ícono ▷ de la Tarea B ("Revisar backlog")
- **THEN** el sistema detiene automáticamente el temporizador de la Tarea A, calcula su Duración, persiste su Registro de Tiempo con Duración mayor que cero, e inmediatamente después inicia el temporizador de la Tarea B en estado "En Ejecución", de modo que solo la Tarea B queda con temporizador activo

### Requirement: Detener el temporizador activo y calcular su Duración

El sistema SHALL permitir al usuario detener el temporizador activo, registrando la Hora Fin y calculando la Duración como (Hora Fin − Hora Inicio) (AC-008).

#### Scenario: Detención manual del temporizador activo

- **WHEN** el temporizador de "Diseñar wireframes" está activo con Hora Inicio 09:00:00 y el usuario hace clic en el control de detener a las 09:25:00
- **THEN** el sistema registra la Hora Fin 09:25:00, calcula la Duración como 00:25:00, y el temporizador pasa a estado inactivo

### Requirement: Validar que la Duración calculada al detener sea mayor que cero

El sistema SHALL validar que la Duración calculada al detener el temporizador sea mayor que cero (BR-04) antes de persistir el Registro de Tiempo.

#### Scenario: Rechazo de Registro con Duración calculada igual a cero

- **WHEN** el temporizador se detiene en el mismo instante en que se inició, de modo que la Hora Fin coincide exactamente con la Hora Inicio y la Duración calculada es cero
- **THEN** el sistema NO persiste ningún Registro de Tiempo con Duración igual a cero, rechazando la operación conforme a BR-04

### Requirement: Persistencia inmediata del Registro de Tiempo generado por el temporizador

El sistema SHALL persistir de forma inmediata en el almacenamiento local el Registro de Tiempo generado al detener el temporizador (AC-010).

#### Scenario: El Registro queda disponible sin recargar y tras recargar la aplicación

- **WHEN** el usuario detiene el temporizador de "Diseñar wireframes" (Hora Inicio 09:00:00, Hora Fin 09:25:00) y luego consulta el almacenamiento local o recarga la aplicación
- **THEN** el Registro de Tiempo (Duración 25 min) está disponible en el almacenamiento local inmediatamente después de detener el temporizador, sin requerir una acción adicional del usuario, y sigue presente tras la recarga

### Requirement: Visibilidad clara del estado del temporizador y su Tarea asociada

La interfaz SHALL mostrar claramente el estado del temporizador (activo/inactivo) y la Tarea asociada (AC-011).

#### Scenario: La interfaz refleja el estado activo e inactivo del temporizador

- **WHEN** el usuario observa el panel de Tareas antes de iniciar cualquier temporizador, luego inicia el temporizador de "Diseñar wireframes" y finalmente lo detiene
- **THEN** la interfaz indica primero el estado inactivo, después muestra "En Ejecución" junto al nombre de "Diseñar wireframes" mientras está activo, y vuelve a mostrar el estado inactivo para esa Tarea al detenerlo

### Requirement: Rendimiento de inicio y detención del temporizador menor a 1 segundo

El sistema SHALL iniciar el temporizador, y SHALL detenerlo y persistir el Registro de Tiempo correspondiente, en menos de 1 segundo desde la acción del usuario (AC-012).

#### Scenario: Inicio y detención del temporizador se completan en menos de 1 segundo

- **WHEN** el usuario hace clic en el ícono ▷ de "Diseñar wireframes" y, en una interacción posterior, hace clic en el control de detener el temporizador
- **THEN** el tiempo transcurrido hasta que la interfaz refleja el estado "En Ejecución" es menor a 1 segundo, y el tiempo transcurrido hasta que el Registro de Tiempo queda persistido al detener es también menor a 1 segundo
