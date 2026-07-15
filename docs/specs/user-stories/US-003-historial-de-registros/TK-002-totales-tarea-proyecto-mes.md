# TK-002: Totales por Tarea, Proyecto y mes

**Estado**: Ready
**Historia**: [US-003](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Calcular, a partir de los arreglos crudos obtenidos de los selectores del store (`useProyectos`, `useTareas`, `useRegistrosDeTiempo`), el total de tiempo acumulado por Tarea, por Proyecto (sumando las Tareas asociadas) y por mes, excluyendo de forma silenciosa los Registros de Tiempo con duración o fecha inválida sin interrumpir el cálculo, y asignando al mes de la fecha/Hora de Inicio la totalidad de la Duración de un Registro generado por el temporizador que cruce la medianoche de fin de mes, sin prorratear entre los dos meses.

## Dependencias

- [US-000 TK-001: Tipos de dominio compartidos](../US-000-fundamentos/TK-001-tipos-dominio-compartidos.md) — tipos `Proyecto`, `Tarea`, `RegistroDeTiempo`.
- [US-000 TK-004: Helper de fecha — mes calendario](../US-000-fundamentos/TK-004-helper-fecha-mes-calendario.md) — `obtenerMesCalendario()`, usado por `calcularTotalPorMes` para agrupar por `"YYYY-MM"`.
- [US-000 TK-003: Store raíz (CRUD crudo)](../US-000-fundamentos/TK-003-store-raiz-crud-crudo.md) — origen de los arreglos que recibe este módulo como parámetros; las funciones de este TK son puras y no invocan los selectores directamente, lo que las mantiene testeables de forma aislada (TC-004 a TC-012 son pruebas unitarias "sin interfaz").

## Referencias

- **Arquitectura:** [ADR-005: Arquitectura del proyecto basada en features](../../../adr/ADR-005-arquitectura-feature-based.md) (ubicación en `src/features/historial/domain/`), [ADR-006: Documentación de código con TSDoc](../../../adr/ADR-006-documentacion-con-tsdoc.md), [ADR-007: Estrategia de pruebas unitarias](../../../adr/ADR-007-estrategia-pruebas-unitarias.md).
- **Investigación:** [RS-001: Regla de asignación de mes para un Registro que cruza la medianoche de fin de mes](./research/RS-001-regla-cruce-de-mes.md) — resuelve el criterio que implementa `calcularTotalPorMes` (asignación por fecha/Hora de Inicio, sin prorrateo).

## Archivos afectados

```text
exercise-time-tracker/
└── src/
    └── features/
        └── historial/
            └── domain/
                ├── + calcular-totales.ts        # indexarPorId, esRegistroDeTiempoValido, calcularTotalPorTarea/Proyecto/Mes
                └── + calcular-totales.test.ts
```

## Plan de implementación

- [ ] **IT-01** — Implementar `esRegistroDeTiempoValido(registro: RegistroDeTiempo): boolean`: verdadero solo si `duracionMinutos` es un número finito mayor a 0 (excluye negativos, `NaN` y valores no numéricos, TC-005) y `fecha` cumple el formato `"YYYY-MM-DD"` y es una fecha calendario real (round-trip contra `Date`, excluye valores como `"2026-13-45"`, TC-011).
- [ ] **IT-02** — Implementar `indexarPorId<T extends { id: string }>(items: T[]): Map<string, T>`, utilidad genérica de indexación por `id` en O(n) reutilizada por las tres funciones de agregación de este módulo y por [TK-001](TK-001-lectura-historial.md) para el join de cada fila del historial con su Tarea/Proyecto.
- [ ] **IT-03** — Implementar `calcularTotalPorTarea(registros: RegistroDeTiempo[], tareas: Tarea[]): TotalPorTarea[]`: para cada Tarea de `tareas` (incluidas las que no tienen ningún Registro asociado, TC-006), suma las `duracionMinutos` de los registros de esa Tarea que cumplen `esRegistroDeTiempoValido`; una Tarea sin registros válidos devuelve `0` (nunca `NaN`/`undefined`).
- [ ] **IT-04** — Implementar `calcularTotalPorProyecto(registros: RegistroDeTiempo[], tareas: Tarea[], proyectos: Proyecto[]): TotalPorProyecto[]`: reutiliza `calcularTotalPorTarea` e `indexarPorId(tareas)` para resolver el `proyectoId` de cada Tarea; suma por Proyecto los totales de sus Tareas; una Tarea cuyo `proyectoId` no exista en `proyectos` (huérfana) se excluye del total de cualquier Proyecto sin interrumpir el cálculo de los Proyectos válidos (TC-008); un Proyecto sin Tareas con registros devuelve `0` (TC-009).
- [ ] **IT-05** — Implementar `calcularTotalPorMes(registros: RegistroDeTiempo[]): TotalPorMes[]`: filtra por `esRegistroDeTiempoValido`, agrupa por `obtenerMesCalendario(registro)` (US-000 TK-004 — ya aplica la regla de RS-001 al basarse en `registro.fecha`, que para un Registro del temporizador corresponde a su Hora de Inicio) y suma `duracionMinutos` por clave `"YYYY-MM"`.
- [ ] **IT-06** — Documentar con TSDoc (ADR-006) las cuatro funciones exportadas y el criterio de exclusión de `esRegistroDeTiempoValido`, dejando explícita en el comentario de `calcularTotalPorMes` la referencia a RS-001 (asignación por fecha/Hora de Inicio, sin prorrateo entre meses).
- [ ] **IT-07** — Cubrir con pruebas Vitest (ADR-007) `calcular-totales.test.ts`, mapeando 1 a 1 con TC-004 a TC-012: total por Tarea (happy, duración inválida, Tarea sin registros), total por Proyecto (happy, Tarea huérfana, Proyecto sin registros) y total por mes (happy, fecha inválida, cruce de medianoche de fin de mes reproduciendo el dato de RT-06 de TC-012: inicio `2026-07-31`, 120 min íntegros en julio, 0 en agosto).

## Observaciones

- El total por Proyecto calculado aquí (`calcularTotalPorProyecto`) es el mismo que consumirán, en `work-plan`/`TK-XXX` de [US-001 (Proyectos)](../US-001-proyectos/README.md), las tarjetas de Proyecto que muestran "Tiempo registrado" (ver Observaciones de US-001 y de US-003): no se duplica la regla de negocio entre ambas historias, aunque la integración concreta en US-001 queda fuera del alcance de este TK.
