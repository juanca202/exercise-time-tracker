# TC-001 — Creación de Proyecto con Nombre y Descripción

Tipo: Happy Path
Prioridad: Alta
Criterio de aceptación: AC-001 (Casos de uso) — Creación de Proyecto con Nombre obligatorio y Descripción opcional
Artefacto padre: US-30273
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Objetivo

Validar que el usuario puede crear un nuevo Proyecto ingresando tanto el Nombre (obligatorio) como la Descripción (opcional), y que el sistema lo acepta y lo agrega al listado.

## Precondiciones

- La aplicación Time Tracker está abierta en el entorno de desarrollo local.
- El usuario se encuentra en la sección "Proyectos".
- No es necesario que existan Proyectos previos.

## Datos de prueba

| Campo       | Valor                                 | Notas                                                            |
| ----------- | ------------------------------------- | ---------------------------------------------------------------- |
| Nombre      | `Rediseño Web`                        | [propuesto] Cadena de texto simple, dentro del uso esperado.     |
| Descripción | `Actualización del sitio corporativo` | [propuesto] Texto libre, opcional pero se completa en este caso. |

## Pasos de ejecución

| #   | Actor   | Acción                                                                | Resultado esperado del paso                                                             |
| --- | ------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 1   | Usuario | Hace clic en la acción "Nuevo Proyecto" / "Crear Nuevo Proyecto"      | Se abre el formulario/modal de creación de Proyecto con los campos Nombre y Descripción |
| 2   | Usuario | Ingresa `Rediseño Web` en el campo Nombre                             | El campo Nombre refleja el valor ingresado                                              |
| 3   | Usuario | Ingresa `Actualización del sitio corporativo` en el campo Descripción | El campo Descripción refleja el valor ingresado                                         |
| 4   | Usuario | Confirma la creación del Proyecto                                     | El sistema acepta la solicitud sin mostrar errores de validación                        |
| 5   | Sistema | Cierra el formulario/modal y actualiza el listado                     | El nuevo Proyecto aparece en el listado de Proyectos                                    |

## Resultado esperado final

El Proyecto "Rediseño Web" queda creado y visible en el listado de Proyectos, mostrando el Nombre "Rediseño Web" y la Descripción "Actualización del sitio corporativo".

## Observaciones

Complementa a TC-005, que valida el contenido completo de la tarjeta en el listado (incluyendo Tiempo Registrado).
