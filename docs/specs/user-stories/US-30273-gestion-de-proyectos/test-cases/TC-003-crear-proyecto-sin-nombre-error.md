# TC-003 — Dado que el usuario está en la sección "Proyectos", Cuando intenta crear un Proyecto dejando el campo Nombre vacío, Entonces el sistema rechaza la creación y muestra un error indicando que el Nombre es obligatorio

Perspectiva: Error
Automatización: Automatizable (E2E)
Prioridad: Alta
Criterio de aceptación: AC-001 (Casos de uso) — Creación de Proyecto con Nombre obligatorio y Descripción opcional
Artefacto padre: US-30273
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- La aplicación Time Tracker está abierta en el entorno de desarrollo local.
- El usuario se encuentra en la sección "Proyectos".

## Datos de prueba

| Campo       | Valor                | Notas                                                                 |
| ----------- | -------------------- | --------------------------------------------------------------------- |
| Nombre      | `` (vacío)           | [propuesto] Campo obligatorio se deja sin completar intencionalmente. |
| Descripción | `Proyecto de prueba` | [propuesto] Se completa para aislar el error al campo Nombre.         |

## Pasos de ejecución

| #   | Actor   | Acción                                                           | Resultado esperado del paso                                                                             |
| --- | ------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 1   | Usuario | Hace clic en la acción "Nuevo Proyecto" / "Crear Nuevo Proyecto" | Se abre el formulario/modal de creación de Proyecto                                                     |
| 2   | Usuario | Deja el campo Nombre vacío                                       | El campo Nombre permanece vacío                                                                         |
| 3   | Usuario | Ingresa `Proyecto de prueba` en el campo Descripción             | El campo Descripción refleja el valor ingresado                                                         |
| 4   | Usuario | Intenta confirmar la creación del Proyecto                       | El sistema rechaza la solicitud y muestra un error de validación indicando que el Nombre es obligatorio |
| 5   | Sistema | Mantiene el formulario/modal abierto                             | El formulario permanece abierto con los datos ingresados, sin crear el Proyecto                         |

## Resultado esperado final

El Proyecto no se crea ni aparece en el listado de Proyectos; el sistema muestra un mensaje de error indicando que el campo Nombre es obligatorio.

## Observaciones

Ninguna.
