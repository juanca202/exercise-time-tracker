# TC-014 — Dado que el usuario está en otra sección de la aplicación, Cuando utiliza la navegación lateral, Entonces puede acceder a la sección Proyectos

**Perspectiva**: Happy Path
**Automatización**: Automatizable (E2E)
**Prioridad**: Media
**Criterio de aceptación**: AC-008 — Proporcionar navegación lateral para acceder a la sección de Proyectos desde cualquier otra sección de la aplicación
**Artefacto padre**: US-001
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación Time Tracker está corriendo en entorno local de desarrollo.
- La aplicación cuenta con al menos otra sección distinta a Proyectos (p. ej. Tareas o Historial de registros) accesible desde la navegación lateral.

## Datos de prueba

N/A — no aplican datos de prueba específicos para este caso.

## Pasos de ejecución

| #   | Actor   | Acción                                                    | Resultado esperado del paso                                                                                   |
| --- | ------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 1   | Usuario | Accede a una sección distinta a Proyectos (p. ej. Tareas) | La navegación lateral está visible con el ítem "Proyectos" disponible                                         |
| 2   | Usuario | Hace clic en el ítem "Proyectos" de la navegación lateral | La aplicación navega a la sección Proyectos                                                                   |
| 3   | Sistema | Renderiza la pantalla de Proyectos                        | Se muestra la pantalla de Proyectos, con su ítem correspondiente marcado como activo en la navegación lateral |

## Resultado esperado final

Desde cualquier otra sección de la aplicación, el usuario puede acceder a la sección Proyectos mediante la navegación lateral, confirmando su disponibilidad global en la aplicación.

## Observaciones

Si al momento de ejecutar este TC solo existe la sección Proyectos implementada (por dependencia de otras historias como US-002 o US-003), este TC queda bloqueado hasta que exista al menos una segunda sección navegable.
