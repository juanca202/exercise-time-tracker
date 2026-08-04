# RS-001 — Meta semanal no especificada en el SRS

**Estado:** Ready
**Flujo:** Artefacto
**Artefacto referenciado:** US-004 (Reportes e Historial de Tiempo)
**Creado por:** juanca202
**Fecha:** 2026-07-30

## Pregunta de investigación

El wireframe [figma-tareas.png](../../../../requirements/SRS-001-timetracker-app/assets/figma-tareas.png) muestra "Has alcanzado el **84%** de tu meta semanal" sobre el panel principal de Tareas, pero ningún requisito funcional del SRS-001 (RF-001 a RF-017) define qué es la "meta semanal" ni cómo se calcula su porcentaje. ¿Cómo debe definirse y calcularse este indicador, y qué historia debe cubrirlo?

## Contexto

Esta laguna **no fue detectada** al redactar US-004 (Reportes e Historial de Tiempo): su AC-006 solo cubre "Total semanal" y "Total mensual" como sumas de tiempo (RF-017 y agregación derivada), sin considerar el indicador de "meta semanal" que sí aparece en el mismo wireframe. Se detectó al revisar el resultado con el usuario, quien confirmó que se le había pasado por alto al equipo. El SRS no menciona "meta" en ninguna sección (verificado por búsqueda de texto sobre `docs/specs/requirements/SRS-001-timetracker-app/README.md`), por lo que este indicador vive únicamente en el wireframe de alta fidelidad.

## Hallazgos

### Convención de la industria para "meta semanal" en apps de time tracking

Es un patrón común en aplicaciones de seguimiento de tiempo y hábitos (Trackr, Timelog, ZoneTrack, TimeCamp): el usuario define un objetivo de horas por período (semanal, en este caso), la app suma el tiempo efectivamente registrado en el período y muestra el avance como porcentaje, a menudo con un indicador visual (barra o color). El patrón general es: `porcentaje = (tiempo acumulado en el período / meta del período) × 100`.

### Decisión de producto obtenida en esta conversación

El usuario (dueño de producto en esta sesión) confirmó explícitamente: la jornada laboral de referencia es de **8 horas diarias**, por lo que la **meta semanal es un valor fijo de 40 horas** (8 × 5 días laborables). No es configurable por el usuario final; es una constante de la aplicación.

## Decisiones pendientes / opciones evaluadas

- **Origen de la meta semanal** — opciones: configurable por el usuario / valor fijo; **decisión tomada:** valor fijo de **40 horas semanales** (8 h/día), confirmado por producto. No requiere pantalla de configuración ni nueva entidad de datos.
- **Fórmula del porcentaje** — recomendación: `porcentaje = (Total semanal en horas / 40) × 100`, usando el mismo "Total semanal" ya definido en AC-006 de US-004 (RF-017 adaptado a la semana en curso) como numerador — no se necesita un cálculo nuevo, solo dividir por la constante 40.
- **¿El porcentaje se limita a 100%?** — opciones: capar en 100% / permitir superarlo (ej. 125%); recomendación original de este RS: no capar. **Decisión final de producto (posterior a esta investigación):** **sí capar en 100%** — el sistema muestra como máximo 100% aunque el Total semanal supere las 40 horas. Esta decisión queda reflejada en US-004 (AC-008) y prevalece sobre la recomendación de este apartado.

## Conclusión y recomendación

La "meta semanal" es una laguna real del backlog, no cubierta por ningún `AC-XXX` existente. Con la meta fijada en 40 horas/semana (decisión de producto), el cálculo es trivial y reutiliza el "Total semanal" ya definido en US-004: no se necesita una nueva entidad de datos ni pantalla de configuración. Recomendación accionable: ampliar US-004 con un nuevo criterio de aceptación que declare la constante de 40 horas semanales y la fórmula del porcentaje, y ajustar su wireframe/AC-006 para incluir explícitamente el indicador de meta semanal junto a los totales.

## Impacto en el artefacto / próximo paso

US-004 necesita al menos un `AC-XXX` nuevo (y posiblemente una regla de negocio `BR-XX`) que declare: "La meta semanal DEBE ser un valor fijo de 40 horas" y "El sistema DEBE calcular y mostrar el porcentaje de avance hacia la meta semanal como (Total semanal / 40 horas) × 100". Próximo paso sugerido: invocar `/work-define` sobre US-004 para incorporar este criterio (sin necesidad de `/design-define`, ya que no introduce un modelo de datos nuevo — reutiliza el "Total semanal" existente).

## Fuentes

- [Trackr - Weekly Goal Tracker — Google Play](https://play.google.com/store/apps/details?id=com.AnyKeySolutions.Trackr&hl=en)
- [Timelog - Goal & Time Tracker — Google Play](https://play.google.com/store/apps/details?id=dev.giall.timelog&hl=en_IN)
- [TimeCamp — best employee time tracking software (DeskTime roundup)](https://desktime.com/best-employee-time-tracking-software)
