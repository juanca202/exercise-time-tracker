## Referencias

- Historia de usuario: [US-30273: Gestión de Proyectos](../../../../../docs/specs/user-stories/US-30273-gestion-de-proyectos/README.md)
- Diseño / prototipo (alta fidelidad) — Proyectos: [Figma — Proyectos](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker?node-id=1-1571)
- Diseño / prototipo (alta fidelidad) — Modal Nuevo Proyecto: [Figma — Proyectos / Diálogo Nuevo proyecto](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker?node-id=1-1642)

## ADDED Requirements

### Requirement: Creación de Proyecto

El sistema SHALL permitir al usuario crear un nuevo Proyecto ingresando un Nombre (obligatorio) y una Descripción (opcional).

#### Scenario: Crear Proyecto con Nombre y Descripción

- **WHEN** el usuario completa Nombre y Descripción y confirma la creación
- **THEN** el sistema crea el Proyecto con ambos valores

#### Scenario: Crear Proyecto solo con Nombre

- **WHEN** el usuario completa únicamente el Nombre y confirma la creación
- **THEN** el sistema crea el Proyecto sin Descripción

#### Scenario: Intento de creación sin Nombre

- **WHEN** el usuario confirma la creación sin ingresar un Nombre
- **THEN** el sistema rechaza la creación y muestra un error de validación

### Requirement: Persistencia local del Proyecto

El sistema SHALL almacenar los datos del Proyecto en el almacenamiento local del dispositivo (localStorage, ADR-011).

#### Scenario: Persistencia tras crear un Proyecto

- **WHEN** el usuario crea un Proyecto válido
- **THEN** el Proyecto queda persistido en el almacenamiento local y disponible tras recargar la aplicación

### Requirement: Listado de Proyectos

La interfaz SHALL listar los Proyectos existentes en tarjetas que muestren Nombre, Descripción y Tiempo Registrado, conforme al prototipo de alta fidelidad.

#### Scenario: Listado con Proyectos existentes

- **WHEN** el usuario abre la pantalla de Proyectos y existen Proyectos creados
- **THEN** el sistema muestra una tarjeta por Proyecto con su Nombre, Descripción y Tiempo Registrado

#### Scenario: Listado vacío

- **WHEN** el usuario abre la pantalla de Proyectos y no existe ningún Proyecto creado
- **THEN** el sistema muestra el estado vacío correspondiente, sin tarjetas de Proyecto

### Requirement: Acción para crear un nuevo Proyecto

La interfaz SHALL ofrecer una acción visible ("Nuevo Proyecto" / "Crear Nuevo Proyecto") para iniciar la creación de un Proyecto.

#### Scenario: Acceso a la creación de Proyecto

- **WHEN** el usuario selecciona la acción "Nuevo Proyecto" / "Crear Nuevo Proyecto"
- **THEN** el sistema inicia el flujo de creación de un Proyecto

### Requirement: Tiempo total registrado por Proyecto

El sistema SHALL calcular y mostrar el tiempo total registrado por Proyecto como la suma de los tiempos de sus Tareas.

#### Scenario: Proyecto con Tareas y Registros de Tiempo

- **WHEN** el Proyecto tiene una o más Tareas con Registros de Tiempo asociados
- **THEN** el sistema muestra como Tiempo Registrado la suma de las duraciones de todos esos Registros de Tiempo

#### Scenario: Proyecto sin Tareas o sin Registros de Tiempo

- **WHEN** el Proyecto no tiene Tareas, o sus Tareas no tienen Registros de Tiempo
- **THEN** el sistema muestra el Tiempo Registrado como cero
