# TK-30304: Harness de rendimiento para iniciar/detener el temporizador

Estado: Ready
Historia: [US-30272](./README.md)
Repositorio: exercise-time-tracker
Asignado a: juanca202
ADO Work Item: [#30304](https://dev.azure.com/BayteqDev/Bayteq%20IA/_workitems/edit/30304)

## Descripción

Cerrar el gap detectado en `trace-report.md` para AC-012 y AC-013: hoy no existe ningún artefacto automatizado que mida la latencia de iniciar o detener el temporizador. Al finalizar esta tarea, debe existir una prueba e2e que mida —con `performance.now()` en el navegador y margen de tolerancia sobre varias repeticiones— que el estado "En Ejecución" aparece y que el Registro de Tiempo queda persistido y visible en menos de 1 segundo desde el clic del usuario, cerrando TC-021 y TC-022.

## Dependencias

- `ActiveTimerCard` (`src/features/tasks/components/ActiveTimerCard.tsx`) — refleja el estado "En Ejecución" y la acción "Detener Sesión".
- `TaskListItem` (`src/features/tasks/components/TaskListItem.tsx`) — acción "Iniciar temporizador".
- `useTasksStore` — `startTimer` / `stopTimer`.

## Referencias

- Trazabilidad y gap detectado: [trace-report.md](./trace-report.md) (filas AC-012 y AC-013).
- Casos de prueba: [TC-021](./test-cases/TC-021-rendimiento-inicio-temporizador-happy.md), [TC-022](./test-cases/TC-022-rendimiento-detener-temporizador-happy.md).

## Archivos afectados

```text
exercise-time-tracker/
└── e2e/
    └── + tasks-performance.spec.ts   # Mide con performance.now() la latencia de iniciar/detener el temporizador, con tolerancia y repeticiones
```

## Plan de implementación

- [x] **IT-01** — Escribir el test que falla (Red): crear `e2e/tasks-performance.spec.ts` con un escenario que cree una Tarea, mida (vía `page.evaluate(() => performance.now())` antes y después del clic, esperando a que el locator del estado "En Ejecución" sea visible) el tiempo transcurrido al iniciar el temporizador, repitiendo la medición 3 veces y afirmando que la mediana es menor a 1 segundo más un margen de tolerancia acordado (p. ej. 250 ms) para absorber la variabilidad del entorno de CI.
- [x] **IT-02** — Añadir el escenario equivalente para "Detener Sesión": medir el tiempo hasta que la acción de "Detener Sesión" surte efecto (desaparición del estado "En Ejecución"), que ocurre en el mismo re-render en que `stopTimer` calcula y persiste el Registro de Tiempo.
      Nota: se descartó verificar además que el texto de duración del ítem ya no muestre `00:00:00`, porque en ciclos de arranque/parada tan rápidos (milisegundos) el formato `HH:MM:SS` redondea a cero — no era un problema funcional, solo un artefacto de visualización con precisión de segundos.
- [x] **IT-03** — Ejecutar `npm run test:e2e -- tasks-performance.spec.ts` y confirmar que ambos escenarios pasan en verde (Green) sin cambios en el código de producción, dado que la latencia real ya cumple el umbral; documentar el margen de tolerancia elegido en el propio test.
- [x] **IT-04** — Actualizar `trace-report.md` de US-30272: mover AC-012 y AC-013 de `No cubierto` a `Cubierto` con el nuevo artefacto y resultado de ejecución.

## Observaciones

Sin pendientes documentados.
