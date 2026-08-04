# RS-001 — Decisiones técnicas pendientes de Gestión de Tareas y Registro de Tiempo

**Estado:** Ready
**Flujo:** Artefacto
**Artefacto referenciado:** US-003 (Gestión de Tareas y Registro de Tiempo)
**Creado por:** juanca202
**Fecha:** 2026-07-30

## Pregunta de investigación

¿Qué decisión conviene tomar para cada laguna técnica documentada en las Observaciones de US-003 y en [timetracker.md](../../../../technical-docs/timetracker.md) respecto a: nombre de Tarea (longitud/unicidad), unidad de almacenamiento de la Duración, fecha de un Registro de Tiempo que cruza la medianoche, reinicio del temporizador sobre la misma Tarea activa, duración ≤ 0 al auto-detener el temporizador anterior, manejo de fallos de `localStorage`, y mensajes de validación/bloqueo?

## Contexto

US-003 (Gestión de Tareas y Registro de Tiempo) es la historia de mayor complejidad del backlog (21 story points, INVEST-S en `No cumple` por fusión intencional de 5 sub-flujos). Su DoR y las Observaciones de [timetracker.md](../../../../technical-docs/timetracker.md) dejaron siete detalles de implementación sin resolver, heredados del SRS-001 (que no los especifica) y de la ampliación de alcance de edición/eliminación confirmada posteriormente. Estas decisiones no cambian el valor de negocio de la historia, pero condicionan cómo se modela `MD-02` (Tarea) y `MD-03` (Registro de Tiempo), y cómo se implementan FL-01, FL-02, FL-03, FL-07 y FL-08.

## Hallazgos

### Longitud máxima y unicidad del Nombre de Tarea

Misma naturaleza que el Nombre de Proyecto (ver [RS-001 de US-002](../../../US-002-gestion-de-proyectos/research/RS-001-decisiones-tecnicas-pendientes/README.md)): no hay estándar único, es decisión de producto. La única diferencia relevante es el alcance de la unicidad: si se exige, tendría sentido evaluarla **dentro del mismo Proyecto** (dos Tareas de distintos Proyectos con igual nombre no genera ambigüedad para el usuario), no de forma global.

### Unidad y precisión de almacenamiento de la Duración

La búsqueda sobre diseño de esquemas para duración confirma que la práctica común es almacenar la duración en su **unidad más pequeña relevante** (segundos, como entero) para facilitar sumas y conversiones a cualquier granularidad de reporte, evitando así errores de redondeo acumulados. El wireframe de la app ([figma-tareas.png](../../../../requirements/SRS-001-timetracker-app/assets/figma-tareas.png)) muestra el temporizador activo con formato `HH:MM:SS` (`01:02:10`), lo que requiere precisión de segundos — un campo `durationMinutes` (decimal), como quedó modelado en `MD-03`, **pierde precisión de segundos** o exige decimales incómodos (p. ej. `62.17` minutos) para representar `01:02:10`.

**Hallazgo relevante para corregir el modelo:** se recomienda cambiar `MD-03.durationMinutes` (decimal) por `durationSeconds` (entero), y derivar minutos/horas solo en la capa de presentación. Esto es una corrección al documento técnico existente, no a esta historia.

### Fecha de un Registro de Tiempo generado por temporizador que cruza la medianoche

Búsqueda sobre el comportamiento de apps de time tracking conocidas (Timery, Jobber, Clockify) confirma que el estándar de la industria es: **el Registro de Tiempo se asocia a la fecha en que se inició el temporizador** (`startTime`), no a la fecha en que se detuvo. Timery incluso ofrece partir la entrada a medianoche como mejora opcional (fuera del alcance de un MVP), pero el comportamiento por defecto en todas las apps revisadas es "cuenta para el día en que empezó".

### Reinicio del temporizador para la misma Tarea ya activa

No es una pregunta que la industria resuelva con una regla de negocio explícita, porque normalmente el problema se evita a nivel de interfaz: mientras una Tarea tiene el temporizador activo, el control para "iniciar" esa misma Tarea se reemplaza por "detener" (ver el propio wireframe: el panel de sesión activa solo muestra "Detener Sesión", no un botón de "Iniciar" adicional). Es decir, el escenario "iniciar la Tarea que ya está activa" no debería ser alcanzable desde la UI normal.

### Duración ≤ 0 al auto-detener el temporizador anterior (desfase de reloj)

Es un caso de borde de manejo de errores, no de negocio; la causa típica es un ajuste manual del reloj del sistema durante una sesión activa. La práctica defensiva estándar en manejo de errores es no dejar que un caso extremo bloquee la operación principal que el usuario sí solicitó (iniciar el nuevo temporizador).

### Manejo de fallo de escritura en `localStorage`

Mismo hallazgo que en [RS-001 de US-002](../../../US-002-gestion-de-proyectos/research/RS-001-decisiones-tecnicas-pendientes/README.md): capturar `QuotaExceededError` con `try/catch` y notificar sin bloquear la app (ver fuentes de MDN allí citadas). Aplica igual a Tarea y a Registro de Tiempo.

### Mensajes de validación y de bloqueo de eliminación

Mismo criterio de UX que en US-002: mensajes específicos y accionables, no genéricos.

## Decisiones pendientes / opciones evaluadas

- **Longitud máxima del Nombre de Tarea** — opciones: sin límite / límite corto / límite generoso; recomendación: **100 caracteres** (igual que Proyecto, por consistencia).
- **Unicidad del Nombre de Tarea** — opciones: unicidad global / unicidad por Proyecto / sin unicidad; recomendación: **sin unicidad forzada**, por la misma razón que Proyecto (el `id` interno es el identificador real).
- **Unidad de almacenamiento de la Duración** — opciones: minutos decimales (modelo actual) / segundos enteros; recomendación: **segundos enteros** (`durationSeconds`), porque el wireframe exige precisión `HH:MM:SS` y porque es la práctica de esquema recomendada para evitar pérdida de precisión y errores de redondeo en las agregaciones de US-004.
- **Fecha de un Registro de Tiempo que cruza la medianoche** — opciones: fecha de inicio / fecha de fin / partir en dos registros; recomendación: **fecha de inicio (`startTime`)**, alineada con el estándar de la industria (Timery, Jobber, Clockify); partir en dos registros queda como mejora futura, no parte de este alcance.
- **Reinicio del temporizador para la misma Tarea activa** — opciones: no-op / reiniciar `startTime` / error; recomendación: **no-op a nivel de UI** (el control de "iniciar" no debe estar disponible para una Tarea con el temporizador ya activo; si se alcanza igualmente por otra vía, tratar como no-op sin generar un nuevo Registro).
- **Duración ≤ 0 al auto-detener el temporizador anterior** — opciones: bloquear el inicio del nuevo temporizador / descartar el registro con duración inválida y continuar / registrar con duración mínima de 1 segundo; recomendación: **descartar el Registro de Tiempo inválido (sin persistirlo) y continuar iniciando el nuevo temporizador**, priorizando que la acción explícita del usuario (iniciar el nuevo) no quede bloqueada por una anomalía del reloj del sistema.
- **Fallo de escritura en `localStorage`** — recomendación: igual que en US-002 (capturar y notificar sin bloquear).
- **Mensajes de validación/bloqueo** — recomendación: mensajes específicos y accionables (p. ej. `"La duración debe ser mayor a 0"`, `"Selecciona una Tarea"`, `"No se puede eliminar '{nombreTarea}' porque tiene {N} Registro(s) de Tiempo asociado(s)"`), consistentes con los de US-002.
- **Restricción sobre la Fecha del registro manual** — opciones: sin restricción / no permitir fechas futuras; recomendación: **no permitir fechas futuras** (no tiene sentido registrar tiempo trabajado en una fecha que aún no ocurre), sin restricción sobre cuán atrás puede ir la fecha.

## Conclusión y recomendación

Ninguna de estas decisiones amplía el alcance de US-003 ni requiere una historia nueva; son detalles de implementación. El hallazgo con mayor impacto es el de **unidad de Duración**: cambiar `durationMinutes` (decimal) por `durationSeconds` (entero) en `MD-03` antes de implementar, ya que corrige una imprecisión real frente al wireframe (`HH:MM:SS`) y evita retrabajo en US-004 (que consume ese mismo campo para sus totales). El resto de las decisiones son coherentes con prácticas estándar de la industria y de ingeniería defensiva, y no representan riesgo si se adoptan tal como se recomienda.

## Impacto en el artefacto / próximo paso

Próximo paso sugerido: invocar `/design-define` para actualizar `docs/specs/technical-docs/timetracker.md` con estas decisiones — en particular, cambiar `MD-03.durationMinutes` por `durationSeconds`, fijar la fecha del Registro de Tiempo del temporizador como la de `startTime`, y documentar el descarte de duración ≤ 0 al auto-detener. Esto no cambia los `AC-XXX` de US-003 en su redacción actual (siguen siendo válidos), pero si el equipo quiere fijar el mensaje de bloqueo o la restricción de fecha futura como criterio de negocio explícito, puede añadirse como `AC-XXX` adicional vía `/work-define`.

## Fuentes

- [Using the Web Storage API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)
- [Handling localStorage errors (such as quota exceeded errors) — Matteo Mazzarolo](https://mmazzarolo.com/blog/2022-06-25-local-storage-status/)
- [Timery: Time Tracker — App Store](https://apps.apple.com/us/app/timery-time-tracker/id1425368544)
- [Timers and Timesheets in the Jobber App — Jobber Help Center](https://help.getjobber.com/hc/en-us/articles/7447924360855-Timers-and-Timesheets-in-the-Jobber-App)
- [Track time — Clockify Help](https://clockify.me/help/time-tracking/creating-a-time-entry)
