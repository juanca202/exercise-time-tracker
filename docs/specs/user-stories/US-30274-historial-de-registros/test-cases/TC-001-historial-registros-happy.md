# TC-001 — Visualización del historial completo de Registros de Tiempo

Tipo: Happy Path
Prioridad: Alta
Criterio de aceptación: AC-001 (Casos de uso) — Lectura y visualización del historial de Registros de Tiempo
Artefacto padre: US-30274
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Objetivo

Validar que el sistema lee y muestra en la interfaz el historial completo de Registros de Tiempo existentes, ya que es la base de toda la funcionalidad de historial.

## Precondiciones

- El usuario tiene al menos 3 Registros de Tiempo previamente creados (vía temporizador o ingreso manual, según US-001) asociados a distintas Tareas y Proyectos.
- El usuario abre la app en el entorno de desarrollo local.

## Datos de prueba

| Campo      | Valor                                                                            | Notas       |
| ---------- | -------------------------------------------------------------------------------- | ----------- |
| Registro 1 | Proyecto "Website", Tarea "Diseño", Duración 1h 30m, Fecha dentro del mes actual | [propuesto] |
| Registro 2 | Proyecto "Website", Tarea "Backend", Duración 45m, Fecha dentro del mes actual   | [propuesto] |
| Registro 3 | Proyecto "App Móvil", Tarea "QA", Duración 2h, Fecha dentro del mes actual       | [propuesto] |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                     | Resultado esperado del paso                                   |
| --- | ------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| 1   | Usuario | Abre la app en el entorno de desarrollo local y navega a la sección Historial de registros | La sección se carga sin errores                               |
| 2   | Sistema | Lee los Registros de Tiempo existentes en el almacenamiento local                          | Los 3 registros de la precondición se recuperan correctamente |
| 3   | Sistema | Muestra el historial en la interfaz                                                        | Los 3 registros aparecen listados en la pantalla              |

## Resultado esperado final

La pantalla de Historial de registros muestra los 3 Registros de Tiempo existentes, sin omisiones ni duplicados.

## Observaciones

Ninguna.
