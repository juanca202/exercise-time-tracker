# TC-013 — Dado un volumen habitual de Registros de Tiempo almacenados, Cuando el usuario abre la pantalla de Historial de registros, Entonces los reportes por Tarea, Proyecto y mes cargan en menos de 2 segundos

**Perspectiva**: Happy Path
**Automatización**: Automatizable (E2E - Performance) <!-- test de performance específico sobre el flujo E2E; ver Observaciones -->
**Prioridad**: Media
**Criterio de aceptación**: AC-005 (Eficiencia de rendimiento)
**Artefacto padre**: US-003
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación Time Tracker está corriendo en entorno local de desarrollo (`npm run dev`), en condiciones de máquina/CI representativas (sin otros procesos intensivos concurrentes).
- El almacenamiento local contiene 500 Registros de Tiempo sintéticos [propuesto], distribuidos entre múltiples Tareas, Proyectos y meses.

## Datos de prueba

| Campo                           | Valor                                  | Notas                                                                             |
| ------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------- |
| Registros de Tiempo [propuesto] | 500 registros generados sintéticamente | Distribuidos entre >=5 Proyectos, >=15 Tareas y >=6 meses distintos               |
| Umbral de carga                 | < 2000 ms                              | Desde navegación hasta reportes (por Tarea, Proyecto y mes) visibles/interactivos |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                                                          | Resultado esperado del paso                              |
| --- | ------- | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 1   | Tester  | Siembra 500 Registros de Tiempo sintéticos en localStorage                                                                      | El almacenamiento queda poblado con el volumen de prueba |
| 2   | Usuario | Navega a la pantalla "Historial de registros" (marca de tiempo t0 al iniciar la navegación)                                     | Se dispara la carga de datos y el cálculo de reportes    |
| 3   | Sistema | Renderiza la lista de registros y los totales por Tarea, Proyecto y mes (marca de tiempo t1 cuando el contenido es interactivo) | La pantalla queda completamente renderizada              |

## Resultado esperado final

El tiempo transcurrido entre t0 y t1 es menor a 2 segundos, con los reportes por Tarea, Proyecto y mes visibles y correctos.

## Observaciones

Medición sugerida mediante Playwright (marca de tiempo de navegación a contenido interactivo) o herramientas de performance del navegador (p. ej. `chrome-devtools` performance trace / Lighthouse). Si el equipo de implementación decide no automatizar esta medición, este TC puede ejecutarse de forma Manual cronometrando la carga; en ese caso, actualizar el campo Automatización a `Manual` antes de la ejecución.
