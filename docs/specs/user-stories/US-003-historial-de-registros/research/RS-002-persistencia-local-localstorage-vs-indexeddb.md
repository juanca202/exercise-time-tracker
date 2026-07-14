# RS-002 — Viabilidad técnica de localStorage vs. IndexedDB para el requisito de rendimiento (AC-005)

**Estado**: Ready
**Dominio**: Técnica
**Artefacto referenciado**: US-003-historial-de-registros
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Pregunta de investigación

¿Es viable usar `localStorage`, o es necesario usar IndexedDB, para persistir los datos de Time Tracker (Next.js 16, App Router, React 19, TypeScript, sin backend, offline-first) de modo que la visualización de un historial de hasta 1000 Registros de Tiempo (con cálculos de totales por Tarea, Proyecto y mes) cargue en menos de 2 segundos?

## Contexto del artefacto

US-003-historial-de-registros define **AC-005**: "La visualización de los reportes de tiempo (por Tarea, Proyecto y mes) DEBE cargar en menos de 2 segundos para un volumen de hasta 1000 Registros de Tiempo" (cubierto por TC-013, TC-014). Las tres US (US-001, US-002, US-003) dejaron el "mecanismo concreto de almacenamiento local" pendiente de `work-plan`/`TK-XXX`. El stack usa Zustand para manejo de estado.

## Hallazgos

### localStorage: límites y rendimiento

- Límite típico: ~5 MiB de `localStorage` por origen (MDN documenta hasta 10 MiB por origen entre `localStorage` + `sessionStorage`); al exceder lanza `QuotaExceededError`. Un dataset de 1000 Registros de Tiempo con pocos campos (fecha, tarea, proyecto, duración) genera un JSON de decenas a cientos de KB — muy por debajo del límite.
- API síncrona: bloquea el hilo principal. Benchmarks con ~500 KB muestran escrituras de ~5.9 ms y lecturas de ~3.3 ms de media; para 1 MB se estima un bloqueo de 100-200 ms en dispositivos modestos — muy por debajo del presupuesto de 2 s.
- El costo dominante es `JSON.stringify`/`JSON.parse`, no el I/O; para 1000 registros pequeños es de pocos milisegundos.
- Riesgo no relacionado con rendimiento: en Safari, con "Intelligent Tracking Prevention", los datos de orígenes sin interacción en 7+ días pueden purgarse — relevante para uso esporádico, mitigable con `navigator.storage.persist()` (aplica igual a localStorage e IndexedDB).

### IndexedDB: límites y rendimiento

- Límite sustancialmente mayor (Chrome/Edge hasta 60% del disco, Firefox 10%-50% según modo, Safari ~60%) — irrelevante para un dataset <1 MB.
- API asíncrona: no bloquea el hilo principal. Para payloads >500 KB puede reducir el tiempo de respuesta hasta un 40% frente a localStorage, según benchmarks de terceros.
- Contrapunto para este caso: con payloads pequeños (~500 KB o menos), el overhead de apertura de transacción de IndexedDB (o wrappers como localForage) puede ser _más lento en términos absolutos_ que localStorage nativo — un benchmark citado mostró 341 ms (SET) / 184 ms (GET) vía localForage/IndexedDB contra 5.9 ms / 3.3 ms vía localStorage nativo para ~500 KB.
- Con Zustand `persist`, un storage asíncrono hace que la hidratación del store ocurra en un microtask posterior al render inicial — el store no está hidratado en el primer render, exigiendo manejar un flag `hasHydrated`. Con localStorage (síncrono) esto no aplica.

### Librerías recomendadas para IndexedDB en 2026

- **idb** (Jake Archibald/Google): wrapper minimalista basado en promesas sobre la API nativa, muy maduro (~20M descargas/semana).
- **Dexie.js**: la opción más completa — tablas tipadas, queries indexadas, transacciones, versionado de esquema, `dexie-react-hooks` para reactividad en React. Muy mantenida (v4.4.2, ~1.5M descargas/semana); recomendada si se necesita tratar IndexedDB como "backend real" con consultas por tarea/proyecto/mes.
- **idb-keyval / localForage**: wrappers clave-valor simples, usables como adapter de storage para Zustand `persist` (patrón documentado oficialmente por Zustand con `idb-keyval` + `createJSONStorage`).
- **zustand-indexeddb**: paquete específico con `createIndexedDBStorage` para el middleware `persist`.
- Nota: usar `createJSONStorage` (serializa a string) sobre IndexedDB desvirtúa parcialmente su ventaja (almacenar tipos no serializables sin conversión manual); si se opta por IndexedDB, Dexie con su propio esquema tipado aprovecha mejor la API que forzar serialización JSON vía el adapter de Zustand.

### Consideraciones de SSR en Next.js 16 App Router

- Usar `window`, `localStorage` o IndexedDB durante el render es causa común de errores de hidratación en Next.js, porque no existen en el servidor (documentado oficialmente).
- Patrones recomendados: (1) `useEffect` + flag `isClient`/`hasHydrated` — renderizar igual en servidor y cliente en el primer render, leer el storage solo tras el `useEffect`; (2) `dynamic(() => import(...), { ssr: false })` para componentes fuertemente dependientes del storage; (3) `suppressHydrationWarning` solo como escape hatch puntual.
- Para Zustand `persist`, se recomienda un hook custom (`useHasHydrated`) que retrase el uso de los datos persistidos hasta que la hidratación termine — el mismo patrón aplica con localStorage (hidratación inmediata/síncrona) o IndexedDB (hidratación en microtask posterior).

## Conclusión y recomendación

**Para este caso concreto (≤1000 Registros de Tiempo, dataset <1 MB, app personal offline-first, requisito <2s), `localStorage` es técnicamente suficiente y es la opción recomendada como base**, con Zustand `persist` en su configuración por defecto.

Justificación:

- El presupuesto de 2 s es ~100-1000x mayor que el costo real medido para este volumen (lectura + parseo + agregación en memoria del orden de <10 ms).
- Para payloads pequeños, la ventaja de IndexedDB no se materializa — el overhead de sus transacciones (o wrappers) puede ser más lento en términos absolutos que localStorage nativo.
- localStorage evita la complejidad de manejar hidratación asíncrona en Zustand (flag `hasHydrated`, riesgo de parpadeo de datos vacíos).
- No añade una dependencia (idb/Dexie/idb-keyval) para un problema que no existe a este volumen.

**Cuándo migrar a IndexedDB**: si el volumen crece de forma sostenida más allá de unos pocos MB (cientos de miles de registros o adjuntos binarios), o si la resiliencia frente a purgas de Safari ITP se vuelve crítica. En ese caso, **Dexie.js** (si se necesitan consultas indexadas nativas por tarea/proyecto/mes) o **idb** (capa más ligera), aplicando el patrón `useEffect`/`hasHydrated` + eventualmente `dynamic(..., { ssr: false })`, y considerando `navigator.storage.persist()`.

**No es necesario usar IndexedDB para cumplir AC-005 con el volumen actual; localStorage cumple con amplio margen.**

Nota metodológica: el dato de "40% de mejora con IndexedDB para payloads >500KB" y los benchmarks de idb/Dexie provienen de blogs técnicos de 2025-2026 (no de documentación oficial de rendimiento), se tratan como indicativos, no normativos. El límite exacto de localStorage también varía ligeramente entre fuentes (5 MiB vs "hasta 10 MiB total del origen" según MDN); para un dataset <1 MB la diferencia es irrelevante.

## Impacto en el artefacto

- No requiere cambios en los AC-XXX de US-001, US-002 o US-003 — todas ya dejaban el mecanismo concreto de almacenamiento local para `work-plan`/`TK-XXX`.
- Queda como referencia técnica para las `TK-XXX` de persistencia que se planifiquen en `work-plan`: usar `localStorage` vía Zustand `persist` (configuración por defecto) como mecanismo base, sin IndexedDB, Dexie ni idb en esta primera versión.
- Relevante también para US-001 (Proyectos) y US-002 (Tareas), que comparten el mismo mecanismo de persistencia local.

## Fuentes

- [Storage quotas and eviction criteria - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- [localStorage is not async, but it's FAST! - Peterbe.com](https://www.peterbe.com/plog/localstorage-is-fast)
- [Why IndexedDB Beats localStorage: Performance, Capacity, and Security Explained | BestHub](https://www.besthub.dev/articles/why-indexeddb-beats-localstorage-performance-capacity-and-security-explained-ce8108875e32)
- [IndexedDB vs LocalStorage vs Cookies: when to use each (2026) - Dirag Biswas](https://diragb.dev/blog/indexeddb-vs-localstorage-vs-cookies/)
- [Dexie.js vs localForage vs idb 2026 — PkgPulse Guides](https://www.pkgpulse.com/guides/dexie-vs-localforage-vs-idb-indexeddb-browser-storage-2026)
- [Which IndexedDB Library Should I Use: Dexie vs idb vs RxDB? | BSWEN](https://docs.bswen.com/blog/2026-04-07-indexeddb-libraries-dexie-idb-rxdb/)
- [Dexie.js - Build Offline-First Apps with IndexedDB Made Simple](https://dexie.org/)
- [Persisting store data - Zustand (docs)](https://zustand.docs.pmnd.rs/reference/integrations/persisting-store-data)
- [How can I use zustand persist with indexeddb? · pmndrs/zustand · Discussion #1721](https://github.com/pmndrs/zustand/discussions/1721)
- [GitHub - zustandjs/zustand-indexeddb](https://github.com/zustandjs/zustand-indexeddb)
- [Text content does not match server-rendered HTML | Next.js docs](https://nextjs.org/docs/messages/react-hydration-error)
- [Using localStorage in Modern Applications - A Comprehensive Guide | RxDB](https://rxdb.info/articles/localstorage.html)
