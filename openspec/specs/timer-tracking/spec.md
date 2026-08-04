## Purpose

Registrar tiempo en tiempo real sobre una Tarea mediante un temporizador dentro del dominio de Time Tracker. Cubre el inicio y la detención del temporizador, la restricción de unicidad global (un único temporizador activo en toda la aplicación, con detención y persistencia automática del temporizador anterior al iniciar uno nuevo), la validación de la Duración calculada y la visualización del estado del temporizador.

## Requirements

### Requirement: Iniciar temporizador para una Tarea

El sistema SHALL permitir al usuario iniciar un temporizador para una Tarea específica. Al iniciarlo, el sistema SHALL guardar localmente el estado "En Ejecución" junto con la hora de inicio y el identificador de la Tarea.

#### Scenario: Iniciar el temporizador sin otro activo

- **WHEN** el usuario inicia el temporizador para una Tarea y no hay ningún otro temporizador activo
- **THEN** el sistema guarda el estado "En Ejecución" con la hora de inicio y el identificador de esa Tarea

### Requirement: Un único temporizador activo en toda la aplicación

El sistema SHALL NOT permitir más de un (1) temporizador activo a la vez en toda la aplicación. Si el usuario inicia un temporizador mientras otro está activo en una Tarea diferente, el sistema SHALL detener automáticamente el temporizador anterior, calcular y guardar su Registro de Tiempo, antes de iniciar el nuevo.

#### Scenario: Iniciar un temporizador mientras otro está activo en otra Tarea

- **WHEN** el usuario inicia el temporizador para la Tarea B mientras el temporizador de la Tarea A está activo
- **THEN** el sistema detiene el temporizador de la Tarea A, calcula y persiste su Registro de Tiempo, y luego inicia el temporizador de la Tarea B

### Requirement: Detener temporizador activo

El sistema SHALL permitir al usuario detener el temporizador activo. Al detenerlo, el sistema SHALL registrar la Hora Fin, calcular la Duración (Hora Fin − Hora Inicio) y persistir el Registro de Tiempo de forma inmediata en el almacenamiento local.

#### Scenario: Detener el temporizador activo

- **WHEN** el usuario detiene el temporizador activo de una Tarea
- **THEN** el sistema registra la Hora Fin, calcula la Duración y persiste el Registro de Tiempo de inmediato

### Requirement: Validación de duración positiva del temporizador

El sistema SHALL validar que la Duración calculada al detener un temporizador sea mayor que cero.

#### Scenario: Duración calculada mayor que cero

- **WHEN** el sistema calcula la Duración al detener un temporizador y el resultado es mayor que cero
- **THEN** el sistema persiste el Registro de Tiempo con esa Duración

### Requirement: Visualización del estado del temporizador

El sistema SHALL mostrar claramente el estado del temporizador (activo/inactivo), la Tarea asociada y el tiempo transcurrido.

#### Scenario: Mostrar el temporizador activo

- **WHEN** hay un temporizador activo para una Tarea
- **THEN** la interfaz muestra el estado activo, el nombre de la Tarea y el tiempo transcurrido en actualización continua

### Requirement: Rendimiento de inicio y detención del temporizador

El sistema SHALL iniciar el temporizador en menos de 1 segundo desde la acción del usuario, y SHALL detenerlo y persistir el Registro de Tiempo en menos de 1 segundo desde la acción del usuario.

#### Scenario: Iniciar el temporizador dentro del límite de tiempo

- **WHEN** el usuario solicita iniciar el temporizador
- **THEN** el sistema refleja el estado "En Ejecución" en menos de 1 segundo

#### Scenario: Detener el temporizador dentro del límite de tiempo

- **WHEN** el usuario solicita detener el temporizador activo
- **THEN** el sistema persiste el Registro de Tiempo en menos de 1 segundo
</content>
