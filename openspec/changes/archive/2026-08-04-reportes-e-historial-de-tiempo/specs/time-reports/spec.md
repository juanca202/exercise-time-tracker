## ADDED Requirements

### Requirement: Historial de Registros de Tiempo

El sistema SHALL leer y mostrar en la interfaz el historial completo de Registros de Tiempo, listando para cada uno su Fecha, Proyecto, Tarea y Duración, y SHALL permitir navegar entre periodos mensuales.

#### Scenario: Ver el historial de un mes

- **WHEN** el usuario abre la pantalla "Historial de registros" para un mes determinado
- **THEN** el sistema muestra todos los Registros de Tiempo de ese mes con su Fecha, Proyecto, Tarea y Duración

#### Scenario: Navegar a otro periodo mensual

- **WHEN** el usuario cambia el periodo seleccionado en el historial
- **THEN** el sistema muestra los Registros de Tiempo correspondientes al nuevo periodo

### Requirement: Total de tiempo por Tarea

El sistema SHALL calcular y mostrar el total de tiempo acumulado por Tarea, mostrando `0` cuando la Tarea no tenga Registros de Tiempo.

#### Scenario: Total de una Tarea sin Registros de Tiempo

- **WHEN** una Tarea no tiene ningún Registro de Tiempo asociado
- **THEN** el sistema muestra su total acumulado como `0`

### Requirement: Total de tiempo por Proyecto

El sistema SHALL calcular y mostrar el total de tiempo acumulado por Proyecto, como la suma de los totales de sus Tareas, mostrando `0` cuando el Proyecto no tenga Registros de Tiempo. El sistema SHALL mostrar este total en la pantalla "Proyectos" para cada Proyecto.

#### Scenario: Total de un Proyecto con Tareas

- **WHEN** un Proyecto tiene Tareas con Registros de Tiempo
- **THEN** el sistema muestra el total del Proyecto como la suma de los totales de esas Tareas

### Requirement: Total de tiempo por mes

El sistema SHALL calcular y mostrar el total de tiempo acumulado por mes, mostrando `0` cuando no existan Registros de Tiempo en el mes seleccionado.

#### Scenario: Total de un mes sin Registros de Tiempo

- **WHEN** no existen Registros de Tiempo en el mes seleccionado
- **THEN** el sistema muestra el total de ese mes como `0`

### Requirement: Totales semanal y mensual en el panel de Tareas

El sistema SHALL mostrar en el panel principal de "Tareas" los totales "Total semanal" y "Total mensual" acumulados.

#### Scenario: Ver los totales en el panel de Tareas

- **WHEN** el usuario abre la pantalla "Tareas"
- **THEN** el sistema muestra el "Total semanal" y el "Total mensual" acumulados

### Requirement: Meta semanal fija

La meta semanal SHALL ser un valor fijo de 40 horas (8 horas × 5 días laborables), no configurable por el usuario.

#### Scenario: La meta semanal es siempre 40 horas

- **WHEN** el sistema calcula el avance semanal del usuario
- **THEN** usa 40 horas como meta, sin ofrecer ninguna forma de configurarla

### Requirement: Porcentaje de avance hacia la meta semanal

El sistema SHALL calcular el porcentaje de avance hacia la meta semanal como (Total semanal ÷ 40 horas) × 100, mostrando como máximo 100% aunque el Total semanal supere las 40 horas, y SHALL mostrar este porcentaje en el panel principal de "Tareas".

#### Scenario: Porcentaje por debajo de la meta

- **WHEN** el Total semanal es menor a 40 horas
- **THEN** el sistema muestra el porcentaje exacto de avance hacia la meta

#### Scenario: Porcentaje capado al superar la meta

- **WHEN** el Total semanal es mayor a 40 horas
- **THEN** el sistema muestra el porcentaje de avance como 100%, sin superarlo

### Requirement: Rendimiento de la visualización de reportes

El sistema SHALL cargar la visualización de reportes de tiempo (por Tarea, Proyecto y mes) en menos de 2 segundos para un volumen de hasta 1000 Registros de Tiempo.

#### Scenario: Carga de reportes con 1000 Registros de Tiempo

- **WHEN** existen hasta 1000 Registros de Tiempo almacenados
- **THEN** la visualización de los reportes (historial, totales) carga en menos de 2 segundos
