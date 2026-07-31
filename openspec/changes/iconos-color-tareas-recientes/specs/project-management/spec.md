## MODIFIED Requirements

### Requirement: Listado de Proyectos

El sistema SHALL mostrar en la pantalla "Proyectos" el listado de Proyectos existentes con su Nombre y Descripción, ofrecer acciones para editar y eliminar cada uno, y SHALL pintar la barra lateral izquierda de cada tarjeta con un color derivado del Nombre del Proyecto mediante la utilidad de color desde string.

#### Scenario: Listar Proyectos existentes

- **WHEN** el usuario abre la pantalla "Proyectos"
- **THEN** el sistema muestra cada Proyecto con su Nombre, Descripción, y acciones de editar y eliminar

#### Scenario: Barra lateral con color derivado del nombre

- **WHEN** el usuario ve la tarjeta de un Proyecto
- **THEN** la barra lateral izquierda de esa tarjeta usa el color calculado a partir del Nombre del Proyecto
