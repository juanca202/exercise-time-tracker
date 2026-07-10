# TC-004 — Dado que la Tarea "Investigación" no tiene ningún Registro de Tiempo asociado, Cuando el sistema calcula el total acumulado por Tarea, Entonces muestra "0h" para esa Tarea sin errores

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

| Campo                               | Valor                 | Notas                                     |
| ----------------------------------- | --------------------- | ----------------------------------------- |
| Tarea "Investigación"               | 0 Registros de Tiempo | [propuesto]                               |
| Total esperado para "Investigación" | 0h                    | Boundary: mínimo posible sin ser un error |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                     | Resultado esperado del paso                                  |
| --- | ------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| 1   | Usuario | Abre la app en el entorno de desarrollo local y navega a la sección Historial de registros | La sección se carga sin errores                              |
| 2   | Sistema | Calcula el total acumulado por Tarea, incluyendo la Tarea "Investigación"                  | El cálculo no falla al no encontrar registros para esa Tarea |
| 3   | Sistema | Muestra el total de la Tarea "Investigación"                                               | Se muestra "0h" (o equivalente) sin errores ni valores nulos |

## Resultado esperado final

El total acumulado de la Tarea "Investigación" se presenta como 0h, sin afectar el cálculo ni la visualización de las demás Tareas.

## Observaciones

Depende de que la Tarea "Investigación" exista previamente (creada según US-001), aunque sin Registros de Tiempo.
