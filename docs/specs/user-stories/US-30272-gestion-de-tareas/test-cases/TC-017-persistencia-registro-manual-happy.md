# TC-017 — Persistencia del Registro de Tiempo manual al confirmar "Guardar Registro"

Tipo: Happy Path
Prioridad: Alta
Criterio de aceptación: AC-010 (Procesamiento de datos) — Persistencia del Registro de Tiempo manual
Artefacto padre: US-30272
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Objetivo

Validar que el sistema persiste el Registro de Tiempo manual en el almacenamiento local al confirmar la acción "Guardar Registro", y que dicho registro permanece disponible tras recargar la aplicación.

## Precondiciones

- La aplicación está abierta en el entorno de desarrollo local.
- Se ha creado el Registro de Tiempo manual de 2 horas para la Tarea "Diseñar wireframes" con Fecha 2026-07-08 (ver TC-015).

## Datos de prueba

N/A

## Pasos de ejecución

| #   | Actor   | Acción                                                             | Resultado esperado del paso                                   |
| --- | ------- | ------------------------------------------------------------------ | ------------------------------------------------------------- |
| 1   | Usuario | Recarga o reinicia la aplicación en el entorno de desarrollo local | La aplicación vuelve a cargar la pantalla principal "Tareas"  |
| 2   | Sistema | Lee los Registros de Tiempo persistidos en el almacenamiento local | Se recupera el Registro de Tiempo manual previamente guardado |

## Resultado esperado final

El Registro de Tiempo manual de 2 horas con Fecha 2026-07-08 sigue visible en el historial de la Tarea "Diseñar wireframes" tras recargar la aplicación.

## Observaciones

Depende de la creación exitosa de un Registro de Tiempo manual (TC-015).
