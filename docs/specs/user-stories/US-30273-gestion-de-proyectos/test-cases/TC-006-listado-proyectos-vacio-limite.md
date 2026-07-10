# TC-006 — Dado que no existe ningún Proyecto creado, Cuando el usuario navega a la sección "Proyectos", Entonces la sección se muestra sin errores y sin tarjetas de Proyecto

Perspectiva: Límite
Automatización: Automatizable (E2E)
Prioridad: Media
Criterio de aceptación: AC-003 (Interacción de usuario) — Listado de Proyectos en tarjetas con Nombre, Descripción y Tiempo Registrado, conforme al prototipo
Artefacto padre: US-30273
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- La aplicación Time Tracker está abierta en el entorno de desarrollo local.
- No existe ningún Proyecto creado (almacenamiento local sin Proyectos, por ejemplo, en una instalación nueva del entorno de desarrollo).

## Datos de prueba

N/A

## Pasos de ejecución

| #   | Actor   | Acción                                    | Resultado esperado del paso                           |
| --- | ------- | ----------------------------------------- | ----------------------------------------------------- |
| 1   | Usuario | Navega a la sección "Proyectos"           | El sistema intenta renderizar el listado de Proyectos |
| 2   | Sistema | Verifica que no hay Proyectos almacenados | El sistema no muestra ninguna tarjeta de Proyecto     |

## Resultado esperado final

La sección "Proyectos" se muestra sin errores y sin tarjetas de Proyecto, reflejando que no hay Proyectos creados en el sistema.

## Observaciones

Requiere un estado inicial sin datos (almacenamiento local vacío para Proyectos).
