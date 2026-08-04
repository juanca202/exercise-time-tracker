## Purpose

Gestionar el ciclo de vida completo de un Proyecto: la agrupación lógica de nivel superior del dominio de Time Tracker de la que dependen las Tareas y, por lo tanto, los Registros de Tiempo. Cubre la creación, edición, eliminación (con regla de bloqueo cuando existen Tareas asociadas) y visualización de Proyectos, con persistencia local del dispositivo.

## Requirements

### Requirement: Crear Proyecto

El sistema SHALL permitir crear un Proyecto ingresando un Nombre obligatorio y una Descripción opcional.

#### Scenario: Crear Proyecto con Nombre y Descripción

- **WHEN** el usuario envía el formulario de creación con un Nombre no vacío y una Descripción
- **THEN** el sistema crea el Proyecto con ambos valores

#### Scenario: Rechazar creación sin Nombre

- **WHEN** el usuario intenta crear un Proyecto sin ingresar un Nombre
- **THEN** el sistema rechaza la creación y no persiste ningún Proyecto

### Requirement: Persistencia local del Proyecto

El sistema SHALL almacenar los datos del Proyecto en el almacenamiento local del dispositivo, y SHALL recuperarlos de forma consistente tras un reinicio de la aplicación o un cierre inesperado.

#### Scenario: El Proyecto persiste tras recargar la aplicación

- **WHEN** el usuario crea, edita o elimina un Proyecto y luego recarga la aplicación
- **THEN** el estado de los Proyectos reflejado coincide con la última operación realizada

### Requirement: Editar Proyecto

El sistema SHALL permitir editar el Nombre y/o la Descripción de un Proyecto existente.

#### Scenario: Editar Nombre y Descripción de un Proyecto

- **WHEN** el usuario modifica el Nombre y/o la Descripción de un Proyecto existente y confirma
- **THEN** el sistema actualiza el Proyecto con los nuevos valores

### Requirement: Eliminar Proyecto sin Tareas asociadas

El sistema SHALL permitir eliminar un Proyecto que no tenga Tareas asociadas.

#### Scenario: Eliminar un Proyecto sin Tareas

- **WHEN** el usuario elimina un Proyecto que no tiene ninguna Tarea asociada
- **THEN** el sistema elimina el Proyecto sin restricciones

### Requirement: Bloqueo de eliminación de Proyecto con Tareas asociadas

El sistema SHALL NOT eliminar un Proyecto que tenga una o más Tareas asociadas, y SHALL informar al usuario el motivo del bloqueo.

#### Scenario: Bloquear eliminación de un Proyecto con Tareas

- **WHEN** el usuario intenta eliminar un Proyecto que tiene una o más Tareas asociadas
- **THEN** el sistema impide la eliminación y muestra un aviso indicando que el Proyecto tiene Tareas asociadas

### Requirement: Listado de Proyectos

El sistema SHALL mostrar en la pantalla "Proyectos" el listado de Proyectos existentes con su Nombre y Descripción, ofrecer acciones para editar y eliminar cada uno, y SHALL pintar la barra lateral izquierda de cada tarjeta con un color derivado del Nombre del Proyecto mediante la utilidad de color desde string.

#### Scenario: Listar Proyectos existentes

- **WHEN** el usuario abre la pantalla "Proyectos"
- **THEN** el sistema muestra cada Proyecto con su Nombre, Descripción, y acciones de editar y eliminar

#### Scenario: Barra lateral con color derivado del nombre

- **WHEN** el usuario ve la tarjeta de un Proyecto
- **THEN** la barra lateral izquierda de esa tarjeta usa el color calculado a partir del Nombre del Proyecto

### Requirement: Adherencia al sistema de diseño

El sistema SHALL adherirse a la paleta de colores, tipografía, espaciado y patrones de componentes de `DESIGN.md` (tema Precision Focus) en la pantalla de Proyectos.

#### Scenario: La pantalla de Proyectos usa los tokens del sistema de diseño

- **WHEN** se renderiza la pantalla "Proyectos"
- **THEN** los estilos aplicados corresponden a los tokens definidos en `DESIGN.md`
