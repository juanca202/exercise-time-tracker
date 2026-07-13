# TC-014 — Dada una Tarea existente, cuando el usuario ingresa un Registro de Tiempo manual con Fecha y Duración válidas, entonces el sistema lo crea exitosamente

**Perspectiva**: Happy Path
**Automatización**: Automatizable (E2E)
**Prioridad**: Media
**Criterio de aceptación**: AC-013 — Crear Registro de Tiempo manual para una Tarea (Tarea, Fecha, Duración)
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación está corriendo en entorno local de desarrollo, sin backend.
- Existe la Tarea "Diseñar wireframes" en el listado "Tareas Recientes".
- El panel de ingreso manual de tiempo está accesible desde el panel principal de Tareas.

## Datos de prueba

| Campo    | Valor                            | Notas                                     |
| -------- | -------------------------------- | ----------------------------------------- |
| Tarea    | "Diseñar wireframes" [propuesto] | Tarea existente                           |
| Fecha    | 2026-07-10 [propuesto]           | Fecha pasada dentro de la semana en curso |
| Duración | 1h 30min [propuesto]             | Valor mayor que cero                      |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                 | Resultado esperado del paso                    |
| --- | ------- | -------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 1   | usuario | Abre el formulario de ingreso manual de tiempo                                         | Se muestran los campos Tarea, Fecha y Duración |
| 2   | usuario | Selecciona la Tarea "Diseñar wireframes", ingresa Fecha 2026-07-10 y Duración 1h 30min | Los campos reflejan los valores ingresados     |
| 3   | usuario | Confirma el registro manual                                                            | El sistema crea el Registro de Tiempo          |

## Resultado esperado final

Se genera un nuevo Registro de Tiempo manual para "Diseñar wireframes" con Fecha 2026-07-10 y Duración 1h 30min, visible en la información de la Tarea/historial.

## Observaciones

La persistencia se valida en TC-017 (AC-015); las validaciones de Duración inválida se cubren en TC-015 y TC-016 (AC-014).
