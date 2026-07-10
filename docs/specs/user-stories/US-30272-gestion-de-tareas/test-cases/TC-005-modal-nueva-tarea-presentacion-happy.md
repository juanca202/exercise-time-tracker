# TC-005 — Dado que el usuario está en la pantalla "Tareas" y existe un Proyecto creado, Cuando abre el modal "Nueva Tarea", Entonces se presentan los campos Proyecto y Nombre junto con las acciones "Cancelar" y "Crear Tarea" conforme al prototipo

Perspectiva: Happy Path
Automatización: Automatizable (Visual Test)
Prioridad: Media
Criterio de aceptación: AC-003 (Interacción de usuario) — Presentación del modal "Nueva Tarea"
Artefacto padre: US-30272
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- La aplicación está abierta en el entorno de desarrollo local, en la pantalla principal "Tareas".
- Existe al menos un Proyecto previamente creado.

## Datos de prueba

N/A

## Pasos de ejecución

| #   | Actor   | Acción                                            | Resultado esperado del paso                              |
| --- | ------- | ------------------------------------------------- | -------------------------------------------------------- |
| 1   | Usuario | Hace clic en la acción para crear una nueva Tarea | Se abre el modal "Nueva Tarea"                           |
| 2   | Usuario | Observa el contenido del modal                    | El modal muestra el campo Proyecto y el campo Nombre     |
| 3   | Usuario | Observa las acciones disponibles del modal        | El modal muestra las acciones "Cancelar" y "Crear Tarea" |

## Resultado esperado final

El modal "Nueva Tarea" se presenta con los campos Proyecto y Nombre, y las acciones "Cancelar" / "Crear Tarea", conforme al prototipo de alta fidelidad referenciado en la US.

## Observaciones

- **Automatización:** Parcial. La presencia de los campos Proyecto/Nombre y las acciones Cancelar/Crear Tarea es aserteable con e2e estándar, pero la verificación "conforme al prototipo de alta fidelidad" (colores, spacing, layout exacto) no es aserteable por una prueba funcional. Se requiere una herramienta de regresión visual (ej. Percy, Chromatic o comparación de capturas) contra una baseline exportada del diseño de Figma.
