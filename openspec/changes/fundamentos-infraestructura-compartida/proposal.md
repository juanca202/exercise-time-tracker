## Why

Time Tracker es una aplicación greenfield, offline-first y sin backend (SRS-001 §2.1, §2.4): todos los datos de Proyecto, Tarea y Registro de Tiempo deben persistir exclusivamente en el almacenamiento local del dispositivo. Antes de poder planificar e implementar en paralelo las historias funcionales de Proyectos, Tareas e Historial de registros, es necesario fijar de una sola vez la base técnica compartida que esas tres historias van a consumir: tipos de dominio, persistencia local, un store raíz con CRUD real por entidad, un helper de fecha compartido y el app shell de navegación. Sin esta base, las tres historias funcionales competirían por modificar los mismos archivos (store, adaptador de persistencia, layout, sidebar), generando conflictos de merge y acoplamiento entre historias que por diseño deben ser independientes entre sí.

## What Changes

- Definir en un módulo compartido los tipos de dominio completos de Proyecto, Tarea, Registro de Tiempo y Temporizador Activo, sin campos placeholder ni "por definir", consumibles de forma idéntica por Proyectos, Tareas e Historial de registros desde su primer commit.
- Implementar un adaptador de persistencia local con operaciones de lectura, escritura y suscripción, más un campo de versión de esquema, de modo que los datos sobrevivan a un cierre inesperado de la aplicación o a un reinicio del dispositivo.
- Exponer, en un store raíz compartido (Zustand, según ADR-004), operaciones CRUD crudas de creación, actualización y listado por entidad (Proyecto, Tarea, Registro de Tiempo), sin validación ni reglas de negocio propias de cada historia funcional (BR-01).
- Gatear toda lectura de estado persistido detrás de un indicador de hidratación, evitando errores de hydration-mismatch entre el render inicial del servidor y el primer render del cliente.
- Solicitar almacenamiento persistente al navegador (best-effort) al cargar la aplicación.
- Proveer, en un único módulo compartido, el cálculo del mes calendario de un Registro de Tiempo, de modo que Tareas e Historial de registros lo consuman de forma idéntica sin duplicar lógica ni depender entre sí.
- Construir el layout de nivel superior con una barra de navegación lateral fija (enlaces a `/tareas`, `/proyectos`, `/historial`), fiel al frame Figma "Aside - SideNavBar", usando Base UI (ADR-003) y Tailwind CSS (ADR-002).
- Resolver las rutas `/tareas`, `/proyectos` y `/historial` con una página funcional cada una (placeholder mínimo "Próximamente"), sin ningún gate de autenticación.
- Garantizar que el store raíz, el adaptador de persistencia, el layout y el sidebar sean la única superficie de API estable que consumen las tres historias funcionales, de modo que ninguna necesite modificar esos archivos compartidos (BR-03).

No hay cambios **BREAKING**: el proyecto es greenfield y no existe código previo que migrar.

## Capabilities

### New Capabilities

- `dominio-y-persistencia-compartida`: tipos de dominio (Proyecto, Tarea, Registro de Tiempo, Temporizador Activo), adaptador de persistencia local (lectura/escritura/suscripción + versión de esquema), store raíz con CRUD crudo por entidad, gate de hidratación, solicitud de almacenamiento persistente y helper compartido de cálculo de mes calendario. Cubre AC-001, AC-002, AC-003, AC-004, AC-005 y AC-006.
- `app-shell-navegacion`: layout de nivel superior con sidebar de navegación fijo, fiel al frame Figma "Aside - SideNavBar", las 3 rutas stub (`/tareas`, `/proyectos`, `/historial`), ausencia de gate de autenticación y funcionamiento completo sin red. Cubre AC-007, AC-008, AC-009, AC-011 y AC-012.
- `estabilidad-api-compartida`: contrato de estabilidad que garantiza que el store raíz, el adaptador de persistencia, el layout y el sidebar constituyen la única superficie estable que Proyectos, Tareas e Historial de registros deben consumir, sin necesitar modificarlos. Cubre AC-010.

### Modified Capabilities

Ninguna. `openspec/specs/` no tiene capacidades existentes: este es el primer change que se archiva en el proyecto, por lo que las tres capacidades listadas arriba son todas nuevas.

## Impact

- Código nuevo bajo `src/shared/` (tipos de dominio, adaptador de persistencia, store raíz, helper de mes calendario), según la arquitectura feature-based (ADR-005): estos módulos son transversales a más de una feature (Proyectos, Tareas, Historial de registros) desde su creación.
- Código nuevo bajo `src/app/` para el layout raíz y las rutas stub `/tareas`, `/proyectos`, `/historial` (App Router, ADR-001).
- Sin dependencias externas nuevas: usa Zustand (ya en `package.json`), Base UI y Tailwind CSS (ya configurados).
- Sin impacto en código existente: no hay migración, es una base greenfield sobre la que se apoyarán los tres changes funcionales futuros (`gestion-proyectos`, `gestion-tareas-temporizador`, `historial-de-registros`).
