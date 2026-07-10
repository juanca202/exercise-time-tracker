# TC-008 — Dado que existen Registros de Tiempo en el mes actual y en el mes anterior, Cuando el usuario navega al mes anterior y regresa al mes siguiente, Entonces el sistema recalcula y muestra el total acumulado correcto en cada periodo

Perspectiva: Happy Path
Automatización: Automatizable (E2E)
Prioridad: Alta
Criterio de aceptación: AC-004 (Salidas del sistema) — Total de tiempo acumulado por mes y navegación entre periodos
Artefacto padre: US-30274
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- Existen Registros de Tiempo tanto en el mes actual como en el mes calendario inmediatamente anterior.
- El usuario abre la app en el entorno de desarrollo local con el mes actual seleccionado.

## Datos de prueba

| Campo                       | Valor                                      | Notas       |
| --------------------------- | ------------------------------------------ | ----------- |
| Registros del mes actual    | 2 Registros de Tiempo                      | [propuesto] |
| Registros del mes anterior  | 3 Registros de Tiempo                      | [propuesto] |
| Total esperado mes anterior | Suma de las duraciones de esos 3 registros | [propuesto] |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                     | Resultado esperado del paso                                                  |
| --- | ------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| 1   | Usuario | Abre la app en el entorno de desarrollo local y navega a la sección Historial de registros | Se muestra el mes actual con su total acumulado                              |
| 2   | Usuario | Hace clic en el control "mes anterior"                                                     | La vista cambia al mes calendario inmediatamente anterior                    |
| 3   | Sistema | Recalcula el total acumulado para el mes anterior                                          | El total mostrado coincide con la suma de los Registros de Tiempo de ese mes |
| 4   | Usuario | Hace clic en el control "mes siguiente"                                                    | La vista regresa al mes actual                                               |
| 5   | Sistema | Recalcula el total acumulado para el mes actual                                            | El total mostrado vuelve a coincidir con el del mes actual original          |

## Resultado esperado final

El usuario puede alternar entre el mes actual y el mes anterior mediante los controles de navegación, y en cada periodo el total de tiempo acumulado mostrado corresponde exactamente a los Registros de Tiempo de ese mes.

## Observaciones

- **Automatización:** Parcial. La navegación mes anterior/siguiente parte del mes actual real del sistema. Sin fijar el reloj, los fixtures deben calcularse dinámicamente en cada corrida, con riesgo de flakiness cerca de cambios de mes o zona horaria. Se requiere un harness con reloj fijo o inyección de fecha.
