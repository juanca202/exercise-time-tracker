# TC-012 — Dado que el mes actual tiene 3 Registros de Tiempo distribuidos en 2 Proyectos, Cuando el sistema calcula el resumen del periodo, Entonces muestra "3 registros", "2 proyectos" y "4h 15m" coincidiendo con los datos reales

Perspectiva: Happy Path
Automatización: Automatizable (Unit)
Prioridad: Media
Criterio de aceptación: AC-006 (Interacción de usuario) — Resumen del periodo seleccionado
Artefacto padre: US-30274
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- El mes actual tiene 3 Registros de Tiempo distribuidos en 2 Proyectos distintos.
- El usuario abre la app en el entorno de desarrollo local con el mes actual seleccionado.

## Datos de prueba

| Campo                   | Valor                      | Notas                                     |
| ----------------------- | -------------------------- | ----------------------------------------- |
| Registros en el periodo | 3                          | [propuesto]                               |
| Proyectos involucrados  | 2 ("Website", "App Móvil") | [propuesto]                               |
| Total de horas          | 4h 15m                     | Suma de las duraciones de los 3 registros |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                                                    | Resultado esperado del paso                                                  |
| --- | ------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 1   | Usuario | Abre la app en el entorno de desarrollo local y navega a la sección Historial de registros con el mes actual seleccionado | La sección se carga sin errores                                              |
| 2   | Sistema | Calcula el resumen del periodo: cantidad de registros, cantidad de proyectos involucrados y total de horas                | Los tres valores se calculan a partir de los Registros de Tiempo del periodo |
| 3   | Sistema | Muestra el resumen en la interfaz                                                                                         | Se muestran "3 registros", "2 proyectos" y "4h 15m"                          |

## Resultado esperado final

El resumen del periodo seleccionado muestra 3 registros encontrados, 2 proyectos involucrados y un total de 4h 15m, coincidiendo con los datos reales del mes.

## Observaciones

- **Automatización:** Parcial. El resumen se calcula sobre "el mes actual". Se requiere fijar o mockear el reloj del sistema para que los conteos de registros, proyectos y horas totales sean deterministas en cualquier fecha de ejecución.
