## ADDED Requirements

### Requirement: Meta Semanal fija de 40 horas, no configurable

El sistema SHALL calcular la Meta Semanal como un valor fijo de 40 horas (8 horas × 5 días laborales), sin que sea configurable por el usuario (BR-05, AC-017).

#### Scenario: La Meta Semanal siempre muestra 40 horas sin control de edición

- **WHEN** el usuario observa el widget "Meta semanal" en el panel principal de Tareas, con o sin Registros de Tiempo previos
- **THEN** el widget muestra 40 horas como meta, sin ningún control de edición o configuración visible, independientemente de los Registros de Tiempo existentes

### Requirement: Cálculo y visualización del Total Semanal (Lunes a Viernes de la semana en curso)

El sistema SHALL calcular y mostrar el Total Semanal de tiempo acumulado, sumando los Registros de Tiempo (por temporizador y manuales) generados durante la semana laboral en curso (Lunes a Viernes, hora local); los Registros de Tiempo del Sábado o Domingo, si existieran, NO DEBEN incluirse en el Total Semanal (BR-05, AC-018, decisión de [RS-001](../../../../docs/specs/user-stories/US-002-tareas/research/RS-001-inicio-semana-total-semanal.md)).

#### Scenario: Suma correcta de Registros de Tiempo dentro de la semana laboral en curso

- **WHEN** la fecha actual es Lunes 2026-07-13 (semana laboral en curso: 2026-07-13 a 2026-07-17) y existen un Registro por temporizador de 2h el 2026-07-13 y un Registro manual de 1h 30min el 2026-07-14
- **THEN** el sistema calcula el Total Semanal como 3h 30min y lo muestra en el stat card "Total Semanal" del panel principal de Tareas

#### Scenario: Exclusión de un Registro de la semana calendario anterior

- **WHEN** la fecha actual es Lunes 2026-07-13 (semana laboral en curso: 2026-07-13 a 2026-07-17) y existen un Registro manual de 2h con fecha Domingo 2026-07-12 (semana anterior) y un Registro manual de 1h con fecha Lunes 2026-07-13
- **THEN** el sistema excluye el Registro del 2026-07-12 por pertenecer a la semana calendario anterior y muestra un Total Semanal de 1h

#### Scenario: Exclusión de Registros de Sábado y Domingo dentro del rango calendario de la semana actual

- **WHEN** la fecha actual es Lunes 2026-07-13 (semana laboral en curso: 2026-07-13 a 2026-07-17) y existen un Registro manual de 3h el Lunes 2026-07-13, un Registro manual de 4h el Sábado 2026-07-18 y un Registro manual de 2h el Domingo 2026-07-19
- **THEN** el sistema excluye los Registros del Sábado 2026-07-18 y del Domingo 2026-07-19 por caer fuera del rango Lunes-Viernes, y muestra un Total Semanal de 3h

### Requirement: Porcentaje alcanzado de la Meta Semanal

El sistema SHALL mostrar el porcentaje alcanzado de la Meta Semanal, calculado como (Total Semanal ÷ Meta Semanal) × 100 (AC-019).

#### Scenario: Cálculo del porcentaje por debajo de la meta

- **WHEN** el Total Semanal acumulado de la semana en curso es 20 horas y la Meta Semanal es 40 horas
- **THEN** el sistema calcula el porcentaje como (20 ÷ 40) × 100 y muestra 50% en el widget "Meta semanal"

#### Scenario: Cálculo del porcentaje por encima del 100% sin truncar

- **WHEN** el Total Semanal acumulado de la semana en curso es 44 horas (producto de Registros por temporizador y manuales) y la Meta Semanal es 40 horas
- **THEN** el sistema calcula el porcentaje como (44 ÷ 40) × 100 y muestra 110% (o una representación visual equivalente) en el widget "Meta semanal", sin ocultar ni truncar artificialmente el valor a 100%
