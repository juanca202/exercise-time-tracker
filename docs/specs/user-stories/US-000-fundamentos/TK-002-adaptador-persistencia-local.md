# TK-002: Adaptador de persistencia local

**Estado**: Ready
**Historia**: [US-000](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Implementar un adaptador de persistencia local genérico (lectura, escritura y suscripción, más campo de versión de esquema), un indicador de hidratación que gatee toda lectura de estado persistido, y una función que solicite almacenamiento persistente al navegador (best-effort) al cargar la aplicación.

## Dependencias

- Web Storage API (`window.localStorage`) — mecanismo de almacenamiento local concreto del adaptador; no requiere librerías externas.
- Storage API del navegador (`navigator.storage.persist()`) — solicitud de almacenamiento persistente best-effort.
- React (`useState`, `useEffect`) — implementación del hook de hidratación.

## Referencias

- **Arquitectura:** [ADR-005: Arquitectura del proyecto basada en features](../../../adr/ADR-005-arquitectura-feature-based.md) (ubicación en módulo compartido), [ADR-004: Uso de Zustand para manejo de estado](../../../adr/ADR-004-uso-de-zustand.md) (el adaptador se diseña para ser consumido por el store raíz de TK-003 sin acoplarse a Zustand), [ADR-007: Estrategia de pruebas unitarias](../../../adr/ADR-007-estrategia-pruebas-unitarias.md) (cobertura y co-localización de las pruebas), [ADR-011: Persistencia local con Web Storage API (localStorage)](../../../adr/ADR-011-persistencia-local-con-web-storage-api.md) (formaliza la elección de `window.localStorage` hecha en IT-02; ninguna otra pieza del código puede acceder a `localStorage` fuera de este módulo, reforzado por la fitness function de ese ADR).

## Archivos afectados

```text
exercise-time-tracker/
└── src/
    └── shared/
        └── persistence/
            ├── + types.ts                        # interfaz AdaptadorPersistencia<T> (read/write/subscribe/version)
            ├── + local-storage-adapter.ts         # crearAdaptadorLocalStorage<T>() sobre window.localStorage
            ├── + local-storage-adapter.test.ts    # cobertura de read/write/subscribe y versión de esquema
            ├── + use-has-hydrated.ts              # hook useHasHydrated(): boolean — gate de hidratación SSR/CSR
            ├── + use-has-hydrated.test.ts
            ├── + request-persistent-storage.ts    # solicitarAlmacenamientoPersistente(): Promise<boolean>
            ├── + request-persistent-storage.test.ts
            └── + storage-bootstrapper.tsx         # client component que invoca solicitarAlmacenamientoPersistente() al montar
```

## Plan de implementación

- [ ] **IT-01** — Definir la interfaz `AdaptadorPersistencia<T>` en `types.ts` con `version: number`, `read(): T | null`, `write(data: T): void`, `subscribe(listener: (data: T | null) => void): () => void`.
- [ ] **IT-02** — Implementar `crearAdaptadorLocalStorage<T>(clave: string, version: number): AdaptadorPersistencia<T>` sobre `window.localStorage`, serializando un envoltorio `{ version, data }` en JSON; `read()` devuelve `null` si no hay dato guardado o si su `version` no coincide con la esperada.
      Mecanismo formalizado en [ADR-011](../../../adr/ADR-011-persistencia-local-con-web-storage-api.md): `window.localStorage` (Web Storage API nativa del navegador) como mecanismo concreto, con volumen de datos esperado bajo (SRS-001 RP-003: ~1000 registros) y sin dependencia nueva.
- [ ] **IT-03** — Implementar `subscribe(listener)` escuchando el evento `storage` de `window`, filtrado por la `clave` del adaptador, para sincronizar datos entre pestañas del navegador; devolver una función de baja (`unsubscribe`) que remueve el listener.
- [ ] **IT-04** — Implementar `useHasHydrated()` en `use-has-hydrated.ts`: estado `useState(false)` que pasa a `true` dentro de un `useEffect` sin dependencias, de modo que el primer render del cliente coincida con el del servidor antes de leer datos persistidos (AC-004).
- [ ] **IT-05** — Implementar `solicitarAlmacenamientoPersistente()` en `request-persistent-storage.ts`, invocando `navigator.storage?.persist?.()` de forma best-effort (no lanza si la API no existe o la promesa se rechaza).
- [ ] **IT-06** — Implementar `StorageBootstrapper` (client component, sin salida visual) en `storage-bootstrapper.tsx`, que invoca `solicitarAlmacenamientoPersistente()` en un `useEffect` al montar. TK-005 lo monta en el layout raíz.
- [ ] **IT-07** — Cubrir con pruebas Vitest + Testing Library (ADR-007): lectura/escritura/versión del adaptador (incluyendo dato con versión distinta a la esperada), comportamiento de `useHasHydrated` antes y después del montaje, y que `solicitarAlmacenamientoPersistente` no lanza cuando `navigator.storage` no existe.
