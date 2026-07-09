# Reporte de trazabilidad — US-30273-gestion-de-proyectos

Fecha: 2026-07-09 01:10
Trabajo: US-30273 · Documento: docs/specs/user-stories/US-30273-gestion-de-proyectos/README.md
Tipo: historia de usuario
Rama: feature/open-spec
Cobertura: 5 de 5 criterios cubiertos (100%)
Veredicto: ✅ Aprobado

## Resumen

Los 5 criterios de aceptación (AC-001 a AC-005) tienen caso de prueba documentado y artefacto automatizado que los valida (unit con Vitest/Testing Library y e2e con Playwright). Se ejecutó la suite acotada y todo pasó: 17 tests unitarios (5 archivos) y 2 tests e2e.

## Matriz de trazabilidad

| Criterio | Descripcion                                                                     | Caso(s) de prueba      | Artefacto(s) (tipo)                                                                                                                                          | Estado   | Ejec. auto | Resultado | Observaciones                                                                                                                                                                                     |
| -------- | ------------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AC-001   | Crear Proyecto con Nombre (obligatorio) y Descripción (opcional)                | TC-001, TC-002, TC-003 | `src/features/projects/components/NewProjectModal.test.tsx` (unit), `src/features/projects/store/projectsStore.test.ts` (unit), `e2e/projects.spec.ts` (e2e) | Cubierto | Si         | Paso      | —                                                                                                                                                                                                 |
| AC-002   | Almacenar los datos del Proyecto en el almacenamiento local                     | TC-004                 | `src/features/projects/store/projectsStore.test.ts` — describe "persistencia en localStorage" (unit)                                                         | Cubierto | Si         | Paso      | Validado a nivel de store (rehidratación desde `localStorage`); no hay un e2e específico de recarga de página para este caso, pero el mecanismo (Zustand persist) es el mismo para todo el store. |
| AC-003   | Listar Proyectos en tarjetas con Nombre, Descripción y Tiempo Registrado        | TC-005, TC-006         | `src/features/projects/components/ProjectCard.test.tsx` (unit), `src/features/projects/components/ProjectsScreen.test.tsx` (unit)                            | Cubierto | Si         | Paso      | —                                                                                                                                                                                                 |
| AC-004   | Acción visible para iniciar la creación de un Proyecto                          | TC-007                 | `src/features/projects/components/NewProjectModal.test.tsx` (unit), `e2e/projects.spec.ts` (e2e)                                                             | Cubierto | Si         | Paso      | —                                                                                                                                                                                                 |
| AC-005   | Calcular y mostrar el tiempo total registrado por Proyecto (suma de sus Tareas) | TC-008, TC-009         | `src/features/projects/store/projectsStore.test.ts` (unit — `selectProjectTotalTime`), `src/features/projects/components/ProjectCard.test.tsx` (unit)        | Cubierto | Si         | Paso      | —                                                                                                                                                                                                 |

## Artefactos de prueba automatizada disponibles

| Tipo                             | Presente | Artefactos                                                                                                                                                                                                                                                                                           |
| -------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit                             | Si       | `src/features/projects/store/projectsStore.test.ts`, `src/features/projects/components/ProjectCard.test.tsx`, `src/features/projects/components/NewProjectModal.test.tsx`, `src/features/projects/components/ProjectsScreen.test.tsx`, `src/features/projects/store/useHydrateProjectsStore.test.ts` |
| Integracion                      | No       | —                                                                                                                                                                                                                                                                                                    |
| E2E                              | Si       | `e2e/projects.spec.ts`                                                                                                                                                                                                                                                                               |
| Golden Master (solo migraciones) | —        | —                                                                                                                                                                                                                                                                                                    |

## Ejecucion automatica

|                       |                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------ |
| **Runner detectado**  | Vitest (unit) + Playwright (e2e)                                                     |
| **Comando ejecutado** | `npx vitest run src/features/projects/` y `npx playwright test e2e/projects.spec.ts` |
| **Resultado global**  | Unit: 17 pasaron, 0 fallaron (5 archivos). E2E: 2 pasaron, 0 fallaron.               |

## Observaciones y pendientes

- AC-002: la cobertura e2e de "recarga de página conserva los Proyectos" no existe como test explícito; se considera cubierta indirectamente por el test de store que ejercita la rehidratación real desde `localStorage`. No es un hueco funcional, solo una nota de dónde vive la prueba.
