## Referencias

- Historia de usuario: [US-30272: Gestión de Tareas y registro de tiempo](../../../../../docs/specs/user-stories/US-30272-gestion-de-tareas/README.md)
- Diseño / prototipo (alta fidelidad) — Tareas (panel principal): [Figma — Tareas](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker?node-id=1-1374)
- Diseño / prototipo (alta fidelidad) — Modal Nueva Tarea: [Figma — Tareas / Diálogo Nueva Tarea](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker?node-id=1-1539)

## ADDED Requirements

### Requirement: Creación de Tarea asociada a un Proyecto

El sistema SHALL permitir al usuario crear una nueva Tarea ingresando un Nombre y asociándola a un Proyecto existente mediante el modal "Nueva Tarea". Una Tarea SHALL pertenecer obligatoriamente a un único Proyecto.

#### Scenario: Crear Tarea con Nombre y Proyecto válidos

- **WHEN** el usuario completa el campo Nombre y selecciona un Proyecto existente y confirma "Crear Tarea"
- **THEN** el sistema crea la Tarea asociada a ese Proyecto y cierra el modal

#### Scenario: Intento de creación con Nombre vacío

- **WHEN** el usuario confirma "Crear Tarea" sin ingresar un Nombre
- **THEN** el sistema rechaza la creación y muestra un error de validación

#### Scenario: Intento de creación sin Proyecto asociado

- **WHEN** el usuario confirma "Crear Tarea" sin seleccionar un Proyecto
- **THEN** el sistema rechaza la creación y muestra un error de validación

### Requirement: Persistencia local de la Tarea

El sistema SHALL almacenar los datos de la Tarea, incluyendo su asociación al Proyecto, en el almacenamiento local del dispositivo (localStorage, ADR-011) de forma inmediata al crearse.

#### Scenario: Persistencia tras crear una Tarea

- **WHEN** el usuario crea una Tarea válida asociada a un Proyecto
- **THEN** la Tarea y su asociación al Proyecto quedan persistidas en el almacenamiento local y disponibles tras recargar la aplicación

### Requirement: Presentación del modal "Nueva Tarea"

La interfaz SHALL presentar el modal "Nueva Tarea" con los campos Proyecto y Nombre, y las acciones "Cancelar" / "Crear Tarea", conforme al prototipo de alta fidelidad.

#### Scenario: Apertura del modal

- **WHEN** el usuario inicia la acción de crear una nueva Tarea
- **THEN** el sistema muestra el modal con los campos Proyecto y Nombre, y las acciones Cancelar / Crear Tarea

#### Scenario: Cancelar la creación

- **WHEN** el usuario selecciona "Cancelar" en el modal "Nueva Tarea"
- **THEN** el sistema cierra el modal sin crear ninguna Tarea

### Requirement: Inicio de temporizador para una Tarea

El sistema SHALL permitir al usuario iniciar un temporizador para una Tarea específica desde el panel de Tareas.

#### Scenario: Iniciar temporizador

- **WHEN** el usuario inicia el temporizador de una Tarea
- **THEN** el sistema marca esa Tarea como "en ejecución" y comienza a contar el tiempo desde la hora de inicio

### Requirement: Temporizador único de la aplicación

El sistema SHALL permitir un (1) único temporizador activo ("en ejecución") a la vez en toda la aplicación. Si el usuario inicia un temporizador mientras otro está activo en una Tarea diferente, el sistema SHALL detener automáticamente el temporizador anterior, calcular y guardar su Registro de Tiempo antes de iniciar el nuevo.

#### Scenario: Cambio de temporizador activo

- **WHEN** el usuario inicia el temporizador de una Tarea mientras el temporizador de otra Tarea está activo
- **THEN** el sistema detiene el temporizador anterior, calcula y persiste su Registro de Tiempo, y luego inicia el temporizador de la nueva Tarea

#### Scenario: Cambio de temporizador con duración mínima válida

- **WHEN** el temporizador anterior se detiene automáticamente con una duración de exactamente 1 segundo
- **THEN** el sistema acepta y persiste ese Registro de Tiempo como válido antes de iniciar el nuevo temporizador

### Requirement: Detención del temporizador activo

El sistema SHALL permitir al usuario detener el temporizador activo mediante la acción "Detener Sesión".

#### Scenario: Detener sesión activa

- **WHEN** el usuario selecciona "Detener Sesión" con un temporizador activo
- **THEN** el sistema detiene el temporizador de esa Tarea

#### Scenario: Detener sin temporizador activo

- **WHEN** el usuario intenta detener el temporizador sin que exista ninguno activo
- **THEN** el sistema rechaza la acción y muestra un error

### Requirement: Cálculo y persistencia de la duración al detener el temporizador

Al detener el temporizador, el sistema SHALL calcular la Duración (Hora Fin − Hora Inicio) y persistir el Registro de Tiempo de forma inmediata en el almacenamiento local.

#### Scenario: Persistencia inmediata del Registro de Tiempo

- **WHEN** el usuario detiene el temporizador activo
- **THEN** el sistema calcula la Duración como Hora Fin menos Hora Inicio y persiste el Registro de Tiempo de inmediato en el almacenamiento local

### Requirement: Validación de duración mínima del temporizador

El sistema SHALL validar que la Duración calculada por el temporizador sea mayor que cero.

#### Scenario: Duración de temporizador igual a cero

- **WHEN** el temporizador se detiene con una Duración calculada igual a cero
- **THEN** el sistema rechaza el Registro de Tiempo y muestra un error

#### Scenario: Duración de temporizador mínima válida

- **WHEN** el temporizador se detiene con una Duración calculada de exactamente 1 segundo
- **THEN** el sistema acepta y persiste el Registro de Tiempo

### Requirement: Registro manual de tiempo

El sistema SHALL permitir al usuario crear un Registro de Tiempo manual para una Tarea, ingresando Fecha, Proyecto/Tarea y Duración mediante el formulario "Entrada Manual".

#### Scenario: Registro manual válido

- **WHEN** el usuario completa Fecha, Proyecto/Tarea y Duración en el formulario "Entrada Manual" y confirma "Guardar Registro"
- **THEN** el sistema crea el Registro de Tiempo manual asociado a la Tarea indicada

#### Scenario: Campo obligatorio faltante

- **WHEN** el usuario confirma "Guardar Registro" sin completar un campo obligatorio (Fecha, Proyecto/Tarea o Duración)
- **THEN** el sistema rechaza la creación y muestra un error de validación

### Requirement: Persistencia del Registro de Tiempo manual

El sistema SHALL persistir el Registro de Tiempo manual en el almacenamiento local al confirmar la acción "Guardar Registro".

#### Scenario: Persistencia tras guardar un registro manual

- **WHEN** el usuario confirma "Guardar Registro" con datos válidos
- **THEN** el Registro de Tiempo manual queda persistido en el almacenamiento local y disponible tras recargar la aplicación

### Requirement: Validación de duración mínima del registro manual

El sistema SHALL validar que la Duración ingresada manualmente sea mayor que cero.

#### Scenario: Duración manual negativa

- **WHEN** el usuario ingresa una Duración negativa en el formulario "Entrada Manual"
- **THEN** el sistema rechaza el registro y muestra un error de validación

#### Scenario: Duración manual igual a cero

- **WHEN** el usuario ingresa una Duración igual a cero en el formulario "Entrada Manual"
- **THEN** el sistema rechaza el registro y muestra un error de validación

#### Scenario: Duración manual mínima válida

- **WHEN** el usuario ingresa una Duración de exactamente 1 minuto en el formulario "Entrada Manual"
- **THEN** el sistema acepta y persiste el Registro de Tiempo

### Requirement: Rendimiento del inicio del temporizador

El sistema SHALL iniciar el temporizador en menos de 1 segundo desde la acción del usuario.

#### Scenario: Inicio del temporizador dentro del presupuesto de rendimiento

- **WHEN** el usuario inicia el temporizador de una Tarea
- **THEN** el sistema marca la Tarea como "en ejecución" en menos de 1 segundo

### Requirement: Rendimiento de la detención del temporizador

El sistema SHALL detener el temporizador y persistir el Registro de Tiempo correspondiente en menos de 1 segundo desde la acción del usuario.

#### Scenario: Detención del temporizador dentro del presupuesto de rendimiento

- **WHEN** el usuario detiene el temporizador activo
- **THEN** el sistema calcula y persiste el Registro de Tiempo en menos de 1 segundo
