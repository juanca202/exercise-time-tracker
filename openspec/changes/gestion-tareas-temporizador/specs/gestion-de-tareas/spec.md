## ADDED Requirements

### Requirement: Crear Tarea asociada a un Proyecto existente

El sistema SHALL permitir crear una Tarea proporcionando un Nombre y asociándola obligatoriamente a un Proyecto ya existente (BR-01).

#### Scenario: Creación exitosa de Tarea con Proyecto y Nombre válidos

- **WHEN** el usuario abre el modal "Nueva Tarea", selecciona un Proyecto existente (p. ej. "Proyecto Alpha"), ingresa un Nombre no vacío (p. ej. "Diseñar wireframes") y confirma la creación
- **THEN** el sistema crea la Tarea, la asocia al Proyecto seleccionado, cierra el modal y la muestra en el listado "Tareas Recientes"

### Requirement: Rechazar creación de Tarea sin Proyecto o sin Nombre

El sistema SHALL NOT permitir crear una Tarea sin un Proyecto asociado o sin Nombre (BR-01).

#### Scenario: Intento de crear Tarea sin seleccionar Proyecto

- **WHEN** el usuario ingresa un Nombre válido pero deja el campo Proyecto sin seleccionar y confirma la creación
- **THEN** el sistema NO crea la Tarea, mantiene el modal abierto e indica que el Proyecto es obligatorio

#### Scenario: Intento de crear Tarea sin Nombre

- **WHEN** el usuario selecciona un Proyecto existente pero deja el campo Nombre vacío y confirma la creación
- **THEN** el sistema NO crea la Tarea, mantiene el modal abierto e indica que el Nombre es obligatorio

### Requirement: Persistir datos de la Tarea en almacenamiento local

El sistema SHALL persistir los datos de la Tarea, incluyendo su asociación al Proyecto, en el almacenamiento local del dispositivo.

#### Scenario: La Tarea persiste tras recargar la aplicación

- **WHEN** se crea la Tarea "Diseñar wireframes" asociada a "Proyecto Alpha" y luego se recarga la aplicación (F5) sin backend disponible
- **THEN** el listado de Tareas Recientes reconstruido desde el almacenamiento local sigue mostrando "Diseñar wireframes" con su asociación intacta a "Proyecto Alpha"

### Requirement: Editar el Nombre de una Tarea existente reutilizando el modal de creación

El sistema SHALL permitir editar el Nombre de una Tarea existente en cualquier momento, reutilizando el mismo modal de creación ("Nueva Tarea") precargado con los datos existentes de la Tarea, cambiando el título y la etiqueta del botón principal a "Editar Tarea" (AC-004).

#### Scenario: Edición exitosa del Nombre de una Tarea

- **WHEN** el usuario selecciona la acción de editar sobre la Tarea "Diseñar wireframes", el modal se abre precargado con Proyecto "Proyecto Alpha" y Nombre "Diseñar wireframes" mostrando título/botón "Editar Tarea", modifica el Nombre a "Diseñar wireframes de alta fidelidad" y confirma
- **THEN** el sistema actualiza la Tarea con el nuevo Nombre, cierra el modal y el listado muestra "Diseñar wireframes de alta fidelidad" manteniendo la misma asociación al Proyecto "Proyecto Alpha"

### Requirement: Adherencia al sistema de diseño DESIGN.md

La interfaz SHALL implementar el diseño de la pantalla de Tareas (panel principal) y el del modal de creación/edición de Tareas definidos en el prototipo Figma de referencia, adhiriéndose al sistema de diseño DESIGN.md (tema Precision Focus).

#### Scenario: La pantalla de Tareas y el modal usan los tokens del tema Precision Focus

- **WHEN** el usuario navega al panel principal de Tareas y abre el modal "Nueva Tarea"
- **THEN** todos los componentes visibles (listado, temporizador, ingreso manual, widgets de meta semanal, modal) usan exclusivamente los tokens de color, tipografía y espaciado definidos en DESIGN.md, sin estilos ad-hoc que los contradigan

### Requirement: Fidelidad visual respecto al prototipo Figma

La implementación de la pantalla de Tareas (panel principal) y del modal de creación/edición de Tareas SHALL ser visualmente fiel (layout, colores, tipografía, espaciado y componentes) al prototipo de alta fidelidad en Figma referenciado.

#### Scenario: Comparación pixel-a-pixel de la pantalla de Tareas

- **WHEN** se captura una imagen de la pantalla de Tareas implementada, poblada con datos de ejemplo, y se compara contra el diseño de referencia en Figma
- **THEN** el layout, los colores, la tipografía, el espaciado y los componentes coinciden con el prototipo, sin diferencias visuales relevantes

#### Scenario: Comparación pixel-a-pixel del modal Nueva Tarea

- **WHEN** se captura una imagen del modal "Nueva Tarea" implementado y se compara contra el diseño de referencia en Figma
- **THEN** el layout, los colores, la tipografía, el espaciado y los componentes coinciden con el prototipo, sin diferencias visuales relevantes
