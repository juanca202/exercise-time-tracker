## ADDED Requirements

### Requirement: Mostrar el historial completo de Time Records

El sistema SHALL leer y mostrar en la interfaz el historial completo de todos los Time Records almacenados. (US-003 AC-001)

#### Escenario: El historial lista todos los registros

- **CUANDO** el usuario navega a la pantalla de Historial de registros y existen Time Records
- **ENTONCES** todos los Time Records almacenados se muestran en la tabla del historial

#### Escenario: Historial vacío

- **CUANDO** el usuario navega a la pantalla de Historial de registros y no existe ningún Time Record
- **ENTONCES** el sistema muestra un estado de historial vacío en lugar de filas de tabla

### Requirement: Total de tiempo por Tarea

El sistema SHALL calcular y mostrar el total de tiempo acumulado por Tarea. (US-003 AC-002)

#### Escenario: El total de la Tarea suma sus registros

- **CUANDO** existen dos o más Time Records para la misma Tarea
- **ENTONCES** el total mostrado para esa Tarea equivale a la suma de sus Duraciones

#### Escenario: Tarea sin registros

- **CUANDO** una Tarea no tiene Time Records
- **ENTONCES** su total es cero

### Requirement: Total de tiempo por Proyecto

El sistema SHALL calcular y mostrar el total de tiempo acumulado por Proyecto, sumando los totales de todas sus Tareas. (US-003 AC-003)

#### Escenario: El total del Proyecto suma los totales de sus tareas

- **CUANDO** un Proyecto tiene dos o más Tareas, cada una con Time Records
- **ENTONCES** el total del Proyecto equivale a la suma de los totales de todas sus Tareas

#### Escenario: Proyecto sin tiempo registrado

- **CUANDO** las Tareas de un Proyecto no tienen Time Records
- **ENTONCES** el total del Proyecto es cero

### Requirement: Total de tiempo por mes

El sistema SHALL calcular y mostrar el total de tiempo acumulado por mes. Cuando un Time Record generado por el timer cruza la medianoche del último día de un mes, su Duración completa SHALL contarse en el mes correspondiente a la Hora de Inicio del registro, sin prorratear entre los dos meses. (US-003 AC-004)

#### Escenario: Registros dentro de un único mes

- **CUANDO** existen Time Records con fechas enteramente dentro de un mes calendario
- **ENTONCES** el total de ese mes equivale a la suma de sus Duraciones

#### Escenario: Un registro de timer cruza un límite de mes

- **CUANDO** un Time Record generado por el timer tiene una Hora de Inicio en un mes y una Hora de Fin en el mes siguiente
- **ENTONCES** su Duración completa se cuenta en el mes de la Hora de Inicio, y nada de ella se cuenta en el mes de la Hora de Fin

### Requirement: Los reportes cargan en menos de 2 segundos para hasta 1.000 registros

La visualización de los reportes de tiempo (por Tarea, Proyecto y mes) SHALL cargar en menos de 2 segundos para un volumen de hasta 1.000 Time Records. (US-003 AC-005)

#### Escenario: Tiempo de carga dentro del presupuesto

- **CUANDO** la pantalla de Historial de registros se abre con 1.000 Time Records almacenados
- **ENTONCES** el listado del historial y todos los totales se renderizan por completo en menos de 2 segundos

### Requirement: La pantalla de historial coincide con el sistema de diseño

La pantalla de Historial de registros SHALL cumplir con el sistema de diseño "Precision Focus" de DESIGN.md. (US-003 AC-006)

#### Escenario: Tokens de diseño aplicados

- **CUANDO** se renderiza la pantalla de Historial de registros
- **ENTONCES** los tokens de color, tipografía y espaciado coinciden con el tema Precision Focus de DESIGN.md

### Requirement: La pantalla de historial coincide con el prototipo de Figma

La implementación de la pantalla de Historial de registros SHALL ser visualmente fiel (layout, colores, tipografía, espaciado, componentes) al prototipo de Figma de alta fidelidad referenciado. (US-003 AC-007)

#### Escenario: Revisión visual contra Figma

- **CUANDO** la pantalla implementada de Historial de registros se compara contra el frame de Figma "Historial de registros"
- **ENTONCES** el layout, los colores, la tipografía, el espaciado y los componentes coinciden
