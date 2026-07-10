# TC-002 — Dado que el usuario no tiene ningún Registro de Tiempo creado, Cuando abre la sección de Historial de registros, Entonces el sistema muestra la lista vacía sin errores ni datos residuales

Perspectiva: Límite
Automatización: Automatizable (E2E)
Prioridad: Media
Criterio de aceptación: AC-001 (Casos de uso) — Lectura y visualización del historial de Registros de Tiempo
Artefacto padre: US-30274
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- El usuario no tiene ningún Registro de Tiempo creado (instalación nueva o almacenamiento local sin registros).
- El usuario abre la app en el entorno de desarrollo local.

## Datos de prueba

N/A

## Pasos de ejecución

| #   | Actor   | Acción                                                                                     | Resultado esperado del paso                                               |
| --- | ------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| 1   | Usuario | Abre la app en el entorno de desarrollo local y navega a la sección Historial de registros | La sección se carga sin errores                                           |
| 2   | Sistema | Verifica que no existen Registros de Tiempo almacenados                                    | El sistema no lanza excepciones ni queda en un estado de carga indefinido |
| 3   | Sistema | Muestra el historial                                                                       | Se presenta un estado vacío (sin filas de registros)                      |

## Resultado esperado final

La pantalla de Historial de registros se muestra sin errores, con la lista de registros vacía y sin datos inventados o residuales.

## Observaciones

El README de US-003 no especifica un mensaje textual concreto para el estado vacío; este TC valida únicamente que el sistema no falle y que la lista quede efectivamente vacía.
