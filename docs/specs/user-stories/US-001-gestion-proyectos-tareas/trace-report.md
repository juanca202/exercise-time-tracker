# Reporte de trazabilidad — US-001-gestion-proyectos-tareas

Fecha: 2026-07-04 19:58
Trabajo: US-001 · Documento: docs/specs/user-stories/US-001-gestion-proyectos-tareas/README.md
Tipo: historia de usuario
Rama: feature/superpowers-test-1
Cobertura: 7 de 8 criterios cubiertos (87.5%); 1 criterio Parcial
Veredicto: ⚠️ Aprobado con observaciones

## Resumen

Los 7 criterios funcionales (AC-001 a AC-007) quedan Cubiertos con pruebas automatizadas que pasaron en la última ejecución. AC-008 (adherencia visual a DESIGN.md) queda Parcial: no hay pruebas automatizadas de regresión visual en el stack del proyecto (fuera del alcance de ADR-005); se validó manualmente en navegador durante la implementación.

## Matriz de trazabilidad

| Criterio | Descripción                                                                               | Caso(s) de prueba                                                                                                | Artefacto(s) (tipo)                                                            | Estado   | Ejec. auto | Resultado    | Observaciones                                                                                                                                                                                                                                                        |
| -------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------- | ---------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AC-001   | Crear Proyecto con Nombre obligatorio y Descripción opcional                              | should_create_a_project_with_name_and_description                                                                | `src/features/time-tracking/components/project-grid.test.tsx` (unit/component) | Cubierto | Si         | Paso         | —                                                                                                                                                                                                                                                                    |
| AC-002   | Persistir el Proyecto creado en almacenamiento local                                      | should_persist_the_created_project_to_local_storage                                                              | `src/features/time-tracking/store/time-tracking-store.test.ts` (unit)          | Cubierto | Si         | Paso         | —                                                                                                                                                                                                                                                                    |
| AC-003   | Crear Tarea seleccionando Proyecto existente e ingresando Nombre                          | should_create_a_task_associated_to_an_existing_project                                                           | `src/app/tasks/page.test.tsx` (component)                                      | Cubierto | Si         | Paso         | —                                                                                                                                                                                                                                                                    |
| AC-004   | NO permitir crear Tarea sin Proyecto seleccionado / nombre vacío, con feedback de error   | should_prompt_to_create_a_project_first_when_there_are_none; should_block_submission_when_no_project_is_selected | `src/app/tasks/page.test.tsx` (component)                                      | Cubierto | Si         | Paso         | —                                                                                                                                                                                                                                                                    |
| AC-005   | Persistir la Tarea creada, incluyendo su asociación al Proyecto                           | should_persist_the_created_task_to_local_storage_with_its_project_association                                    | `src/features/time-tracking/store/time-tracking-store.test.ts` (unit)          | Cubierto | Si         | Paso         | Test añadido durante esta validación de trazabilidad (gap detectado y cerrado).                                                                                                                                                                                      |
| AC-006   | Vista "Proyectos" en cuadrícula (nombre, descripción, tiempo total) + tarjeta de creación | should_create_a_project_with_name_and_description; should_show_zero_time_for_a_project_without_time_entries      | `src/features/time-tracking/components/project-grid.test.tsx` (component)      | Cubierto | Si         | Paso         | —                                                                                                                                                                                                                                                                    |
| AC-007   | Navegación lateral persistente (Tareas / Proyectos / Historial de Registros)              | should_mark_the_link_matching_the_current_route_as_active; should_not_mark_other_links_as_active                 | `src/features/time-tracking/components/sidebar.test.tsx` (component)           | Cubierto | Si         | Paso         | —                                                                                                                                                                                                                                                                    |
| AC-008   | Adherencia a paleta, tipografía, espaciado y patrones de "Precision Focus"                | —                                                                                                                | —                                                                              | Parcial  | N/A        | No ejecutado | Sin herramienta de regresión visual en el stack (fuera de alcance de ADR-005); validado manualmente comparando la app en navegador contra `DESIGN.md` durante la implementación (ver `progress.md`). Riesgo bajo: es un criterio de estilo, no de lógica de negocio. |

## Artefactos de prueba automatizada disponibles

| Tipo                             | Presente | Artefactos                                                                               |
| -------------------------------- | -------- | ---------------------------------------------------------------------------------------- |
| Unit                             | Si       | `src/features/time-tracking/lib/*.test.ts`, `src/features/time-tracking/store/*.test.ts` |
| Integracion                      | No       | —                                                                                        |
| E2E                              | No       | —                                                                                        |
| Golden Master (solo migraciones) | —        | —                                                                                        |

## Ejecucion automatica

|                       |                                                                                                          |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| **Runner detectado**  | Vitest (`vitest.config.ts`, script `test:run`)                                                           |
| **Comando ejecutado** | `npm run test:run`                                                                                       |
| **Resultado global**  | 92 pasaron, 0 fallaron (21 archivos de test del repositorio; AC-001 a AC-007 de esta historia incluidos) |

## Observaciones y pendientes

- AC-008: si el proyecto adopta en el futuro una herramienta de regresión visual (p. ej. Chromatic, Playwright screenshots), incorporar una prueba automatizada para este criterio; hoy queda validado solo manualmente.
