## ADDED Requirements

### Requirement: Iniciar un cronómetro para una Tarea específica

El sistema SHALL permitir al usuario iniciar un cronómetro para una Tarea específica seleccionándola desde la lista de Tareas (el ícono ▷ junto a cada Tarea), almacenando localmente el estado "En Ejecución", la hora de inicio, y el identificador de la Tarea. (US-002 AC-006)

#### Escenario: Iniciar cronómetro desde la lista de tareas

- **CUANDO** el usuario hace clic en el ícono ▷ junto a una Tarea que no tiene cronómetro activo
- **ENTONCES** el sistema inicia un cronómetro para esa Tarea, almacenando su hora de inicio y marcándola como en ejecución

### Requirement: Un solo cronómetro activo a la vez, con auto-detención

El sistema SHALL permitir solo un (1) cronómetro activo a nivel de toda la app. Si el usuario inicia un cronómetro mientras otro está activo en una Tarea distinta, el sistema SHALL detener automáticamente el cronómetro anterior, calcular y persistir su Registro de Tiempo, antes de iniciar el nuevo. (US-002 AC-007, BR-02, BR-03)

#### Escenario: Iniciar un nuevo cronómetro auto-detiene el anterior

- **CUANDO** hay un cronómetro corriendo para la Tarea A y el usuario inicia un cronómetro para la Tarea B
- **ENTONCES** el sistema detiene el cronómetro de la Tarea A, calcula y persiste su Duración como un Registro de Tiempo, e inicia el cronómetro de la Tarea B como "En Ejecución"

### Requirement: Detener el cronómetro activo y calcular la duración

El sistema SHALL permitir al usuario detener el cronómetro activo, registrando la Hora de Fin y calculando la Duración como Hora de Fin menos Hora de Inicio. (US-002 AC-008)

#### Escenario: Detener cronómetro activo

- **CUANDO** el usuario hace clic en "Detener Sesión" mientras un cronómetro está activo
- **ENTONCES** el sistema registra la Hora de Fin y calcula la Duración desde la Hora de Inicio hasta la Hora de Fin

### Requirement: Rechazar una duración calculada de cero o negativa

El sistema SHALL validar que una Duración calculada al detener un cronómetro sea mayor a cero antes de persistir el Registro de Tiempo resultante. (US-002 AC-009, BR-04)

#### Escenario: La duración calculada es cero

- **CUANDO** el cronómetro se detiene en el mismo instante en que se inició, produciendo una Duración calculada de cero
- **ENTONCES** el sistema no persiste un Registro de Tiempo con Duración cero

### Requirement: Persistir inmediatamente los Registros de Tiempo generados por el cronómetro

El sistema SHALL persistir en el almacenamiento local, de forma inmediata, el Registro de Tiempo generado cuando se detiene un cronómetro. (US-002 AC-010)

#### Escenario: El registro persiste después de detener

- **CUANDO** el usuario detiene un cronómetro activo con una Duración válida (>0)
- **ENTONCES** el Registro de Tiempo resultante está presente en el almacenamiento local inmediatamente después de la acción de detener, sin requerir ninguna acción adicional del usuario

### Requirement: Mostrar el estado actual del cronómetro

La interfaz SHALL mostrar claramente el estado del cronómetro (activo/inactivo) y la Tarea con la que está asociado. (US-002 AC-011)

#### Escenario: El cronómetro activo es visible

- **CUANDO** hay un cronómetro corriendo para una Tarea
- **ENTONCES** la pantalla de Tareas muestra el estado en ejecución, el nombre de la Tarea asociada, y el tiempo transcurrido

### Requirement: Las acciones del cronómetro se completan en menos de 1 segundo

El sistema SHALL iniciar un cronómetro, y SHALL detenerlo y persistir el Registro de Tiempo resultante, en menos de 1 segundo desde la acción del usuario. (US-002 AC-012)

#### Escenario: Capacidad de respuesta al iniciar/detener

- **CUANDO** el usuario inicia o detiene un cronómetro
- **ENTONCES** el cambio de estado correspondiente y la persistencia se completan en menos de 1 segundo

### Requirement: Crear un Registro de Tiempo manual

El sistema SHALL permitir al usuario crear un Registro de Tiempo manual para una Tarea ingresando la Tarea, la Fecha, y la Duración, sin usar el cronómetro. (US-002 AC-013)

#### Escenario: Entrada manual con datos válidos

- **CUANDO** el usuario envía el formulario "Entrada Manual" con una Tarea, una Fecha, y una Duración mayor a cero
- **ENTONCES** el sistema crea un Registro de Tiempo con esos valores

### Requirement: Rechazar una duración ingresada manualmente que sea inválida

El sistema SHALL validar que una Duración ingresada manualmente sea mayor a cero, rechazando el registro en caso contrario. (US-002 AC-014, BR-04)

#### Escenario: La duración manual es cero o negativa

- **CUANDO** el usuario envía el formulario "Entrada Manual" con una Duración de cero (o un valor no positivo equivalente)
- **ENTONCES** el sistema bloquea el envío y no crea un Registro de Tiempo

### Requirement: Persistir localmente los Registros de Tiempo manuales

El sistema SHALL persistir un Registro de Tiempo ingresado manualmente en el almacenamiento local del dispositivo. (US-002 AC-015)

#### Escenario: El registro manual sobrevive al reload

- **CUANDO** el usuario crea un Registro de Tiempo manual y luego recarga la aplicación
- **ENTONCES** el Registro de Tiempo sigue presente con la misma Tarea, Fecha y Duración

### Requirement: Meta Semanal fija de 40 horas

El sistema SHALL calcular la Meta Semanal como un valor fijo de 40 horas (8 horas × 5 días laborables), no configurable por el usuario. (US-002 AC-017, BR-05)

#### Escenario: La Meta Semanal siempre es de 40 horas

- **CUANDO** se muestra la Meta Semanal en la pantalla de Tareas
- **ENTONCES** su valor es de 40 horas sin importar ningún Registro de Tiempo existente o configuración del usuario

### Requirement: Total Semanal acotado a la semana laboral actual (lunes-viernes)

El sistema SHALL calcular y mostrar el Total Semanal sumando los Registros de Tiempo (del cronómetro y de entradas manuales) generados durante la semana laboral actual, definida como lunes a viernes, hora local. Los Registros de Tiempo fechados en sábado o domingo SHALL NOT ser incluidos en el Total Semanal. (US-002 AC-018, BR-05)

#### Escenario: El Total Semanal suma los registros de la semana laboral

- **CUANDO** existen Registros de Tiempo con fechas dentro del rango lunes-viernes actual
- **ENTONCES** el Total Semanal es igual a la suma de sus Duraciones

#### Escenario: Semana anterior excluida

- **CUANDO** la fecha de un Registro de Tiempo cae en la semana calendario anterior a la semana laboral actual
- **ENTONCES** la Duración de ese Registro de Tiempo no se incluye en el Total Semanal

#### Escenario: Fin de semana excluido

- **CUANDO** la fecha de un Registro de Tiempo cae en sábado o domingo dentro de la semana calendario actual
- **ENTONCES** la Duración de ese Registro de Tiempo no se incluye en el Total Semanal

### Requirement: Porcentaje de la Meta Semanal

El sistema SHALL mostrar el porcentaje alcanzado de la Meta Semanal, calculado como (Total Semanal ÷ Meta Semanal) × 100. (US-002 AC-019)

#### Escenario: Porcentaje por debajo de la meta

- **CUANDO** el Total Semanal es menor a la Meta Semanal de 40 horas
- **ENTONCES** el porcentaje mostrado es (Total Semanal ÷ 40h) × 100, por debajo del 100%

#### Escenario: Porcentaje por encima de la meta

- **CUANDO** el Total Semanal excede la Meta Semanal de 40 horas
- **ENTONCES** el porcentaje mostrado excede el 100%, sin ser capado
