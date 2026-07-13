# US-002: Tareas

**Estado**: Ready
**Fecha de creación**: 2026-07-13
**Última actualización**: 2026-07-13

## Descripción

**COMO** usuario de Time Tracker
**QUIERO** crear y editar Tareas dentro de un Proyecto, controlar un temporizador para registrar el tiempo dedicado a una Tarea en tiempo real, registrar tiempo de forma manual cuando no usé el temporizador, y ver mi progreso frente a una meta semanal
**PARA** llevar un control preciso del tiempo que invierto en cada actividad

## Contexto

Una Tarea pertenece siempre a un único Proyecto existente (ver [US-001](../US-001-proyectos/README.md)). El panel principal de Tareas concentra tanto la gestión de Tareas como el control del temporizador y el ingreso manual de tiempo (Apéndice A del SRS-001: "Pantalla de Tareas" y "Nueva Tarea"), por decisión explícita del usuario al alcance de esta historia. Solo puede haber un (1) temporizador activo a la vez en toda la aplicación, y ninguna Duración de Registro de Tiempo (automática o manual) puede ser menor o igual a cero.

## Reglas de negocio

- **BR-01:** Una Tarea DEBE pertenecer obligatoriamente a un único Proyecto existente. → verificado por AC-001, AC-002
- **BR-02:** El sistema DEBE permitir un (1) único temporizador activo ("En Ejecución") a la vez en toda la aplicación. → verificado por AC-007
- **BR-03:** Si se inicia un temporizador mientras otro está activo en una Tarea diferente, el sistema DEBE detener automáticamente el temporizador anterior, calcular y persistir su Registro de Tiempo antes de iniciar el nuevo. → verificado por AC-007
- **BR-04:** La Duración de cualquier Registro de Tiempo (generado por temporizador o ingresado manualmente) DEBE ser mayor que cero. → verificado por AC-009, AC-014
- **BR-05:** El sistema DEBE considerar una jornada laboral fija de 8 horas y una semana laboral de 5 días (Lunes a Viernes) para calcular la Meta Semanal (8 h × 5 días = 40 horas) y el Total Semanal, de modo que ambos midan el mismo rango de días. → verificado por AC-017, AC-018

## Referencias

- **Diseño / prototipo:** [Figma - Exercise · Time Tracker (pantalla Tareas y modal Nueva Tarea)](https://www.figma.com/design/YYHDIH7CBsZrZ4VKXvbzkR/Exercise---Time-Tracker)
- **Especificación funcional:** [SRS-001: Especificación de Requisitos - Time Tracker](../../requirements/SRS-001-timetracker-app/README.md) (secciones 3.1.2, 3.1.3 y 3.2.1)

## Criterios de aceptación

- **AC-001 (Reglas de negocio):** El sistema DEBE permitir crear una Tarea asociándola obligatoriamente a un Proyecto existente y proporcionando un Nombre para la Tarea.
  Casos de prueba: [TC-001](./test-cases/TC-001-crear-tarea-happy.md)
- **AC-002 (Procesamiento de datos):** El sistema NO DEBE permitir crear una Tarea sin un Proyecto asociado o sin Nombre.
  Casos de prueba: [TC-002](./test-cases/TC-002-crear-tarea-sin-proyecto-error.md) · [TC-003](./test-cases/TC-003-crear-tarea-sin-nombre-error.md)
- **AC-003 (Fiabilidad):** El sistema DEBE persistir los datos de la Tarea, incluyendo su asociación al Proyecto, en el almacenamiento local del dispositivo.
  Casos de prueba: [TC-004](./test-cases/TC-004-persistencia-tarea-happy.md)
- **AC-004 (Reglas de negocio):** El sistema DEBE permitir editar el Nombre de una Tarea existente en cualquier momento, reutilizando el mismo modal de creación ("Nueva Tarea") precargado con los datos existentes de la Tarea y con el título y la etiqueta del botón principal cambiados a "Editar Tarea".
  Casos de prueba: [TC-005](./test-cases/TC-005-editar-nombre-tarea-happy.md)
- **AC-005 (Interacción de usuario):** La interfaz DEBE implementar el diseño de la pantalla de Tareas (panel principal) y el del modal de creación/edición de Tareas definidos en el prototipo Figma de referencia, adhiriéndose al sistema de diseño DESIGN.md (tema Precision Focus).
  Casos de prueba: [TC-006](./test-cases/TC-006-diseno-pantalla-tareas-happy.md)
- **AC-006 (Reglas de negocio):** El sistema DEBE permitir al usuario iniciar un temporizador para una Tarea específica seleccionándola desde el listado de Tareas (acción del ícono ▷ junto a cada Tarea), guardando localmente el estado "En Ejecución", la hora de inicio y el identificador de la Tarea.
  Casos de prueba: [TC-007](./test-cases/TC-007-iniciar-temporizador-happy.md)
- **AC-007 (Reglas de negocio):** Si el usuario inicia un temporizador mientras otro está activo en una Tarea diferente, el sistema DEBE detener automáticamente el temporizador anterior, calcular su Duración y persistir su Registro de Tiempo antes de iniciar el nuevo temporizador.
  Casos de prueba: [TC-008](./test-cases/TC-008-auto-stop-temporizador-happy.md)
- **AC-008 (Reglas de negocio):** El sistema DEBE permitir al usuario detener el temporizador activo, registrando la Hora Fin y calculando la Duración (Hora Fin − Hora Inicio).
  Casos de prueba: [TC-009](./test-cases/TC-009-detener-temporizador-happy.md)
- **AC-009 (Procesamiento de datos):** El sistema DEBE validar que la Duración calculada al detener el temporizador sea mayor que cero antes de persistir el Registro de Tiempo.
  Casos de prueba: [TC-010](./test-cases/TC-010-duracion-cero-al-detener-limite.md)
- **AC-010 (Fiabilidad):** El sistema DEBE persistir de forma inmediata en el almacenamiento local el Registro de Tiempo generado al detener el temporizador.
  Casos de prueba: [TC-011](./test-cases/TC-011-persistencia-registro-temporizador-happy.md)
- **AC-011 (Interacción de usuario):** La interfaz DEBE mostrar claramente el estado del temporizador (activo/inactivo) y la Tarea asociada.
  Casos de prueba: [TC-012](./test-cases/TC-012-estado-temporizador-visible-happy.md)
- **AC-012 (Eficiencia de rendimiento):** El sistema DEBE iniciar el temporizador, y DEBE detenerlo y persistir el Registro de Tiempo correspondiente, en menos de 1 segundo desde la acción del usuario.
  Casos de prueba: [TC-013](./test-cases/TC-013-rendimiento-temporizador-happy.md)
- **AC-013 (Reglas de negocio):** El sistema DEBE permitir al usuario crear un Registro de Tiempo manual para una Tarea, ingresando la Tarea, la Fecha y la Duración.
  Casos de prueba: [TC-014](./test-cases/TC-014-registro-manual-happy.md)
- **AC-014 (Procesamiento de datos):** El sistema DEBE validar que la Duración ingresada manualmente sea mayor que cero, rechazando el registro en caso contrario.
  Casos de prueba: [TC-015](./test-cases/TC-015-duracion-manual-invalida-error.md) · [TC-016](./test-cases/TC-016-duracion-manual-minima-limite.md)
- **AC-015 (Fiabilidad):** El sistema DEBE persistir el Registro de Tiempo manual en el almacenamiento local del dispositivo.
  Casos de prueba: [TC-017](./test-cases/TC-017-persistencia-registro-manual-happy.md)
- **AC-016 (Interacción de usuario):** La implementación de la pantalla de Tareas (panel principal) y del modal de creación/edición de Tareas DEBE ser visualmente fiel (layout, colores, tipografía, espaciado y componentes) al prototipo de alta fidelidad en Figma referenciado.
  Casos de prueba: [TC-018](./test-cases/TC-018-fidelidad-visual-tareas-happy.md)
- **AC-017 (Procesamiento de datos):** El sistema DEBE calcular la Meta Semanal como un valor fijo de 40 horas (8 horas × 5 días laborales), sin que sea configurable por el usuario.
  Casos de prueba: [TC-019](./test-cases/TC-019-meta-semanal-fija-happy.md)
- **AC-018 (Procesamiento de datos):** El sistema DEBE calcular y mostrar el Total Semanal de tiempo acumulado, sumando los Registros de Tiempo (por temporizador y manuales) generados durante la semana laboral en curso (Lunes a Viernes, hora local); los Registros de Tiempo del Sábado o Domingo, si existieran, NO DEBEN incluirse en el Total Semanal.
  Casos de prueba: [TC-020](./test-cases/TC-020-total-semanal-happy.md) · [TC-021](./test-cases/TC-021-total-semanal-excluye-semana-anterior-limite.md) · [TC-024](./test-cases/TC-024-total-semanal-excluye-fin-de-semana-limite.md)
  Investigación: [RS-001](./research/RS-001-inicio-semana-total-semanal.md)
- **AC-019 (Salidas del sistema):** El sistema DEBE mostrar el porcentaje alcanzado de la Meta Semanal, calculado como (Total Semanal ÷ Meta Semanal) × 100.
  Casos de prueba: [TC-022](./test-cases/TC-022-porcentaje-meta-semanal-happy.md) · [TC-023](./test-cases/TC-023-porcentaje-meta-semanal-superior-100-limite.md)

---

## Complejidad sugerida

- **Story points:** 8
- **Justificación:** La historia agrupa cuatro capacidades, por decisión explícita del usuario: gestión de Tareas, temporizador (con la regla de exclusividad y auto-detención de BR-02/BR-03), ingreso manual de tiempo, y el cálculo de Meta Semanal/Total Semanal (BR-05). El mayor riesgo e incertidumbre está en la máquina de estados del temporizador (auto-stop al iniciar uno nuevo) y en el requisito de rendimiento (<1s); el cálculo de meta semanal es de bajo riesgo al ser un valor fijo. Se sugiere descomponer en `TK-XXX` independientes por subcapacidad durante `work-plan`.

## Repositorios

- exercise-time-tracker

## Validación

### INVEST

| Letra | Criterio      | Resultado | Notas                                                                                                                                                                   |
| ----- | ------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **I** | Independiente | Parcial   | Depende de que exista al menos un Proyecto creado ([US-001](../US-001-proyectos/README.md)) para poder crear Tareas.                                                    |
| **N** | Negociable    | Cumple    | El detalle de edición y la descomposición técnica del temporizador admiten ajuste en planificación.                                                                     |
| **V** | Valiosa       | Cumple    | Es el núcleo funcional de la app: permite registrar el tiempo dedicado a cada actividad.                                                                                |
| **E** | Estimable     | Cumple    | Reglas suficientemente claras para estimar, aunque con mayor incertidumbre en la lógica de auto-stop (reflejado en los story points).                                   |
| **S** | Pequeña       | Parcial   | Agrupa tres capacidades relacionadas (Tareas, temporizador, registro manual) por decisión del usuario; se recomienda dividir en `TK-XXX` independientes en `work-plan`. |
| **T** | Testeable     | Cumple    | Cada AC-XXX es verificable de forma objetiva.                                                                                                                           |

### Definition of Ready (DoR)

| Criterio DoR                       | Estado  | Notas                                                                                                                                                               |
| ---------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dependencias listas                | Parcial | Depende funcionalmente de [US-001 (Proyectos)](../US-001-proyectos/README.md); no es una aclaración pendiente sino un orden de implementación (Proyectos → Tareas). |
| Inputs/outputs claros              | Cumple  | Inputs: Proyecto, Nombre de Tarea, acciones de iniciar/detener temporizador, Fecha/Duración manual. Outputs: Tarea persistida, Registro(s) de Tiempo persistidos.   |
| Repositorios definidos             | Cumple  | exercise-time-tracker.                                                                                                                                              |
| Sin decisiones técnicas pendientes | Cumple  | El mecanismo concreto de persistencia y la implementación de la máquina de estados del temporizador se resuelven en `work-plan`/`TK-XXX`.                           |
| Referencias de UI                  | Cumple  | Prototipo de alta fidelidad en Figma referenciado (pantalla Tareas y modal Nueva Tarea).                                                                            |
| Sin aclaraciones pendientes        | Cumple  | Ninguna.                                                                                                                                                            |

## Observaciones

- El SRS-001 (sección 2.2) mencionaba "edición" de Tareas como función del producto sin detallar reglas (RF-003/RF-004 solo cubrían creación y almacenamiento). Por decisión del usuario, se incorporó edición libre del Nombre (AC-004) sin restricciones adicionales.
- Por decisión explícita del usuario, esta historia agrupa Gestión de Tareas, Temporizador (RF-005 a RF-010) y Registro manual de tiempo (RF-011 a RF-013), lo que degrada la dimensión INVEST "S" (Pequeña) a Parcial. Se recomienda validar en `work-plan` si conviene planificar `TK-XXX` separadas por subcapacidad.
- El prototipo Figma de referencia no incluye un modal ni una pantalla específica de "Editar Tarea" (solo existe "Nueva Tarea"). Por decisión del usuario, AC-004 especifica que la edición reutiliza ese mismo modal precargado con los datos existentes.
- El prototipo Figma muestra en la pantalla de Tareas un widget "Meta semanal" (%) y un total "Total Semanal" no contemplados en ningún RF del SRS-001. Por decisión del usuario, se incorporaron AC-017 a AC-019 fijando la Meta Semanal en 40 horas (8 h × 5 días, no configurable).
- El prototipo Figma también muestra en la pantalla de Tareas un stat card "Total Mensual"; este reutiliza el cálculo de total acumulado por mes ya definido en [US-003 (Historial de registros)](../US-003-historial-de-registros/README.md), AC-004 — no se duplica como AC en esta historia, pero la pantalla de Tareas depende de esa lógica para mostrarlo.
- El ícono ▷ junto a cada Tarea en el listado ("Tareas Recientes") es, por confirmación del usuario, el mecanismo de interacción para iniciar el temporizador de esa Tarea (AC-006).
- [RS-001](./research/RS-001-inicio-semana-total-semanal.md) investigó el inicio de la "semana en curso" de AC-018. Por decisión del usuario, el Total Semanal se acota a la semana laboral (Lunes a Viernes), no a la semana completa (Lunes a Domingo), para coincidir con el rango de la Meta Semanal (BR-05/AC-017). TC-020 y TC-021 se actualizaron para reflejar el rango Lunes-Viernes, y se agregó TC-024 para cubrir la exclusión de Sábado/Domingo.
