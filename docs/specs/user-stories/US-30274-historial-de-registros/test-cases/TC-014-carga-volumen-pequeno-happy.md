# TC-014 — Dado que existen 50 Registros de Tiempo en el almacenamiento local, Cuando el usuario navega a la sección de Historial, Entonces el sistema carga y muestra el historial completo en menos de 2 segundos

Perspectiva: Happy Path
Automatización: Automatizable (E2E)
Prioridad: Media
Criterio de aceptación: AC-007 (Eficiencia de rendimiento) — Carga del historial en menos de 2 segundos hasta 1000 registros
Artefacto padre: US-30274
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- Existen 50 Registros de Tiempo en el almacenamiento local, distribuidos entre varios Proyectos y Tareas.
- El usuario abre la app en el entorno de desarrollo local.

## Datos de prueba

| Campo                          | Valor      | Notas                           |
| ------------------------------ | ---------- | ------------------------------- |
| Volumen de Registros de Tiempo | 50         | [propuesto]                     |
| Umbral máximo de carga         | 2 segundos | Definido por el criterio AC-007 |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                     | Resultado esperado del paso                                                        |
| --- | ------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| 1   | Usuario | Abre la app en el entorno de desarrollo local y navega a la sección Historial de registros | Se inicia la carga de la sección                                                   |
| 2   | Sistema | Lee los 50 Registros de Tiempo y calcula los totales por Tarea, Proyecto y mes             | El cálculo se completa sin bloquear la interfaz                                    |
| 3   | Sistema | Renderiza el historial completo con sus totales                                            | La pantalla queda completamente cargada en menos de 2 segundos desde la navegación |

## Resultado esperado final

El historial con 50 Registros de Tiempo se carga y muestra completamente en menos de 2 segundos, cumpliendo el umbral de rendimiento definido.

## Observaciones

- **Automatización:** Parcial. El flujo funcional (seed de registros + medición) es automatizable, pero la aserción "< 2 segundos" es sensible a flakiness en CI (recursos compartidos, cold start). Se requiere un harness de medición dedicado (Performance API, umbral con margen de tolerancia, entorno controlado/aislado).
