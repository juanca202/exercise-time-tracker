# TK-007: Meta Semanal y Total Semanal

**Estado**: Ready
**Historia**: [US-002](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Calcular la Meta Semanal como un valor fijo de 40 horas (8 h × 5 días laborales, no configurable por el usuario), calcular y mostrar el Total Semanal sumando los Registros de Tiempo (por temporizador y manuales) generados durante la semana laboral en curso (Lunes a Viernes, hora local, excluyendo Sábado y Domingo), y mostrar el porcentaje alcanzado de la Meta Semanal ((Total Semanal ÷ Meta Semanal) × 100).

## Dependencias

- `src/shared/domain/types.ts` — tipo `RegistroDeTiempo`.
- `src/shared/store/app-store.ts` — `useRegistrosDeTiempo()`.

## Referencias

- **Investigación:** [RS-001: Inicio de la semana en curso para el cálculo del Total Semanal](./research/RS-001-inicio-semana-total-semanal.md) — fija Lunes como inicio de la semana laboral y el rango Lunes-Viernes para el Total Semanal, consistente con la Meta Semanal (BR-05).
- **Diseño:** [Figma - Exercise · Time Tracker (widgets Meta Semanal y Total Semanal)](https://www.figma.com/design/YYHDIH7CBsZrZ4VKXvbzkR/Exercise---Time-Tracker) — nodo `1:1374`, sección "Welcome Summary Section".
- **Arquitectura:** [ADR-002: Uso de Tailwind CSS](../../../adr/ADR-002-uso-de-tailwind-css.md).

## Archivos afectados

```text
exercise-time-tracker/
└── src/
    └── features/
        └── tareas/
            ├── domain/
            │   ├── + calcular-rango-semana-laboral.ts    # obtiene el Lunes 00:00:00 y el Viernes 23:59:59 de la semana de una fecha (RS-001)
            │   └── + calcular-total-semanal-minutos.ts    # suma la duración de los Registros de Tiempo dentro del rango Lunes-Viernes
            ├── hooks/
            │   └── + useMetaYTotalSemanal.ts               # expone metaSemanalMinutos (constante), totalSemanalMinutos, porcentaje
            └── components/
                ├── + WidgetMetaSemanal.tsx                  # muestra el porcentaje alcanzado de la Meta Semanal
                └── + WidgetTotalSemanal.tsx                  # muestra el Total Semanal acumulado
```

## Plan de implementación

- [ ] **IT-01** — Crear `calcular-rango-semana-laboral.ts`: función pura que, dada una fecha de referencia, retorna el Lunes 00:00:00 y el Viernes 23:59:59 (hora local) de esa semana, como constante fija en código — sin `Intl.Locale` ni librerías de fecha adicionales — siguiendo la recomendación de [RS-001](./research/RS-001-inicio-semana-total-semanal.md).
- [ ] **IT-02** — Crear `calcular-total-semanal-minutos.ts`: función pura que, dado el arreglo de `RegistroDeTiempo` (`useRegistrosDeTiempo()`) y el rango de `calcular-rango-semana-laboral.ts`, suma `duracionMinutos` de los registros cuya `fecha` cae dentro del rango (inclusive), excluyendo explícitamente los de Sábado y Domingo.
      Cubre AC-018; ver [TC-020](./test-cases/TC-020-total-semanal-happy.md), [TC-021](./test-cases/TC-021-total-semanal-excluye-semana-anterior-limite.md) y [TC-024](./test-cases/TC-024-total-semanal-excluye-fin-de-semana-limite.md).
- [ ] **IT-03** — Definir en `useMetaYTotalSemanal.ts` la constante `METAS_SEMANAL_MINUTOS = 8 * 60 * 5` (= 2400, no configurable) y calcular `porcentaje = (totalSemanalMinutos / METAS_SEMANAL_MINUTOS) * 100`, sin acotar el valor superior a 100.
      Cubre AC-017 ([TC-019](./test-cases/TC-019-meta-semanal-fija-happy.md)) y AC-019 ([TC-022](./test-cases/TC-022-porcentaje-meta-semanal-happy.md), [TC-023](./test-cases/TC-023-porcentaje-meta-semanal-superior-100-limite.md) para el caso de superar el 100%).
- [ ] **IT-04** — Crear `WidgetMetaSemanal.tsx` y `WidgetTotalSemanal.tsx`, componentes presentacionales que consumen `useMetaYTotalSemanal()`, replicando la estructura exacta del nodo `1:1374`:
  - `WidgetMetaSemanal.tsx`: no es una tarjeta separada — se renderiza como el texto inline junto al heading "Tareas": "Has alcanzado el **{porcentaje}%** de tu meta semanal." (Inter Regular 16px `#45464e`, con `{porcentaje}%` en Inter Bold 16px `#006c4b`/DESIGN.md `secondary`).
  - `WidgetTotalSemanal.tsx`: tarjeta blanca (`border #c6c6ce`, `rounded-sm` 2px, sombra, min-width 160px, padding 17px) con label "TOTAL SEMANAL" (uppercase, JetBrains Mono Medium 12px tracking 0.6px, opacidad 50%, `#45464e`, DESIGN.md `label-meta`) y valor (Inter Bold 24px `#182442`, formato `{h}h {m}m`, p. ej. "32h 45m").
    Ambos se componen dentro de `PanelTareas.tsx` ([TK-004](./TK-004-ui-pantalla-tareas.md)).

## Observaciones

- El prototipo Figma no muestra la Meta Semanal como una tarjeta numérica independiente: el porcentaje se expresa como texto inline junto al heading "Tareas" (`WidgetMetaSemanal.tsx`), mientras que "TOTAL SEMANAL" sí es una tarjeta con valor `{h}h {m}m` (`WidgetTotalSemanal.tsx`). Esto no cambia el alcance de AC-017/AC-018/AC-019, solo precisa su forma visual.
