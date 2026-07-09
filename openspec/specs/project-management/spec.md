# project-management Specification

## Purpose

TBD - created by archiving change manage-projects. Update Purpose after archive.

## Requirements

### Requirement: Creación de Proyecto

El sistema SHALL permitir al usuario crear un nuevo Proyecto ingresando un Nombre (obligatorio) y una Descripción (opcional) mediante el formulario/modal "Nuevo Proyecto". El sistema SHALL rechazar la creación cuando el Nombre esté vacío.

#### Scenario: Creación con Nombre y Descripción

- **WHEN** el usuario ingresa un Nombre y una Descripción válidos y confirma la creación
- **THEN** el sistema crea el Proyecto sin errores de validación y lo agrega al listado

#### Scenario: Creación solo con Nombre

- **WHEN** el usuario ingresa un Nombre válido y deja la Descripción vacía, y confirma la creación
- **THEN** el sistema crea el Proyecto sin exigir la Descripción y lo agrega al listado sin Descripción asociada

#### Scenario: Intento de creación sin Nombre

- **WHEN** el usuario intenta confirmar la creación con el campo Nombre vacío
- **THEN** el sistema rechaza la solicitud, muestra un error de validación indicando que el Nombre es obligatorio, y mantiene el formulario abierto sin crear el Proyecto

### Requirement: Persistencia local de Proyectos

El sistema SHALL almacenar los datos de cada Proyecto creado en el almacenamiento local del dispositivo (`localStorage`, según ADR-011), de forma que persistan tras recargar o reiniciar la aplicación.

#### Scenario: El Proyecto persiste tras recargar la aplicación

- **WHEN** el usuario crea un Proyecto y luego recarga la aplicación
- **THEN** el sistema recupera el Proyecto desde el almacenamiento local y lo muestra en el listado con el mismo Nombre y Descripción

### Requirement: Listado de Proyectos

La interfaz SHALL listar los Proyectos existentes en tarjetas que muestren Nombre, Descripción y Tiempo Registrado, conforme al prototipo de alta fidelidad. Cuando no exista ningún Proyecto, la interfaz SHALL mostrarse sin errores y sin tarjetas.

#### Scenario: Listado con Proyectos existentes

- **WHEN** el usuario navega a la sección "Proyectos" y existe al menos un Proyecto creado
- **THEN** el sistema muestra una tarjeta por Proyecto con su Nombre, Descripción y Tiempo Registrado

#### Scenario: Listado vacío sin Proyectos creados

- **WHEN** el usuario navega a la sección "Proyectos" y no existe ningún Proyecto almacenado
- **THEN** el sistema muestra la sección sin errores y sin tarjetas de Proyecto

### Requirement: Acción visible para iniciar la creación de un Proyecto

La interfaz SHALL ofrecer una acción visible ("Nuevo Proyecto" / "Crear Nuevo Proyecto") que, al activarse, abre el formulario/modal de creación de Proyecto.

#### Scenario: Activación de la acción de creación

- **WHEN** el usuario hace clic en la acción "Nuevo Proyecto" / "Crear Nuevo Proyecto"
- **THEN** el sistema abre el formulario/modal de creación de Proyecto, listo para recibir los datos

### Requirement: Cálculo del tiempo total por Proyecto

El sistema SHALL calcular y mostrar el tiempo total registrado de un Proyecto como la suma de los tiempos registrados de sus Tareas. Cuando el Proyecto no tenga Tareas, o sus Tareas no tengan Registros de Tiempo, el sistema SHALL mostrar el tiempo total como cero sin generar error.

#### Scenario: Suma de tiempos de las Tareas del Proyecto

- **WHEN** un Proyecto tiene Tareas con Registros de Tiempo ya guardados
- **THEN** la tarjeta del Proyecto muestra el Tiempo Registrado como la suma exacta de los tiempos de todas sus Tareas

#### Scenario: Proyecto sin Tareas o sin Registros de Tiempo

- **WHEN** un Proyecto no tiene Tareas asociadas, o sus Tareas no tienen Registros de Tiempo
- **THEN** la tarjeta del Proyecto muestra el Tiempo Registrado como `0h 00m`, sin errores
