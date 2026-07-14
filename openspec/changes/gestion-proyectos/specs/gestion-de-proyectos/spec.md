## ADDED Requirements

### Requirement: Creación de Proyecto con Nombre obligatorio y Descripción opcional

El sistema SHALL permitir crear un Proyecto mediante un modal "Nuevo Proyecto" que solicite un campo Nombre obligatorio y un campo Descripción opcional, persistiendo el Proyecto y mostrándolo en el listado únicamente cuando el Nombre es válido.

#### Scenario: Creación con Nombre y Descripción completos

- **WHEN** el usuario abre el modal "Nuevo Proyecto", completa el Nombre y la Descripción, y confirma la creación
- **THEN** el sistema cierra el modal sin errores, crea el Proyecto con el Nombre y la Descripción ingresados, y lo muestra en el listado de Proyectos

#### Scenario: Creación únicamente con Nombre, sin Descripción

- **WHEN** el usuario completa únicamente el campo Nombre y deja el campo Descripción vacío, y confirma la creación
- **THEN** el sistema crea el Proyecto con el Nombre ingresado y Descripción vacía, sin bloquear el guardado por la ausencia de Descripción

### Requirement: Bloqueo de guardado al crear un Proyecto sin Nombre válido

El sistema SHALL impedir la creación de un Proyecto cuando el campo Nombre esté vacío o contenga únicamente espacios en blanco, manteniendo el modal abierto y mostrando el error junto al campo Nombre.

#### Scenario: Nombre vacío bloquea la creación

- **WHEN** el usuario deja el campo Nombre vacío e intenta confirmar la creación en el modal "Nuevo Proyecto"
- **THEN** el sistema no persiste ningún Proyecto nuevo, mantiene el modal abierto y muestra un error de campo requerido junto al Nombre

#### Scenario: Nombre compuesto solo por espacios en blanco bloquea la creación

- **WHEN** el usuario completa el campo Nombre únicamente con espacios en blanco e intenta confirmar la creación
- **THEN** el sistema evalúa el Nombre como vacío tras normalizar espacios (`trim`), no persiste ningún Proyecto nuevo y muestra el error de campo requerido junto al Nombre

### Requirement: Persistencia local de los datos del Proyecto

El sistema SHALL persistir el Nombre y la Descripción de cada Proyecto exclusivamente en el almacenamiento local del dispositivo, garantizando su disponibilidad tras un cierre inesperado de la aplicación o un reinicio.

#### Scenario: Un Proyecto persiste tras recargar la aplicación

- **WHEN** el usuario crea un Proyecto y luego recarga completamente la aplicación
- **THEN** el sistema reconstruye el listado desde el almacenamiento local y el Proyecto sigue visible con el mismo Nombre y Descripción

#### Scenario: Múltiples Proyectos persisten íntegros tras recargar la aplicación

- **WHEN** el usuario crea varios Proyectos consecutivos y luego recarga completamente la aplicación
- **THEN** el sistema reconstruye el listado desde el almacenamiento local y todos los Proyectos creados siguen presentes, sin pérdida ni duplicación de datos

### Requirement: Listado de todos los Proyectos creados

El sistema SHALL mostrar el listado de todos los Proyectos existentes en el almacenamiento local al acceder a la sección Proyectos, incluyendo el caso en que no exista ningún Proyecto.

#### Scenario: Listado muestra todos los Proyectos existentes

- **WHEN** el usuario accede a la sección Proyectos existiendo al menos dos Proyectos previamente creados
- **THEN** el sistema renderiza cada Proyecto existente en el almacenamiento local, sin omitir ninguno

#### Scenario: Listado vacío cuando no existen Proyectos

- **WHEN** el usuario accede a la sección Proyectos sin que exista ningún Proyecto creado
- **THEN** el sistema muestra el listado en su estado vacío, sin filas ni tarjetas de Proyecto y sin producir ningún error

### Requirement: Edición de Proyecto reutilizando el modal de creación

El sistema SHALL permitir editar el Nombre y la Descripción de un Proyecto existente en cualquier momento reutilizando el mismo modal usado para crear Proyectos, precargado con los datos existentes del Proyecto, con el título y la etiqueta del botón principal cambiados a "Editar Proyecto".

#### Scenario: Edición de Nombre y Descripción de un Proyecto existente

- **WHEN** el usuario selecciona la acción "Editar" sobre un Proyecto existente, el modal se abre precargado con su Nombre y Descripción actuales mostrando el título "Editar Proyecto", y el usuario reemplaza ambos campos y confirma
- **THEN** el sistema cierra el modal sin errores y persiste los cambios, reflejando el nuevo Nombre y la nueva Descripción en el listado de Proyectos

#### Scenario: Edición que vacía la Descripción de un Proyecto existente

- **WHEN** el usuario edita un Proyecto existente que tiene Descripción, borra completamente el contenido del campo Descripción sin modificar el Nombre, y confirma la edición
- **THEN** el sistema persiste el Proyecto con la Descripción vacía sin mostrar ningún error de validación

### Requirement: Bloqueo de guardado al editar un Proyecto sin Nombre válido

El sistema SHALL impedir guardar la edición de un Proyecto existente cuando el campo Nombre quede vacío o contenga únicamente espacios en blanco, manteniendo el modal abierto, mostrando el error junto al campo Nombre y conservando el Nombre original del Proyecto en el almacenamiento local.

#### Scenario: Nombre vacío bloquea el guardado de la edición

- **WHEN** el usuario edita un Proyecto existente, borra completamente el contenido del campo Nombre e intenta confirmar la edición
- **THEN** el sistema no persiste ningún cambio, mantiene el modal abierto con el error visible junto al Nombre, y el Proyecto conserva su Nombre original en el almacenamiento local

#### Scenario: Nombre reemplazado solo por espacios en blanco bloquea el guardado de la edición

- **WHEN** el usuario edita un Proyecto existente, reemplaza el contenido del campo Nombre únicamente por espacios en blanco e intenta confirmar la edición
- **THEN** el sistema evalúa el Nombre como vacío tras normalizar espacios (`trim`), no persiste ningún cambio y el Proyecto conserva su Nombre original en el almacenamiento local

### Requirement: Adherencia al sistema de diseño DESIGN.md (Precision Focus)

La interfaz de la pantalla de Proyectos SHALL adherirse al sistema de diseño DESIGN.md (tema Precision Focus), utilizando su paleta de colores, tipografía, espaciados y componentes base, e implementar el diseño de referencia indicado en las Referencias de US-001.

#### Scenario: La pantalla de Proyectos cumple los tokens de Precision Focus

- **WHEN** el usuario navega a la sección Proyectos y se compara la pantalla renderizada contra los tokens y componentes definidos en DESIGN.md (tema Precision Focus)
- **THEN** la paleta de colores, la tipografía, los espaciados y los componentes Base UI observados coinciden con lo definido en DESIGN.md, sin desviaciones

### Requirement: Navegación lateral a la sección Proyectos

La interfaz SHALL proporcionar un ítem de navegación lateral que permita acceder a la sección Proyectos desde cualquier otra sección de la aplicación.

#### Scenario: Acceso a Proyectos desde otra sección mediante la navegación lateral

- **WHEN** el usuario se encuentra en una sección distinta a Proyectos y hace clic en el ítem "Proyectos" de la navegación lateral
- **THEN** el sistema navega a la sección Proyectos, la renderiza y marca su ítem correspondiente como activo en la navegación lateral

### Requirement: Fidelidad visual al prototipo de alta fidelidad en Figma

La implementación de la pantalla de Proyectos SHALL ser visualmente fiel (layout, colores, tipografía, espaciado y componentes) al prototipo de alta fidelidad en Figma referenciado en US-001.

#### Scenario: La implementación coincide visualmente con el prototipo de Figma

- **WHEN** se compara una captura de la sección Proyectos implementada, poblada con datos de ejemplo equivalentes, contra la captura del prototipo de Figma referenciado
- **THEN** el layout, la paleta de colores, la tipografía, el espaciado y los componentes coinciden entre ambas capturas dentro de una tolerancia aceptable, sin diferencias significativas
