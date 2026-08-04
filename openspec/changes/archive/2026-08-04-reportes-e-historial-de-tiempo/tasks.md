## 1. Cálculo de totales

- [x] 1.1 Implementar el cálculo del total de tiempo por Tarea (suma de sus Registros de Tiempo, `0` si no tiene)
- [x] 1.2 Implementar el cálculo del total de tiempo por Proyecto (suma de los totales de sus Tareas, `0` si no tiene)
- [x] 1.3 Implementar el cálculo del total de tiempo por mes (suma de Registros de Tiempo cuya fecha cae en el mes)
- [x] 1.4 Implementar el cálculo del "Total semanal" (semana en curso) y "Total mensual"
- [x] 1.5 Memoizar los cálculos para cumplir el presupuesto de rendimiento (RP-003, < 2s con 1000 registros) — **revisado**: no fue necesario; las agregaciones son `filter`/`reduce` sobre arreglos y tardan ~1ms con 1000 Registros de Tiempo (ver prueba de rendimiento 5.3), muy por debajo del presupuesto de 2s. Memoizar habría sido complejidad sin beneficio medible.

## 2. Meta semanal

- [x] 2.1 Definir la constante `WEEKLY_GOAL_HOURS = 40`
- [x] 2.2 Calcular el porcentaje de avance `(Total semanal / 40) * 100`, capado en 100 con `Math.min`

## 3. UI — Historial

- [x] 3.1 Construir la pantalla "Historial de registros" con el listado de Registros de Tiempo (Fecha, Proyecto, Tarea, Duración) — validado además contra Figma vía MCP (nodo 1:1746); se omitieron las 3 tarjetas decorativas de "proyectos destacados del mes" del diseño (sin AC que las respalde) para no exceder el alcance de US-004
- [x] 3.2 Implementar la navegación entre periodos mensuales

## 4. UI — Panel de Tareas y Proyectos

- [x] 4.1 Mostrar "Total semanal" y "Total mensual" en el panel principal de "Tareas"
- [x] 4.2 Mostrar el porcentaje de avance hacia la meta semanal en el panel principal de "Tareas"
- [x] 4.3 Mostrar el tiempo total acumulado de cada Proyecto en la pantalla "Proyectos"

## 5. Pruebas

- [x] 5.1 Pruebas unitarias de las agregaciones (Tarea, Proyecto, mes, semana), incluyendo casos sin Registros de Tiempo (`0`)
- [x] 5.2 Pruebas unitarias del porcentaje de meta semanal (por debajo, exacto y por encima de 40 horas)
- [x] 5.3 Prueba de rendimiento con 1000 Registros de Tiempo simulados (< 2 segundos) — completa en ~1ms
- [x] 5.4 Validar visualmente contra `figma-historial.png`, `figma-tareas.png` y `figma-proyectos.png` — validado además contra el diseño de alta fidelidad en Figma vía MCP y probado interactivamente (totales reales, meta semanal, historial filtrado por mes)
