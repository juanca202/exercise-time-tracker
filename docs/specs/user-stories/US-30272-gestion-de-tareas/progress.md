# Progreso

## Trabajo: US-30272

- Tipo: historia de usuario
- Ultima actualizacion: 2026-07-10

### Unidades

- TK-30303 Prueba de persistencia real tras recargar la app (AC-002, AC-010)
  Estado: Done
  Implementador: "juanca202"
  Archivos:
  - src/features/tasks/store/tasksStore.persistence.test.ts
  - e2e/tasks.spec.ts
  - docs/specs/user-stories/US-30272-gestion-de-tareas/trace-report.md
    Notas:
  - No hizo falta cambiar código de producción: el mecanismo de persist/rehydrate de Zustand ya cumplía AC-002/AC-010; el gap era de cobertura de pruebas, no de implementación.
    Decisiones adicionales:
  - Se implementa sobre la rama actual `feature/open-spec` en lugar de crear `feature/US-30272-gestion-de-tareas`, por instrucción explícita del usuario.
  - Para simular una recarga real sin falsos negativos, el test de integración usa `vi.resetModules()` + reimport (instancia de store nueva) en lugar de `useTasksStore.setState(...)`, que reescribe `localStorage` al pasar por el wrapper de `persist`.

- TK-30304 Harness de rendimiento para iniciar/detener el temporizador (AC-012, AC-013)
  Estado: Done
  Implementador: "juanca202"
  Archivos:
  - e2e/tasks-performance.spec.ts
  - docs/specs/user-stories/US-30272-gestion-de-tareas/trace-report.md
    Notas:
  - No hizo falta cambiar código de producción: la latencia real ya cumplía el umbral de 1s; el gap era de cobertura de pruebas, no de implementación.
    Decisiones adicionales:
  - Margen de tolerancia de 250ms sobre el umbral de 1s, medido con `performance.now()` sobre la mediana de 3 repeticiones, para absorber variabilidad de CI sin afirmar un umbral exacto.
  - Para "Detener Sesión" se descartó verificar que el texto de duración deje de mostrar `00:00:00`: en ciclos de arranque/parada de milisegundos el formato `HH:MM:SS` redondea a cero. Se usa en su lugar la desaparición de "En Ejecución", que ocurre en el mismo re-render en que se calcula y persiste el Registro de Tiempo.
