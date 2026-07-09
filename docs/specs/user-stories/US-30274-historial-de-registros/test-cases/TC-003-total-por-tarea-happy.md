# TC-003 — Cálculo del total de tiempo acumulado por Tarea

Tipo: Happy Path
Prioridad: Media
Criterio de aceptación: AC-002 (Salidas del sistema) — Total de tiempo acumulado por Tarea
Artefacto padre: US-30274
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Objetivo

Validar que el sistema calcula y muestra correctamente el total de tiempo acumulado por Tarea cuando existen múltiples Registros de Tiempo para la misma Tarea.

## Precondiciones

- La Tarea "Diseño" (Proyecto "Website") tiene 2 Registros de Tiempo previos.
- El usuario abre la app en el entorno de desarrollo local.

## Datos de prueba

| Campo                       | Valor           | Notas                   |
| --------------------------- | --------------- | ----------------------- |
| Registro 1 (Tarea "Diseño") | Duración 1h 30m | [propuesto]             |
| Registro 2 (Tarea "Diseño") | Duración 45m    | [propuesto]             |
| Total esperado              | 2h 15m          | Suma de ambos registros |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                     | Resultado esperado del paso                                          |
| --- | ------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| 1   | Usuario | Abre la app en el entorno de desarrollo local y navega a la sección Historial de registros | La sección se carga sin errores                                      |
| 2   | Sistema | Agrupa los Registros de Tiempo por Tarea y suma sus duraciones                             | El cálculo agrupa correctamente los 2 registros de la Tarea "Diseño" |
| 3   | Sistema | Muestra el total acumulado junto a la Tarea                                                | Se muestra "2h 15m" como total de la Tarea "Diseño"                  |

## Resultado esperado final

La interfaz muestra el total de tiempo acumulado de la Tarea "Diseño" como 2h 15m, coincidiendo con la suma de sus Registros de Tiempo.

## Observaciones

Ninguna.
