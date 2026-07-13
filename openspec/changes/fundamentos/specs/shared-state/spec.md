## ADDED Requirements

### Requirement: Adaptador compartido de persistencia local

El sistema SHALL proveer un adaptador de storage en `src/shared/persistence` que envuelve `localStorage` detrás de una interfaz `get`/`set`/`subscribe`, incluyendo un campo `schemaVersion`, utilizable por cualquier feature sin depender del código de otra feature.

#### Escenario: El estado sobrevive un reload

- **CUANDO** se escribe un valor a través del adaptador y la aplicación se recarga
- **ENTONCES** leer la misma key a través del adaptador devuelve el valor previamente escrito

#### Escenario: El adaptador es agnóstico de la feature

- **CUANDO** cualquier módulo de feature importa el adaptador de storage
- **ENTONCES** depende únicamente de `src/shared/persistence`, no de ningún módulo de `src/features/*`

### Requirement: El store raíz expone CRUD crudo por entidad

El store raíz de Zustand SHALL exponer operaciones de creación/actualización/listado sin validar para Project (`addProject`, `updateProject`, `listProjects`), Task (`addTask`, `updateTask`, `listTasks`) y TimeRecord (`addTimeRecord`, `listTimeRecords`), cada una persistida a través del adaptador de storage, sin imponer ninguna regla de negocio a nivel de campo.

#### Escenario: La creación cruda persiste de inmediato

- **CUANDO** se llama a `addProject`, `addTask` o `addTimeRecord` con cualquier valor para sus campos requeridos
- **ENTONCES** la nueva entidad está presente en el resultado de `list*` correspondiente y persistida a través del adaptador de storage, sin aplicar ninguna validación

#### Escenario: No se expone filtrado específico de feature

- **CUANDO** un consumidor necesita una vista filtrada o derivada de una lista de entidades (p. ej. Tasks de un Project, totales por Mes)
- **ENTONCES** ese filtrado es calculado por la feature consumidora a partir del resultado crudo de `list*`, no expuesto como una acción del store

### Requirement: Lecturas seguras respecto de la hidratación

El sistema SHALL proveer un hook `useHasHydrated()`, y toda lectura de estado persistido SHALL estar gateada detrás de él para que el markup renderizado en servidor y el primer renderizado en cliente coincidan.

#### Escenario: Sin hydration mismatch

- **CUANDO** la aplicación se renderiza en servidor y luego se hidrata en el cliente con estado persistido existente
- **ENTONCES** no se produce ninguna advertencia de hydration-mismatch y el estado persistido se refleja solo después de que `useHasHydrated()` reporte true

### Requirement: Solicitud best-effort de persistencia de storage

El sistema SHALL llamar a `navigator.storage.persist()` una vez al cargar la aplicación.

#### Escenario: Persistencia solicitada al cargar

- **CUANDO** la aplicación carga en un navegador que soporta la Storage API
- **ENTONCES** `navigator.storage.persist()` es invocado durante el arranque

### Requirement: Helper compartido de atribución de mes

El sistema SHALL proveer `getRecordMonth(record: TimeRecord)` en `src/shared`, devolviendo el mes calendario del Start Time del registro, para que cualquier feature que agregue TimeRecords por mes use la misma regla de atribución sin duplicarla ni depender de la implementación de otra feature.

#### Escenario: El mes se deriva del Start Time

- **CUANDO** se llama a `getRecordMonth` con un TimeRecord cuyo Start Time y End Time caen en meses calendario distintos
- **ENTONCES** devuelve el mes calendario del Start Time
