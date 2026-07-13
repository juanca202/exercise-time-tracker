# TC-007 — Dado que existen varias Tareas de un mismo Proyecto con Registros de Tiempo, Cuando el sistema calcula el total acumulado por Proyecto, Entonces el total corresponde a la suma de los totales de todas sus Tareas

**Perspectiva**: Happy Path
**Automatización**: Automatizable (Integration)
**Prioridad**: Alta
**Criterio de aceptación**: AC-003 (Procesamiento de datos)
**Artefacto padre**: US-003
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La función de cálculo de total por Proyecto está disponible, integrando las colecciones de Proyectos, Tareas y Registros de Tiempo (sin interfaz).
- Existe un Proyecto con al menos dos Tareas, cada una con Registros de Tiempo.

## Datos de prueba

| Campo                          | Valor                             | Notas               |
| ------------------------------ | --------------------------------- | ------------------- |
| Proyecto "Alfa" [propuesto]    | id: "P-1"                         |                     |
| Tarea "Diseño UI" [propuesto]  | proyectoId: "P-1", total: 135 min | Resultado de TC-004 |
| Tarea "Testing" [propuesto]    | proyectoId: "P-1", total: 60 min  | RT-04: 60 min       |
| Total esperado Proyecto "Alfa" | 195 min                           | 135 + 60            |

## Pasos de ejecución

| #   | Actor          | Acción                                                                                            | Resultado esperado del paso                                                  |
| --- | -------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 1   | Sistema (test) | Invoca la función de cálculo de total por Proyecto con las Tareas y Registros de Tiempo de prueba | El sistema relaciona cada Registro con su Tarea y cada Tarea con su Proyecto |
| 2   | Sistema        | Suma los totales de "Diseño UI" y "Testing" bajo el Proyecto "Alfa"                               | Se obtiene el total agregado del Proyecto                                    |
| 3   | Sistema (test) | Verifica el total devuelto para el Proyecto "Alfa"                                                | El valor coincide con el esperado                                            |

## Resultado esperado final

El total acumulado del Proyecto "Alfa" es 195 minutos, resultado de sumar los totales de todas sus Tareas ("Diseño UI": 135 min, "Testing": 60 min).

## Observaciones

Este cálculo reutiliza la misma regla de negocio que consumen tanto la pantalla de Historial (AC-003) como las tarjetas de Proyecto en US-001, sin duplicar lógica (ver Observaciones de US-003).
