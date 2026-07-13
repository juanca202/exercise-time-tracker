## 1. Gestión de Proyectos

- [ ] 1.1 Scaffoldear `src/features/projects` según ADR-005 (si no está ya presente desde `fundamentos`).
- [ ] 1.2 Implementar la validación `isValidProjectName` (no vacío después de trim) compartida por los flujos de creación y edición.
- [ ] 1.3 Construir el componente modal "Nuevo Proyecto" / "Editar Proyecto", aceptando una prop opcional `initialValues` para alternar entre creación y edición.
- [ ] 1.4 Construir la pantalla de Proyectos: grilla de tarjetas de proyecto + tarjeta de estado vacío "Crear Nuevo Proyecto", según Figma.
- [ ] 1.5 Conectar el modal y la pantalla a las acciones crudas `addProject`/`updateProject`/`listProjects` de `fundamentos` y verificar que los datos sobrevivan a la recarga.
- [ ] 1.6 Aplicar los tokens de DESIGN.md "Precision Focus" a la pantalla de Proyectos y al modal.
- [ ] 1.7 Pasada de QA visual de la pantalla de Proyectos y el modal contra los frames de Figma "Proyectos" / "Proyectos - Diálogo Nuevo proyecto".

## 2. Verificación

- [ ] 2.1 Confirmar que la pantalla de Proyectos es completamente usable con la red deshabilitada (offline-first).
- [ ] 2.2 Confirmar que no existe ningún gate de autenticación antes de llegar a la pantalla de Proyectos.
- [ ] 2.3 Ejecutar los casos de prueba `TC-XXX` existentes bajo `docs/specs/user-stories/US-001-proyectos/test-cases/` contra la implementación y registrar los resultados.
- [ ] 2.4 Confirmar que cada `AC-XXX` de US-001 cubierto por este change (AC-001 a AC-007 y AC-009) se cumple de punta a punta. AC-008 queda verificado por `fundamentos`.
