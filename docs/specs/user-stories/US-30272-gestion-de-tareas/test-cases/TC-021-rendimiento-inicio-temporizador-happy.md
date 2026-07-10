# TC-021 — Dado que existe la Tarea "Diseñar wireframes" sin ningún temporizador activo, Cuando el usuario inicia el temporizador, Entonces el estado "En Ejecución" se refleja en la interfaz en menos de 1 segundo

Perspectiva: Happy Path
Automatización: Automatizable (E2E)
Prioridad: Media
Criterio de aceptación: AC-012 (Eficiencia de rendimiento) — Inicio del temporizador en menos de 1 segundo
Artefacto padre: US-30272
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- La aplicación está abierta en el entorno de desarrollo local, en la pantalla principal "Tareas".
- Existe la Tarea "Diseñar wireframes" asociada al "Proyecto Alfa".
- No hay ningún temporizador activo en la aplicación.

## Datos de prueba

N/A

## Pasos de ejecución

| #   | Actor   | Acción                                                                                                                                                                  | Resultado esperado del paso                                              |
| --- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 1   | Usuario | Hace clic en la acción de iniciar temporizador sobre la Tarea "Diseñar wireframes" y mide el tiempo transcurrido hasta que la interfaz refleja el estado "En Ejecución" | El estado "En Ejecución" se refleja en la interfaz en menos de 1 segundo |

## Resultado esperado final

El panel de Tareas muestra el temporizador de "Diseñar wireframes" como activo en un tiempo menor a 1 segundo desde el clic del usuario.

## Observaciones

- Medición realizada en el entorno de desarrollo local; los tiempos pueden variar en otros entornos.
- **Automatización:** Parcial. El comportamiento funcional (iniciar el temporizador) es automatizable, pero la aserción "< 1 segundo" mide latencia real de UI y es sensible a flakiness por carga del entorno de CI. Se requiere un harness de medición dedicado (ej. Performance API / `performance.now()`) con margen de tolerancia y varias repeticiones, en vez de un umbral exacto único.
