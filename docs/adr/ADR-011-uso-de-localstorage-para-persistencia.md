# ADR-011: Uso de localStorage para la persistencia local

Estado: Accepted
Fecha de creación: 2026-07-09
Última actualización: 2026-07-09
Decisores: Equipo de desarrollo
Etiquetas: persistencia, localstorage, offline-first, zustand

## Contexto

Time Tracker es una aplicación de uso personal y offline-first: toda la información (Proyectos, Tareas, Registros de Tiempo) debe persistirse exclusivamente en el almacenamiento local del dispositivo, sin backend ni sincronización externa, garantizando disponibilidad sin conexión y recuperación consistente de los datos tras un cierre inesperado o un reinicio de la aplicación.

El manejo de estado global ya está resuelto por [ADR-004](ADR-004-uso-de-zustand.md) mediante Zustand, pero ningún ADR fija todavía **cómo** ese estado se persiste en el dispositivo. Sin un lineamiento único, distintas features podrían adoptar mecanismos de almacenamiento local distintos (localStorage, IndexedDB, wrappers de terceros), fragmentando la capa de persistencia y complicando su mantenimiento.

## Decision

Todo el estado persistente de la aplicación se almacena mediante el Web Storage API `localStorage`, integrado a través del middleware `persist` incluido en el paquete `zustand` (ya presente en el proyecto por ADR-004, sin dependencias adicionales). No se introducen IndexedDB ni librerías de bases de datos embebidas en el navegador (Dexie, idb, etc.) como mecanismo de persistencia mientras el volumen de datos se mantenga dentro de los límites prácticos de `localStorage` (del orden de 5-10 MB por origen).

## Alternativas consideradas

- **IndexedDB (nativo):** soporta mayor volumen de datos y tipos no serializados, y opera de forma asíncrona sin bloquear el hilo principal. Descartada por ahora: añade complejidad de esquema/transacciones no justificada para el volumen esperado de una herramienta de uso personal.
- **Dexie / idb (wrappers sobre IndexedDB):** simplifican la API de IndexedDB, pero heredan su complejidad conceptual (versionado de esquema, transacciones) y suman una dependencia externa. Descartadas por el mismo motivo que IndexedDB directo.

## Consecuencias

### Positivas

- API síncrona y simple, sin dependencias nuevas: el middleware `persist` ya viene incluido en `zustand`.
- Persistencia integrada de forma natural con el patrón de manejo de estado ya adoptado (ADR-004), sin una capa de acceso a datos separada.
- Suficiente para el volumen de uso personal esperado por la aplicación.

### Negativas / trade-offs

- `localStorage` tiene un límite de tamaño por origen (típicamente 5-10 MB según navegador); si el volumen de datos crece más allá de lo esperado para uso personal, esta decisión deberá revisarse.
- Solo admite strings: todo objeto debe serializarse/deserializarse a JSON (ya resuelto por el middleware `persist`).
- Las operaciones son síncronas y pueden bloquear el hilo principal si el volumen de datos leído/escrito crece significativamente.
- No ofrece soporte transaccional real; operaciones concurrentes complejas no están cubiertas.

## Fitness function

Apto: Sí
Estado: Creada
Herramienta: ESLint (`no-restricted-globals`, `no-restricted-imports`)
Ubicación: `eslint.config.mjs` (regla scoped a `src/**/*.{ts,tsx}`)
Comando: `npm run lint`

## Referencias

- [ADR-004: Uso de Zustand para manejo de estado](ADR-004-uso-de-zustand.md)
- [Zustand — persist middleware](https://zustand.docs.pmnd.rs/integrations/persisting-store-data)
- [MDN — Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
