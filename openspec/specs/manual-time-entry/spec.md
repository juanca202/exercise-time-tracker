## Purpose

Registrar tiempo de forma diferida sobre una Tarea dentro del dominio de Time Tracker, para los casos en que el usuario no utilizó el temporizador en tiempo real. Cubre la creación de un Registro de Tiempo manual mediante el formulario "Entrada Manual" (Tarea, Fecha y Duración), la validación de que la Duración ingresada sea mayor que cero, y la persistencia local de los Registros de Tiempo manuales.

## Requirements

### Requirement: Crear Registro de Tiempo manual

El sistema SHALL permitir crear un Registro de Tiempo manual para una Tarea, ingresando la Tarea (asociada a su Proyecto), la Fecha y la Duración. El sistema SHALL persistir el Registro de Tiempo manual en el almacenamiento local.

#### Scenario: Crear un Registro de Tiempo manual válido

- **WHEN** el usuario ingresa una Tarea existente, una Fecha y una Duración mayor que cero, y confirma
- **THEN** el sistema persiste el Registro de Tiempo con esos datos

### Requirement: Validación de duración positiva en el registro manual

El sistema SHALL validar que la Duración ingresada manualmente sea mayor que cero.

#### Scenario: Rechazar duración manual menor o igual a cero

- **WHEN** el usuario ingresa una Duración menor o igual a cero en el formulario de entrada manual
- **THEN** el sistema rechaza el registro y no persiste ningún Registro de Tiempo

### Requirement: Formulario de Entrada Manual

El sistema SHALL presentar un formulario "Entrada Manual" con los campos Fecha, Proyecto/Tarea y Duración, y una acción "Guardar Registro".

#### Scenario: El formulario expone los campos requeridos

- **WHEN** el usuario abre el panel de "Entrada Manual"
- **THEN** el sistema muestra los campos Fecha, Proyecto/Tarea, Duración, y la acción "Guardar Registro"

### Requirement: Persistencia consistente de Registros de Tiempo manuales

El sistema SHALL recuperar de forma consistente los Registros de Tiempo manuales tras un reinicio de la aplicación o un cierre inesperado.

#### Scenario: Los Registros de Tiempo manuales persisten tras recargar la aplicación

- **WHEN** el usuario crea un Registro de Tiempo manual y luego recarga la aplicación
- **THEN** el Registro de Tiempo sigue presente con los mismos datos
</content>
