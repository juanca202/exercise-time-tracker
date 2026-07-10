# Reporte de trazabilidad — US-30273-gestion-de-proyectos

Fecha: 2026-07-10 03:15
Trabajo: US-30273 · Documento: docs/specs/user-stories/US-30273-gestion-de-proyectos/README.md
Tipo: historia de usuario
Rama: loop/open-spec
Cobertura: 5 de 5 criterios cubiertos (100%)
Veredicto: ⚠️ Aprobado con observaciones

## Resumen

Los cinco criterios de aceptación (AC-001 a AC-005) quedan cubiertos por pruebas automatizadas de store y de componente (Vitest + Testing Library, ADR-007), todas ejecutadas y en verde. Los TC documentados como "Automatizable (E2E)" se automatizaron como pruebas de componente en lugar de e2e/Playwright real (el repo no tiene todavía specs en `e2e/`), y la fidelidad visual exacta contra el prototipo de Figma queda fuera de alcance automatizado, tal como los propios TC ya declaran ("Automatización: Parcial").

## Matriz de trazabilidad

| Criterio | Descripción                                                                                | Caso(s) de prueba      | Artefactos                                                                                                                                          | Estado   | Automática | Resultado | Observaciones                                                                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------ | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AC-001   | Crear Proyecto con Nombre (obligatorio) y Descripción (opcional)                           | TC-001, TC-002, TC-003 | `src/features/project-management/model/project-store.test.ts` (unit); `src/features/project-management/ui/projects-page.test.tsx` (unit/componente) | Cubierto | Sí         | Paso      | TC-001/002/003 están etiquetados "Automatizable (E2E)"; se automatizaron como pruebas de componente (Testing Library), no hay e2e/Playwright real en el repo.                               |
| AC-002   | Persistir el Proyecto en almacenamiento local (`localStorage`, ADR-011)                    | TC-004                 | `src/features/project-management/model/project-store.test.ts` (unit)                                                                                | Cubierto | Sí         | Paso      | TC-004 etiquetado "Automatizable (Integration)"; se valida contra un mock de `localStorage` (jsdom), no contra un navegador real.                                                           |
| AC-003   | Listar Proyectos en tarjetas (Nombre, Descripción, Tiempo Registrado) y estado vacío       | TC-005, TC-006         | `src/features/project-management/ui/projects-page.test.tsx` (unit/componente)                                                                       | Cubierto | Sí         | Paso      | TC-005 declara "Automatización: Parcial" — el contenido funcional está cubierto, la fidelidad visual exacta al prototipo Figma requiere regresión visual (fuera de alcance de este change). |
| AC-004   | Acción visible "Nuevo Proyecto" / "Crear Nuevo Proyecto" para iniciar la creación          | TC-007                 | `src/features/project-management/ui/projects-page.test.tsx` (unit/componente)                                                                       | Cubierto | Sí         | Paso      | —                                                                                                                                                                                           |
| AC-005   | Calcular y mostrar el tiempo total registrado por Proyecto (suma de tiempos de sus Tareas) | TC-008, TC-009         | `src/features/project-management/model/use-project-total-time.test.ts` (unit)                                                                       | Cubierto | Sí         | Paso      | —                                                                                                                                                                                           |

## Artefactos de prueba automatizada disponibles

| Tipo        | Presente | Artefactos                                                                                                                                                                                                                                   |
| ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit        | Sí       | `src/features/project-management/model/project-store.test.ts`, `src/features/project-management/model/use-project-total-time.test.ts`, `src/features/project-management/ui/projects-page.test.tsx`, `src/shared/lib/format-duration.test.ts` |
| Integración | No       | — (persistencia validada a nivel de store con mock de `localStorage`, no como suite de integración separada)                                                                                                                                 |
| E2E         | No       | — (`e2e/` existe pero está vacío; ningún TC de esta US se automatizó como Playwright)                                                                                                                                                        |

## Ejecución automática

|                       |                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| **Runner detectado**  | Vitest 4.1.7 (`npm run test:run` / `npx vitest run`)                                            |
| **Comando ejecutado** | `npx vitest run src/features/project-management src/features/task-time-tracking src/shared/lib` |
| **Resultado global**  | 16 pruebas pasaron, 0 fallaron (4 archivos de test)                                             |

## Observaciones y pendientes

- AC-001/AC-003: la fidelidad visual exacta contra el prototipo de alta fidelidad de Figma (layout, spacing, colores) no está cubierta por ninguna prueba automatizada; los propios TC-005/TC-001 ya la marcan como "Automatización: Parcial" y requieren regresión visual o revisión manual puntual si se quiere verificar.
- No existe todavía suite e2e (Playwright) en el repo (`e2e/` vacío) pese a que varios TC están documentados como "Automatizable (E2E)"; la cobertura funcional equivalente se logró con pruebas de componente (Testing Library), consistente con ADR-007, pero no ejercita el flujo completo en un navegador real ni la integración con el resto de la aplicación.
