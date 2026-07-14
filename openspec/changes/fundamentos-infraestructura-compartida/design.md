## Context

Time Tracker es una aplicación greenfield, offline-first y sin backend (SRS-001 §2.1, §2.4): Proyecto, Tarea y Registro de Tiempo se persisten exclusivamente en el almacenamiento local del dispositivo. Esta historia (US-000) es la primera del flujo y actúa como cuello de botella duro (BR-03): nada de lo que dependa de ella (Proyectos, Tareas, Historial de registros) puede avanzar hasta que quede completa. El proyecto sigue ADR-001 (App Router exclusivo), ADR-002 (Tailwind CSS), ADR-003 (Base UI), ADR-004 (Zustand) y ADR-005 (arquitectura feature-based: código transversal a más de una feature vive en `src/shared/`, no dentro de una feature concreta).

Actualmente `src/shared/` y `src/app/` solo contienen el scaffolding por defecto de Next.js: no existe código de dominio previo que migrar.

## Goals / Non-Goals

**Goals:**

- Fijar de una sola vez los tipos de dominio, la persistencia local, el store raíz y el app shell de navegación como una superficie de API estable y completa.
- Permitir que Proyectos, Tareas e Historial de registros se implementen en paralelo sin tocar los mismos archivos ni depender funcionalmente entre sí.
- Evitar errores de hydration-mismatch al leer estado persistido en un componente cliente.
- Proveer un único punto de cálculo del mes calendario de un Registro de Tiempo, reutilizable sin duplicación ni acoplamiento cruzado entre Tareas e Historial.
- Ofrecer un layout y sidebar visualmente fieles al frame Figma "Aside - SideNavBar", navegables sin red y sin autenticación.

**Non-Goals:**

- Validación de campos, reglas de negocio o máquinas de estado propias de cada historia funcional (p. ej. estados del temporizador, meta semanal, selectores de totales): quedan fuera de alcance y son responsabilidad de US-001, US-002 y US-003 respectivamente (BR-01).
- Contenido final de las pantallas `/tareas`, `/proyectos`, `/historial`: aquí solo se resuelven como stubs "Próximamente".
- Sincronización remota, backend o multiusuario: fuera de alcance por diseño (offline-first, SRS-001 §2.4).

## Decisions

### 1. Ubicación de los tipos de dominio

Los tipos de dominio (`Proyecto`, `Tarea`, `RegistroDeTiempo`, `TemporizadorActivo`) se definen en un único módulo compartido, `src/shared/domain/types.ts` (o equivalente `src/shared/domain/` con un archivo por entidad y un `index.ts` de re-export), conforme a ADR-005: es código consumido por más de una feature futura y por tanto no puede vivir dentro de ninguna de ellas. Los tipos incluyen todos los campos necesarios para el dominio completo descrito en SRS-001 §2.2/§3.1 (identificador, relaciones obligatorias Tarea→Proyecto y RegistroDeTiempo→Tarea, campos temporales, duración), sin placeholders ni campos "por definir" (AC-001). Cada historia funcional (Proyectos, Tareas, Historial) importa estos tipos; ninguna los redefine ni los extiende, evitando divergencia de forma entre historias.

Alternativa considerada: definir los tipos dentro de cada feature y unificarlos luego. Descartada porque reintroduce exactamente el problema que esta historia busca resolver (colisión y divergencia entre historias que se implementan en paralelo).

### 2. Forma del adaptador de persistencia (AC-002)

Se implementa un adaptador de persistencia local en `src/shared/persistence/` con una interfaz reducida y estable:

- `leer(): EstadoPersistido | null` — lectura síncrona del estado guardado.
- `escribir(estado: EstadoPersistido): void` — escritura completa del estado (persistencia local vía `localStorage` u otro storage local disponible en el navegador).
- `suscribir(listener: (estado: EstadoPersistido) => void): () => void` — notifica cambios externos (p. ej. otra pestaña) y devuelve una función de desuscripción.
- Un campo `version` (versión de esquema) dentro de `EstadoPersistido`, incrementado cada vez que cambie la forma de los datos persistidos, para permitir una futura migración de esquema sin perder datos existentes.

Esta interfaz es deliberadamente pequeña: no expone operaciones parciales por entidad (eso es responsabilidad del store raíz), solo lectura/escritura/suscripción del estado completo más versión. Esto la hace estable frente a cambios funcionales futuros (BR-03): agregar una entidad o un campo no cambia la forma del adaptador, solo el contenido de `EstadoPersistido`.

Alternativa considerada: usar IndexedDB directamente desde cada feature. Descartada porque expondría detalles de storage a las historias funcionales, violando BR-03 y complicando el testing (ADR-007 exige pruebas deterministas y aisladas).

### 3. Gate de hidratación (AC-004)

El store raíz expone un flag `haHidratado: boolean` (inicialmente `false`). El middleware `persist` de Zustand (o un `onRehydrateStorage` equivalente construido sobre el adaptador de persistencia) marca `haHidratado = true` una vez completada la lectura desde el storage local en el cliente. Todo componente que lea datos persistidos (proyectos, tareas, registros) DEBE comprobar `haHidratado` antes de renderizar contenido dependiente de esos datos; mientras `haHidratado` es `false`, se renderiza un estado neutro/vacío que coincide entre servidor y cliente. Esto evita el error clásico de Next.js de hydration-mismatch al leer `localStorage` (inexistente en el servidor) durante el primer render.

Alternativa considerada: usar `useEffect` ad-hoc en cada componente para posponer la lectura. Descartada porque duplicaría el mismo patrón en cada historia funcional; centralizarlo en el store raíz cumple BR-03.

### 4. Solicitud de almacenamiento persistente (AC-005)

Al montar el layout raíz (client component), se invoca de forma best-effort `navigator.storage?.persist?.()` si la API existe en el navegador. La llamada no bloquea el render, no requiere que el usuario conceda permiso explícito, y su resultado (concedido o no) no condiciona ninguna funcionalidad: es una mejora de fiabilidad frente a que el navegador purgue el storage local bajo presión de espacio, no un requisito funcional. Se ubica en el layout raíz (no en el store) porque es un efecto de arranque de la aplicación, no una operación de datos.

### 5. Helper compartido de mes calendario (AC-006)

Se provee una única función pura, `obtenerMesCalendario(registro: RegistroDeTiempo): string` (o `Date`/clave `YYYY-MM`, a definir en planificación técnica), en `src/shared/date/mes-calendario.ts`. Tareas (para agrupar/filtrar por mes) e Historial de registros (para reportes mensuales) importan esta misma función desde `src/shared/`; ninguna la reimplementa ni depende de la implementación de la otra historia para obtenerla. Al ser una función pura sin estado, ambas historias pueden testearla y consumirla de forma aislada (ADR-007).

Alternativa considerada: que Historial de registros exponga el cálculo y que Tareas lo importe desde ahí. Descartada explícitamente porque crea una dependencia funcional directa entre dos historias que deben poder implementarse en paralelo sin orden de precedencia entre sí.

### 6. Layout, sidebar y rutas stub (AC-007, AC-008, AC-009, AC-011, AC-012)

El layout raíz vive en `src/app/layout.tsx` e incluye un componente de sidebar (`src/shared/ui/sidebar` o equivalente) construido sobre primitivas de Base UI y estilizado con Tailwind CSS, replicando fielmente colores, tipografía, espaciado y componentes del frame Figma "Aside - SideNavBar" (AC-012). El sidebar contiene enlaces de navegación a las rutas finales `/tareas`, `/proyectos`, `/historial` usando el componente `Link` de Next.js (navegación sin recarga completa, sin red). Cada ruta se resuelve con una página mínima bajo `src/app/tareas/page.tsx`, `src/app/proyectos/page.tsx`, `src/app/historial/page.tsx`, cada una con un placeholder "Próximamente" (AC-008). Ninguna ruta ni el layout requieren autenticación ni gate de acceso (AC-009); no se realiza ninguna llamada de red ni a servicios externos, por lo que la app shell funciona íntegramente con la red deshabilitada (AC-011).

### 7. Por qué esto es un cuello de botella duro (BR-03 / AC-010)

El store raíz, el adaptador de persistencia, el layout y el sidebar son la única superficie de API estable que Proyectos, Tareas e Historial de registros consumen. Esto es intencional y no un accidente de diseño:

- El **store raíz** solo expone CRUD crudo por entidad (crear/actualizar/listar); cada historia funcional construye su propia lógica de negocio (validaciones, selectores derivados, máquinas de estado) en su propia feature, componiendo sobre ese CRUD sin necesitar cambiar su firma.
- El **adaptador de persistencia** expone solo lectura/escritura/suscripción del estado completo más versión de esquema; agregar campos a una entidad no cambia esta interfaz.
- El **layout y el sidebar** ya declaran los enlaces a las 3 rutas finales desde el día uno; cada historia funcional reemplaza el contenido de su propia página (`/tareas`, `/proyectos`, `/historial`) sin tocar el layout que la envuelve.

Como consecuencia, una vez completada esta historia, ninguna tarea técnica de Proyectos, Tareas o Historial de registros debería requerir un pull request que modifique `src/shared/domain/`, `src/shared/persistence/`, `src/app/layout.tsx` o el componente de sidebar. Si una historia funcional futura necesitara modificar alguno de estos archivos para agregar su propia lógica, eso señala un defecto de diseño en esta base (API insuficiente) y no una evolución normal esperada — es la señal explícita para revisar esta capacidad antes de continuar.

## Risks / Trade-offs

- [Riesgo: la interfaz de CRUD crudo del store puede quedar demasiado genérica y forzar a cada historia a reimplementar lógica de acceso similar] → Mitigación: mantener el CRUD tipado por entidad (no un CRUD genérico sin tipos) para que cada historia obtenga autocompletado y seguridad de tipos sin necesitar helpers adicionales compartidos.
- [Riesgo: cambios futuros al esquema de datos persistidos rompen datos ya guardados en dispositivos de usuarios] → Mitigación: el campo `version` en `EstadoPersistido` permite detectar la versión guardada y aplicar una migración incremental antes de exponer los datos al store (mecanismo de migración concreto queda fuera de alcance de US-000, pero el campo que lo habilita se entrega aquí).
- [Riesgo: `navigator.storage.persist()` no está disponible en todos los navegadores] → Mitigación: la llamada es best-effort y opcional (optional chaining), la app funciona igual si la API no existe o el permiso es denegado.
- [Riesgo: el gate de hidratación introduce un parpadeo visual (flash) en el primer render mientras `haHidratado` es `false`] → Mitigación: el estado neutro mostrado antes de hidratar debe ser mínimo y consistente con el diseño (p. ej. mismo layout, contenido vacío) para minimizar el impacto visual; el tiempo de hidratación desde `localStorage` es del orden de milisegundos.
- [Riesgo: divergencia visual respecto al frame Figma por interpretación subjetiva de espaciado/color] → Mitigación: extraer tokens de diseño (color, tipografía, espaciado) directamente del frame Figma referenciado y mapearlos a la configuración de Tailwind, en lugar de aproximarlos a ojo.

## Migration Plan

No aplica: proyecto greenfield sin datos ni código de dominio previo que migrar. El único paso de "migración" es la implementación inicial de los módulos descritos, sin pasos de rollback más allá de revertir el commit/PR si se detectan defectos antes de mergear.

## Open Questions

Ninguna: BR-01, BR-02, BR-03 y los AC-001 a AC-012 dejan cerradas las decisiones necesarias para esta historia (ver DoR de US-000, "Sin decisiones técnicas pendientes: Cumple"). El nombre exacto de archivos/carpetas dentro de `src/shared/` puede ajustarse en planificación técnica sin afectar el contrato descrito aquí.
