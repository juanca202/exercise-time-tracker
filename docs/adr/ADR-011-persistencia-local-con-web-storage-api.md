# ADR-011: Persistencia local con Web Storage API (localStorage)

**Estado**: Draft
**Fecha de creación**: 2026-07-15
**Última actualización**: 2026-07-15
**Decisores**: juanca202
**Etiquetas**: persistencia, offline-first, web-storage-api, localstorage

## Contexto

Time Tracker es una aplicación offline-first sin backend: todo el estado de dominio (Proyecto, Tarea, Registro de Tiempo, y cualquier entidad que se agregue a futuro) debe sobrevivir a un cierre inesperado de la aplicación o a un reinicio del dispositivo, sin depender de ningún servicio externo ni de infraestructura de servidor. El mecanismo de almacenamiento debe ser nativo del navegador, no requerir una dependencia nueva, y su costo de lectura/escritura debe mantenerse despreciable para el volumen de datos esperado de una aplicación de uso personal.

## Decision

Todo el almacenamiento persistente en el cliente usa **Web Storage API (`window.localStorage`)** como mecanismo concreto de almacenamiento, accedido exclusivamente a través de un adaptador de persistencia compartido — ninguna feature ni componente lee o escribe `localStorage` directamente. El adaptador expone una interfaz genérica (lectura, escritura, suscripción a cambios entre pestañas, y versión de esquema) independiente del motor de almacenamiento subyacente, de modo que cambiar de mecanismo en el futuro no requiera tocar el código que lo consume. No se introduce IndexedDB, Web SQL, ni librerías de persistencia de terceros (Dexie, localForage, etc.) como convención vigente.

## Alternativas consideradas

- **IndexedDB**: ofrece mayor capacidad y consultas indexadas, pero introduce una API asíncrona más compleja y no aporta beneficio medible para el volumen de datos esperado en una aplicación de uso personal (del orden de miles de registros, no millones). Se descarta mientras el volumen real no lo justifique.
- **Librerías de persistencia de terceros (Dexie, localForage)**: añaden una dependencia y una capa de abstracción adicional sobre un problema ya resuelto de forma nativa por el navegador para el volumen de datos esperado.

## Consecuencias

### Positivas

- Cero dependencias nuevas: `localStorage` es una API nativa del navegador, disponible sin instalación ni configuración.
- API síncrona, lo que simplifica el adaptador de persistencia y el código que lo consume (sin manejo de promesas/callbacks para operaciones de lectura/escritura).
- Sincronización entre pestañas del navegador disponible de forma nativa a través del evento `storage`.

### Negativas / trade-offs

- Límite de capacidad de `localStorage` (típicamente 5-10 MB por origen, según navegador): si el volumen de datos crece significativamente más allá de lo esperado, será necesario migrar a IndexedDB u otro mecanismo, lo que implica revisar este ADR.
- API únicamente de strings: todo dato debe serializarse/deserializarse a JSON en cada lectura/escritura.

## Fitness function

Apto: Sí
Estado: Creada
Herramienta: ESLint (`no-restricted-globals` + `no-restricted-properties`)
Ubicación: `eslint.config.mjs` (bloque `files: ["src/**/*.{js,jsx,ts,tsx}"], ignores: ["src/shared/persistence/**"]`)
Comando: `pnpm run lint`

## Referencias

- [MDN: Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [ADR-004: Uso de Zustand para manejo de estado](ADR-004-uso-de-zustand.md) — el store raíz y los stores de feature usan este mecanismo como motor de persistencia.
