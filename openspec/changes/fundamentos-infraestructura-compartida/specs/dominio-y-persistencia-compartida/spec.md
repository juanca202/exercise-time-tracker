## ADDED Requirements

### Requirement: Tipos de dominio compartidos completos

El sistema SHALL definir los tipos de dominio completos de Proyecto, Tarea, Registro de Tiempo y Temporizador Activo en un único módulo compartido, sin campos placeholder ni marcados como "por definir", de modo que Proyectos, Tareas e Historial de registros los consuman de forma idéntica desde su primer commit.

#### Scenario: Una historia funcional importa los tipos de dominio compartidos

- **WHEN** el código de una historia funcional (Proyectos, Tareas o Historial de registros) importa `Proyecto`, `Tarea`, `RegistroDeTiempo` o `TemporizadorActivo` desde el módulo de dominio compartido
- **THEN** obtiene la definición completa del tipo (incluyendo sus relaciones obligatorias: Tarea→Proyecto y Registro de Tiempo→Tarea) sin necesitar redefinir, extender ni completar campos faltantes

#### Scenario: Los tipos no contienen campos placeholder

- **WHEN** se inspecciona el módulo de dominio compartido
- **THEN** ningún campo está marcado como placeholder, `TODO`, `any` sin justificar o "por definir"

### Requirement: Adaptador de persistencia local

El sistema SHALL implementar un adaptador de persistencia local, con operaciones de lectura, escritura y suscripción, más un campo de versión de esquema, de modo que los datos de Proyecto, Tarea y Registro de Tiempo sobrevivan a un cierre inesperado de la aplicación o a un reinicio del dispositivo.

#### Scenario: Los datos persisten tras un cierre inesperado

- **WHEN** la aplicación escribe datos de Proyecto, Tarea o Registro de Tiempo mediante el adaptador de persistencia y luego se cierra de forma inesperada (o el dispositivo se reinicia)
- **THEN** al volver a abrir la aplicación, el adaptador de persistencia lee los mismos datos previamente escritos desde el almacenamiento local del dispositivo

#### Scenario: El estado persistido incluye una versión de esquema

- **WHEN** el adaptador de persistencia escribe el estado en el almacenamiento local
- **THEN** el estado escrito incluye un campo de versión de esquema junto a los datos de dominio

#### Scenario: Suscripción a cambios del estado persistido

- **WHEN** un consumidor se suscribe al adaptador de persistencia y el estado almacenado cambia
- **THEN** el consumidor recibe una notificación con el estado actualizado y puede desuscribirse en cualquier momento

### Requirement: CRUD crudo por entidad en el store raíz

El sistema SHALL exponer, en un store raíz compartido, operaciones CRUD crudas de creación, actualización y listado para cada entidad (Proyecto, Tarea, Registro de Tiempo), sin aplicar validación ni reglas de negocio propias de cada historia funcional.

#### Scenario: Creación cruda de una entidad

- **WHEN** una historia funcional invoca la operación de creación del store raíz para Proyecto, Tarea o Registro de Tiempo con datos que cumplen la forma del tipo de dominio
- **THEN** el store raíz agrega la entidad a su estado y la persiste, sin ejecutar validación de negocio adicional (esa validación es responsabilidad de la historia funcional que la invoca)

#### Scenario: Actualización cruda de una entidad

- **WHEN** una historia funcional invoca la operación de actualización del store raíz sobre una entidad existente
- **THEN** el store raíz reemplaza los campos provistos de esa entidad en su estado y la persiste, sin aplicar reglas de negocio propias de ninguna historia funcional

#### Scenario: Listado de entidades

- **WHEN** una historia funcional invoca la operación de listado del store raíz para Proyecto, Tarea o Registro de Tiempo
- **THEN** el store raíz devuelve la colección completa de esa entidad tal como está persistida, sin filtrar ni transformar según reglas de negocio de ninguna historia funcional

### Requirement: Gate de hidratación sobre el estado persistido

El sistema SHALL gatear toda lectura de estado persistido detrás de un indicador de hidratación, de modo que el render inicial del servidor y el primer render del cliente coincidan y no se produzcan errores de hydration-mismatch.

#### Scenario: Render antes de hidratar

- **WHEN** el layout o cualquier ruta se renderiza en el servidor o en el primer render del cliente, antes de completar la hidratación del estado persistido
- **THEN** el indicador de hidratación expuesto por el store raíz es `false` y ningún componente renderiza datos leídos del almacenamiento local

#### Scenario: Render después de hidratar

- **WHEN** la hidratación del estado persistido finaliza en el cliente
- **THEN** el indicador de hidratación pasa a `true` y los componentes pueden entonces leer y renderizar los datos persistidos sin provocar una discrepancia entre el markup del servidor y el del cliente

### Requirement: Solicitud best-effort de almacenamiento persistente

El sistema SHALL solicitar almacenamiento persistente al navegador (best-effort) al cargar la aplicación.

#### Scenario: El navegador soporta la API de almacenamiento persistente

- **WHEN** la aplicación se carga en un navegador que expone la API de solicitud de almacenamiento persistente
- **THEN** la aplicación invoca esa solicitud durante el arranque, sin bloquear el render de la aplicación en espera de la respuesta

#### Scenario: El navegador no soporta la API de almacenamiento persistente

- **WHEN** la aplicación se carga en un navegador que no expone la API de solicitud de almacenamiento persistente
- **THEN** la aplicación continúa funcionando con normalidad, sin generar errores ni bloquear ninguna funcionalidad

### Requirement: Helper compartido de cálculo de mes calendario

El sistema SHALL proveer, en un único módulo compartido, el cálculo del mes calendario de un Registro de Tiempo, de modo que Tareas e Historial de registros lo consuman de forma idéntica sin duplicar la lógica ni depender entre sí para obtenerla.

#### Scenario: Tareas obtiene el mes calendario de un registro

- **WHEN** la historia funcional de Tareas necesita el mes calendario correspondiente a un Registro de Tiempo
- **THEN** importa y utiliza la función de cálculo de mes calendario del módulo compartido, sin reimplementar la lógica ni importarla desde el módulo de Historial de registros

#### Scenario: Historial de registros obtiene el mes calendario de un registro

- **WHEN** la historia funcional de Historial de registros necesita el mes calendario correspondiente a un Registro de Tiempo
- **THEN** importa y utiliza la misma función de cálculo de mes calendario del módulo compartido, obteniendo el mismo resultado que obtendría Tareas para el mismo registro, sin depender del módulo de Tareas para obtenerla
