# TK-006: Registro manual de tiempo

**Estado**: Ready
**Historia**: [US-002](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Permitir crear un Registro de Tiempo manual para una Tarea, ingresando la Tarea, la Fecha y la Duración, validando que la Duración sea mayor que cero (rechazando el registro con un mensaje de error en caso contrario) y persistiendo el Registro de Tiempo manual (origen `"manual"`) de forma inmediata en el almacenamiento local. La interfaz correspondiente ("Entrada Manual") es una tarjeta siempre visible en el panel principal, no un modal disparado por una acción (ver Observaciones).

## Dependencias

- `src/shared/domain/types.ts` — tipo `RegistroDeTiempo`.
- `src/shared/store/app-store.ts` — `crearRegistroDeTiempo`, `useTareas()` (selector de Tarea en el formulario).
- `src/features/tareas/domain/validar-duracion.ts` ([TK-005](./TK-005-temporizador.md)) — reutilizado para validar que la Duración ingresada sea mayor que cero (BR-04, misma regla que usa el temporizador).

## Referencias

- **Diseño:** [Figma - Exercise · Time Tracker (registro manual de tiempo)](https://www.figma.com/design/YYHDIH7CBsZrZ4VKXvbzkR/Exercise---Time-Tracker) — tarjeta "Entrada Manual" en el nodo `1:1374` (Bento Grid, columna 9–12 de la fila 1).
- **Arquitectura:** [ADR-002: Uso de Tailwind CSS](../../../adr/ADR-002-uso-de-tailwind-css.md).
- **Arquitectura:** [ADR-003: Uso de Base UI](../../../adr/ADR-003-uso-de-base-ui.md).

## Archivos afectados

```text
exercise-time-tracker/
└── src/
    └── features/
        └── tareas/
            ├── hooks/
            │   └── + useRegistroManual.ts        # valida y crea un RegistroDeTiempo con origen "manual"
            └── components/
                └── + TarjetaEntradaManual.tsx     # tarjeta "Entrada Manual": campos FECHA, PROYECTO / TAREA, DURACIÓN
```

## Plan de implementación

- [ ] **IT-01** — Crear `useRegistroManual.ts`: hook que recibe `{ tareaId, fecha, duracionMinutos }`, valida `duracionMinutos` con `validar-duracion.ts` ([TK-005](./TK-005-temporizador.md)) y, si es válida, invoca `useAppStore().crearRegistroDeTiempo({ tareaId, fecha, duracionMinutos, origen: "manual" })`.
      Cubre AC-013 y AC-015; ver [TC-014](./test-cases/TC-014-registro-manual-happy.md) y [TC-017](./test-cases/TC-017-persistencia-registro-manual-happy.md). Si la Duración no es válida, retorna el motivo de rechazo sin crear el registro (AC-014, [TC-015](./test-cases/TC-015-duracion-manual-invalida-error.md), [TC-016](./test-cases/TC-016-duracion-manual-minima-limite.md)).
- [ ] **IT-02** — Crear `TarjetaEntradaManual.tsx`: tarjeta blanca (`border #c6c6ce`, `rounded-sm` 2px, sombra, padding 25px) con heading "Entrada Manual" (Inter Semibold 24px `#182442`, DESIGN.md `headline-md`) y formulario con gap 20px entre campos, replicando el nodo `1:1374`:
  - Campo "FECHA" (label uppercase JetBrains Mono Medium 12px tracking 0.6px opacidad 50% `#45464e`, DESIGN.md `label-meta`): input con formato `DD/MM/AAAA` e ícono de calendario, borde `#c6c6ce`, `rounded` 4px.
  - Campo "PROYECTO / TAREA" (misma label): selector de Tarea (`useTareas()`) con el mismo estilo de borde/`rounded` que el campo Fecha.
  - Campo "DURACIÓN" (misma label): input de texto en formato `HH:MM`, mismo borde/`rounded`.
  - Botón "Guardar Registro" (`bg #182442`, texto blanco bold 16px, `rounded-md` 8px, con sombra, ancho completo).
    Muestra el mensaje de error de `useRegistroManual` cuando la Duración no sea válida.
- [ ] **IT-03** — Componer `TarjetaEntradaManual` dentro de `PanelTareas.tsx` ([TK-004](./TK-004-ui-pantalla-tareas.md)), en la columna 9–12 de la fila 1 del Bento Grid, siempre visible junto a `WidgetTemporizador` (no requiere una acción que la abra, a diferencia de lo asumido originalmente sin acceso a Figma).

## Observaciones

- Corrección respecto a la redacción original de este TK (escrita sin acceso a Figma): el prototipo (nodo `1:1374`) muestra "Entrada Manual" como una tarjeta siempre visible en el Bento Grid del panel principal, no como un modal disparado por una acción explícita. Se renombró el componente de `ModalRegistroManual.tsx` a `TarjetaEntradaManual.tsx`; el alcance funcional (AC-013/AC-014/AC-015: Tarea, Fecha, Duración, validación > 0, persistencia con origen `"manual"`) no cambia.
