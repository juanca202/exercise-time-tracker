# TC-015 — Crear un Registro de Tiempo manual con Fecha, Tarea y Duración válidos

Tipo: Happy Path
Prioridad: Alta
Criterio de aceptación: AC-009 (Casos de uso) — Crear Registro de Tiempo manual
Artefacto padre: US-30272
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Objetivo

Validar que el usuario puede crear un Registro de Tiempo manual para una Tarea, ingresando Fecha, Proyecto/Tarea y Duración mediante el formulario "Entrada Manual".

## Precondiciones

- La aplicación está abierta en el entorno de desarrollo local, en la pantalla principal "Tareas".
- Existe la Tarea "Diseñar wireframes" asociada al "Proyecto Alfa".

## Datos de prueba

| Campo          | Valor                                              | Notas                                  |
| -------------- | -------------------------------------------------- | -------------------------------------- |
| Fecha          | 2026-07-08 [propuesto]                             | Fecha válida, formato AAAA-MM-DD       |
| Proyecto/Tarea | "Proyecto Alfa" / "Diseñar wireframes" [propuesto] | Tarea existente asociada a su Proyecto |
| Duración       | 2 horas [propuesto]                                | Valor numérico mayor que cero          |

## Pasos de ejecución

| #   | Actor   | Acción                                                       | Resultado esperado del paso                             |
| --- | ------- | ------------------------------------------------------------ | ------------------------------------------------------- |
| 1   | Usuario | Abre el formulario "Entrada Manual"                          | Se muestran los campos Fecha, Proyecto/Tarea y Duración |
| 2   | Usuario | Ingresa la Fecha 2026-07-08                                  | El campo Fecha queda con el valor ingresado             |
| 3   | Usuario | Selecciona la Tarea "Diseñar wireframes" del "Proyecto Alfa" | El campo Proyecto/Tarea queda con el valor seleccionado |
| 4   | Usuario | Ingresa 2 horas en el campo Duración                         | El campo Duración queda con el valor ingresado          |
| 5   | Usuario | Hace clic en "Guardar Registro"                              | El sistema crea el Registro de Tiempo manual            |

## Resultado esperado final

El nuevo Registro de Tiempo manual de 2 horas queda visible en el historial de la Tarea "Diseñar wireframes", con Fecha 2026-07-08.

## Observaciones

Ninguna.
