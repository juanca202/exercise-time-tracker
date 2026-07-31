# RS-001 — Decisiones técnicas pendientes de Gestión de Proyectos

**Estado:** Ready
**Flujo:** Artefacto
**Artefacto referenciado:** US-002 (Gestión de Proyectos)
**Creado por:** juanca202
**Fecha:** 2026-07-30

## Pregunta de investigación

¿Qué decisión conviene tomar para cada laguna técnica documentada en las Observaciones de US-002 y en [timetracker.md](../../../../technical-docs/timetracker.md) respecto al modelo de Proyecto: longitud/unicidad del Nombre, el mensaje de bloqueo al intentar eliminar un Proyecto con Tareas asociadas, y el manejo de un fallo de escritura en `localStorage`?

## Contexto

US-002 (Gestión de Proyectos) está en `Estado: Ready`, pero su DoR nota tres detalles de implementación no resueltos por el SRS-001 ni por la conversación de producto:

1. **MD-01 (`name`):** el SRS no define longitud máxima ni unicidad del Nombre de Proyecto.
2. **AC-005 / FL-06 (eliminar Proyecto):** BR-01 exige bloquear la eliminación si el Proyecto tiene Tareas asociadas, pero no se definió el mensaje ni el detalle de esa experiencia.
3. **FL-05/FL-06 (manejo de errores):** no se especifica qué debe hacer el sistema si falla la escritura en `localStorage` al crear, editar o eliminar un Proyecto (p. ej. cuota excedida).

La app persiste todo en `localStorage` del navegador (ver [ADR-011](../../../../../adr/ADR-011-persistencia-local-con-web-storage-api.md)), sin backend ni sincronización, por lo que estas decisiones recaen enteramente en el frontend.

## Hallazgos

### Longitud máxima y unicidad del Nombre de Proyecto

No existe un estándar universal para el nombre de un Proyecto en herramientas de gestión de tiempo; es una decisión de producto, no una restricción técnica dura. Convención de ingeniería ampliamente extendida para campos de "nombre" en formularios: un límite generoso (100–255 caracteres) que evita casos degenerados sin restringir el uso real, y **sin unicidad forzada** — la mayoría de las herramientas de gestión de proyectos (Trello, Notion, Asana, Jira) permiten nombres duplicados, ya que el identificador real es el `id` interno, no el nombre visible.

### Mensaje / UX al bloquear la eliminación de un Proyecto con Tareas

No hay una fuente normativa única; es una decisión de UX. La convención dominante en apps CRUD con relaciones padre-hijo obligatorias (como esta, donde una Tarea no puede existir sin Proyecto) es un mensaje de error específico y accionable, que indique la causa y una vía de resolución, en vez de un mensaje genérico. Patrón habitual: `"No se puede eliminar '{nombreProyecto}' porque tiene {N} Tarea(s) asociada(s). Elimina o reasigna esas Tareas primero."` — reutilizando el mismo patrón de Tarea → Proyecto ya definido en US-003 (BR-06 / FL-08), para mantener consistencia de mensajes entre ambas entidades.

### Manejo de fallo de escritura en `localStorage`

Según [MDN — Using the Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API) y el análisis de [Matteo Mazzarolo — Handling localStorage errors](https://mmazzarolo.com/blog/2022-06-25-local-storage-status/), cuando se excede la cuota de almacenamiento (`localStorage` permite ~5 MiB por origen), el navegador lanza una excepción `QuotaExceededError` (código `22`, o `1014` en Firefox) al llamar a `setItem`. La práctica recomendada es:

- Envolver toda escritura en `try/catch`.
- Detectar el error verificando `DOMException` con nombre `QuotaExceededError` (o código `22`/`1014`).
- No dejar que la excepción rompa la aplicación: informar al usuario que el cambio no pudo guardarse (banner o toast no bloqueante) y conservar el estado en memoria para que pueda reintentar.
- Nota: en el modo privado de Safari, la cuota es efectivamente cero, por lo que incluso el primer `setItem` puede fallar.

Dado que esta app usa `Proyecto`, `Tarea` y `Registro de Tiempo` como texto plano (sin adjuntos ni binarios), es improbable alcanzar la cuota de 5 MiB en un uso personal normal, pero el manejo defensivo sigue siendo una buena práctica.

## Decisiones pendientes / opciones evaluadas

- **Longitud máxima del Nombre de Proyecto** — opciones: sin límite explícito / límite corto (≤50) / límite generoso (100–255); recomendación: **100 caracteres**, validado en el formulario (no solo en la capa de persistencia), porque cubre cualquier uso real sin ser percibido como restrictivo.
- **Unicidad del Nombre de Proyecto** — opciones: unicidad forzada / sin unicidad; recomendación: **sin unicidad forzada** (permitir nombres duplicados), porque el identificador real es el `id` interno y forzar unicidad añadiría fricción sin beneficio claro para un usuario individual.
- **Mensaje al bloquear eliminación** — opciones: mensaje genérico ("no se puede eliminar") / mensaje específico con causa y acción sugerida; recomendación: **mensaje específico** (`"No se puede eliminar '{nombre}' porque tiene {N} Tarea(s) asociada(s). Elimina o reasigna esas Tareas primero."`), reutilizando el mismo patrón que la eliminación de Tarea (US-003) para consistencia.
- **Fallo de escritura en `localStorage`** — opciones: dejar que la excepción se propague (riesgo de crash) / capturarla y notificar sin bloquear la UI; recomendación: **capturar y notificar** (toast/banner no bloqueante, se conserva el estado en memoria), siguiendo el patrón estándar documentado por MDN para `QuotaExceededError`.

## Conclusión y recomendación

Ninguna de las tres lagunas requiere una nueva historia ni cambia el alcance de US-002: son detalles de implementación que pueden resolverse actualizando el modelo de datos (technical-docs) y, si se desea mayor precisión, añadiendo criterios de aceptación explícitos para el mensaje de bloqueo y el manejo de errores de persistencia. Recomendación accionable:

1. Fijar el Nombre de Proyecto en máximo 100 caracteres, sin unicidad forzada.
2. Adoptar el mensaje de bloqueo específico propuesto arriba (y su equivalente para Tarea en US-003, para consistencia).
3. Envolver las escrituras de Proyecto en `try/catch`, detectando `QuotaExceededError`, y mostrar un aviso no bloqueante ante fallo.

## Impacto en el artefacto / próximo paso

Estas decisiones no cambian los `AC-XXX` de US-002 en su redacción de negocio, pero sí resuelven las notas abiertas en su DoR ("Sin decisiones técnicas pendientes") y en las Observaciones de [timetracker.md](../../../../technical-docs/timetracker.md) (MD-01, FL-06). Próximo paso sugerido: invocar `/design-define` para actualizar MD-01 y FL-06 con estas reglas concretas (longitud, mensaje, manejo de error), y opcionalmente `/work-define` para añadir un AC explícito sobre el mensaje de bloqueo si el equipo quiere que quede fijado a nivel de historia y no solo de implementación.

## Fuentes

- [Using the Web Storage API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)
- [Storage quotas and eviction criteria — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- [Handling localStorage errors (such as quota exceeded errors) — Matteo Mazzarolo](https://mmazzarolo.com/blog/2022-06-25-local-storage-status/)
