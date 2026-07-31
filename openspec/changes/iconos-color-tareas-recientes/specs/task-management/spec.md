## MODIFIED Requirements

### Requirement: Listado de Tareas Recientes

El sistema SHALL mostrar en la pantalla "Tareas" un listado de "Tareas Recientes" con el nombre de cada Tarea, su Proyecto asociado, un icono decorativo a la izquierda cuyo fondo se deriva del Nombre de la Tarea mediante la utilidad de color desde string, y acciones para editarla y eliminarla.

#### Scenario: Listar Tareas Recientes

- **WHEN** el usuario abre la pantalla "Tareas"
- **THEN** el sistema muestra cada Tarea reciente con su Nombre, su Proyecto asociado, y acciones de editar y eliminar

#### Scenario: Icono con fondo derivado del nombre

- **WHEN** el usuario ve una Tarea en "Tareas Recientes"
- **THEN** la fila muestra un cuadro de icono a la izquierda con fondo calculado a partir del Nombre de esa Tarea, de forma consistente con el prototipo de Figma (nodo 1:1452)
