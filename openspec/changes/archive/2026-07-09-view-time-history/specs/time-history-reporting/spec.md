## ADDED Requirements

### Requirement: Visualización del historial de Registros de Tiempo

El sistema SHALL leer todos los Registros de Tiempo existentes y presentarlos agrupados por Tarea dentro del periodo seleccionado (ver Requirement "Listado de Tareas con tiempo acumulado en el periodo"). Cuando no exista ningún Registro de Tiempo en el periodo, el sistema SHALL mostrar la sección sin errores y con la lista vacía.

#### Scenario: Historial con Registros de Tiempo existentes

- **WHEN** el usuario navega a la sección "Historial de registros" y existen Registros de Tiempo almacenados dentro del periodo seleccionado
- **THEN** el sistema muestra una fila por cada Tarea con actividad en ese periodo, sin omisiones ni duplicados

#### Scenario: Historial vacío

- **WHEN** el usuario navega a la sección "Historial de registros" y no existe ningún Registro de Tiempo almacenado en el periodo seleccionado
- **THEN** el sistema muestra la sección sin errores, con la lista de registros vacía

### Requirement: Total de tiempo acumulado por Tarea

El sistema SHALL calcular y mostrar el total de tiempo acumulado por Tarea dentro del periodo seleccionado, sumando sus Registros de Tiempo de ese periodo (columna "Duración" de la tabla del historial). Una Tarea sin Registros de Tiempo en el periodo seleccionado SHALL NOT aparecer en la tabla de ese periodo (no hay una fila con total cero; la Tarea simplemente no tuvo actividad en él).

#### Scenario: Tarea con múltiples Registros de Tiempo en el periodo

- **WHEN** una Tarea tiene más de un Registro de Tiempo dentro del periodo seleccionado
- **THEN** el sistema muestra su fila en la tabla con la Duración como la suma exacta de las duraciones de esos registros

#### Scenario: Tarea sin Registros de Tiempo en el periodo seleccionado

- **WHEN** una Tarea existente no tiene ningún Registro de Tiempo dentro del periodo seleccionado
- **THEN** el sistema no incluye una fila para esa Tarea en la tabla de ese periodo, sin generar error

### Requirement: Total de tiempo acumulado por Proyecto en el periodo seleccionado

El sistema SHALL calcular y mostrar el total de tiempo acumulado por Proyecto dentro del periodo (mes) seleccionado, sumando los tiempos de sus Tareas en ese periodo. Cuando un Proyecto no tenga Registros de Tiempo dentro del periodo seleccionado, el sistema SHALL mostrar su total como cero para ese periodo.

#### Scenario: Proyecto con actividad en el periodo seleccionado

- **WHEN** un Proyecto tiene Tareas con Registros de Tiempo dentro del mes seleccionado
- **THEN** el sistema muestra el total acumulado del Proyecto como la suma de esos Registros de Tiempo del periodo

#### Scenario: Proyecto sin actividad en el periodo seleccionado

- **WHEN** un Proyecto solo tiene Registros de Tiempo en meses distintos al seleccionado
- **THEN** el sistema muestra su total acumulado en el periodo seleccionado como cero, sin incluir registros de otros meses

### Requirement: Total de tiempo acumulado por mes y navegación entre periodos

El sistema SHALL calcular y mostrar el total de tiempo acumulado por mes, seleccionando el mes calendario actual como periodo por defecto al abrir la sección. El sistema SHALL permitir navegar al mes anterior y al mes siguiente, recalculando el total del periodo en cada navegación.

#### Scenario: Mes actual seleccionado por defecto

- **WHEN** el usuario abre la sección "Historial de registros"
- **THEN** el sistema selecciona el mes calendario actual como periodo por defecto y muestra su total acumulado

#### Scenario: Navegación al mes anterior y regreso al mes siguiente

- **WHEN** el usuario navega al mes anterior y luego al mes siguiente
- **THEN** el sistema recalcula y muestra el total acumulado correspondiente a cada periodo visitado

#### Scenario: Navegación a un mes sin Registros de Tiempo

- **WHEN** el usuario navega a un mes calendario sin ningún Registro de Tiempo asociado
- **THEN** el sistema muestra ese periodo con la lista vacía y el total acumulado en cero, sin errores ni datos de otro mes

### Requirement: Listado de Tareas con tiempo acumulado en el periodo

La interfaz SHALL listar, dentro del periodo seleccionado, una fila por cada Tarea con actividad en ese periodo, mostrando Fecha (de su Registro de Tiempo más reciente dentro del periodo), Proyecto, Tarea y Duración (total acumulado de esa Tarea en el periodo), conforme al prototipo de alta fidelidad. Esta decisión (agrupar por Tarea en vez de listar cada Registro de Tiempo individual) se tomó tras la revisión de fidelidad Figma — ver design.md.

#### Scenario: Fila de Tarea con todos sus campos

- **WHEN** el sistema renderiza la fila de una Tarea con actividad en el periodo
- **THEN** la fila muestra su Fecha de última actividad en el periodo, Proyecto, Tarea y la Duración acumulada de esa Tarea en el periodo

#### Scenario: Fila con la duración acumulada mínima válida

- **WHEN** la Duración acumulada de una Tarea en el periodo es el valor mínimo válido (mayor que cero)
- **THEN** la fila muestra la Duración en un formato legible, sin truncamientos ni mostrarla como cero

### Requirement: Resumen del periodo seleccionado

La interfaz SHALL mostrar un resumen del periodo seleccionado con el total de Registros de Tiempo encontrados, la cantidad de Proyectos involucrados y el total de horas. Cuando el periodo no tenga Registros de Tiempo, el sistema SHALL mostrar los tres valores del resumen en cero de forma consistente.

#### Scenario: Resumen de un periodo con actividad

- **WHEN** el periodo seleccionado tiene Registros de Tiempo distribuidos en uno o más Proyectos
- **THEN** el sistema muestra la cantidad de registros, la cantidad de proyectos involucrados y el total de horas del periodo, coincidiendo con los datos reales

#### Scenario: Resumen de un periodo sin Registros de Tiempo

- **WHEN** el periodo seleccionado no tiene ningún Registro de Tiempo
- **THEN** el sistema muestra "0 registros", "0 proyectos" y "0h" de forma consistente, sin errores

### Requirement: Rendimiento de la carga del historial

La visualización del historial SHALL cargarse en menos de 2 segundos para un volumen de hasta 1000 Registros de Tiempo (RP-003).

#### Scenario: Carga con volumen pequeño de registros

- **WHEN** existen 50 Registros de Tiempo en el almacenamiento local
- **THEN** el historial completo, con sus totales, se carga y muestra en menos de 2 segundos

#### Scenario: Carga con el volumen máximo contemplado

- **WHEN** existen 1000 Registros de Tiempo en el almacenamiento local
- **THEN** el historial completo, con sus totales por Tarea, Proyecto y mes, se carga y muestra en menos de 2 segundos, sin errores por volumen

## Referencias

- Historia de origen: [US-30274 — Historial de Registros](../../../../../docs/specs/user-stories/US-30274-historial-de-registros/README.md)
- Especificación de origen: [SRS-001: Time Tracker](../../../../../docs/specs/requirements/SRS-001-timetracker-app/README.md)
- Diseño / prototipo (alta fidelidad) — Historial de registros: [Figma — Historial de registros](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker?node-id=1-1740)
