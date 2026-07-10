# TC-009 — Dado que el mes calendario anterior no tiene Registros de Tiempo, Cuando el usuario navega a ese mes, Entonces el sistema muestra la lista vacía y el total acumulado en "0h" sin errores

Perspectiva: Límite
Automatización: Automatizable (E2E)
Prioridad: Media
Criterio de aceptación: AC-004 (Salidas del sistema) — Total de tiempo acumulado por mes y navegación entre periodos
Artefacto padre: US-30274
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- Existen Registros de Tiempo en el mes actual, pero ninguno en el mes calendario inmediatamente anterior.
- El usuario abre la app en el entorno de desarrollo local con el mes actual seleccionado.

## Datos de prueba

| Campo                           | Valor                 | Notas                           |
| ------------------------------- | --------------------- | ------------------------------- |
| Registros del mes anterior      | 0 Registros de Tiempo | [propuesto]                     |
| Total esperado del mes anterior | 0h                    | Boundary: periodo sin actividad |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                     | Resultado esperado del paso                                                  |
| --- | ------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| 1   | Usuario | Abre la app en el entorno de desarrollo local y navega a la sección Historial de registros | Se muestra el mes actual con su total acumulado                              |
| 2   | Usuario | Hace clic en el control "mes anterior"                                                     | La vista cambia al mes calendario anterior, que no tiene Registros de Tiempo |
| 3   | Sistema | Calcula el total acumulado para ese mes sin registros                                      | El cálculo no falla al no encontrar registros                                |
| 4   | Sistema | Muestra el periodo seleccionado                                                            | Se muestra el mes anterior con lista de registros vacía y total "0h"         |

## Resultado esperado final

Al navegar a un mes sin Registros de Tiempo, la pantalla muestra ese periodo con la lista vacía y el total acumulado en 0h, sin errores ni datos residuales de otro mes.

## Observaciones

- **Automatización:** Parcial. La navegación a "mes anterior sin registros" depende de qué mes es "hoy" para el sistema. Mismo requerimiento que TC-007/TC-008: fijar o mockear el reloj para reproducibilidad determinista.
