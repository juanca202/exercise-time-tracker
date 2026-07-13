## ADDED Requirements

### Requirement: Crear Proyecto

El sistema SHALL permitir al usuario crear un Proyecto proporcionando un Nombre obligatorio y una Descripción opcional. (US-001 AC-001, AC-002)

#### Escenario: Crear con nombre y descripción

- **CUANDO** el usuario envía el formulario "Nuevo Proyecto" con un Nombre no vacío y una Descripción
- **ENTONCES** el sistema crea el Proyecto con ambos campos y cierra el formulario

#### Escenario: Crear solo con nombre

- **CUANDO** el usuario envía el formulario "Nuevo Proyecto" con un Nombre no vacío y una Descripción vacía
- **ENTONCES** el sistema crea el Proyecto con la Descripción almacenada como vacía/ausente

#### Escenario: Rechazar nombre vacío

- **CUANDO** el usuario envía el formulario "Nuevo Proyecto" con un Nombre vacío o compuesto solo por espacios
- **ENTONCES** el sistema bloquea el envío y no crea ningún Proyecto

### Requirement: Persistir Proyectos localmente

El sistema SHALL persistir cada Proyecto creado o editado (Nombre, Descripción) en el almacenamiento local del dispositivo, sobreviviendo a un cierre inesperado de la app o a un reinicio del dispositivo. (US-001 AC-003)

#### Escenario: El Proyecto sobrevive a la recarga

- **CUANDO** el usuario crea un Proyecto y luego recarga la aplicación
- **ENTONCES** el Proyecto sigue presente con el mismo Nombre y Descripción

### Requirement: Listar Proyectos

El sistema SHALL mostrar la lista de todos los Proyectos creados. (US-001 AC-004)

#### Escenario: La pantalla de Proyectos muestra todos los proyectos

- **CUANDO** el usuario navega a la pantalla de Proyectos y existe al menos un Proyecto
- **ENTONCES** cada Proyecto existente se muestra como una tarjeta en la lista

#### Escenario: Estado vacío sin proyectos

- **CUANDO** el usuario navega a la pantalla de Proyectos y no existe ningún Proyecto
- **ENTONCES** el sistema muestra el estado vacío/"Crear Nuevo Proyecto" en lugar de una tarjeta de proyecto

### Requirement: Editar Proyecto

El sistema SHALL permitir al usuario editar el Nombre y la Descripción de un Proyecto existente en cualquier momento, reutilizando el modal "Nuevo Proyecto" precargado con los datos actuales del Proyecto, con su título y la etiqueta del botón principal cambiados a "Editar Proyecto". (US-001 AC-005, AC-006)

#### Escenario: Editar nombre y descripción

- **CUANDO** el usuario abre un Proyecto existente para editar, cambia el Nombre y/o la Descripción, y envía
- **ENTONCES** el sistema actualiza el Proyecto con los nuevos valores

#### Escenario: Rechazar nombre vacío en edición

- **CUANDO** el usuario edita un Proyecto existente y vacía el campo Nombre antes de enviar
- **ENTONCES** el sistema bloquea el envío y el Nombre del Proyecto permanece sin cambios

### Requirement: La pantalla de Proyectos coincide con el sistema de diseño

La pantalla de Proyectos SHALL cumplir con el sistema de diseño "Precision Focus" de DESIGN.md (paleta, tipografía, espaciado, patrones de componentes). (US-001 AC-007)

#### Escenario: Tokens de diseño aplicados

- **CUANDO** se renderiza la pantalla de Proyectos
- **ENTONCES** los tokens de color, tipografía y espaciado coinciden con los definidos en DESIGN.md para el tema Precision Focus

### Requirement: La pantalla de Proyectos coincide con el prototipo de Figma

La implementación de la pantalla de Proyectos SHALL ser visualmente fiel (layout, colores, tipografía, espaciado, componentes) al prototipo de Figma de alta fidelidad referenciado. (US-001 AC-009)

#### Escenario: Revisión visual contra Figma

- **CUANDO** la pantalla de Proyectos implementada se compara contra el frame "Proyectos" de Figma
- **ENTONCES** el layout, los colores, la tipografía, el espaciado y los componentes coinciden
