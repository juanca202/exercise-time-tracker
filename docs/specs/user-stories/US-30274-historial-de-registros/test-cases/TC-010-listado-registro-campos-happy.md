# TC-010 — Dado que existe un Registro de Tiempo con Fecha, Proyecto, Tarea y Duración definidos, Cuando el sistema lo lista en la sección de Historial, Entonces se muestran los cuatro campos conforme al prototipo de alta fidelidad

Perspectiva: Happy Path
Automatización: Automatizable (E2E)
Prioridad: Alta
Criterio de aceptación: AC-005 (Interacción de usuario) — Listado de cada Registro de Tiempo conforme al prototipo de alta fidelidad
Artefacto padre: US-30274
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- Existe al menos un Registro de Tiempo completo: Fecha, Proyecto, Tarea y Duración definidos.
- El usuario abre la app en el entorno de desarrollo local.

## Datos de prueba

| Campo    | Valor      | Notas       |
| -------- | ---------- | ----------- |
| Fecha    | 2026-07-08 | [propuesto] |
| Proyecto | "Website"  | [propuesto] |
| Tarea    | "Diseño"   | [propuesto] |
| Duración | 1h 30m     | [propuesto] |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                        | Resultado esperado del paso                                            |
| --- | ------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 1   | Usuario | Abre la app en el entorno de desarrollo local y navega a la sección Historial de registros    | La sección se carga sin errores                                        |
| 2   | Sistema | Renderiza la fila del Registro de Tiempo en la lista                                          | La fila incluye los cuatro campos: Fecha, Proyecto, Tarea y Duración   |
| 3   | Usuario | Compara la fila mostrada contra el prototipo de alta fidelidad de Figma referenciado en la US | La disposición y el contenido de los campos coinciden con el prototipo |

## Resultado esperado final

El Registro de Tiempo se muestra en la lista con Fecha "2026-07-08", Proyecto "Website", Tarea "Diseño" y Duración "1h 30m", conforme al prototipo de alta fidelidad.

## Observaciones

- **Automatización:** Parcial. Los cuatro campos del registro (Fecha, Proyecto, Tarea, Duración) son aserteables por texto sin problema, pero la comparación de la fila "contra el prototipo de alta fidelidad" de Figma requiere regresión visual con una baseline exportada del diseño (o revisión manual puntual), no una aserción de contenido directa.
