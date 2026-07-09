# TC-004 — Persistencia del Proyecto en almacenamiento local del dispositivo

Tipo: Happy Path
Prioridad: Alta
Criterio de aceptación: AC-002 (Procesamiento de datos) — Almacenamiento de los datos del Proyecto en el almacenamiento local del dispositivo
Artefacto padre: US-30273
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Objetivo

Validar que los datos de un Proyecto creado se almacenan en el almacenamiento local del dispositivo y persisten tras recargar o reiniciar la aplicación.

## Precondiciones

- La aplicación Time Tracker está abierta en el entorno de desarrollo local.
- No existe un Proyecto llamado "Auditoría Anual" previamente creado.

## Datos de prueba

| Campo       | Valor                           | Notas                               |
| ----------- | ------------------------------- | ----------------------------------- |
| Nombre      | `Auditoría Anual`               | [propuesto] Cadena de texto simple. |
| Descripción | `Revisión de procesos internos` | [propuesto] Texto libre.            |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                            | Resultado esperado del paso                                                      |
| --- | ------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 1   | Usuario | Crea un nuevo Proyecto con Nombre `Auditoría Anual` y Descripción `Revisión de procesos internos` | El Proyecto aparece en el listado inmediatamente después de crearlo              |
| 2   | Usuario | Recarga la aplicación (refresca la página o reinicia la app en el entorno de desarrollo local)    | La aplicación vuelve a cargar la sección "Proyectos"                             |
| 3   | Sistema | Recupera los datos almacenados localmente                                                         | El sistema muestra el listado de Proyectos leyendo desde el almacenamiento local |

## Resultado esperado final

El Proyecto "Auditoría Anual" sigue presente en el listado de Proyectos después de recargar la aplicación, con el mismo Nombre y Descripción, confirmando que los datos se almacenaron en el almacenamiento local del dispositivo.

## Observaciones

Depende de que exista al menos un Proyecto creado previamente (ver TC-001).
