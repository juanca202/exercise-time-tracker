# TK-30303: Prueba de persistencia real de Tarea y Registro manual tras recargar la app

Estado: Ready
Historia: [US-30272](./README.md)
Repositorio: exercise-time-tracker
Asignado a: juanca202
ADO Work Item: [#30303](https://dev.azure.com/BayteqDev/Bayteq%20IA/_workitems/edit/30303)

## Descripción

Cerrar el gap detectado en `trace-report.md` para AC-002 y AC-010: hoy solo existe una prueba de que `persist.rehydrate()` se invoca al montar (`useHydrateTasksStore.test.ts`), pero ninguna prueba automatizada ejecuta un ciclo real de escritura en `localStorage` seguido de una recarga que confirme que una Tarea (con su Proyecto asociado) y un Registro de Tiempo manual siguen presentes y correctos. Al finalizar esta tarea, TC-004 y TC-017 deben quedar cubiertos por un artefacto automatizado que pase en verde.

## Dependencias

- `useTasksStore` (`src/features/tasks/store/tasksStore.ts`) — store con middleware `persist` de Zustand hacia `localStorage`.
- `useHydrateTasksStore` (`src/features/tasks/store/useHydrateTasksStore.ts`) — hook de rehidratación al montar.
- `useProjectsStore` (`src/features/projects/store/projectsStore.ts`) — Proyecto asociado a la Tarea persistida.

## Referencias

- Trazabilidad y gap detectado: [trace-report.md](./trace-report.md) (filas AC-002 y AC-010).
- Casos de prueba: [TC-004](./test-cases/TC-004-persistencia-tarea-proyecto-happy.md), [TC-017](./test-cases/TC-017-persistencia-registro-manual-happy.md).

## Archivos afectados

```text
exercise-time-tracker/
├── src/
│   └── features/
│       └── tasks/
│           └── store/
│               └── + tasksStore.persistence.test.ts   # Test de integración: escribe en localStorage, remonta el store "fresco" y valida que Tarea + Registro manual sobreviven
└── e2e/
    └── ~ tasks.spec.ts   # Agrega escenario con page.reload() que cubre TC-004/TC-017 end-to-end
```

## Plan de implementación

- [x] **IT-01** — Escribir el test que falla (Red): crear `tasksStore.persistence.test.ts` que limpie `localStorage`, cree una Tarea asociada a un Proyecto y un Registro de Tiempo manual con `useTasksStore`, luego "recargue" simulando un remount del store (reset del estado en memoria + `useTasksStore.persist.rehydrate()`) y afirme que la Tarea sigue asociada al Proyecto y el Registro de Tiempo manual sigue presente con su duración correcta.
      Debe fallar solo si la aserción de recarga no está probada hoy; si el código de producción ya cumple, el test pasa en verde sin cambios adicionales (Green).
      Nota: la primera versión reseteaba el estado en memoria con `useTasksStore.setState(...)`, pero ese `setState` pasa por el wrapper de `persist` y reescribe `localStorage`, por lo que el test fallaba en falso (borraba lo persistido antes de recargar). Corregido usando `vi.resetModules()` + reimport para obtener una instancia de store realmente nueva, sin tocar `localStorage` — la forma fiel de simular una recarga real de página.
- [x] **IT-02** — Confirmar Green: ejecutar `npm run test:run` y verificar que el nuevo test pasa junto con el resto de la suite de `tasksStore`.
- [x] **IT-03** — Añadir un escenario e2e en `e2e/tasks.spec.ts` que cree una Tarea y un Registro de Tiempo manual, llame a `page.reload()` y verifique que ambos siguen visibles en el panel de Tareas, cerrando TC-004 y TC-017 a nivel de navegador real.
- [x] **IT-04** — Actualizar `trace-report.md` de US-30272: mover AC-002 y AC-010 de `Parcial` a `Cubierto` con los nuevos artefactos y resultado de ejecución.

## Observaciones

Sin pendientes documentados.
