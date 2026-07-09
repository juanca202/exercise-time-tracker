# ADR-011: Uso de localStorage vía Zustand persist para el almacenamiento local

Estado: Accepted
Fecha de creación: 2026-07-08
Última actualización: 2026-07-08
Decisores: Equipo de desarrollo
Etiquetas: persistence, storage, localstorage, zustand, offline-first

## Contexto

Time Tracker es una aplicación offline-first: toda la información del dominio (Proyectos, Tareas y Registros de Tiempo) debe persistirse exclusivamente en el almacenamiento del dispositivo, sin backend ni sincronización externa. [ADR-004](ADR-004-uso-de-zustand.md) fija Zustand como única solución de estado global, pero no se pronuncia sobre qué motor de almacenamiento del navegador respalda esa persistencia entre sesiones.

El navegador ofrece dos mecanismos principales de persistencia local del lado del cliente: `localStorage` (síncrono, clave-valor, cuota de unos ~5 MiB por origen) e `IndexedDB` (asíncrono, orientado a objetos, con índices y una cuota mucho mayor gestionada dinámicamente por el navegador). Dejar esta elección librada a cada feature fragmentaría la capa de datos y dificultaría mantener invariantes transversales del dominio (p. ej. un único temporizador activo en toda la aplicación, o la consistencia entre Proyectos, Tareas y Registros).

## Decision

El almacenamiento local de todos los datos del dominio (Proyectos, Tareas, Registros de Tiempo) se implementa exclusivamente con `localStorage`, integrado a través del middleware `persist` de Zustand (`createJSONStorage`). No se introduce `IndexedDB` ni otros motores de almacenamiento del navegador como convención vigente del proyecto. Cualquier store de Zustand que necesite sobrevivir a un refresco o cierre de la aplicación debe declarar su persistencia con este mismo mecanismo.

## Alternativas consideradas

- **IndexedDB** (vía un adaptador como `idb-keyval` o `Dexie`): ofrece mayor cuota de almacenamiento y consultas indexadas, pero es asíncrono (rehidratación no inmediata, con estados de carga adicionales en componentes cliente), no tiene soporte nativo en el middleware `persist` de Zustand, y no sincroniza automáticamente entre pestañas del navegador.
- **localStorage** (elegida): soporte nativo en `persist` sin dependencias nuevas, operaciones síncronas (el estado está disponible antes del primer render), y sincronización automática entre pestañas vía el evento `storage`.

## Consecuencias

### Positivas

- Cero dependencias adicionales: se apoya en una capacidad nativa del navegador y en el middleware `persist` ya disponible con Zustand (ADR-004).
- Sincronización automática entre pestañas del navegador, relevante para invariantes globales del dominio (p. ej. temporizador único activo).
- Rehidratación síncrona: el estado persistido está disponible antes del primer render en componentes cliente, sin necesidad de pantallas de carga adicionales.

### Negativas / trade-offs

- Cuota limitada (~5 MiB por origen); si el volumen de datos de un usuario creciera muy por encima de lo previsto, sería necesario migrar a `IndexedDB` u otro motor.
- Cada escritura reserializa el store completo en JSON; en datasets muy grandes esto podría degradar el rendimiento percibido, algo a vigilar si el volumen de registros crece significativamente respecto al uso esperado de la aplicación.

## Fitness function

Apto: Sí
Estado: Pendiente
Herramienta: TODO
Ubicación: TODO
Comando: TODO

## Referencias

- [ADR-004: Uso de Zustand para manejo de estado](ADR-004-uso-de-zustand.md)
- [Zustand — Persisting store data](https://zustand.docs.pmnd.rs/reference/integrations/persisting-store-data)
- [MDN — Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
