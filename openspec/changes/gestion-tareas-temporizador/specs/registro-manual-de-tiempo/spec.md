## ADDED Requirements

### Requirement: Crear Registro de Tiempo manual para una Tarea

El sistema SHALL permitir al usuario crear un Registro de Tiempo manual para una Tarea, ingresando la Tarea, la Fecha y la Duración (AC-013).

#### Scenario: Creación exitosa de un Registro de Tiempo manual

- **WHEN** el usuario abre el formulario de ingreso manual de tiempo, selecciona la Tarea "Diseñar wireframes", ingresa Fecha 2026-07-10 y Duración 1h 30min, y confirma
- **THEN** el sistema crea el Registro de Tiempo manual para "Diseñar wireframes" con Fecha 2026-07-10 y Duración 1h 30min, visible en la información de la Tarea/historial

### Requirement: Validar que la Duración ingresada manualmente sea mayor que cero

El sistema SHALL validar que la Duración ingresada manualmente sea mayor que cero (BR-04), rechazando el registro en caso contrario.

#### Scenario: Rechazo de Duración manual igual a cero o negativa

- **WHEN** el usuario selecciona una Tarea existente, ingresa una Fecha válida y una Duración de 0 minutos (o, alternativamente, -30 minutos si el campo lo permite ingresar), e intenta confirmar el registro
- **THEN** el sistema NO crea el Registro de Tiempo en ningún caso e informa que la Duración debe ser mayor que cero

#### Scenario: Aceptación del valor positivo mínimo de Duración

- **WHEN** el usuario selecciona una Tarea existente, ingresa una Fecha válida y la Duración positiva más pequeña permitida por la granularidad del campo (p. ej. 1 minuto), y confirma el registro
- **THEN** el sistema crea el Registro de Tiempo manual con esa Duración, por ser un valor mayor que cero

### Requirement: Persistir el Registro de Tiempo manual en el almacenamiento local

El sistema SHALL persistir el Registro de Tiempo manual en el almacenamiento local del dispositivo (AC-015).

#### Scenario: El Registro de Tiempo manual persiste tras recargar la aplicación

- **WHEN** se crea el Registro de Tiempo manual para "Diseñar wireframes" (Fecha 2026-07-10, Duración 1h 30min) y luego se recarga la aplicación (F5) sin backend disponible
- **THEN** el Registro de Tiempo manual permanece disponible en la información de la Tarea "Diseñar wireframes" con sus datos originales, confirmando su persistencia en el almacenamiento local
