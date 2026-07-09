# TC-015 — Carga del historial en menos de 2 segundos con el volumen máximo de 1000 registros

Tipo: Límite
Prioridad: Alta
Criterio de aceptación: AC-007 (Eficiencia de rendimiento) — Carga del historial en menos de 2 segundos hasta 1000 registros
Artefacto padre: US-30274
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Objetivo

Validar el caso límite de volumen explícitamente definido por el criterio: la visualización del historial debe cargarse en menos de 2 segundos con hasta 1000 Registros de Tiempo.

## Precondiciones

- Existen exactamente 1000 Registros de Tiempo en el almacenamiento local, distribuidos entre varios Proyectos, Tareas y meses.
- El usuario abre la app en el entorno de desarrollo local.

## Datos de prueba

| Campo                          | Valor      | Notas                                                                   |
| ------------------------------ | ---------- | ----------------------------------------------------------------------- |
| Volumen de Registros de Tiempo | 1000       | Boundary: volumen máximo contemplado por el criterio (RP-003 de la SRS) |
| Umbral máximo de carga         | 2 segundos | Definido por el criterio AC-007                                         |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                     | Resultado esperado del paso                                                        |
| --- | ------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| 1   | Usuario | Abre la app en el entorno de desarrollo local y navega a la sección Historial de registros | Se inicia la carga de la sección                                                   |
| 2   | Sistema | Lee los 1000 Registros de Tiempo y calcula los totales por Tarea, Proyecto y mes           | El cálculo se completa sin bloquear la interfaz ni generar errores por volumen     |
| 3   | Sistema | Renderiza el historial completo con sus totales                                            | La pantalla queda completamente cargada en menos de 2 segundos desde la navegación |

## Resultado esperado final

El historial con 1000 Registros de Tiempo (volumen máximo del criterio) se carga y muestra completamente en menos de 2 segundos, cumpliendo el requisito de rendimiento RP-003.

## Observaciones

- Este caso ejercita el límite superior de volumen mencionado explícitamente en AC-007; se recomienda ejecutarlo con medición instrumentada (p. ej. Performance API del navegador) para verificar el tiempo real.
- **Automatización:** Parcial. Doble limitante: (1) la aserción de tiempo es sensible a flakiness en CI igual que TC-014, y (2) la generación de 1000 registros distribuidos en varios meses/proyectos/tareas exige fixtures/factories dedicados, costosos de mantener. Se requiere el mismo harness de medición dedicado más una estrategia de seeding masivo reutilizable.
