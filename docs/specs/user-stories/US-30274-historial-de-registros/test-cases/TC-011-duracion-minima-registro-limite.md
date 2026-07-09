# TC-011 — Listado de un Registro de Tiempo con la Duración mínima válida

Tipo: Límite
Prioridad: Baja
Criterio de aceptación: AC-005 (Interacción de usuario) — Listado de cada Registro de Tiempo conforme al prototipo de alta fidelidad
Artefacto padre: US-30274
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Objetivo

Validar que un Registro de Tiempo con la Duración mínima permitida por el sistema (mayor que cero, conforme a la restricción de la SRS de no admitir duraciones menores o iguales a cero) se lista correctamente con sus cuatro campos, sin errores de formato.

## Precondiciones

- Existe un Registro de Tiempo con Duración de 1 minuto (el valor válido más bajo posible, mayor que cero).
- El usuario abre la app en el entorno de desarrollo local.

## Datos de prueba

| Campo    | Valor      | Notas                                                            |
| -------- | ---------- | ---------------------------------------------------------------- |
| Fecha    | 2026-07-08 | [propuesto]                                                      |
| Proyecto | "Website"  | [propuesto]                                                      |
| Tarea    | "Diseño"   | [propuesto]                                                      |
| Duración | 1 minuto   | Boundary: valor válido más bajo (>0) según restricción de la SRS |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                     | Resultado esperado del paso                                                                             |
| --- | ------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| 1   | Usuario | Abre la app en el entorno de desarrollo local y navega a la sección Historial de registros | La sección se carga sin errores                                                                         |
| 2   | Sistema | Renderiza la fila del Registro de Tiempo de 1 minuto de Duración                           | La fila se muestra con Fecha, Proyecto, Tarea y Duración legibles, sin truncamientos ni valores en cero |

## Resultado esperado final

El Registro de Tiempo con Duración de 1 minuto se muestra correctamente en la lista, con un formato de Duración legible (p. ej. "1m"), sin errores de visualización.

## Observaciones

Ninguna.
