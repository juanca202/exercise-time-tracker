# TC-004 — Dado que la Tarea "Investigación" no tiene ningún Registro de Tiempo asociado, Cuando el sistema calcula el total acumulado por Tarea, Entonces esa Tarea no aparece en el listado del periodo, sin errores

Perspectiva: Límite
Automatización: Automatizable (Unit)
Prioridad: Baja
Criterio de aceptación: AC-002 (Salidas del sistema) — Total de tiempo acumulado por Tarea
Artefacto padre: US-30274
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- Existe la Tarea "Investigación" (Proyecto "Website") sin ningún Registro de Tiempo asociado.
- Existen otras Tareas del mismo Proyecto con Registros de Tiempo, de modo que el historial no está vacío en su totalidad.
- El usuario abre la app en el entorno de desarrollo local.

## Datos de prueba

| Campo                                          | Valor                 | Notas                                     |
| ---------------------------------------------- | --------------------- | ----------------------------------------- |
| Tarea "Investigación"                          | 0 Registros de Tiempo | [propuesto]                               |
| Filas esperadas para "Investigación" en el mes | Ninguna (se omite)    | Boundary: mínimo posible sin ser un error |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                     | Resultado esperado del paso                                                                              |
| --- | ------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| 1   | Usuario | Abre la app en el entorno de desarrollo local y navega a la sección Historial de registros | La sección se carga sin errores                                                                          |
| 2   | Sistema | Calcula el total acumulado por Tarea, evaluando también la Tarea "Investigación"           | El cálculo no falla al no encontrar registros para esa Tarea                                             |
| 3   | Sistema | Lista las filas de Tareas con actividad en el periodo                                      | La Tarea "Investigación" no genera una fila (no hay actividad que agrupar), sin errores ni valores nulos |

## Resultado esperado final

La Tarea "Investigación" no aparece en el listado del Historial para el periodo seleccionado (no tiene Registros de Tiempo que agrupar), sin afectar el cálculo ni la visualización de las demás Tareas.

## Observaciones

Depende de que la Tarea "Investigación" exista previamente (creada según US-001), aunque sin Registros de Tiempo.

**Decisión de producto (2026-07-10):** el listado del Historial agrupa por Tarea con actividad en el periodo (ver `design.md` de `view-time-history`); las Tareas sin Registros en el periodo se omiten en vez de mostrarse en "0h" — consistente con no listar información sin contenido accionable. Este TC se corrigió para reflejar ese comportamiento confirmado (antes exigía mostrar "0h", lo cual contradecía la implementación ya probada en `selectors.test.ts`).
