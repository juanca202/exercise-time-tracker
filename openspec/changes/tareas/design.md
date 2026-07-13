## Contexto

Se construye sobre el change `fundamentos` (tipos compartidos, persistencia, store raíz con CRUD crudo para Project/Task/TimeRecord, shell de la app). [US-002](../../../docs/specs/user-stories/US-002-tareas/README.md) es la más grande y riesgosa de las tres historias de usuario: combina una gestión de Tareas tipo CRUD con una máquina de estados de cronómetro único a nivel de toda la app (BR-02/BR-03), entrada manual de tiempo, y un cálculo de meta semanal fijo cuyo alcance exacto (lunes-viernes vs. semana calendario completa) se resolvió mediante una investigación dedicada ([RS-001](../../../docs/specs/user-stories/US-002-tareas/research/RS-001-inicio-semana-total-semanal.md)). Dado que `fundamentos` ya provee datos reales de Proyecto (no un fixture), este change no tiene dependencia funcional de la propia pantalla del change `proyectos` y puede implementarse en paralelo con ella.

## Objetivos / No-Objetivos

**Objetivos:**

- Implementar la creación/edición de Tarea, el cronómetro único con auto-detención, la entrada manual, y la Meta Semanal/Total Semanal según US-002.
- Mantener la regla de exclusividad del cronómetro (BR-02/BR-03) aplicada en un solo lugar (el store), sin duplicarla entre los puntos de invocación de la UI.
- Coincidir con el prototipo de Figma y con DESIGN.md.

**No-Objetivos:**

- Tipos compartidos, persistencia, store raíz, o shell de la app/sidebar — cubiertos por el change `fundamentos`; este change solo los consume.
- Gestión de Proyectos (la propia pantalla de Proyectos) — cubierta por el change `proyectos`; este change solo lee Proyectos mediante el `listProjects` crudo de `fundamentos`.
- Historial/reportes sobre todos los Registros de Tiempo — cubierto por `historial-de-registros`.
- Un día de inicio de semana configurable o una meta semanal configurable — ambos están fijados por decisión explícita de producto (BR-05, RS-001), no se exponen como configuraciones en este MVP.
- Prorratear/dividir una sesión de cronómetro a través de un límite de mes — fuera de alcance para este change; la regla de asignación vive en los totales del change `historial-de-registros` (US-003 AC-004), este change solo necesita registrar timestamps de Inicio/Fin precisos.

## Decisiones

1. **El cronómetro como única fuente de verdad en el store compartido**: `activeTimer: { taskId, startedAt } | null`, con un selector derivado "¿el cronómetro de esta Tarea está corriendo?", no como estado local de componente por Tarea. Requerido por BR-02/BR-03 — hay exactamente un lugar que puede estar activo a nivel de toda la app, por lo que no puede vivir en un componente que solo conoce una Tarea.
2. **`startTimer(taskId)` realiza la auto-detención internamente**: si `activeTimer` está definido y pertenece a una Tarea distinta, se detiene (se calcula la Duración, se persiste el Registro de Tiempo) como primer paso de `startTimer`, antes de que arranque el nuevo cronómetro. Esto mantiene la garantía de orden de BR-03 (detener-y-luego-iniciar) dentro de una única acción atómica del store en lugar de depender de la secuenciación en el punto de invocación.
3. **Validación de duración centralizada**: un único guard `isValidDuration(minutes: number): boolean` (`> 0`), compartido por `stopTimer()` y `addManualTimeRecord()` (BR-04), en lugar de duplicar la verificación.
4. **Semana laboral fija de lunes a viernes**: `getWorkweekRange(date: Date)` siempre devuelve lunes 00:00:00–viernes 23:59:59 de la semana que contiene a `date`, con el lunes fijado (no derivado de `Intl.Locale`, según el hallazgo de RS-001 de que la detección del inicio de semana por locale del navegador tiene brechas reales entre navegadores y no simplifica nada aquí). El selector de Total Semanal filtra los Registros de Tiempo mediante este rango; la Meta Semanal es una constante fija de `480` (8h × 5 días), coincidiendo con el mismo alcance lunes-viernes para que el cálculo del porcentaje sea significativo.
5. **La persistencia de Tarea y Registro de Tiempo reutiliza las acciones crudas `addTask`/`updateTask`/`addTimeRecord`** provistas por el change `fundamentos` — no se introduce ningún mecanismo de almacenamiento nuevo, y no se edita el propio módulo del store compartido (según la Decisión 2 del diseño de `fundamentos`).
6. **La edición reutiliza el modal de creación**, el mismo patrón que Proyectos: "Nueva Tarea" recibe una prop `initialValues` opcional y cambia a "Editar Tarea".
7. **Los datos de Proyecto provienen del `listProjects` crudo de `fundamentos`, no de la pantalla de `proyectos`.** El selector de Proyecto del modal "Nueva Tarea" lee cualquier Proyecto que exista en el store compartido, sin importar si fueron creados a través de la pantalla de Proyectos (posiblemente aún no implementada) o sembrados directamente vía `addProject` durante el desarrollo/pruebas — esto es lo que elimina la dependencia funcional de `proyectos`.

## Riesgos / Compromisos

- **[Riesgo] La máquina de estados del cronómetro (iniciar / auto-detener / detener / validación de duración) es la pieza de mayor complejidad y mayor riesgo del MVP** (reflejado en la estimación de 8 puntos de US-002). → Mitigación: aislarla en un único módulo del store con pruebas unitarias que cubran BR-02/BR-03/BR-04 directamente (sin necesidad de UI), antes de conectar la UI.
- **[Riesgo] Agrupar gestión de Tareas + cronómetro + entrada manual + meta semanal en un solo change/US arriesga una implementación grande y difícil de revisar.** → Mitigación: `tasks.md` secuencia esto en grupos completables e independientemente probables.
- **[Compromiso] Fijar la semana laboral a lunes-viernes es una opinión de producto validada con el usuario durante `work-research`, no una necesidad técnica** — documentado aquí para que un futuro pedido de "semana configurable" tenga un lugar claro (`getWorkweekRange`) donde cambiarlo.
- **[Riesgo] El ícono ▷ como única affordance para iniciar el cronómetro es una interacción inferida (confirmada con el usuario, no explícita en las anotaciones originales de Figma).** → Mitigación: cubierto explícitamente por un escenario de la spec `time-tracking` y un paso de QA en la lista de tareas, de modo que una actualización de Figma pueda detectarse como drift de spec.
- **[Riesgo] Si `proyectos` aún no está mergeado, un usuario final no tiene UI para crear un Proyecto, por lo que el selector de Proyecto de "Nueva Tarea" estaría vacío en un despliegue real.** → Mitigación: esto solo afecta el orden de despliegue, no la implementación — para construir y probar este change, los Proyectos se siembran directamente vía `addProject` de `fundamentos`; la verificación de integración final (una vez que ambos changes estén mergeados) vuelve a comprobar el selector contra Proyectos creados a través de la pantalla real de Proyectos.

## Plan de Migración

No aplica — greenfield. Los datos de Tarea y Registro de Tiempo se escriben mediante el CRUD crudo ya establecido por `fundamentos`; no se necesita migración de datos ya que todavía no existen datos de Tarea/Registro de Tiempo.

## Preguntas Abiertas

Ninguna bloqueante. La reutilización del modal de edición, el alcance de la meta semanal, y la affordance de inicio del cronómetro se resolvieron durante `work-define`/`work-research` (ver las Observaciones de US-002 y RS-001).
