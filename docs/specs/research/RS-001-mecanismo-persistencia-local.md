# RS-001 — Mecanismo de almacenamiento local para Time Tracker

Estado: Ready
Dominio: Técnica
Artefacto referenciado: N/A (afecta transversalmente a US-30272, US-30273 y US-30274)
Creado por: juanca202
Fecha: 2026-07-09

## Pregunta de investigación

¿Existe alguna decisión técnica pendiente que bloquee la implementación de las historias de usuario en `docs/specs/user-stories/`?

## Contexto del artefacto

Investigación independiente que revisa transversalmente las tres historias de usuario existentes (US-30272 Gestión de Tareas, US-30273 Gestión de Proyectos, US-30274 Historial de Registros), todas en `Estado: Ready`, contra la SRS de origen ([SRS-001](../requirements/SRS-001-timetracker-app/README.md)) y los ADRs vigentes, para confirmar que no queden decisiones abiertas que condicionen el desarrollo.

## Hallazgos

### Checklists de DoR de las tres historias

Las tres historias marcan en su propia tabla de Definition of Ready "Sin decisiones técnicas pendientes: Cumple" y "Sin aclaraciones pendientes: Cumple". No hay señales explícitas de "pendiente", "TBD" o "por definir" en ninguno de los README ni en los casos de prueba (`TC-XXX`) de las tres carpetas.

Las únicas dependencias identificadas son de **orden de implementación**, no aclaraciones abiertas:

- US-30272 (Tareas) requiere que exista al menos un Proyecto, por lo que depende de US-30273.
- US-30274 (Historial) requiere Registros de Tiempo generados por US-30272.

Ambas están correctamente documentadas como orden natural de desarrollo, no como bloqueos de alcance.

### Mecanismo de persistencia local: decisión técnica sin resolver

Las tres historias comparten un requisito no trivial que ningún artefacto arquitectónico resuelve todavía:

- La SRS exige almacenamiento local exclusivo y offline-first (RD-002, RDP-001).
- La SRS exige fiabilidad de la persistencia y recuperación consistente tras cierre inesperado o reinicio (RFB-001, RFB-002).
- US-30274 (AC-007) fija un requisito de rendimiento explícito: cargar el historial en menos de 2 segundos para hasta 1000 Registros de Tiempo.
- [ADR-004](../../adr/ADR-004-uso-de-zustand.md) fija Zustand como única librería de manejo de **estado**, pero no menciona nada sobre **persistencia** (ni el middleware `persist` de Zustand, ni IndexedDB, ni una librería como Dexie/idb).
- No existe ningún otro ADR que cubra el mecanismo de almacenamiento.
- No hay código en `src/` que ya lo implemente (`src/` solo contiene `app/`, `components/`, `lib/`, `shared/`).
- Ningún caso de prueba (`TC-XXX`) de las tres historias asume un mecanismo concreto (no se menciona `localStorage` ni `indexedDB` en ninguno).

Esto es relevante porque `localStorage` es síncrono, limitado en tamaño y solo admite strings (requiere serialización manual), mientras que `IndexedDB` es asíncrono, soporta mayor volumen y tipos de datos, pero añade complejidad de implementación. La elección condiciona directamente cómo se resuelven AC-002 en US-30272 y US-30273 (persistencia de Tarea/Proyecto) y el requisito de rendimiento AC-007 en US-30274.

## Conclusión y recomendación

No hay aclaraciones de alcance funcional pendientes en las tres historias: están correctamente especificadas y su `Estado: Ready` es válido para iniciar el trabajo de producto.

Sí existe una **decisión técnica abierta y transversal**: el mecanismo de almacenamiento local (candidatos: `localStorage` directo, middleware `persist` de Zustand sobre `localStorage`, o `IndexedDB` vía una librería como Dexie/idb). Se recomienda:

1. Registrar esta decisión como un nuevo ADR (p. ej. "ADR-011: Mecanismo de persistencia local") antes de comenzar la implementación de cualquiera de las tres historias, dado que las tres dependen de ella.
2. Evaluar explícitamente el candidato frente al requisito de rendimiento de US-30274 (AC-007: <2s para 1000 registros) antes de decidir.

## Impacto en el artefacto

No aplica una única US/WI/MG. El hallazgo debería alimentar un ADR nuevo (dominio Arquitectura) antes de planificar (`work-plan`) o implementar (`work-implement`) tareas técnicas bajo US-30272, US-30273 o US-30274 que toquen la capa de persistencia.

## Fuentes

- [SRS-001: Time Tracker](../requirements/SRS-001-timetracker-app/README.md) — RD-002, RFB-001, RFB-002, RDP-001 (2026-07-08)
- [ADR-004: Uso de Zustand para manejo de estado](../../adr/ADR-004-uso-de-zustand.md) (2026-07-06)
- Revisión directa de `docs/specs/user-stories/US-30272-gestion-de-tareas/README.md`, `US-30273-gestion-de-proyectos/README.md`, `US-30274-historial-de-registros/README.md` y sus carpetas `test-cases/` (2026-07-09)
