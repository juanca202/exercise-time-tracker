# TC-007 — Acción visible "Nuevo Proyecto" para iniciar la creación

Tipo: Happy Path
Prioridad: Alta
Criterio de aceptación: AC-004 (Interacción de usuario) — Acción visible para iniciar la creación de un Proyecto
Artefacto padre: US-30273
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Objetivo

Validar que la interfaz ofrece una acción visible ("Nuevo Proyecto" / "Crear Nuevo Proyecto") que, al activarse, inicia el flujo de creación de un Proyecto.

## Precondiciones

- La aplicación Time Tracker está abierta en el entorno de desarrollo local.
- El usuario se encuentra en la sección "Proyectos", con o sin Proyectos previamente creados.

## Datos de prueba

N/A

## Pasos de ejecución

| #   | Actor   | Acción                                                           | Resultado esperado del paso                                                                        |
| --- | ------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 1   | Usuario | Ingresa a la sección "Proyectos"                                 | El sistema muestra visiblemente la acción "Nuevo Proyecto" / "Crear Nuevo Proyecto" en la pantalla |
| 2   | Usuario | Hace clic en la acción "Nuevo Proyecto" / "Crear Nuevo Proyecto" | El sistema inicia el flujo de creación mostrando el formulario/modal correspondiente               |

## Resultado esperado final

El formulario/modal de creación de Proyecto queda abierto y disponible para que el usuario ingrese los datos del nuevo Proyecto.

## Observaciones

Este TC valida únicamente la visibilidad y activación de la acción de entrada al flujo; la creación efectiva del Proyecto se valida en TC-001, TC-002 y TC-003.
