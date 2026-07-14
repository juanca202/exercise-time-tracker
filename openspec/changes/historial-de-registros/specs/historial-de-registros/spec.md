## ADDED Requirements

### Requirement: Historial completo de Registros de Tiempo

El sistema SHALL leer y mostrar en la interfaz el historial completo de todos los Registros de Tiempo almacenados localmente, sin omisiones ni duplicados, y SHALL manejar de forma controlada cualquier dato corrupto o con formato inválido en el almacenamiento sin interrumpir el render de la aplicación.

#### Scenario: Historial completo se muestra correctamente

- **WHEN** el usuario abre la pantalla de Historial de registros y el almacenamiento local contiene Registros de Tiempo persistidos (p. ej. RT-01, RT-02 de la Tarea "Diseño UI" y RT-03 de la Tarea "Backend API")
- **THEN** el sistema lee todos los Registros de Tiempo desde el almacenamiento local y los lista en pantalla con sus datos correctos (Tarea, Proyecto, fecha y duración), sin omitir ni duplicar ninguno

#### Scenario: Datos corruptos no rompen la aplicación

- **WHEN** el almacenamiento local contiene, bajo la clave de Registros de Tiempo, un valor no parseable (JSON malformado) o con estructura inválida (p. ej. un campo `duracion` de tipo no numérico)
- **THEN** el sistema captura el error de parseo/formato, no lanza una excepción no controlada, no renderiza una pantalla en blanco ni provoca un crash de React, y degrada a un estado de error controlado o a un estado vacío con aviso

#### Scenario: Historial vacío se muestra sin errores

- **WHEN** el usuario abre la pantalla de Historial de registros y el almacenamiento local no contiene ningún Registro de Tiempo (clave ausente o arreglo vacío)
- **THEN** el sistema muestra un estado vacío legible (p. ej. "No hay registros de tiempo aún"), sin filas fantasma, sin totales erróneos (`NaN`/`undefined`) y sin errores en la consola del navegador

### Requirement: Total de tiempo acumulado por Tarea

El sistema SHALL calcular y mostrar el total de tiempo acumulado por Tarea, sumando las duraciones de todos los Registros de Tiempo asociados a cada Tarea, excluyendo del cálculo cualquier Registro con duración inválida y devolviendo 0 para una Tarea sin Registros asociados.

#### Scenario: Suma exacta de duraciones por Tarea

- **WHEN** el sistema calcula el total acumulado por Tarea para un conjunto con varios Registros de Tiempo asociados a la misma Tarea (p. ej. dos Registros de 90 y 45 minutos para la Tarea "Diseño UI")
- **THEN** el total devuelto para esa Tarea es la suma exacta de las duraciones de sus Registros (135 minutos), y el total de otra Tarea con un único Registro (120 minutos) se calcula de forma independiente y correcta

#### Scenario: Registro con duración inválida no corrompe el total

- **WHEN** el conjunto de Registros de Tiempo de una Tarea incluye al menos un Registro con duración inválida (negativa o no numérica) junto con Registros válidos
- **THEN** el sistema excluye o normaliza los Registros con duración inválida sin lanzar una excepción no controlada, y el total final de la Tarea es numérico, no negativo y no incluye la duración inválida

#### Scenario: Tarea sin Registros de Tiempo asociados

- **WHEN** el sistema calcula el total acumulado por Tarea para una Tarea que no tiene ningún Registro de Tiempo asociado
- **THEN** el total devuelto para esa Tarea es 0, no `undefined`, `null` ni `NaN`

### Requirement: Total de tiempo acumulado por Proyecto

El sistema SHALL calcular y mostrar el total de tiempo acumulado por Proyecto, sumando los totales de tiempo de todas las Tareas que pertenecen a ese Proyecto, sin que una Tarea huérfana (con referencia a un Proyecto inexistente) corrompa el cálculo de los Proyectos válidos, y devolviendo 0 para un Proyecto sin Tareas con Registros de Tiempo. Este cálculo es el mismo que consume la pantalla de Proyectos para sus totales, sin duplicar la regla de negocio.

#### Scenario: Suma exacta de totales de Tareas por Proyecto

- **WHEN** el sistema calcula el total acumulado por Proyecto para un Proyecto con al menos dos Tareas que tienen Registros de Tiempo (p. ej. "Diseño UI" con 135 minutos y "Testing" con 60 minutos, ambas del Proyecto "Alfa")
- **THEN** el total devuelto para el Proyecto "Alfa" es la suma de los totales de todas sus Tareas (195 minutos)

#### Scenario: Tarea huérfana no corrompe los totales de Proyectos válidos

- **WHEN** existe una Tarea cuyo Proyecto referenciado ya no existe (huérfana) con al menos un Registro de Tiempo asociado, junto con al menos un Proyecto válido con sus propias Tareas y Registros
- **THEN** el cálculo se completa sin lanzar una excepción no controlada, el Registro de la Tarea huérfana no se suma a ningún Proyecto, y el total del Proyecto válido no se ve afectado

#### Scenario: Proyecto sin Tareas con Registros de Tiempo

- **WHEN** el sistema calcula el total acumulado por Proyecto para un Proyecto sin Tareas, o con Tareas que no tienen ningún Registro de Tiempo asociado
- **THEN** el total devuelto para ese Proyecto es 0, no `undefined`, `null` ni `NaN`

### Requirement: Total de tiempo acumulado por mes con atribución al mes de inicio

El sistema SHALL calcular y mostrar el total de tiempo acumulado por mes, agrupando los Registros de Tiempo por el año-mes de su fecha/Hora de Inicio y sumando sus duraciones. Cuando un Registro de Tiempo generado por el temporizador cruce la medianoche de fin de mes, la totalidad de su Duración SHALL contabilizarse en el mes correspondiente a la Hora de Inicio del registro, sin prorratear entre los dos meses. Un Registro con fecha inválida SHALL excluirse del cálculo sin corromper los totales de los meses válidos.

#### Scenario: Suma exacta de duraciones por mes

- **WHEN** el sistema calcula el total acumulado por mes para Registros de Tiempo distribuidos en distintos meses (p. ej. dos Registros en mayo 2026 de 90 y 45 minutos, y uno en junio 2026 de 120 minutos)
- **THEN** el total de mayo 2026 es 135 minutos y el total de junio 2026 es 120 minutos, coincidiendo con la suma exacta de las duraciones de cada mes

#### Scenario: Registro con fecha inválida no corrompe los totales mensuales

- **WHEN** el conjunto de Registros de Tiempo incluye al menos un Registro con fecha no parseable, junto con Registros válidos de un mes conocido (p. ej. junio 2026 con 120 minutos)
- **THEN** el sistema excluye el Registro con fecha inválida del cálculo sin lanzar una excepción no controlada, no genera un mes espurio, y el total de junio 2026 sigue siendo 120 minutos

#### Scenario: Registro que cruza la medianoche de fin de mes se atribuye al mes de inicio

- **WHEN** un Registro de Tiempo generado por el temporizador tiene Hora de Inicio el último día de un mes calendario (p. ej. 2026-07-31 23:00) y Hora Fin en el primer día del mes siguiente (p. ej. 2026-08-01 01:00), con una Duración total de 120 minutos
- **THEN** el total de julio 2026 incluye los 120 minutos completos de ese Registro (mes de la Hora de Inicio), y el total de agosto 2026 no incluye ninguna porción de su duración

### Requirement: Rendimiento de carga de los reportes hasta 1000 Registros de Tiempo

La visualización de los reportes de tiempo (historial y totales por Tarea, Proyecto y mes) SHALL cargar y quedar interactiva en menos de 2 segundos para un volumen de hasta 1000 Registros de Tiempo almacenados, sin errores ni congelamiento de la interfaz (UI freeze).

#### Scenario: Carga bajo 2 segundos con volumen representativo de 500 registros

- **WHEN** el almacenamiento local contiene 500 Registros de Tiempo sintéticos distribuidos entre al menos 5 Proyectos, 15 Tareas y 6 meses distintos, y el usuario navega a la pantalla de Historial de registros
- **THEN** la lista de Registros de Tiempo y los totales por Tarea, Proyecto y mes quedan visibles e interactivos en menos de 2000 ms desde el inicio de la navegación

#### Scenario: Carga bajo 2 segundos en el volumen máximo de 1000 registros

- **WHEN** el almacenamiento local contiene exactamente 1000 Registros de Tiempo sintéticos (volumen máximo especificado) y el usuario navega a la pantalla de Historial de registros
- **THEN** la lista de Registros de Tiempo y los totales por Tarea, Proyecto y mes quedan visibles e interactivos en menos de 2000 ms, sin errores ni congelamiento de la interfaz

### Requirement: Adherencia al sistema de diseño Precision Focus

La interfaz de la pantalla de Historial de registros SHALL adherirse al sistema de diseño definido en DESIGN.md (tema Precision Focus) en cuanto a paleta de colores, tipografía, espaciado, elevación y formas, sin estilos hardcodeados que se aparten de esos tokens.

#### Scenario: Los estilos computados coinciden con los tokens de DESIGN.md

- **WHEN** la pantalla de Historial de registros está implementada y renderizada con datos de prueba, y se inspeccionan los estilos computados de sus componentes clave (colores, tipografía, espaciado, elevación, formas)
- **THEN** los valores obtenidos coinciden con los tokens definidos en DESIGN.md (tema Precision Focus), sin discrepancias respecto al sistema de diseño

### Requirement: Fidelidad visual al prototipo de Figma

La implementación de la pantalla de Historial de registros SHALL ser visualmente fiel (layout, colores, tipografía, espaciado y componentes) al prototipo de alta fidelidad en Figma referenciado en US-003.

#### Scenario: La implementación coincide con el prototipo Figma

- **WHEN** se compara una captura de la implementación real de la pantalla de Historial de registros con la captura del frame correspondiente del prototipo Figma referenciado, en el mismo viewport
- **THEN** no se detectan discrepancias visuales significativas en layout, colores, tipografía, espaciado ni componentes entre la implementación y el prototipo
