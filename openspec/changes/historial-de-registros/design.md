## Contexto

Se construye sobre `fundamentos` (tipos compartidos, persistencia, store raíz con CRUD crudo para Project/Task/TimeRecord, shell de la app). [US-003](../../../docs/specs/user-stories/US-003-historial-de-registros/README.md) es agregación y presentación de solo lectura sobre datos ya persistidos a través de ese store — este change los lee mediante `listProjects`/`listTasks`/`listTimeRecords` crudos de `fundamentos`, sin importar si los TimeRecords fueron producidos a través de las pantallas de `tareas` (posiblemente aún no implementadas) o sembrados directamente para pruebas. Esto es lo que elimina la dependencia funcional de `proyectos`/`tareas` y permite implementar los tres changes en paralelo.

## Objetivos / No-Objetivos

**Objetivos:**

- Implementar el listado completo del historial y los totales por Tarea, Proyecto y mes según US-003.
- Cumplir el presupuesto de renderizado de <2s para hasta 1.000 Time Records.
- Aplicar la regla de atribución de cruce de mes mediante el helper compartido `getRecordMonth` de `fundamentos`, manteniéndolo idéntico al que usa la tarjeta de estadística "Total Mensual" del change `tareas`.
- Coincidir con el prototipo de Figma y con DESIGN.md.

**No-Objetivos:**

- Tipos compartidos, persistencia, store raíz, `getRecordMonth`, o shell de la app/sidebar — cubiertos por el change `fundamentos`; este change solo los consume.
- Crear, editar o eliminar Time Records — fuera de alcance; este change es de solo lectura (eso es `tareas`).
- Prorratear una sesión de timer a través de un límite de mes — rechazado explícitamente por la investigación (RS-001); la duración completa va al mes de la Hora de Inicio.
- Cualquier mecanismo de almacenamiento más allá de `localStorage` — confirmado como suficiente por RS-002 en este volumen; IndexedDB queda documentado solo como una vía de actualización futura si el volumen crece bien por encima de 1.000 registros.
- Un resumen distinto de "total semanal" en esta pantalla — el Total/Meta Semanal vive en la pantalla de Tareas, entregado por el change `tareas`.

## Decisiones

1. **Atribución de mes: por Hora de Inicio, sin prorrateo.** El mes de un Time Record es siempre `Registro.Fecha` (entradas manuales) o la fecha de `HoraInicio` (registros generados por timer), según US-003 AC-004 y el hallazgo de [RS-001](../../../docs/specs/user-stories/US-003-historial-de-registros/research/RS-001-regla-cruce-de-mes.md) de que esto coincide con el estándar de la industria (Toggl, QuickBooks Time sin split) y no requiere nuevo estado persistido (no divide un registro en dos). Usa `getRecordMonth(record: TimeRecord): YearMonth` de `fundamentos` — este change no implementa su propia copia.
2. **Totales calculados como selectores derivados, no como agregados persistidos.** El total por Tarea, el total por Proyecto y el total por mes son todos reducciones `O(n)` sobre el array de Time Records en memoria al momento de la lectura, no mantenidos incrementalmente en cada escritura. Más simple y, según el benchmark de RS-002, ampliamente dentro del presupuesto de 2 segundos con 1.000 registros (el costo de agregación es del orden de milisegundos de un solo dígito; la propia lectura del almacenamiento es el costo mayor, aunque igualmente pequeño).
3. **`localStorage` mediante `persist` de Zustand, sin IndexedDB**, confirmado por RS-002 específicamente contra el requisito de <2s/1.000 registros de este change — el adaptador de almacenamiento de `fundamentos` se reutiliza sin modificaciones.
4. **Paginación/virtualización deliberadamente postergada.** Con 1.000 registros, la tabla completa se renderiza dentro del presupuesto sin virtualización (según el análisis de costos de RS-002); si el uso real crece bien por encima de eso, la virtualización de listas es el próximo paso documentado, no una optimización prematura ahora.
5. **Fixture de rendimiento sembrado mediante el `addTimeRecord` crudo de `fundamentos`.** El conjunto de datos de 1.000 registros usado para la verificación de rendimiento (Decisiones anteriores) se genera directamente contra el store crudo, independientemente de si la UI de timer/entrada manual de `tareas` ya está lista — el mecanismo que permite implementar este change en paralelo con `tareas`.

## Riesgos / Compromisos

- **[Riesgo] El presupuesto de rendimiento de 1.000 registros (AC-005) es el único requisito de este change que necesita una medición real, no solo revisión de código.** → Mitigación: `tasks.md` incluye una verificación de rendimiento dedicada basada en fixture (conjunto de datos de 1.000 registros, aserción de tiempo de renderizado) en lugar de tratarlo como implícitamente satisfecho.
- **[Riesgo] Calcular los totales como reducciones al momento de la lectura podría degradarse si la cantidad de registros crece mucho más allá del objetivo de 1.000 registros usado para validar el rendimiento.** → Mitigación: la lógica de agregación está aislada en funciones selectoras (Decisión 2), lo que hace que un futuro cambio a totales memoizados/incrementales sea un cambio localizado si alguna vez se necesita.
- **[Compromiso] Asignar los registros que cruzan de mes en su totalidad al mes de la Hora de Inicio (Decisión 1) es la regla más simple, no la más "precisa" (existe una regla de prorrateo en la industria, p. ej. el split opcional de QuickBooks Time).** → Aceptado según la recomendación de RS-001: la precisión a nivel de minuto a través de un límite de mes no es requerida por AC-004 y no vale la pena la complejidad adicional del modelo de datos para una herramienta personal offline.

## Plan de Migración

No aplica — funcionalidad de solo lectura, sin nuevo esquema persistido. Sin cambios al `schemaVersion` del store establecido por `fundamentos`.

## Preguntas Abiertas

Ninguna bloqueante. La regla de cruce de mes y la decisión del mecanismo de almacenamiento se resolvieron mediante `work-research` (RS-001, RS-002) antes de que se propusiera este change.
