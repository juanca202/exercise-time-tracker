## Referencias

- Historia de usuario: [US-30274: Historial de Registros](../../../../../docs/specs/user-stories/US-30274-historial-de-registros/README.md)
- Diseño / prototipo (alta fidelidad) — Historial de registros: [Figma — Historial de registros](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker?node-id=1-1740)

## ADDED Requirements

### Requirement: Historial de Registros de Tiempo

El sistema SHALL leer y mostrar en la interfaz el historial de todos los Registros de Tiempo.

#### Scenario: Historial con Registros existentes

- **WHEN** el usuario abre la pantalla de Historial y existen Registros de Tiempo
- **THEN** el sistema muestra el listado de esos Registros de Tiempo

#### Scenario: Historial vacío

- **WHEN** el usuario abre la pantalla de Historial y no existe ningún Registro de Tiempo
- **THEN** el sistema muestra el estado vacío correspondiente

### Requirement: Total de tiempo acumulado por Tarea

El sistema SHALL calcular y mostrar el total de tiempo acumulado por Tarea.

#### Scenario: Tarea con Registros de Tiempo

- **WHEN** una Tarea tiene uno o más Registros de Tiempo
- **THEN** el sistema muestra como total de la Tarea la suma de las duraciones de esos Registros

#### Scenario: Tarea sin Registros de Tiempo

- **WHEN** una Tarea no tiene ningún Registro de Tiempo
- **THEN** el sistema muestra el total de esa Tarea como cero

### Requirement: Total de tiempo acumulado por Proyecto en el periodo seleccionado

El sistema SHALL calcular y mostrar el total de tiempo acumulado por Proyecto dentro del periodo seleccionado.

#### Scenario: Proyecto con Registros de Tiempo en el periodo

- **WHEN** el Proyecto tiene Registros de Tiempo dentro del periodo seleccionado
- **THEN** el sistema muestra como total del Proyecto la suma de las duraciones de esos Registros

#### Scenario: Proyecto sin Registros de Tiempo en el periodo

- **WHEN** el Proyecto no tiene Registros de Tiempo dentro del periodo seleccionado
- **THEN** el sistema muestra el total de ese Proyecto como cero

### Requirement: Total de tiempo acumulado por mes con navegación entre periodos

El sistema SHALL calcular y mostrar el total de tiempo acumulado por mes, permitiendo navegar entre periodos (mes anterior / mes siguiente).

#### Scenario: Mes actual con Registros de Tiempo

- **WHEN** el usuario abre el Historial y el mes actual tiene Registros de Tiempo
- **THEN** el sistema muestra el total acumulado de ese mes

#### Scenario: Navegación entre meses

- **WHEN** el usuario selecciona "mes anterior" o "mes siguiente"
- **THEN** el sistema recalcula y muestra el total acumulado, el listado y el resumen del periodo seleccionado

#### Scenario: Mes sin Registros de Tiempo

- **WHEN** el periodo seleccionado no tiene ningún Registro de Tiempo
- **THEN** el sistema muestra el total de ese periodo como cero y el estado vacío del listado

### Requirement: Listado de Registros de Tiempo con sus campos

La interfaz SHALL listar cada Registro de Tiempo con Fecha, Proyecto, Tarea y Duración, conforme al prototipo de alta fidelidad.

#### Scenario: Presentación de campos del Registro

- **WHEN** el sistema muestra un Registro de Tiempo en el listado
- **THEN** incluye su Fecha, Proyecto, Tarea y Duración

#### Scenario: Registro con duración mínima

- **WHEN** el Registro de Tiempo listado tiene la duración mínima válida (mayor que cero)
- **THEN** el sistema lo muestra correctamente en el listado sin tratarlo como un caso de error

### Requirement: Resumen del periodo seleccionado

La interfaz SHALL mostrar un resumen del periodo seleccionado con el total de registros encontrados, la cantidad de proyectos involucrados y el total de horas.

#### Scenario: Resumen con Registros en el periodo

- **WHEN** el periodo seleccionado tiene Registros de Tiempo
- **THEN** el sistema muestra el total de registros, la cantidad de proyectos involucrados y el total de horas de ese periodo

#### Scenario: Resumen sin Registros en el periodo

- **WHEN** el periodo seleccionado no tiene ningún Registro de Tiempo
- **THEN** el sistema muestra el resumen en cero (0 registros, 0 proyectos, 0 horas)

### Requirement: Rendimiento de carga del historial

La visualización del historial SHALL cargarse en menos de 2 segundos para un volumen de hasta 1000 Registros de Tiempo.

#### Scenario: Carga con volumen pequeño de Registros

- **WHEN** el usuario abre el Historial con un volumen pequeño de Registros de Tiempo
- **THEN** la pantalla se carga en menos de 2 segundos

#### Scenario: Carga con 1000 Registros de Tiempo

- **WHEN** el usuario abre el Historial con 1000 Registros de Tiempo almacenados
- **THEN** la pantalla se carga en menos de 2 segundos
