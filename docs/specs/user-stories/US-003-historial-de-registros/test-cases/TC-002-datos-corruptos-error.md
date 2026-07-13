# TC-002 — Dado que el almacenamiento local contiene datos de Registros de Tiempo con formato inválido, Cuando el usuario abre la pantalla de Historial de registros, Entonces el sistema maneja el error de forma controlada sin fallar la aplicación

**Perspectiva**: Error
**Automatización**: Automatizable (E2E)
**Prioridad**: Media
**Criterio de aceptación**: AC-001 (Salidas del sistema)
**Artefacto padre**: US-003
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación Time Tracker está corriendo en entorno local de desarrollo (`npm run dev`).
- El almacenamiento local del navegador contiene, bajo la clave usada para Registros de Tiempo, un valor no parseable o con estructura inválida (ver Datos de prueba).
- No se requiere autenticación.

## Datos de prueba

| Campo                                        | Valor                                                       | Notas                                                           |
| -------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------- |
| localStorage["registros-tiempo"] [propuesto] | `"{esto-no-es-json-valido"`                                 | JSON malformado, no parseable                                   |
| Alternativa [propuesto]                      | `[{"id":"RT-01","tareaId":"T-1","duracion":"no-numerico"}]` | Estructura parseable pero con campo `duracion` de tipo inválido |

## Pasos de ejecución

| #   | Actor   | Acción                                                           | Resultado esperado del paso                                            |
| --- | ------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 1   | Tester  | Inyecta el valor corrupto en localStorage antes de cargar la app | El almacenamiento queda en estado inválido                             |
| 2   | Usuario | Navega a la pantalla "Historial de registros"                    | El sistema intenta leer y parsear los Registros de Tiempo              |
| 3   | Sistema | Detecta el error de parseo/formato                               | El sistema captura el error y no interrumpe el render de la aplicación |

## Resultado esperado final

La aplicación no se rompe (no hay pantalla en blanco ni crash de React); se muestra un estado de error controlado o un estado degradado (por ejemplo, historial vacío con aviso), y no se registra una excepción no controlada (unhandled exception) en la consola del navegador.

## Observaciones

El mecanismo exacto de manejo de errores (mensaje visible vs. degradar a estado vacío) es una decisión técnica a definir en `work-plan`/`TK-XXX`; este TC valida que, cualquiera sea la estrategia elegida, la aplicación permanece funcional.
