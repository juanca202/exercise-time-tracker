# task-time-tracking Specification

## Purpose

TBD - created by archiving change track-task-time. Update Purpose after archive.

## Requirements

### Requirement: Creación de Tarea asociada a un Proyecto

El sistema SHALL permitir al usuario crear una nueva Tarea ingresando un Nombre y asociándola a un Proyecto existente mediante el modal "Nueva Tarea". Toda Tarea SHALL pertenecer obligatoriamente a un único Proyecto (BR-01).

#### Scenario: Creación con Nombre y Proyecto válidos

- **WHEN** el usuario selecciona un Proyecto existente, ingresa un Nombre no vacío y confirma "Crear Tarea"
- **THEN** el sistema crea la Tarea asociada a ese Proyecto y la muestra en el panel de Tareas

#### Scenario: Intento de creación con Nombre vacío

- **WHEN** el usuario intenta confirmar la creación dejando el campo Nombre vacío
- **THEN** el sistema rechaza la solicitud y no crea la Tarea

#### Scenario: Intento de creación sin Proyecto seleccionado

- **WHEN** el usuario intenta confirmar la creación sin seleccionar un Proyecto
- **THEN** el sistema rechaza la solicitud y no crea la Tarea

### Requirement: Persistencia local de Tareas

El sistema SHALL almacenar los datos de cada Tarea, incluyendo su asociación al Proyecto, en el almacenamiento local del dispositivo (`localStorage`, ADR-011).

#### Scenario: La Tarea persiste tras recargar la aplicación

- **WHEN** el usuario crea una Tarea asociada a un Proyecto y luego recarga la aplicación
- **THEN** el sistema recupera la Tarea desde el almacenamiento local, con su asociación al Proyecto intacta

### Requirement: Modal "Nueva Tarea"

La interfaz SHALL presentar el modal "Nueva Tarea" con los campos Proyecto y Nombre, y las acciones "Cancelar" / "Crear Tarea", conforme al prototipo de alta fidelidad.

#### Scenario: Presentación del modal

- **WHEN** el usuario abre el modal "Nueva Tarea"
- **THEN** el modal muestra los campos Proyecto y Nombre, y las acciones "Cancelar" y "Crear Tarea"

#### Scenario: Cancelar la creación

- **WHEN** el usuario hace clic en "Cancelar" con o sin datos ingresados
- **THEN** el modal se cierra sin crear ninguna Tarea

### Requirement: Inicio de temporizador para una Tarea

El sistema SHALL permitir al usuario iniciar un temporizador para una Tarea específica desde el panel de Tareas, registrando localmente el estado "En Ejecución" junto con la hora de inicio y el identificador de la Tarea.

#### Scenario: Inicio de temporizador sobre una Tarea sin temporizador activo

- **WHEN** el usuario inicia el temporizador de una Tarea y no hay ningún otro temporizador activo
- **THEN** el sistema marca esa Tarea como "En Ejecución" con su hora de inicio registrada

### Requirement: Único temporizador activo en toda la aplicación

El sistema SHALL permitir un (1) único temporizador activo a la vez en toda la aplicación (BR-02). Si el usuario inicia un temporizador mientras otro está activo en una Tarea diferente, el sistema SHALL detener automáticamente el temporizador anterior, calcular su Duración y persistir su Registro de Tiempo antes de iniciar el nuevo.

#### Scenario: Cambio de temporizador entre Tareas

- **WHEN** el usuario inicia el temporizador de la Tarea B mientras el temporizador de la Tarea A está activo
- **THEN** el sistema detiene el temporizador de la Tarea A, calcula y persiste su Registro de Tiempo, y activa el temporizador de la Tarea B

#### Scenario: Cambio de temporizador con duración mínima

- **WHEN** el usuario inicia el temporizador de la Tarea B casi inmediatamente después de iniciar el de la Tarea A (duración resultante mínima pero mayor que cero)
- **THEN** el sistema persiste el Registro de Tiempo de la Tarea A con esa duración mínima válida y activa el temporizador de la Tarea B

### Requirement: Detener el temporizador activo

El sistema SHALL permitir al usuario detener el temporizador activo mediante la acción "Detener Sesión". Si no hay ningún temporizador activo, el sistema SHALL rechazar la acción.

#### Scenario: Detener un temporizador activo

- **WHEN** el usuario hace clic en "Detener Sesión" mientras un temporizador está activo
- **THEN** el sistema detiene el temporizador y registra su Hora Fin

#### Scenario: Intento de detener sin temporizador activo

- **WHEN** el usuario invoca "Detener Sesión" sin que exista ningún temporizador activo
- **THEN** el sistema rechaza la acción sin generar un Registro de Tiempo

### Requirement: Cálculo y persistencia del Registro de Tiempo por temporizador

Al detener el temporizador, el sistema SHALL calcular la Duración (Hora Fin − Hora Inicio) y persistir el Registro de Tiempo de forma inmediata en el almacenamiento local.

#### Scenario: Persistencia inmediata al detener

- **WHEN** el usuario detiene un temporizador activo
- **THEN** el sistema calcula la Duración y persiste el Registro de Tiempo en el almacenamiento local antes de que la interfaz vuelva a un estado sin temporizador activo

### Requirement: Validación de Duración mayor que cero (temporizador y manual)

El sistema SHALL validar que la Duración de todo Registro de Tiempo, ya sea calculada por temporizador o ingresada manualmente, sea mayor que cero (BR-03). El sistema SHALL rechazar y no persistir cualquier Registro de Tiempo cuya Duración sea menor o igual a cero.

#### Scenario: Duración de temporizador igual a cero

- **WHEN** la Duración calculada al detener un temporizador es igual a cero
- **THEN** el sistema no persiste ningún Registro de Tiempo para esa sesión

#### Scenario: Duración de temporizador en el límite mínimo válido

- **WHEN** la Duración calculada al detener un temporizador es mayor que cero (aunque mínima)
- **THEN** el sistema persiste el Registro de Tiempo con esa Duración

#### Scenario: Duración manual negativa

- **WHEN** el usuario ingresa una Duración negativa en el formulario "Entrada Manual" y confirma "Guardar Registro"
- **THEN** el sistema no crea el Registro de Tiempo y el formulario permanece abierto

#### Scenario: Duración manual igual a cero

- **WHEN** el usuario ingresa una Duración igual a cero en el formulario "Entrada Manual" y confirma "Guardar Registro"
- **THEN** el sistema no crea el Registro de Tiempo y el formulario permanece abierto

#### Scenario: Duración manual en el límite mínimo válido

- **WHEN** el usuario ingresa una Duración mayor que cero (aunque mínima) en el formulario "Entrada Manual" y confirma "Guardar Registro"
- **THEN** el sistema crea y persiste el Registro de Tiempo

### Requirement: Registro de Tiempo manual

El sistema SHALL permitir al usuario crear un Registro de Tiempo manual para una Tarea, ingresando Fecha, Proyecto/Tarea y Duración mediante el formulario "Entrada Manual", y SHALL persistirlo en el almacenamiento local al confirmar "Guardar Registro".

#### Scenario: Creación de Registro de Tiempo manual válido

- **WHEN** el usuario completa Fecha, Proyecto/Tarea y una Duración válida (mayor que cero) y confirma "Guardar Registro"
- **THEN** el sistema crea y persiste el Registro de Tiempo, asociado a la Tarea seleccionada

#### Scenario: Intento de guardar con un campo obligatorio vacío

- **WHEN** el usuario intenta confirmar "Guardar Registro" dejando algún campo obligatorio (Fecha, Proyecto/Tarea o Duración) vacío
- **THEN** el sistema rechaza la solicitud y no crea el Registro de Tiempo

### Requirement: Listado de Tareas en el panel principal

La interfaz SHALL listar las Tareas existentes en el panel principal, mostrando su Nombre, Proyecto asociado, tiempo acumulado y última actividad, con una acción para iniciar su temporizador. Esta infraestructura es necesaria para AC-004/RIU-004 aunque no tenga un AC propio en la historia de origen.

#### Scenario: Listado con Tareas existentes

- **WHEN** el usuario abre el panel de Tareas y existen Tareas creadas
- **THEN** el sistema muestra cada Tarea con su Nombre, Proyecto, tiempo acumulado (suma de sus Registros de Tiempo) y la fecha/hora de su última actividad

#### Scenario: Tarea sin Registros de Tiempo todavía

- **WHEN** una Tarea no tiene ningún Registro de Tiempo
- **THEN** el sistema muestra su tiempo acumulado como cero y omite la última actividad, sin errores

### Requirement: Resumen de tiempo trabajado por semana y por mes

El sistema SHALL mostrar en el panel de Tareas el tiempo total trabajado en la semana calendario actual y en el mes calendario actual, y SHALL mostrar el progreso hacia una meta semanal fija de 8 horas por cada día hábil (lunes a viernes, 40h/semana). Este requisito no proviene de un AC de US-30272; se agregó tras la revisión de fidelidad visual contra el prototipo Figma.

#### Scenario: Cálculo del total semanal y mensual

- **WHEN** existen Registros de Tiempo dentro de la semana o el mes calendario actual
- **THEN** el sistema suma sus duraciones y las muestra como "Total Semanal" y "Total Mensual" respectivamente

#### Scenario: Progreso hacia la meta semanal

- **WHEN** el sistema calcula el total semanal
- **THEN** muestra el porcentaje alcanzado respecto a la meta semanal de 40 horas

#### Scenario: Semana o mes sin Registros de Tiempo

- **WHEN** no existe ningún Registro de Tiempo dentro del periodo (semana o mes) actual
- **THEN** el sistema muestra el total de ese periodo como cero, sin errores

### Requirement: Rendimiento del temporizador

El sistema SHALL iniciar el temporizador en menos de 1 segundo desde la acción del usuario (RP-001), y SHALL detener el temporizador y persistir el Registro de Tiempo correspondiente en menos de 1 segundo desde la acción del usuario (RP-002).

#### Scenario: Inicio de temporizador dentro del umbral

- **WHEN** el usuario inicia un temporizador
- **THEN** el sistema refleja el estado "En Ejecución" en menos de 1 segundo

#### Scenario: Detención de temporizador dentro del umbral

- **WHEN** el usuario detiene el temporizador activo
- **THEN** el sistema persiste el Registro de Tiempo correspondiente en menos de 1 segundo
