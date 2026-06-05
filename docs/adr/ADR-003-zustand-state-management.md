# ADR-003: Manejo de estado cliente con Zustand

- Estado: Accepted
- Fecha de creación: 2026-05-28
- Última actualización: 2026-05-28
- Decisores: Tech lead
- Etiquetas: estado, zustand, react, cliente, arquitectura

## Contexto

La aplicación de time-tracker requiere estado compartido entre componentes de la UI (listado, formularios, filtros, acciones CRUD) en un stack Next.js 16 con App Router y React 19 ([ADR-001](ADR-001-app-router-only.md)). Sin una decisión explícita, el equipo podría dispersar la lógica entre múltiples `useState` locales, Context API anidados o librerías distintas (Redux, Jotai, etc.), aumentando complejidad y dificultando pruebas.

El dominio prevé persistencia local en el navegador (`localStorage`, clave `todos:v1`; ver `docs/specs/technical-docs/todo-entity.md`). Esa persistencia es una **preocupación de almacenamiento**, no sustituye la necesidad de un store de estado cliente unificado para la interfaz.

## Decision

El **manejo de estado cliente compartido** del proyecto usará **Zustand** como librería estándar.

- Los stores de Zustand concentran estado global de UI y dominio en cliente (p. ej. colección de tareas, acciones de mutación, flags de UI).
- Los componentes que consumen o modifican ese estado deben ser **Client Components** cuando corresponda, respetando los límites RSC de App Router.
- La **sincronización con `localStorage`** se implementa en la capa de store o en módulos de persistencia dedicados invocados desde el store; el ADR no prescribe middleware concreto (`persist`, llamadas a `lib/.../storage.ts`, etc.).
- El **estado local efímero** de un solo componente (focus, hover, valor controlado de un input antes de enviar) puede seguir en `useState`/`useReducer` sin store.
- El **estado de servidor** (fetch en Server Components, `cache`, revalidación) no se duplica en Zustand; solo se hidrata o expone al cliente cuando la UX lo exija.

Queda **fuera de alcance** como estrategia principal: Redux Toolkit, Recoil, Jotai, MobX y Context API como sustituto de un store global de aplicación. Context API sigue permitido para dependencias acotadas (tema, providers de librerías) sin solapar el store de dominio.

## Consecuencias

### Positivas

- API mínima y tipable con TypeScript, alineada con React 19 sin boilerplate de acciones/reducers.
- Stores independientes y composables; pruebas unitarias sencillas instanciando el store fuera de React.
- Buen encaje con Client Components en App Router y con patrones de selectores para evitar re-renders innecesarios.
- Ecosistema maduro (middleware `persist`, devtools) si la persistencia o el debugging lo requieren.

### Negativas / trade-offs

- Hay que añadir y mantener la dependencia `zustand` (aún no presente en `package.json` al registrar este ADR).
- Uso incorrecto en Server Components provoca errores; el equipo debe delimitar qué vive en servidor vs. cliente.
- Abusar del store global para estado que debería ser local aumenta acoplamiento y dificulta el mantenimiento.

## Referencias

- [Zustand — Documentación](https://zustand.docs.pmnd.rs/)
- [ADR-001: Enrutamiento exclusivo con App Router](ADR-001-app-router-only.md)
- `docs/specs/technical-docs/todo-entity.md` — modelo y clave `localStorage`
- [Documenting Architecture Decisions — Cognitect](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
