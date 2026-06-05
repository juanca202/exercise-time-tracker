# Quickstart: Time Tracker (validación manual)

**Feature**: `001-time-tracker`  
**Branch**: `001-time-tracker`

## Prerrequisitos

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) — vista **Tareas**.

## Validación por User Story

### US-1 — Proyectos y Tareas (P1)

1. Ir a **Proyectos** → **Nuevo Proyecto** (o tarjeta punteada).
2. Crear proyecto con nombre; descripción opcional.
3. En **Tareas** → **Nueva Tarea** → seleccionar proyecto + nombre.
4. Recargar página → datos persisten (SC-006).

### US-2 — Temporizador (P2)

1. En **Tareas Recientes** o panel activo, pulsar **Play** en una tarea.
2. Verificar temporizador en ejecución (hora inicio + contador).
3. Iniciar otra tarea → la anterior debe guardarse automáticamente.
4. **Detener Sesión** → registro aparece en **Historial** (&lt;5 s, SC-002).
5. Recargar con temporizador activo → sigue corriendo.

### US-3 — Entrada manual (P3)

1. Panel **Entrada Manual**: Fecha, Proyecto/Tarea, Duración (ej. `02:30`).
2. **Guardar Registro** → aparece en Historial con duración correcta.
3. Intentar duración `0` → error (BR-05).

### US-4 — Totales e Historial (P4)

1. **Historial**: cambiar período con flechas; ver tarjetas por proyecto y tabla (Fecha, Proyecto, Tarea, Duración).
2. Ir a **Proyectos** → **TIEMPO REGISTRADO** coincide con el mismo período (SC-010).
3. **Tareas**: verificar TOTAL SEMANAL, TOTAL MENSUAL y % meta semanal (40 h).

## Comandos de calidad (gate pre-merge)

```bash
npm run test:run
npm run lint
npm run build
```

## Wireframes de referencia

```text
specs/001-time-tracker/assets/LB-TT-img-1.png  # Tareas
specs/001-time-tracker/assets/LB-TT-img-2.png  # Nueva Tarea
specs/001-time-tracker/assets/LB-TT-img-3.png  # Historial
specs/001-time-tracker/assets/LB-TT-img-4.png  # Nuevo Proyecto
specs/001-time-tracker/assets/LB-TT-img-5.png  # Proyectos
```

## Diseño

- Tokens: `DESIGN.md` (raíz del repo)
- Tipografías: Inter (UI), JetBrains Mono (duraciones)
- Iconos: `@heroicons/react` — elegir outline/solid según wireframe más cercano (FR-030)

## Revisión visual (SC-008)

Comparar las 5 vistas con `specs/001-time-tracker/assets/LB-TT-img-*.png`; verificar iconografía Heroicons, layout sidebar y tokens Precision Focus.
