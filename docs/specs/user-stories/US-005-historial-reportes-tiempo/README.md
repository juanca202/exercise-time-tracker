# US-005: Historial y reportes de tiempo acumulado

Estado: Ready
Fecha de creación: 2026-07-06
Última actualización: 2026-07-06

## Descripción

**COMO** usuario
**QUIERO** ver el historial de mis Registros de Tiempo y los totales acumulados por Tarea, Proyecto y mes
**PARA** entender en qué he invertido mi tiempo

## Contexto

Historia derivada de [SRS-001-timetracker-app](../../requirements/SRS-001-timetracker-app/README.md), sección 3.1.3 (Ingreso Manual y Reportes) — parte de reportes. Requiere que existan Registros de Tiempo generados por temporizador y/o de forma manual — ver [US-003](../US-003-registro-tiempo-temporizador/README.md) y [US-004](../US-004-registro-manual-tiempo/README.md).

## Criterios de aceptación

- **AC-001 (Salidas del sistema):** El sistema DEBE leer y mostrar en la interfaz el historial de todos los Registros de Tiempo. [RF-014]
- **AC-002 (Procesamiento de datos):** El sistema DEBE calcular y mostrar los totales de tiempo acumulado por Tarea. [RF-015]
- **AC-003 (Procesamiento de datos):** El sistema DEBE calcular y mostrar los totales de tiempo acumulado por Proyecto, como suma de los tiempos de sus Tareas. [RF-016]
- **AC-004 (Procesamiento de datos):** El sistema DEBE calcular y mostrar los totales de tiempo acumulado por mes. [RF-017]
- **AC-005 (Interacción de usuario):** La interfaz DEBE presentar el historial de registros conforme al wireframe de referencia. [Apéndice A]
- **AC-006 (Eficiencia de rendimiento):** La visualización de los reportes de tiempo (por Tarea, Proyecto y mes) DEBE cargarse en menos de 2 segundos para un volumen de datos razonable (p. ej. 1000 registros). [RP-003]

---

## Complejidad sugerida

- **Story points:** 3
- **Justificación:** Lectura y agregación de datos ya persistidos (sin nueva escritura); tres niveles de totalización (Tarea, Proyecto, mes) y una restricción de rendimiento sobre el volumen de datos.

## Repositorios

- exercise-time-tracker

## Validación

### INVEST

| Letra | Criterio      | Resultado | Notas                                                                                             |
| ----- | ------------- | --------- | ------------------------------------------------------------------------------------------------- |
| **I** | Independiente | Parcial   | Requiere que existan Registros de Tiempo generados por US-003 (temporizador) y/o US-004 (manual). |
| **N** | Negociable    | Cumple    | El formato exacto de presentación de los totales admite ajuste.                                   |
| **V** | Valiosa       | Cumple    | Cierra el ciclo de valor del producto: visibilidad del tiempo invertido.                          |
| **E** | Estimable     | Cumple    | RF-014 a RF-017 y RP-003 son suficientes para estimar.                                            |
| **S** | Pequeña       | Cumple    | Acotada a lectura y agregación, sin nueva escritura de datos.                                     |
| **T** | Testeable     | Cumple    | AC-001 a AC-006 son verificables de forma objetiva.                                               |

### Definition of Ready (DoR)

| Criterio DoR                       | Estado  | Notas                                                                                                                        |
| ---------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Dependencias listas                | Parcial | Depende de US-003 y US-004, incluidas en el mismo lote de definición, para disponer de Registros de Tiempo.                  |
| Inputs/outputs claros              | Cumple  | Entrada: Registros de Tiempo persistidos. Salida: historial y totales por Tarea, Proyecto y mes.                             |
| Repositorios definidos             | Cumple  | exercise-time-tracker.                                                                                                       |
| Sin decisiones técnicas pendientes | Cumple  | Ninguna.                                                                                                                     |
| Referencias de UI                  | Cumple  | Wireframe "Historial de registros" — ![Historial de registros](../../requirements/SRS-001-timetracker-app/assets/image.png). |
| Sin aclaraciones pendientes        | Cumple  | Ninguna.                                                                                                                     |

## Observaciones

- Depende de que existan Registros de Tiempo generados por US-003 (temporizador) y/o US-004 (manual), incluidas en el mismo lote de definición.
- El SRS-001 no especifica el criterio de agrupación temporal para el total "por mes" (p. ej. mes calendario vs. ventana móvil de 30 días); se asume mes calendario salvo indicación contraria del usuario o producto.
