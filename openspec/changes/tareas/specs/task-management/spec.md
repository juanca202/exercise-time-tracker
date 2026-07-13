## ADDED Requirements

### Requirement: Crear Tarea bajo un Proyecto

El sistema SHALL permitir al usuario crear una Tarea seleccionando un Proyecto existente y proporcionando un Nombre; una Tarea sin un Proyecto asociado o sin Nombre SHALL ser rechazada. (US-002 AC-001, AC-002, BR-01)

#### Escenario: Crear tarea con proyecto y nombre

- **CUANDO** el usuario envía el formulario "Nueva Tarea" con un Proyecto existente seleccionado y un Nombre no vacío
- **ENTONCES** el sistema crea la Tarea asociada a ese Proyecto

#### Escenario: Rechazar tarea sin proyecto

- **CUANDO** el usuario envía el formulario "Nueva Tarea" sin seleccionar un Proyecto
- **ENTONCES** el sistema bloquea el envío y no crea la Tarea

#### Escenario: Rechazar tarea sin nombre

- **CUANDO** el usuario envía el formulario "Nueva Tarea" con un Proyecto seleccionado pero con el Nombre vacío
- **ENTONCES** el sistema bloquea el envío y no crea la Tarea

### Requirement: Persistir Tareas localmente

El sistema SHALL persistir cada Tarea creada o editada, incluyendo su asociación a un Proyecto, en el almacenamiento local del dispositivo. (US-002 AC-003)

#### Escenario: La tarea sobrevive al reload

- **CUANDO** el usuario crea una Tarea y luego recarga la aplicación
- **ENTONCES** la Tarea sigue presente con el mismo Nombre y la misma asociación de Proyecto

### Requirement: Editar Tarea

El sistema SHALL permitir al usuario editar el Nombre de una Tarea existente en cualquier momento, reutilizando el modal "Nueva Tarea" precargado con los datos actuales de la Tarea, con su título y la etiqueta del botón principal cambiados a "Editar Tarea". (US-002 AC-004)

#### Escenario: Editar nombre de tarea

- **CUANDO** el usuario abre una Tarea existente para editar, cambia el Nombre, y envía el formulario
- **ENTONCES** el sistema actualiza la Tarea con el nuevo Nombre

### Requirement: La pantalla de Tareas y el modal de Tarea coinciden con el sistema de diseño y el prototipo de Figma

La pantalla de Tareas (panel principal) y el modal de creación/edición de Tarea SHALL implementar el diseño definido en el prototipo de Figma y adherirse al sistema de diseño "Precision Focus" de DESIGN.md, coincidiendo visualmente (layout, colores, tipografía, espaciado, componentes). (US-002 AC-005, AC-016)

#### Escenario: Tokens de diseño aplicados en la pantalla de Tareas

- **CUANDO** se renderiza la pantalla Tareas
- **ENTONCES** los tokens de color, tipografía y espaciado coinciden con el tema Precision Focus de DESIGN.md

#### Escenario: Revisión visual contra Figma

- **CUANDO** se comparan la pantalla Tareas implementada y el modal "Nueva Tarea"/"Editar Tarea" contra los frames correspondientes de Figma
- **ENTONCES** el layout, los colores, la tipografía, el espaciado y los componentes coinciden
