# TC-009 — Tiempo total del Proyecto sin Tareas registradas (valor cero)

Tipo: Límite
Prioridad: Media
Criterio de aceptación: AC-005 (Salidas del sistema) — Cálculo y visualización del tiempo total registrado por Proyecto como suma de los tiempos de sus Tareas
Artefacto padre: US-30273
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Objetivo

Validar el caso límite en que un Proyecto no tiene Tareas (o sus Tareas no tienen Registros de Tiempo), verificando que el tiempo total calculado y mostrado sea cero.

## Precondiciones

- La aplicación Time Tracker está abierta en el entorno de desarrollo local.
- Existe un Proyecto `Consultoría Interna` (ver TC-002) sin ninguna Tarea asociada.

## Datos de prueba

| Campo                              | Valor    | Notas                                            |
| ---------------------------------- | -------- | ------------------------------------------------ |
| Tareas asociadas al Proyecto       | `0`      | [propuesto] El Proyecto no tiene Tareas creadas. |
| Tiempo total esperado del Proyecto | `0h 00m` | [propuesto] Suma vacía de tiempos de Tareas.     |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                  | Resultado esperado del paso                           |
| --- | ------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1   | Sistema | Recupera las Tareas asociadas al Proyecto `Consultoría Interna`                         | El sistema determina que no existen Tareas asociadas  |
| 2   | Sistema | Calcula la suma de los tiempos de las Tareas del Proyecto                               | El resultado calculado es `0h 00m`, sin generar error |
| 3   | Usuario | Navega a la sección "Proyectos" y observa la tarjeta del Proyecto `Consultoría Interna` | La tarjeta muestra el Tiempo Registrado como `0h 00m` |

## Resultado esperado final

La tarjeta del Proyecto "Consultoría Interna" en el listado muestra un Tiempo Registrado de `0h 00m`, sin errores, reflejando que un Proyecto sin Tareas tiene tiempo total cero.

## Observaciones

Depende de que exista un Proyecto creado sin Tareas asociadas (ver TC-002).
