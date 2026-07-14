# TC-002 — Dado que el usuario está en la sección "Proyectos", Cuando crea un nuevo Proyecto ingresando solo el Nombre y dejando la Descripción vacía, Entonces el Proyecto queda creado y visible en el listado sin Descripción

Perspectiva: Happy Path
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

| Campo       | Valor                 | Notas                                                     |
| ----------- | --------------------- | --------------------------------------------------------- |
| Nombre      | `Consultoría Interna` | [propuesto] Cadena de texto simple.                       |
| Descripción | `` (vacío)            | [propuesto] Campo se deja sin completar intencionalmente. |

## Pasos de ejecución

| #   | Actor   | Acción                                                           | Resultado esperado del paso                                          |
| --- | ------- | ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | Usuario | Hace clic en la acción "Nuevo Proyecto" / "Crear Nuevo Proyecto" | Se abre el formulario/modal de creación de Proyecto                  |
| 2   | Usuario | Ingresa `Consultoría Interna` en el campo Nombre                 | El campo Nombre refleja el valor ingresado                           |
| 3   | Usuario | Deja el campo Descripción vacío                                  | El campo Descripción permanece vacío sin marcarse como error         |
| 4   | Usuario | Confirma la creación del Proyecto                                | El sistema acepta la solicitud sin exigir la Descripción             |
| 5   | Sistema | Cierra el formulario/modal y actualiza el listado                | El nuevo Proyecto aparece en el listado de Proyectos sin Descripción |

## Resultado esperado final

El Proyecto "Consultoría Interna" queda creado y visible en el listado, sin Descripción asociada, sin que el sistema haya bloqueado la creación por la ausencia de ese campo.

## Observaciones

Ninguna.
