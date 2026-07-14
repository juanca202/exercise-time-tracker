# RS-001 — Regla de asignación de mes para un Registro de Tiempo que cruza la medianoche de fin de mes (AC-004)

**Estado**: Ready
**Dominio**: Producto
**Artefacto referenciado**: US-003-historial-de-registros
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Pregunta de investigación

Cuando un Registro de Tiempo (con Hora Inicio y Hora Fin) cruza la medianoche del último día de un mes calendario, ¿a qué mes debe asignarse ese tiempo al calcular un "Total de tiempo acumulado por mes"? ¿Cómo lo resuelven en la práctica herramientas de time tracking conocidas?

## Contexto del artefacto

US-003-historial-de-registros define el criterio **AC-004**: "El sistema DEBE calcular y mostrar el total de tiempo acumulado por mes" (cubierto por TC-010, TC-011, TC-012). El TC-012 (Límite — "Registro que cruza fin de mes") dejó documentada la duda sin resolver. En esta app, el Registro de Tiempo manual se ingresa como Tarea + Fecha única (no rango) + Duración; solo el Registro generado por el temporizador tiene Hora Inicio y Hora Fin reales que podrían cruzar la medianoche de fin de mes (ver [US-002](../../US-002-tareas/README.md), AC-006 a AC-010).

## Hallazgos

### Cómo lo resuelven herramientas de time tracking

- **Toggl Track**: asigna el registro completo a la **fecha de inicio**, por diseño explícito ("time entries are allocated to the start date by design", confirmado por soporte). No hay opción configurable para dividir. El workaround oficial ante quejas de usuarios es partir manualmente el registro a las 23:59.
- **Clockify**: información **contradictoria** entre fuentes — un resultado sugiere agrupación por fecha de inicio, el foro oficial (2022) describe el comportamiento como agrupación por fecha de fin (con usuarios pidiendo volver a fecha de inicio). No se pudo confirmar con certeza el comportamiento vigente en 2026; se trata como incierto.
- **Harvest**: no documenta una regla explícita; la UI (vista "Day", modo "Start and End Times" deshabilita la vista semanal) sugiere que un registro pertenece conceptualmente a un solo día — inferencia, no declaración oficial.
- **QuickBooks Time (TSheets)**: ofrece el ajuste opcional **"Split timesheets at midnight"**, que divide automáticamente el registro en dos entradas en el instante de la medianoche. Es opt-in; sin activarlo, el comportamiento por defecto es igual a Toggl (registro completo al día de inicio).

**Patrón general**: por defecto, la mayoría asigna el registro completo a la **fecha/hora de inicio**. El prorrateo real (dividir en dos) existe solo como feature opcional (QuickBooks Time), lo que confirma que es la solución más precisa pero con complejidad suficiente como para no ser el comportamiento por defecto en ningún producto revisado.

### Convenciones de prorrateo en reportes/nómina

- En nómina por horas, cuando un turno cruza el límite de un período de pago, la práctica estándar es dividir las horas exactamente en el instante del corte (análogo al "split at midnight" de QuickBooks Time).
- El Fact Sheet #23 del DOL (EE.UU.) fija la semana laboral como bloque de 168 horas consecutivas, sin promediar entre semanas — el corte es estricto para cálculo de horas extra.
- El "prorrateo de salario" (proration) es un concepto distinto (fracción de días calendario trabajados por un asalariado que no completa el período), no aplicable directamente al caso de un timer puntual que cruza una fecha.
- En síntesis: el prorrateo exacto es la convención cuando hay presión legal/financiera (nómina, facturación); en herramientas de productividad personal sin esa presión, la convención por defecto observada es más simple (todo al día de inicio).

### Análisis para este caso concreto (registro manual con Fecha única vs. temporizador con Hora Inicio/Fin)

El registro manual de esta app usa Fecha única + Duración, por lo que **no puede** originar el problema de cruce de mes — siempre pertenece a un único mes de forma inequívoca. El cruce de medianoche/mes **solo puede originarse desde el temporizador**. Es un caso de borde poco frecuente en un contexto de uso personal (requiere que el usuario deje el temporizador corriendo exactamente a través de la medianoche del último día del mes).

Opciones de diseño, de menor a mayor complejidad:

1. **Asignar por fecha de inicio** (Toggl; QuickBooks Time sin split activado): se suma la duración íntegra al mes de la Hora Inicio. Sin lógica adicional — unifica el criterio de agrupación mensual entre ambos tipos de registro ("mes del registro" = mes de la fecha del registro, sea la Fecha manual o la Hora Inicio del timer).
2. **Asignar por fecha de fin**: simétrico, pero menos intuitivo ("empecé en octubre, se contó en noviembre") y es el comportamiento cuestionado por los propios usuarios de Clockify según el hilo revisado.
3. **Prorratear/dividir en dos sub-registros** en la medianoche (QuickBooks Time): más preciso, pero exige generar y persistir dos entradas derivadas de una sola sesión de timer, con complicaciones en edición/eliminación. Sobre-ingeniería para una app personal offline-first sin necesidad legal/financiera de precisión por segundo entre meses.

## Conclusión y recomendación

Recomiendo la **Opción 1: asignar el registro completo (temporizador o manual) al mes de su fecha de inicio** (para el temporizador, la Hora Inicio; para el registro manual, la Fecha única ya declarada).

Razones:

- Es el comportamiento por defecto más común en la industria (Toggl explícitamente, QuickBooks Time sin split).
- Unifica el criterio de agrupación mensual entre los dos tipos de registro del sistema, sin regla especial para el temporizador.
- Trivial de implementar sin backend: no requiere dividir un registro en dos entidades persistidas; basta usar `fecha inicio → mes` como clave de agrupación.
- El prorrateo exacto (opción 3) es la práctica más rigurosa en nómina/facturación, pero esa precisión no está exigida por AC-004 tal como está redactado, y agregarla no está justificada para un time tracker personal.

Incertidumbre señalada: el comportamiento exacto de Clockify no pudo confirmarse (fuentes contradictorias, la más reciente de 2022); no se usó como base decisiva.

## Impacto en el artefacto

- **AC-004** se aclara con la regla: "Cuando un Registro de Tiempo generado por el temporizador cruce la medianoche de fin de mes, la totalidad de su Duración se contabiliza en el mes correspondiente a la Hora de Inicio del registro."
- El TC-012 (Límite — cruce de fin de mes) de `test-cases/` puede resolverse con esta regla: el resultado esperado es que el registro se compute íntegro en el mes de inicio.
- No se requiere ningún cambio de modelo de datos (no hay que partir registros en dos), lo que mantiene simple el mecanismo de persistencia local evaluado en [RS-002](./RS-002-persistencia-local-localstorage-vs-indexeddb.md).

## Fuentes

- [Time Entries spanning multiple days don't show up properly in reports - Toggl Community](https://community.toggl.com/t/time-entries-spanning-multiple-days-dont-show-up-properly-in-reports/438)
- [Group Entries by day based on start time rather than end time working past midnight - Clockify Forum](https://forum.clockify.me/t/group-entries-by-day-based-on-start-time-rather-than-end-time-working-past-midnight/1490)
- [Tracking time in Harvest - Harvest Help Center](https://support.getharvest.com/hc/en-us/articles/26871883335821-Tracking-time-in-Harvest)
- [Tracking time: Day view - Harvest Help Center](https://support.getharvest.com/hc/en-us/articles/360048181892-Tracking-time-Day-view)
- [Harvest's two timer modes: Duration & Start and End Times](https://www.getharvest.com/blog/timer-mode)
- [Update company settings for QuickBooks Time - Intuit](https://quickbooks.intuit.com/learn-support/en-us/help-article/product-preferences/quickbooks-time-company-settings/L4JHHheXr_US_en_US)
- [Guide to Pay Periods: Different Types & How to Choose - Paylocity](https://www.paylocity.com/resources/learn/articles/pay-periods/)
- [Prorated Salary: Complete Guide for Employers - Rippling](https://www.rippling.com/blog/prorated-salary)
