## Why

Los usuarios de Time Tracker ya pueden generar Registros de Tiempo (temporizador o ingreso manual, ver US-002), pero hoy esos datos quedan atrapados en el almacenamiento local sin ninguna forma de consultarlos: no existe una pantalla donde ver el historial completo ni los totales acumulados. Sin esta visibilidad, el usuario no puede responder la pregunta central de una herramienta de time tracking — "¿en qué estoy invirtiendo mi tiempo?" — y el valor de haber registrado el tiempo se pierde. Se necesita ahora, en paralelo a US-002, porque el store raíz y los tipos de dominio de `fundamentos-infraestructura-compartida` ya permiten sembrar Registros de Tiempo de prueba y desarrollar la lectura/agregación sin esperar a que el temporizador esté terminado.

## What Changes

- Se agrega la pantalla "Historial de registros": listado completo y de solo lectura de todos los Registros de Tiempo persistidos, sin capacidad de crear, editar ni eliminar registros desde aquí.
- Se agrega el cálculo del total de tiempo acumulado por Tarea, sumando las duraciones de todos sus Registros de Tiempo.
- Se agrega el cálculo del total de tiempo acumulado por Proyecto, sumando los totales de todas sus Tareas (mismo cálculo que consume la pantalla de Proyectos de US-001, sin duplicar la regla de negocio).
- Se agrega el cálculo del total de tiempo acumulado por mes, agrupando los Registros de Tiempo por año-mes y reutilizando el helper compartido de cálculo de mes de `fundamentos-infraestructura-compartida` (no se reimplementa la lógica de atribución de mes en esta feature).
- Regla de negocio para el cruce de medianoche de fin de mes (solo aplicable a Registros generados por el temporizador): la Duración completa se atribuye al mes de la Hora de Inicio del registro, sin prorratear entre los dos meses, según lo resuelto en RS-001.
- Manejo controlado de datos corruptos o inválidos en el almacenamiento local (JSON no parseable, campos con tipo incorrecto, duraciones negativas, fechas inválidas, Tareas huérfanas sin Proyecto): estos casos se excluyen de los cálculos sin romper el render de la aplicación ni producir `NaN`/`undefined` en los totales.
- Se agrega un requisito de rendimiento: los reportes (historial completo y totales por Tarea, Proyecto y mes) deben quedar visibles/interactivos en menos de 2 segundos para un volumen de hasta 1000 Registros de Tiempo, apoyándose en `localStorage` vía Zustand `persist` (RS-002, sin IndexedDB) y en selectores derivados/memoizados sobre el store compartido.
- La interfaz de la pantalla debe adherirse al sistema de diseño DESIGN.md (tema Precision Focus) y ser visualmente fiel al prototipo de alta fidelidad en Figma.

Fuera de alcance: la creación, edición o eliminación de Registros de Tiempo (cubierta por `gestion-tareas-temporizador`), y la redefinición del store raíz, la persistencia o el helper de cálculo de mes (cubiertos por `fundamentos-infraestructura-compartida`), que aquí solo se consumen.

## Capabilities

### New Capabilities

- `historial-de-registros`: lectura del historial completo de Registros de Tiempo y agregación de totales de tiempo por Tarea, por Proyecto y por mes, incluyendo la regla de atribución de mes en cruces de medianoche de fin de mes, el manejo de datos inválidos/huérfanos y el requisito de rendimiento (<2s para 1000 registros). Se mantiene como una única capability porque el listado y las tres agregaciones comparten la misma fuente de datos, el mismo flujo de lectura y la misma pantalla, sin una frontera de negocio independiente que justifique dividirlos.

### Modified Capabilities

Ninguna. `openspec/specs/` no tiene capabilities archivadas todavía; esta es una capability enteramente nueva.

## Impact

- Código nuevo: módulo de feature `src/features/historial/` (componentes de la pantalla de Historial de registros, selectores/hooks de agregación por Tarea/Proyecto/mes), siguiendo la arquitectura feature-based de ADR-005.
- Consumo de código existente (no modificado por esta change): el store raíz, los tipos de dominio (`RegistroDeTiempo`, `Tarea`, `Proyecto`) y el helper compartido de cálculo de mes provistos por `fundamentos-infraestructura-compartida` en `src/shared/`; los Registros de Tiempo reales generados por el temporizador/ingreso manual de `gestion-tareas-temporizador`.
- Sin cambios de esquema de datos ni de mecanismo de persistencia: se reutiliza `localStorage` vía Zustand `persist` tal como quedó resuelto en RS-002.
- Sin impacto en backend ni en APIs externas: la aplicación es offline-first y sin servidor.
- Cambio greenfield: no reemplaza ni elimina funcionalidad existente.
