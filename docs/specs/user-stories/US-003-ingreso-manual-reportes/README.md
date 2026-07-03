# US-003: Ingreso Manual de Tiempo y Reportes

Estado: Ready
Fecha de creación: 2026-07-03
Última actualización: 2026-07-03

## Descripción

**COMO** usuario de Time Tracker
**QUIERO** registrar tiempo manualmente para una tarea y consultar el historial y los totales de tiempo acumulado por tarea, proyecto y mes
**PARA** completar mi registro de tiempo cuando no uso el temporizador y entender en qué invierto mi tiempo

## Contexto

Depende de [US-001](../US-001-gestion-proyectos-tareas/README.md) (requiere Proyectos y Tareas existentes) y se complementa con [US-002](../US-002-control-tiempo-automatizado/README.md): el historial y los totales de esta historia agregan Registros de Tiempo sin importar su origen (`source: 'timer' | 'manual'`), pero esta historia es funcionalmente entregable y verificable solo con registros manuales.

Un Registro de Tiempo manual (`TimeEntry { id, taskId, date, durationSeconds, source: 'manual', createdAt }`) se crea indicando Tarea, Fecha y Duración (RF-011); no incluye hora de inicio/fin explícitas (a diferencia de los registros generados por el temporizador). La Duración DEBE ser mayor que cero (RF-013, restricción 2.4).

Decisión de alcance (SRS es ambiguo entre el wireframe de "Historial de Registros" y el requisito RF-015 de totales por Tarea): el wireframe de referencia solo muestra totales por Proyecto y por mes/periodo; no muestra un desglose por Tarea. Para cumplir RF-015 sin contradecir el wireframe, esta historia **añade** una sección adicional de "Totales por Tarea" dentro de la vista "Historial de Registros" (extensión consistente con el mismo lenguaje visual de tarjetas/tabla del wireframe, no un rediseño).

## Reglas de negocio

- **BR-01:** El sistema DEBE permitir crear un Registro de Tiempo manual para una Tarea, ingresando la Tarea, la Fecha y la Duración. → verificado por AC-001
- **BR-02:** El sistema DEBE persistir el Registro de Tiempo manual en el almacenamiento local. → verificado por AC-002
- **BR-03:** El sistema NO DEBE persistir un Registro de Tiempo manual cuya Duración ingresada sea menor o igual a cero. → verificado por AC-003
- **BR-04:** El sistema DEBE leer y mostrar en la interfaz el historial de todos los Registros de Tiempo. → verificado por AC-004
- **BR-05:** El sistema DEBE calcular y mostrar los totales de tiempo acumulado por Tarea. → verificado por AC-005
- **BR-06:** El sistema DEBE calcular y mostrar los totales de tiempo acumulado por Proyecto, como suma de los tiempos de sus Tareas. → verificado por AC-006
- **BR-07:** El sistema DEBE calcular y mostrar los totales de tiempo acumulado por mes. → verificado por AC-007
- **BR-08:** Los reportes de tiempo (por tarea, proyecto y mes) DEBEN cargar en menos de 2 segundos para un volumen de hasta 1000 registros. → verificado por AC-009

## Referencias

- **Diseño / sistema de diseño:** [DESIGN.md — Precision Focus](https://github.com/HectorAndradeBayteq/taller-sdd/blob/master/etapa-2/assets/DESIGN.md)
- **Wireframe — Panel de Tareas (entrada manual):** [assets/wireframe-panel-tareas-entrada-manual.png](assets/wireframe-panel-tareas-entrada-manual.png)
- **Wireframe — Historial de Registros:** [assets/wireframe-historial-registros.png](assets/wireframe-historial-registros.png)
- **Historia base:** [US-001: Gestión de Proyectos y Tareas](../US-001-gestion-proyectos-tareas/README.md)
- **Historia complementaria:** [US-002: Control de Tiempo Automatizado](../US-002-control-tiempo-automatizado/README.md)

## Criterios de aceptación

- **AC-001 (Reglas de negocio):** El sistema DEBE permitir crear un Registro de Tiempo manual seleccionando una Tarea, ingresando una Fecha y una Duración mediante el panel "Entrada Manual".
- **AC-002 (Procesamiento de datos):** El sistema DEBE persistir el Registro de Tiempo manual en el almacenamiento local del dispositivo, marcado con origen "manual".
- **AC-003 (Reglas de negocio):** El sistema NO DEBE permitir confirmar el registro manual si la Duración ingresada es menor o igual a cero; DEBE mostrar retroalimentación de error al usuario.
- **AC-004 (Salidas del sistema):** La interfaz DEBE mostrar en la vista "Historial de Registros" el listado completo de Registros de Tiempo (de origen temporizador y manual), con Fecha, Proyecto, Tarea y Duración, filtrable por periodo mensual.
- **AC-005 (Salidas del sistema):** La interfaz DEBE mostrar los totales de tiempo acumulado por Tarea para el periodo consultado.
- **AC-006 (Salidas del sistema):** La interfaz DEBE mostrar los totales de tiempo acumulado por Proyecto (suma de los tiempos de sus Tareas) para el periodo consultado, conforme al wireframe de referencia.
- **AC-007 (Salidas del sistema):** La interfaz DEBE mostrar el total de tiempo acumulado del mes/periodo seleccionado.
- **AC-008 (Interacción de usuario):** La interfaz DEBE permitir navegar entre periodos mensuales (mes anterior/siguiente) en la vista "Historial de Registros", conforme al wireframe de referencia.
- **AC-009 (Eficiencia de rendimiento):** La visualización de los reportes de tiempo (por tarea, proyecto y mes) DEBE cargar en menos de 2 segundos para un volumen de hasta 1000 Registros de Tiempo.

### Escenarios de comportamiento

```gherkin
Escenario: SC-01 - Crear un registro de tiempo manual válido
DADO que existe al menos una Tarea
CUANDO el usuario ingresa la Tarea, una Fecha y una Duración mayor que cero en el panel "Entrada Manual" y confirma
ENTONCES el sistema DEBE crear el Registro de Tiempo con origen "manual" y persistirlo en almacenamiento local

Escenario: SC-02 - Rechazar registro manual con duración inválida
DADO que el usuario completa el panel "Entrada Manual"
CUANDO ingresa una Duración igual o menor a cero y confirma
ENTONCES el sistema NO DEBE crear el Registro de Tiempo y DEBE mostrar un mensaje de error

Escenario: SC-03 - Consultar historial y totales de un periodo
DADO que existen Registros de Tiempo en distintos meses
CUANDO el usuario navega a la vista "Historial de Registros" y selecciona un mes
ENTONCES el sistema DEBE mostrar únicamente los registros de ese mes junto con los totales por Tarea, por Proyecto y el total del mes
```

---

## Complejidad sugerida

- **Story points:** 5
- **Justificación:** Formulario de entrada manual con validación, vista de historial con filtro por periodo y tres agregaciones distintas (por tarea, por proyecto, por mes) sobre un volumen de datos con requisito de rendimiento explícito (RP-003). Riesgo moderado por la lógica de agregación y el filtrado temporal.

## Repositorios

- exercise-time-tracker

## Validación

### INVEST

| Letra | Criterio      | Resultado | Notas                                                                                                                                |
| ----- | ------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **I** | Independiente | Parcial   | Depende de que existan Tareas (US-001); es funcionalmente verificable solo con registros manuales, sin requerir US-002 implementada. |
| **N** | Negociable    | Cumple    | La composición visual exacta del desglose por tarea (sección añadida) queda abierta a `work-plan`.                                   |
| **V** | Valiosa       | Cumple    | Permite completar el registro de tiempo sin temporizador y entender en qué se invierte el tiempo.                                    |
| **E** | Estimable     | Cumple    | RF-011 a RF-017 y RP-003 son suficientemente específicos.                                                                            |
| **S** | Pequeña       | Cumple    | Alcance acotado a creación manual + historial + tres agregaciones; sin edición ni borrado de registros.                              |
| **T** | Testeable     | Cumple    | AC-001 a AC-009 son verificables (incluye tests de cálculo de totales con datos fijos).                                              |

### Definition of Ready (DoR)

| Criterio DoR                       | Estado | Notas                                                                                          |
| ---------------------------------- | ------ | ---------------------------------------------------------------------------------------------- |
| Dependencias listas                | Cumple | Depende de US-001 (Project/Task), ya definida y secuenciada antes que esta historia.           |
| Inputs/outputs claros              | Cumple | Entradas (Tarea, Fecha, Duración) y salidas (historial, totales) definidas en RF-011 a RF-017. |
| Repositorios definidos             | Cumple | exercise-time-tracker.                                                                         |
| Sin decisiones técnicas pendientes | Cumple | Forma del TimeEntry manual y estrategia de agregación documentadas en Contexto.                |
| Referencias de UI                  | Cumple | Wireframes de entrada manual e historial de registros adjuntos en `assets/`.                   |
| Sin aclaraciones pendientes        | Cumple | Ambigüedad de totales por tarea vs. wireframe resuelta y documentada en Contexto.              |

## Observaciones

Ninguna.
