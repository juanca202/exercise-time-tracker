# TC-006 — Dado un número considerable de Proyectos creados, Cuando se recarga la aplicación, Entonces todos los Proyectos persisten íntegros y en el mismo orden de creación

**Perspectiva**: Límite
**Automatización**: Automatizable (E2E)
**Prioridad**: Media
**Criterio de aceptación**: AC-003 — Persistir los datos del Proyecto en el almacenamiento local, garantizando disponibilidad tras cierre inesperado o reinicio
**Artefacto padre**: US-001
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación Time Tracker está corriendo en entorno local de desarrollo.
- No hay Proyectos previos en el almacenamiento local (estado limpio) para aislar el resultado.

## Datos de prueba

| Campo             | Valor                                                             | Notas                                                                                        |
| ----------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Proyectos a crear | 20 Proyectos con Nombre `Proyecto 01` … `Proyecto 20` [propuesto] | Volumen límite propuesto para validar que la persistencia no degrada con múltiples registros |

## Pasos de ejecución

| #   | Actor   | Acción                                                         | Resultado esperado del paso                                            |
| --- | ------- | -------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 1   | Usuario | Crea 20 Proyectos consecutivos (`Proyecto 01` a `Proyecto 20`) | Los 20 Proyectos aparecen en el listado                                |
| 2   | Usuario | Recarga completamente la página/aplicación                     | La aplicación vuelve a cargar la sección de Proyectos                  |
| 3   | Sistema | Reconstruye el listado desde el almacenamiento local           | Los 20 Proyectos siguen presentes, sin pérdida ni duplicación de datos |

## Resultado esperado final

Los 20 Proyectos creados persisten íntegramente tras la recarga, sin pérdida, duplicación ni corrupción de datos, validando el comportamiento de persistencia bajo un volumen mayor de registros.

## Observaciones

El volumen de 20 Proyectos es una propuesta razonable de "varios registros"; puede ajustarse según límites reales de almacenamiento del navegador si se detectan en implementación.
