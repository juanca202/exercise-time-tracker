# TC-005 — Dado que el Proyecto "Website" tiene Tareas con Registros de Tiempo dentro del mes seleccionado, Cuando el sistema calcula el total acumulado por Proyecto, Entonces muestra "2h 15m" como total del Proyecto "Website" en ese periodo

Perspectiva: Happy Path
Automatización: Automatizable (Unit)
Prioridad: Media
Criterio de aceptación: AC-003 (Salidas del sistema) — Total de tiempo acumulado por Proyecto dentro del periodo seleccionado
Artefacto padre: US-30274
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- El Proyecto "Website" tiene 2 Tareas ("Diseño" y "Backend"), cada una con Registros de Tiempo dentro del mes actualmente seleccionado.
- El usuario abre la app en el entorno de desarrollo local.

## Datos de prueba

| Campo                                | Valor                               | Notas                              |
| ------------------------------------ | ----------------------------------- | ---------------------------------- |
| Tarea "Diseño" (Proyecto "Website")  | 1h 30m, dentro del mes seleccionado | [propuesto]                        |
| Tarea "Backend" (Proyecto "Website") | 45m, dentro del mes seleccionado    | [propuesto]                        |
| Total esperado Proyecto "Website"    | 2h 15m                              | Suma de ambas Tareas en el periodo |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                                                    | Resultado esperado del paso                                                                      |
| --- | ------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1   | Usuario | Abre la app en el entorno de desarrollo local y navega a la sección Historial de registros con el mes actual seleccionado | La sección se carga sin errores                                                                  |
| 2   | Sistema | Agrupa los Registros de Tiempo del periodo seleccionado por Proyecto, sumando las Tareas de cada uno                      | El cálculo agrupa correctamente los registros de "Diseño" y "Backend" bajo el Proyecto "Website" |
| 3   | Sistema | Muestra el total acumulado junto al Proyecto                                                                              | Se muestra "2h 15m" como total del Proyecto "Website" para el periodo seleccionado               |

## Resultado esperado final

La interfaz muestra el total de tiempo acumulado del Proyecto "Website" como 2h 15m para el mes seleccionado, coincidiendo con la suma de sus Tareas.

## Observaciones

- **Automatización:** Parcial. El cálculo de agregación es automatizable, pero depende del "mes actualmente seleccionado" = mes calendario real del sistema. Se requiere fijar o mockear el reloj (ej. Playwright Clock, fake timers) o calcular las fechas de los fixtures dinámicamente relativas a `Date.now()`, para evitar flakiness en los bordes de mes.
