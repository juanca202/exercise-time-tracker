# US-003: Historial de registros

**Estado**: Ready
**Fecha de creación**: 2026-07-13
**Última actualización**: 2026-07-13

## Descripción

**COMO** usuario de Time Tracker
**QUIERO** visualizar el historial de mis Registros de Tiempo y los totales acumulados por Tarea, Proyecto y mes
**PARA** analizar en qué actividades invierto mi tiempo

## Contexto

Los Registros de Tiempo que alimentan este historial se generan al detener el temporizador o al ingresar tiempo manualmente (ver [US-002](../US-002-tareas/README.md)). Esta historia cubre exclusivamente la lectura, agregación y presentación de esos datos ya persistidos, no su creación.

## Referencias

- **Diseño / prototipo:** [Figma - Exercise · Time Tracker (pantalla Historial de registros)](https://www.figma.com/design/YYHDIH7CBsZrZ4VKXvbzkR/Exercise---Time-Tracker)
- **Especificación funcional:** [SRS-001: Especificación de Requisitos - Time Tracker](../../requirements/SRS-001-timetracker-app/README.md) (sección 3.1.3 y Apéndice A)

## Criterios de aceptación

- **AC-001 (Salidas del sistema):** El sistema DEBE leer y mostrar en la interfaz el historial completo de todos los Registros de Tiempo almacenados.
  Casos de prueba: [TC-001](./test-cases/TC-001-historial-completo-happy.md) · [TC-002](./test-cases/TC-002-datos-corruptos-error.md) · [TC-003](./test-cases/TC-003-historial-vacio-limite.md)
- **AC-002 (Procesamiento de datos):** El sistema DEBE calcular y mostrar el total de tiempo acumulado por Tarea.
  Casos de prueba: [TC-004](./test-cases/TC-004-total-por-tarea-happy.md) · [TC-005](./test-cases/TC-005-total-por-tarea-error.md) · [TC-006](./test-cases/TC-006-total-por-tarea-limite.md)
- **AC-003 (Procesamiento de datos):** El sistema DEBE calcular y mostrar el total de tiempo acumulado por Proyecto, sumando los tiempos de todas sus Tareas.
  Casos de prueba: [TC-007](./test-cases/TC-007-total-por-proyecto-happy.md) · [TC-008](./test-cases/TC-008-total-por-proyecto-error.md) · [TC-009](./test-cases/TC-009-total-por-proyecto-limite.md)
- **AC-004 (Procesamiento de datos):** El sistema DEBE calcular y mostrar el total de tiempo acumulado por mes. Cuando un Registro de Tiempo generado por el temporizador cruce la medianoche de fin de mes, la totalidad de su Duración DEBE contabilizarse en el mes correspondiente a la Hora de Inicio del registro (sin prorratear entre los dos meses).
  Casos de prueba: [TC-010](./test-cases/TC-010-total-por-mes-happy.md) · [TC-011](./test-cases/TC-011-total-por-mes-error.md) · [TC-012](./test-cases/TC-012-total-por-mes-limite.md)
  Investigación: [RS-001](./research/RS-001-regla-cruce-de-mes.md)
- **AC-005 (Eficiencia de rendimiento):** La visualización de los reportes de tiempo (por Tarea, Proyecto y mes) DEBE cargar en menos de 2 segundos para un volumen de hasta 1000 Registros de Tiempo.
  Casos de prueba: [TC-013](./test-cases/TC-013-rendimiento-1000-registros-happy.md) · [TC-014](./test-cases/TC-014-rendimiento-1000-registros-limite.md)
  Investigación: [RS-002](./research/RS-002-persistencia-local-localstorage-vs-indexeddb.md)
- **AC-006 (Interacción de usuario):** La interfaz de la pantalla de Historial de registros DEBE adherirse al sistema de diseño DESIGN.md (tema Precision Focus).
  Casos de prueba: [TC-015](./test-cases/TC-015-adherencia-design-system-happy.md)
- **AC-007 (Interacción de usuario):** La implementación de la pantalla de Historial de registros DEBE ser visualmente fiel (layout, colores, tipografía, espaciado y componentes) al prototipo de alta fidelidad en Figma referenciado.
  Casos de prueba: [TC-016](./test-cases/TC-016-fidelidad-figma-happy.md)

---

## Complejidad sugerida

- **Story points:** 3
- **Justificación:** Alcance limitado a lectura, agregación y presentación de datos ya persistidos por [US-002](../US-002-tareas/README.md); sin nuevas reglas de negocio ni escritura de datos. El único riesgo es el requisito de rendimiento sobre volúmenes de hasta 1000 registros.

## Repositorios

- exercise-time-tracker

## Validación

### INVEST

| Letra | Criterio      | Resultado | Notas                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----- | ------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **I** | Independiente | Parcial   | No aporta valor real sin Registros de Tiempo existentes, generados por [US-002 (Tareas)](../US-002-tareas/README.md) (dependencia **funcional de dominio**, no de implementación); gracias al store raíz y los tipos de dominio ya definidos en [US-000](../US-000-fundamentos/README.md) (AC-001, AC-003), puede implementarse en paralelo sembrando Registros de Tiempo de prueba mediante el CRUD crudo del store compartido, sin esperar a que el temporizador de US-002 esté terminado. |
| **N** | Negociable    | Cumple    | El formato exacto de agrupación/orden del historial admite ajuste técnico.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **V** | Valiosa       | Cumple    | Permite al usuario analizar en qué invierte su tiempo, valor central de una herramienta de time tracking.                                                                                                                                                                                                                                                                                                                                                                                    |
| **E** | Estimable     | Cumple    | Alcance y reglas de agregación claros.                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **S** | Pequeña       | Cumple    | Cabe en un incremento único (lectura + agregación + presentación).                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **T** | Testeable     | Cumple    | Cada AC-XXX es verificable de forma objetiva.                                                                                                                                                                                                                                                                                                                                                                                                                                                |

### Definition of Ready (DoR)

| Criterio DoR                       | Estado  | Notas                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dependencias listas                | Parcial | Depende funcionalmente de [US-002 (Tareas)](../US-002-tareas/README.md) para la existencia de Registros de Tiempo reales; no es una aclaración pendiente ni un bloqueo de implementación, ya que el store raíz de [US-000](../US-000-fundamentos/README.md) permite sembrar Registros de Tiempo de prueba y desarrollar esta historia en paralelo. El orden Proyectos → Tareas → Historial de registros aplica al flujo de valor para el usuario final, no a la secuencia de desarrollo. |
| Inputs/outputs claros              | Cumple  | Input: Registros de Tiempo persistidos. Output: historial listado y totales por Tarea, Proyecto y mes.                                                                                                                                                                                                                                                                                                                                                                                   |
| Repositorios definidos             | Cumple  | exercise-time-tracker.                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Sin decisiones técnicas pendientes | Cumple  | El mecanismo de persistencia local quedó resuelto en [RS-002](./research/RS-002-persistencia-local-localstorage-vs-indexeddb.md) (localStorage vía Zustand `persist`); el detalle de cómo se cachan/optimizan los totales en memoria se resuelve en `work-plan`/`TK-XXX`.                                                                                                                                                                                                                |
| Referencias de UI                  | Cumple  | Prototipo de alta fidelidad en Figma referenciado.                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Sin aclaraciones pendientes        | Cumple  | Ninguna.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

## Observaciones

- Esta historia debe implementarse después de [US-002 (Tareas)](../US-002-tareas/README.md) para contar con Registros de Tiempo reales, aunque su desarrollo puede iniciarse en paralelo con datos de prueba. Esta dependencia es de **regla de negocio** (un Registro de Tiempo solo existe si fue generado por un temporizador o un ingreso manual de Tareas), no de archivos ni de secuencia de desarrollo: al estar el store raíz, los tipos de dominio y el CRUD crudo de Registro de Tiempo ya resueltos en [US-000 (Fundamentos)](../US-000-fundamentos/README.md), esta historia puede sembrar Registros de Tiempo de prueba directamente contra el store compartido y avanzar en paralelo sin necesitar que US-002 esté implementada.
- En el prototipo Figma, la pantalla de Historial de registros muestra el total acumulado por Proyecto como stat cards (AC-003) y el detalle de cada Registro (con su Tarea) en la tabla, pero no muestra un resumen visual distinto para el total por Tarea (AC-002); se calcula igualmente sobre los datos, aunque su presentación específica queda a definir en `work-plan`/`TK-XXX`.
- El total de tiempo acumulado por Proyecto (AC-003) también se muestra en el prototipo Figma dentro de las tarjetas de la pantalla de Proyectos ([US-001](../US-001-proyectos/README.md)); ambas pantallas consumen el mismo cálculo, sin duplicar la regla de negocio.
- La laguna documentada en TC-012 (cruce de fin de mes) quedó resuelta por [RS-001](./research/RS-001-regla-cruce-de-mes.md): se asigna por fecha de inicio del registro, sin prorratear. TC-012 ya fue actualizado para reflejar el resultado esperado exacto (mes de inicio recibe la duración completa; mes de fin recibe 0).
- El mecanismo concreto de almacenamiento local, antes pendiente de `work-plan`, quedó investigado en [RS-002](./research/RS-002-persistencia-local-localstorage-vs-indexeddb.md): `localStorage` vía Zustand `persist` es suficiente para AC-005; no se requiere IndexedDB en esta primera versión. Aplica también a US-001 y US-002, que comparten el mismo mecanismo de persistencia.
