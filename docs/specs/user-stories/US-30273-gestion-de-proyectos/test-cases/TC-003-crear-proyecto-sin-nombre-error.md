# TC-003 — Intento de creación de Proyecto sin Nombre

Tipo: Error
Prioridad: Alta
Criterio de aceptación: AC-001 (Casos de uso) — Creación de Proyecto con Nombre obligatorio y Descripción opcional
Artefacto padre: US-30273
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Objetivo

Validar que el sistema impide crear un Proyecto cuando el campo Nombre, obligatorio, se deja vacío.

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
