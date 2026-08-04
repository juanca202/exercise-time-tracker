## ADDED Requirements

### Requirement: Crear Tarea asociada a un Proyecto

El sistema SHALL requerir que toda Tarea se asocie, en el momento de su creación, a un Proyecto existente seleccionado por el usuario, y SHALL requerir un Nombre para la Tarea. El sistema SHALL almacenar la Tarea en el almacenamiento local, incluyendo la referencia a su Proyecto asociado.

#### Scenario: Crear una Tarea con Proyecto y Nombre válidos

- **WHEN** el usuario selecciona un Proyecto existente e ingresa un Nombre no vacío para la nueva Tarea
- **THEN** el sistema crea la Tarea asociada a ese Proyecto

#### Scenario: Rechazar creación sin Proyecto o sin Nombre

- **WHEN** el usuario intenta crear una Tarea sin seleccionar un Proyecto o sin ingresar un Nombre
- **THEN** el sistema rechaza la creación y no persiste ninguna Tarea

### Requirement: Editar Tarea

El sistema SHALL permitir editar el Nombre de una Tarea existente y/o reasignarla a otro Proyecto existente. Al reasignar, el sistema SHALL validar que el Proyecto seleccionado exista.

#### Scenario: Editar el Nombre de una Tarea

- **WHEN** el usuario modifica el Nombre de una Tarea existente y confirma
- **THEN** el sistema actualiza la Tarea con el nuevo Nombre

#### Scenario: Reasignar una Tarea a otro Proyecto existente

- **WHEN** el usuario reasigna una Tarea a un Proyecto distinto que existe
- **THEN** el sistema actualiza la referencia de Proyecto de la Tarea

#### Scenario: Rechazar reasignación a un Proyecto inexistente

- **WHEN** el usuario intenta reasignar una Tarea a un Proyecto que no existe
- **THEN** el sistema rechaza la operación y conserva el Proyecto original de la Tarea

### Requirement: Eliminar Tarea sin Registros de Tiempo asociados

El sistema SHALL permitir eliminar una Tarea que no tenga Registros de Tiempo asociados.

#### Scenario: Eliminar una Tarea sin Registros de Tiempo

- **WHEN** el usuario elimina una Tarea que no tiene ningún Registro de Tiempo asociado
- **THEN** el sistema elimina la Tarea sin restricciones

### Requirement: Bloqueo de eliminación de Tarea con Registros de Tiempo asociados

El sistema SHALL NOT eliminar una Tarea que tenga uno o más Registros de Tiempo asociados, y SHALL informar al usuario el motivo del bloqueo.

#### Scenario: Bloquear eliminación de una Tarea con Registros de Tiempo

- **WHEN** el usuario intenta eliminar una Tarea que tiene uno o más Registros de Tiempo asociados
- **THEN** el sistema impide la eliminación y muestra un aviso indicando que la Tarea tiene Registros de Tiempo asociados

### Requirement: Listado de Tareas Recientes

El sistema SHALL mostrar en la pantalla "Tareas" un listado de "Tareas Recientes" con el nombre de cada Tarea, su Proyecto asociado, y acciones para editarla y eliminarla.

#### Scenario: Listar Tareas Recientes

- **WHEN** el usuario abre la pantalla "Tareas"
- **THEN** el sistema muestra cada Tarea reciente con su Nombre, su Proyecto asociado, y acciones de editar y eliminar

### Requirement: Persistencia consistente de Tareas

El sistema SHALL recuperar de forma consistente las Tareas y su asociación al Proyecto —incluyendo ediciones y eliminaciones— tras un reinicio de la aplicación o un cierre inesperado.

#### Scenario: Las Tareas persisten tras recargar la aplicación

- **WHEN** el usuario crea, edita o elimina una Tarea y luego recarga la aplicación
- **THEN** el estado de las Tareas reflejado coincide con la última operación realizada
