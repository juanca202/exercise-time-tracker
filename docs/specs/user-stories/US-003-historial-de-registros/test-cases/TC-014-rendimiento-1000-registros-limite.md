# TC-014 — Dado el volumen máximo especificado de 1000 Registros de Tiempo almacenados, Cuando el usuario abre la pantalla de Historial de registros, Entonces los reportes por Tarea, Proyecto y mes cargan en menos de 2 segundos

**Perspectiva**: Límite
**Automatización**: Automatizable (E2E - Performance) <!-- test de performance específico en el borde de volumen definido por AC-005; ver Observaciones -->
**Prioridad**: Media
**Criterio de aceptación**: AC-005 (Eficiencia de rendimiento)
**Artefacto padre**: US-003
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación Time Tracker está corriendo en entorno local de desarrollo (`npm run dev`), en condiciones de máquina/CI representativas.
- El almacenamiento local contiene exactamente 1000 Registros de Tiempo sintéticos [propuesto] (el volumen máximo especificado por AC-005), distribuidos entre múltiples Tareas, Proyectos y meses.

## Datos de prueba

| Campo                           | Valor                                   | Notas                                                 |
| ------------------------------- | --------------------------------------- | ----------------------------------------------------- |
| Registros de Tiempo [propuesto] | 1000 registros generados sintéticamente | Volumen límite superior definido por AC-005           |
| Umbral de carga                 | < 2000 ms                               | Desde navegación hasta reportes visibles/interactivos |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                       | Resultado esperado del paso                                             |
| --- | ------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1   | Tester  | Siembra exactamente 1000 Registros de Tiempo sintéticos en localStorage                      | El almacenamiento queda poblado con el volumen máximo especificado      |
| 2   | Usuario | Navega a la pantalla "Historial de registros" (marca de tiempo t0)                           | Se dispara la carga de datos y el cálculo de reportes                   |
| 3   | Sistema | Renderiza la lista de registros y los totales por Tarea, Proyecto y mes (marca de tiempo t1) | La pantalla queda completamente renderizada sin degradación perceptible |

## Resultado esperado final

El tiempo transcurrido entre t0 y t1 es menor a 2 segundos incluso con el volumen máximo de 1000 Registros de Tiempo, sin errores ni congelamiento de la interfaz (UI freeze).

## Observaciones

Este TC valida específicamente el borde superior del rango de rendimiento declarado en AC-005 (hasta 1000 registros); complementa a TC-013, que valida un volumen intermedio representativo. Medición sugerida vía Playwright/`chrome-devtools` performance trace; alternativa Manual si el equipo no automatiza la medición de performance.
