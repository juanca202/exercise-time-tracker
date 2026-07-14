## Context

`historial-de-registros` es una feature de solo lectura: consume el store raíz, los tipos de dominio (`RegistroDeTiempo`, `Tarea`, `Proyecto`) y el mecanismo de persistencia (`localStorage` vía Zustand `persist`) que provee la change hermana `fundamentos-infraestructura-compartida`, y presenta datos que en producción genera `gestion-tareas-temporizador` (temporizador e ingreso manual). Ninguna de las dos dependencias bloquea la implementación: el store compartido permite sembrar Registros de Tiempo de prueba directamente vía su CRUD crudo, por lo que este módulo puede construirse y probarse en paralelo.

El AC-004 quedó resuelto por RS-001 (atribución de mes por Hora de Inicio, sin prorrateo) y el AC-005 quedó resuelto por RS-002 (`localStorage` es suficiente para ≤1000 registros, sin necesidad de IndexedDB). Este diseño no reabre esas decisiones; explica cómo se implementan dentro de `src/features/historial/`.

## Goals / Non-Goals

**Goals:**

- Definir cómo se lee y lista el historial completo de Registros de Tiempo desde el store compartido.
- Definir el enfoque de agregación para los totales por Tarea, por Proyecto y por mes, reutilizando el helper compartido de cálculo de mes (no reimplementarlo).
- Fijar cómo se aplica la regla de cruce de medianoche de fin de mes (RS-001) al calcular el total por mes.
- Confirmar el mecanismo de persistencia (`localStorage` vía Zustand `persist`, RS-002) tal como aplica a esta feature.
- Explicar cómo se cumple el presupuesto de <2s para 1000 Registros de Tiempo (selectores derivados/memoizados).
- Definir cómo se manejan datos corruptos/huérfanos sin romper el render.

**Non-Goals:**

- No se diseña la creación, edición ni eliminación de Registros de Tiempo (responsabilidad de `gestion-tareas-temporizador`).
- No se rediseña el store raíz, el adaptador de persistencia ni el helper de cálculo de mes de `fundamentos-infraestructura-compartida`; aquí solo se consumen.
- No se evalúa IndexedDB ni otro mecanismo de almacenamiento alternativo (ya descartado por RS-002 para este volumen).
- No se define la UI pixel-a-pixel (layout, componentes exactos): esos detalles quedan resueltos por AC-006/AC-007 contra DESIGN.md y el prototipo Figma, y se detallan en tasks.md, no en este documento.

## Decisions

### 1. Lectura del historial completo (AC-001)

- El módulo `src/features/historial/` expone un hook (p. ej. `useHistorialRegistros`) que lee el arreglo de Registros de Tiempo directamente del store raíz compartido (sin store propio ni copia de estado), respetando ADR-004 (Zustand como única solución de estado global) y ADR-005 (feature-based: la feature no redefine estado transversal, lo consume).
- La lectura ocurre sobre el estado ya hidratado por Zustand `persist`; se sigue el patrón `hasHydrated` que define `fundamentos-infraestructura-compartida` para evitar problemas de hidratación SSR en el App Router (Next.js 16), renderizando un estado de carga hasta que el store confirme hidratación.
- Manejo de datos corruptos (TC-002): la validación/parseo de lo persistido en `localStorage` es responsabilidad del adaptador de persistencia compartido (fuera de esta feature); esta feature solo debe ser defensiva ante lo que el store expone en memoria: si un `RegistroDeTiempo` individual tiene campos con forma inválida (duración no numérica/negativa, fecha no parseable, referencia a Tarea/Proyecto inexistente), se filtra ese registro puntual de los cálculos y de la lista, sin lanzar excepciones ni interrumpir el render de la pantalla completa. Un fallo total de parseo del storage (JSON inválido) degrada a estado vacío ("No hay registros de tiempo aún") en lugar de pantalla en blanco o crash.

### 2. Agregación por Tarea y por Proyecto (AC-002, AC-003)

- Total por Tarea: selector puro `calcularTotalPorTarea(registros: RegistroDeTiempo[]): Map<TareaId, number>` que agrupa por `tareaId` y suma `duracion`, descartando registros con `duracion` no numérica o `<= 0` y `tareaId` ausente. Una Tarea sin Registros asociados no aparece en el Map y se resuelve a `0` en la capa de presentación (no `undefined`/`NaN`).
- Total por Proyecto: selector puro `calcularTotalPorProyecto` que compone el resultado de `calcularTotalPorTarea` con la relación `Tarea → Proyecto` ya provista por los tipos de dominio compartidos: para cada Proyecto, suma los totales de sus Tareas válidas. Una Tarea cuyo `proyectoId` no resuelve a un Proyecto existente (huérfana) se excluye de todo total de Proyecto sin abortar el cálculo del resto (TC-008); no se crea un cubo "Sin proyecto" en esta iteración por no estar exigido por el AC.
- Esta misma función de total por Proyecto es la que reutiliza (sin duplicar) la pantalla de Proyectos de `gestion-proyectos` para sus stat cards, tal como señala la Observación de US-003; por eso vive en un selector exportable de `src/features/historial/` (o se promueve a `src/shared/` si `gestion-proyectos` la necesita también — decisión de ubicación exacta en tasks.md/TK-XXX, sin impacto en el contrato del cálculo).

### 3. Agregación por mes y regla de cruce de medianoche (AC-004, RS-001)

- Total por mes: selector puro `calcularTotalPorMes(registros: RegistroDeTiempo[]): Map<"YYYY-MM", number>` que agrupa por año-mes de la **fecha de inicio** del registro (Fecha única en el caso manual, Hora de Inicio en el caso del temporizador) y suma `duracion`.
- Esta clave de agrupación se obtiene invocando el helper compartido de cálculo de mes de `fundamentos-infraestructura-compartida` (p. ej. `obtenerClaveMes(fecha: Date): string`); `historial-de-registros` no reimplementa la lógica de atribución de mes, solo la invoca sobre el campo de fecha de inicio de cada registro.
- Por construcción, al agrupar siempre por Hora de Inicio (nunca por Hora Fin ni por un cálculo prorrateado), un Registro que cruza la medianoche de fin de mes queda íntegramente contabilizado en el mes de inicio sin ningún branch especial: la regla de RS-001 se cumple como consecuencia directa de "agrupar por fecha de inicio", no como una excepción añadida al selector.
- Registros con fecha de inicio no parseable se excluyen del cálculo por mes (TC-011), igual criterio defensivo que en los otros dos totales.

### 4. Persistencia (AC-005, RS-002)

- Se usa `localStorage` vía Zustand `persist` en su configuración por defecto, ya resuelta y compartida por `fundamentos-infraestructura-compartida`; esta feature no introduce IndexedDB, Dexie ni otro adaptador. La justificación completa (benchmarks, límites de cuota, comparación con IndexedDB) está en RS-002 y no se repite aquí.

### 5. Cumplimiento del presupuesto de rendimiento (<2s / 1000 registros, AC-005)

- Los tres selectores (`calcularTotalPorTarea`, `calcularTotalPorProyecto`, `calcularTotalPorMes`) son funciones puras O(n) sobre el arreglo de Registros de Tiempo (un único recorrido con acumulación en `Map`), evitando complejidad cuadrática.
- Se envuelven en selectores derivados memoizados (p. ej. vía el propio Zustand con comparadores superficiales, o `useMemo` en los hooks de la feature) para que la agregación solo se recalcule cuando cambie el arreglo de Registros de Tiempo, no en cada render de la pantalla.
- Dado que RS-002 midió que la lectura/parseo de ~1000 registros pequeños vía `localStorage` toma unos pocos milisegundos y la agregación en memoria es del mismo orden, el presupuesto de 2000 ms tiene margen amplio (~2-3 órdenes de magnitud); no se requiere virtualización de lista, paginación ni web workers para este volumen. Si el volumen creciera muy por encima de 1000 registros en el futuro, esas técnicas quedarían como opciones de escalado, fuera del alcance actual.
- La medición de este AC se hace a nivel E2E (Playwright, marca de tiempo navegación → contenido interactivo) según TC-013/TC-014, no como micro-benchmark unitario.

### 6. Adherencia visual (AC-006, AC-007)

- La pantalla se construye con componentes de Base UI (ADR-003) estilizados con Tailwind CSS (ADR-002), usando los tokens de `DESIGN.md` (tema "Precision Focus": paleta, tipografía Inter/JetBrains Mono, radios, elevación) sin estilos hardcodeados fuera de esos tokens.
- El layout, las stat cards de totales y la tabla/lista de historial replican el prototipo de Figma referenciado en US-003; el detalle de maquetación concreta (qué stat cards se muestran, orden de columnas) se resuelve en tasks.md/TK-XXX, no en este documento.

## Risks / Trade-offs

- [Los selectores puros recorren todo el arreglo en cada recálculo] → Mitigado por memoización basada en la identidad/versión del arreglo de Registros de Tiempo; a 1000 registros el costo absoluto es despreciable frente al presupuesto de 2s (ver RS-002).
- [Tareas/Registros huérfanos o con datos inválidos podrían ocultar información al usuario sin aviso] → Se documenta como comportamiento esperado por los AC/TC (excluir del cálculo sin corromper los totales válidos); si en el futuro se requiere visibilidad explícita de datos descartados, se abordaría como una mejora incremental, no bloqueante para esta change.
- [Ubicación del selector de total por Proyecto compartido con `gestion-proyectos`] → Se deja abierta como decisión de ubicación de archivo (feature vs. `src/shared/`) para tasks.md, sin impacto en el contrato ni en los ACs, evitando duplicar la regla de negocio en dos lugares.
- [Volumen futuro muy por encima de 1000 registros] → Fuera de alcance de esta change; RS-002 ya documenta el criterio de migración a IndexedDB/Dexie si ese escenario se materializa.

## Migration Plan

No aplica migración de datos: esta change es greenfield y de solo lectura, no introduce cambios de esquema ni de mecanismo de persistencia (reutiliza el ya definido por `fundamentos-infraestructura-compartida`). El despliegue consiste en agregar el módulo `src/features/historial/` y su entrada de navegación en el layout/sidebar compartido; no requiere rollback especial más allá de revertir el commit/PR si se detectan regresiones.

## Open Questions

- Ubicación final del selector de total por Proyecto (dentro de `src/features/historial/` con export público, o promovido a `src/shared/`) cuando `gestion-proyectos` lo consuma: se resuelve en la primera tarea técnica que integre ambas pantallas, sin bloquear el desarrollo de esta feature.
- Presentación visual específica del total por Tarea (AC-002), que el prototipo Figma no distingue con una tarjeta propia: se resuelve como detalle de maquetación en tasks.md/TK-XXX.
