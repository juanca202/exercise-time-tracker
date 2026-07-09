# RS-001 — Mecanismo de almacenamiento local para Proyectos, Tareas y Registros de Tiempo

Estado: Ready
Dominio: Arquitectura
Artefacto referenciado: N/A (afecta por igual a US-30272, US-30273, US-30274)
Creado por: juanca202
Fecha: 2026-07-08

## Pregunta de investigación

¿Qué mecanismo de almacenamiento local (`localStorage` vs `IndexedDB` u otra alternativa) conviene usar para persistir Proyectos, Tareas y Registros de Tiempo en Time Tracker, dado el requisito offline-first (RD-002), la durabilidad exigida (RFB-001/002) y el límite de rendimiento explícito (RP-003: carga <2s con hasta 1000 registros)?

## Contexto del artefacto

Las tres historias en `docs/specs/user-stories/` (US-30272 Gestión de Tareas, US-30273 Gestión de Proyectos, US-30274 Historial de Registros) comparten la misma restricción de la SRS-001: "toda la información... debe persistirse exclusivamente en el almacenamiento local del dispositivo" (sección 2.4) y "la aplicación deberá ser desarrollada para funcionar con almacenamiento local exclusivamente" (RD-002). Ninguna de las tres marca esto como decisión técnica pendiente en su DoR, pero ningún ADR del proyecto (ADR-001 a ADR-010) especifica el motor de almacenamiento concreto. ADR-004 fija Zustand para estado global, pero no se pronuncia sobre el `storage` que use su middleware `persist`.

Esta es una decisión transversal: las tres historias leen y escriben sobre la misma capa de persistencia, por lo que decidirla una sola vez evita inconsistencias entre features.

## Hallazgos

### Zustand `persist` middleware y el motor de storage

El middleware `persist` de Zustand acepta cualquier storage que implemente la interfaz `getItem`/`setItem`/`removeItem`, ya sea síncrona o asíncrona, vía `createJSONStorage` ([Zustand — Persisting store data](https://zustand.docs.pmnd.rs/reference/integrations/persisting-store-data)):

- Con `localStorage`/`sessionStorage`: soporte nativo, síncrono, cero dependencias adicionales.
- Con `IndexedDB`: no hay soporte nativo de primera clase — requiere una librería intermedia (`idb-keyval`, `Dexie`) o un paquete comunitario como `zustand-indexeddb` para adaptar la interfaz. La discusión oficial del proyecto (GitHub Discussion #1721) confirma que es un patrón soportado pero no built-in. Usar `createJSONStorage` sobre IndexedDB "defeats the whole point" de IndexedDB, porque esa API está pensada para guardar objetos no serializados directamente (no vía JSON.stringify).

### Comparativa localStorage vs IndexedDB

| Dimensión                                   | `localStorage`                                                                                   | `IndexedDB`                                                                                                                       |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Cuota                                       | ~5 MiB por origen (hasta 10 MiB según navegador)                                                 | Varios GB, gestionada dinámicamente por el navegador (hasta ~80% del disco en Chrome, en modo "best-effort" con posible eviction) |
| Modelo de acceso                            | Síncrono, bloquea el hilo principal                                                              | Asíncrono, no bloquea el hilo principal                                                                                           |
| Estructura de datos                         | Solo strings (clave-valor); requiere serializar/deserializar todo el store en cada escritura     | Objetos estructurados, con índices y transacciones                                                                                |
| Rendimiento con datasets pequeños (<100 KB) | Más simple y rápido para lecturas puntuales                                                      | Mayor overhead por la naturaleza asíncrona/transaccional                                                                          |
| Rendimiento con datasets grandes            | Se degrada porque cada escritura reserializa el store completo                                   | Escala mejor; permite consultas indexadas sin cargar todo en memoria                                                              |
| Sincronización entre pestañas               | Automática vía el evento `storage` (útil para BR-02: temporizador único en "toda la aplicación") | No hay notificación nativa entre pestañas; requeriría `BroadcastChannel` adicional                                                |

(Fuentes: [MDN — Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria), [RxDB — IndexedDB Max Storage Size Limit](https://rxdb.info/articles/indexeddb-max-storage-limit.html), [RxDB — LocalStorage vs IndexedDB vs Cookies vs OPFS vs WASM-SQLite](https://rxdb.info/articles/localstorage-indexeddb-cookies-opfs-sqlite-wasm.html))

### Dimensionamiento real del caso de uso

RP-003 fija el techo de prueba de rendimiento en 1000 registros. Un Registro de Tiempo (fecha, ids de tarea/proyecto, duración, timestamps) serializado en JSON pesa un orden de magnitud de ~150-300 bytes; 1000 registros más sus Proyectos/Tareas asociados quedan muy por debajo de los ~5 MiB de cuota de `localStorage`. Las agregaciones que piden AC-002/003/004 de US-30274 (totales por tarea, proyecto y mes) son operaciones en memoria sobre un arreglo de ≤1000 elementos — triviales para el motor JS en <2s, independientemente del storage elegido. El cuello de botella de rendimiento, de existir, estaría en la serialización/escritura completa del store en cada operación con `localStorage`, no en el cálculo de agregados.

## Conclusión y recomendación

Para el volumen y perfil de uso descritos en la SRS (aplicación personal, un solo usuario, techo de prueba explícito de 1000 registros), **`localStorage` vía el `persist` middleware nativo de Zustand es la opción más simple y suficiente**: no añade dependencias, es compatible de fábrica con ADR-004, y su sincronización automática entre pestañas resuelve de forma natural la ambigüedad de BR-02 (temporizador único "en toda la aplicación", no solo por pestaña).

`IndexedDB` sería la opción más "correcta" a futuro si el alcance creciera (más usuarios, registros ilimitados, consultas indexadas), pero introduce un adaptador externo, rehidratación asíncrona (con el consiguiente estado de carga inicial en componentes cliente) y pierde la sincronización automática entre pestañas — sobre-ingeniería frente al alcance actual y objeto de riesgo de contradecir la restricción "Pequeña" (S) que ya reconoce US-30272 como la historia más grande de las tres.

**Recomendación:** adoptar `localStorage` + `zustand/persist` como mecanismo único de persistencia para Proyectos, Tareas y Registros de Tiempo, y documentar esta decisión en un ADR nuevo antes de iniciar la implementación (ver Handoff). Si en el futuro el volumen de datos supera la cuota o se requieren consultas más complejas, migrar a IndexedDB queda como decisión de evolución, no como bloqueo actual.

Como nota secundaria (no bloqueante, pero derivada de esta decisión): dado que toda la interacción con `localStorage` y Zustand ocurre en el cliente, los componentes que lean/escriban el store deben marcarse `'use client'` explícitamente; el layout raíz y cualquier chrome estático pueden permanecer como Server Components. Esto es una convención de código a aplicar por feature, no requiere una decisión adicional de investigación.

## Impacto en el artefacto

No aplica una única US — la recomendación debe formalizarse como ADR-011 (o siguiente número disponible) antes de implementar TK/tareas técnicas de US-30272, US-30273 y US-30274, ya que las tres consumen la misma capa de persistencia. Una vez exista el ADR, referenciarlo desde las tres historias (sección "Referencias") para que quede trazado.

## Fuentes

- [Zustand — Persisting store data](https://zustand.docs.pmnd.rs/reference/integrations/persisting-store-data)
- [GitHub Discussion — How can I use zustand persist with indexeddb? (pmndrs/zustand #1721)](https://github.com/pmndrs/zustand/discussions/1721)
- [MDN — Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- [RxDB — IndexedDB Max Storage Size Limit: Detailed Best Practices](https://rxdb.info/articles/indexeddb-max-storage-limit.html)
- [RxDB — LocalStorage vs. IndexedDB vs. Cookies vs. OPFS vs. WASM-SQLite](https://rxdb.info/articles/localstorage-indexeddb-cookies-opfs-sqlite-wasm.html)
