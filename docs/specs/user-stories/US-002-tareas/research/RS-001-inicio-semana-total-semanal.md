# RS-001 — Inicio de la semana en curso para el cálculo del Total Semanal (AC-018)

**Estado**: Ready
**Dominio**: Producto
**Artefacto referenciado**: US-002-tareas
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Pregunta de investigación

¿Qué día debe considerarse el inicio de la "semana en curso" para calcular el Total Semanal de tiempo trabajado (Lunes o Domingo), según el estándar ISO 8601 y según la convención habitual en herramientas de time tracking similares (Toggl, Clockify, Harvest, RescueTime)?

## Contexto del artefacto

US-002-tareas define el criterio **AC-018**: "El sistema DEBE calcular y mostrar el Total Semanal de tiempo acumulado, sumando los Registros de Tiempo (por temporizador y manuales) generados durante la semana en curso" (cubierto por TC-020 y TC-021). No se especificó el día de inicio de semana. La misma historia fija, vía **BR-05 / AC-017**, una Meta Semanal no configurable de 40 horas (8 h × 5 días laborales, Lunes a Viernes). La app es Next.js, sin backend, con persistencia local (offline-first).

## Hallazgos

### ISO 8601

El estándar ISO 8601 establece explícitamente que la semana comienza en **Lunes** y termina en Domingo (Domingo es el 7º y último día). La numeración de semanas ISO ("semana 01" = la semana que contiene el primer jueves de enero) se apoya en esta misma convención de semana Lunes-Domingo. Esta es también la convención habitual en Europa, Reino Unido, China y la mayoría de países que siguen normas ISO de fecha/hora para uso empresarial y de software. Contraste relevante: Estados Unidos y Canadá usan convencionalmente Domingo como inicio de semana, pero esto es una convención cultural/regional, no parte del estándar ISO 8601.

### Convención en herramientas de time tracking

- **Toggl Track**: el valor por defecto documentado es **Lunes**; el usuario puede cambiarlo desde su página de perfil ("First Day of the Week") a cualquier otro día. Este ajuste afecta los presets "This Week/Last Week" en los reportes, pero no a los reportes programados por email.
- **Clockify**: cada usuario puede configurar el día de inicio de semana en su perfil; adicionalmente el Owner/Admin puede fijar un valor por defecto a nivel de Workspace (solo aplica a miembros nuevos). Es decir, es configurable por usuario/organización, sin un default único documentado de forma tajante en las fuentes revisadas.
- **Harvest**: originalmente los timesheets siempre empezaban en Lunes; hoy es configurable (Sábado, Domingo o Lunes) desde Account Settings → Preferences, solo por administradores, para alinear el timesheet con la semana laboral/de facturación de la empresa.
- **RescueTime**: permite elegir si la semana laboral comienza en Domingo o Lunes como parte de "Work Settings", lo cual determina también cuándo se envía el reporte semanal por email.

**Patrón identificado**: ninguna de las herramientas revisadas fuerza un único día "correcto" — todas ofrecen Lunes como opción explícita (y en el caso de Toggl y, originalmente, Harvest, como default), y todas permiten configurarlo. No hay consenso absoluto en el dato por defecto, pero Lunes aparece consistentemente como la opción alineada a semana laboral y es el default más citado (Toggl, Harvest histórico).

### Soporte nativo en JavaScript/navegador

- **`Intl.Locale.prototype.getWeekInfo()`** (parte de la propuesta TC39 `proposal-intl-locale-info`) devuelve `{ firstDay, weekend, minimalDays }` según la configuración regional (`firstDay`: 1=Lunes … 7=Domingo). Ejemplo: `en-GB` → `firstDay: 1` (Lunes); `he` (Israel) → `firstDay: 7` (Domingo).
- **Soporte de navegador (vía caniuse, consultado 2026-07-13)**: cobertura global ~90.5%. Soporte completo en Chrome/Edge 130+, Safari 17+, Opera 115+; soporte parcial en versiones intermedias (Chrome/Edge 99-129, Safari iOS 15.4-16.7). **Firefox no lo soporta** en ninguna versión hasta la 152 (llega en la 153+), lo que representa una brecha real para una app que no controla qué navegador usa el usuario final.
- **date-fns**: `startOfWeek` NO es locale-aware por defecto — usa `weekStartsOn: 0` (Domingo) del locale `en-US` salvo que se pase explícitamente un locale o se use `setDefaultOptions`. Hay un feature request abierto (issue #3829 en el repo de date-fns) pidiendo que sea locale-aware por defecto, lo que confirma que hoy no lo es.
- **day.js**: requiere el plugin `weekOfYear`/`localeData` y, análogamente, no infiere automáticamente el inicio de semana del usuario sin configuración explícita del locale.

**Implicación para una app sin backend**: depender de `Intl.Locale.getWeekInfo()` para "adivinar" el inicio de semana según la configuración regional del navegador introduce una brecha de soporte (Firefox) y variabilidad no controlada (dos usuarios con distinto locale verían Totales Semanales con distinto rango de fechas para "la misma semana"), lo cual complica —no simplifica— la trazabilidad y las pruebas (TC-020/TC-021 tendrían que contemplar N locales). Una constante fija en el código (Lunes) es más simple, 100% predecible offline, no depende de compatibilidad de navegador ni de librerías adicionales, y es consistente con la Meta Semanal ya fijada en AC-017/BR-05 como Lunes-Viernes.

## Conclusión y recomendación

**Recomendación: usar Lunes como inicio de la semana en curso para AC-018**, implementado como constante fija en el código (no derivada de `Intl.Locale`/configuración regional del navegador).

Justificación:

1. Es el día que exige el estándar ISO 8601, la referencia más objetiva y libre de ambigüedad cultural.
2. Es consistente con BR-05/AC-017, que ya fija la semana laboral en Lunes-Viernes (5 días) para calcular la Meta Semanal de 40 horas — usar Domingo como inicio de la "semana en curso" mientras la Meta Semanal se basa en Lunes-Viernes generaría una inconsistencia conceptual (el rango de acumulación no coincidiría con el rango de la meta).
3. Es el default (o default histórico) de al menos dos de las cuatro herramientas revisadas (Toggl, Harvest), y las cuatro lo ofrecen como opción válida.
4. Para una app offline-first sin backend, una constante fija es más simple de implementar, probar (TC-020/TC-021) y razonar que depender de `Intl.Locale.getWeekInfo()`, que además tiene un hueco de soporte real en Firefox y no resuelve el problema por sí sola en date-fns/day.js sin configuración explícita de locale.

Si en el futuro se quisiera soportar el caso de usuarios que prefieran Domingo (p. ej. convención US/Canadá), se podría añadir como preferencia configurable por el usuario más adelante — pero esto queda fuera del alcance actual de AC-018, que no menciona configurabilidad, y mantenerlo fijo en Lunes evita ambigüedad para la v1.

## Impacto en el artefacto

- **Decisión final del usuario (2026-07-13):** el Total Semanal DEBE acumularse solo sobre la **semana laboral (Lunes a Viernes)**, no sobre la semana completa (Lunes a Domingo), para que el rango de acumulación coincida exactamente con el rango de la Meta Semanal fija de BR-05/AC-017 (8 h × 5 días laborales). Esto acota el hallazgo de esta investigación (que Lunes es el inicio de semana correcto según ISO 8601 e industria) a la parte de "qué día es el primero"; el rango de días considerados para el Total Semanal queda restringido a Lunes-Viernes por decisión de negocio, no a los 7 días de la semana ISO.
- **AC-018** puede especificarse de forma no ambigua: "...generados durante la semana laboral en curso (Lunes a Viernes, hora local); los Registros de Tiempo del Sábado y Domingo, si existieran, no se incluyen en el Total Semanal".
- Los casos de prueba **TC-020** (happy path) y **TC-021** (excluye semana anterior en el límite) deben fijar el límite de corte en el cambio de Domingo 23:59:59 → Lunes 00:00:00 (inicio del rango) y en el cambio de Viernes 23:59:59 → Sábado 00:00:00 (fin del rango); debe agregarse un TC adicional que verifique que un Registro de Sábado o Domingo no se suma al Total Semanal.
- No se detecta necesidad de tocar BR-05/AC-017 (Meta Semanal); fijar el rango Lunes-Viernes en AC-018 refuerza la coherencia con la semana laboral ya definida ahí.
- No se requiere agregar `Intl.Locale`, `date-fns` ni `day.js` como dependencia solo para este cálculo; basta una constante/función pura que determine el Lunes y el Viernes de la semana de una fecha dada.

## Fuentes

- [ISO week date - Wikipedia](https://en.wikipedia.org/wiki/ISO_week_date)
- [ISO 8601 - rule for defining week numbers (Brepols)](https://www.brepols.com/Data/Downloads/ISO8601_RULE_FOR_DEFINING_WEEKNUMBERS.pdf)
- [ISO week numbers — weeknumber.com](https://weeknumber.com/how-to/iso-week-numbers)
- [What's the First Day of the Week? Country-by-Country Conventions](https://daysoftheweek.org/first-day-of-the-week)
- [How to change the first day of the week? — Toggl Track Knowledge Base](https://support.toggl.com/en/articles/4805855-how-to-change-the-first-day-of-the-week)
- [Default work week start day — Clockify Community Forum](https://forum.clockify.me/t/default-work-week-start-day/2184)
- [Why is Week Start in Preferences and Workspace Settings Different? — Clockify Community Forum](https://forum.clockify.me/t/why-is-week-start-in-preferences-and-workspace-settings-different/9327)
- [Timesheet Update: Start Your Week on Saturday, Sunday or Monday — Harvest Blog](https://www.getharvest.com/blog/2011/09/new-timesheet-feature-start-your-week-on-saturday-sunday-or-monday)
- [Timesheet settings — Harvest Help Center](https://support.getharvest.com/hc/en-us/articles/360048181812-Timesheet-settings)
- [Understanding your work settings — RescueTime](https://help.rescuetime.com/article/330-understanding-work-settings)
- [Intl.Locale.prototype.getWeekInfo() — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getWeekInfo)
- [proposal-intl-locale-info — TC39 GitHub](https://github.com/tc39/proposal-intl-locale-info)
- [JavaScript built-in: Intl: Locale: getWeekInfo() method — caniuse](https://caniuse.com/mdn-javascript_builtins_intl_locale_getweekinfo)
- [Feature request: Make startOfWeek locale aware — date-fns issue #3829](https://github.com/date-fns/date-fns/issues/3829)
- [startOfWeek - first day of week based on locale — date-fns issue #493](https://github.com/date-fns/date-fns/issues/493)
