## 1. Modelo y store

- [x] 1.1 Crear carpeta `src/features/projects/` (ADR-005) con la estructura interna estándar (`store/`, `components/`, `types.ts`)
- [x] 1.2 Definir el tipo `Project { id: string; name: string; description?: string; createdAt: string }` en `src/features/projects/types.ts`
- [x] 1.3 Crear `src/features/projects/store/projectsStore.ts`: store de Zustand con `persist` + `createJSONStorage(() => localStorage)` bajo la clave `time-tracker/projects` (ADR-011)
- [x] 1.4 Implementar la acción `addProject(name, description?)` que genera `id` con `crypto.randomUUID()` y `createdAt`
- [x] 1.5 Implementar el selector `selectProjectTotalTime(projectId)` que retorna `0` por ahora (hasta que exista el store de Registros de Tiempo del change `track-task-time`)

## 2. Validación

- [x] 2.1 Validar en el formulario que el Nombre no esté vacío antes de invocar `addProject`
- [x] 2.2 Mostrar el mensaje de error de validación cuando el Nombre esté vacío, sin cerrar el modal ni persistir el intento

## 3. UI — Modal "Nuevo Proyecto"

- [x] 3.1 Construir el modal de creación con Base UI (ADR-003) con campos Nombre y Descripción, conforme al prototipo Figma
- [x] 3.2 Conectar el submit del modal a `addProject`, cerrando el modal y limpiando el formulario al confirmar con éxito

## 4. UI — Listado de Proyectos

- [x] 4.1 Construir la página/sección "Proyectos" (App Router, componente cliente) que lea del `projectsStore`
- [x] 4.2 Construir el componente de tarjeta de Proyecto (Nombre, Descripción, Tiempo Registrado) con Tailwind (ADR-002)
- [x] 4.3 Renderizar el estado vacío cuando no existan Proyectos, sin errores
- [x] 4.4 Agregar la acción visible "Nuevo Proyecto" / "Crear Nuevo Proyecto" que abre el modal (sección 3)

## 5. Pruebas

- [x] 5.1 Pruebas unitarias (Vitest + Testing Library, ADR-007) del store: creación válida, rechazo sin Nombre, selector de tiempo total en 0
- [x] 5.2 Pruebas unitarias de persistencia: el store recupera Proyectos ya guardados en `localStorage` al inicializarse
- [x] 5.3 Prueba e2e (Playwright, ADR-008) del flujo happy path: abrir modal → crear Proyecto → verlo en el listado
- [x] 5.4 Prueba e2e del estado vacío del listado sin Proyectos creados
- [x] 5.5 Documentar las funciones públicas del store y componentes con TSDoc (ADR-006)

## 6. Fidelidad visual (revisión contra Figma)

- [x] 6.1 Crear `AppShell` compartido (`src/components/layout/AppShell.tsx`): SideNavBar fijo + TopAppBar, conforme al prototipo (RIU-003 de la SRS)
- [x] 6.2 Ajustar `ProjectCard` a los tokens exactos del frame Figma: color primary en el título, sin radio de borde, label "TIEMPO REGISTRADO" en mayúscula + valor grande en mono
- [x] 6.3 Agregar la tarjeta punteada "Crear Nuevo Proyecto" como segundo trigger del mismo diálogo (`Dialog.createHandle`), conforme al frame Figma
- [x] 6.4 Ajustar `NewProjectModal`: ancho fijo 512px, botón de cierre "X", labels en mayúscula/mono, `Descripción` como `textarea`, radios y placeholders exactos del frame
- [x] 6.5 Crear `src/lib/colorFromString.ts` (función compartida): deriva la barra de acento de color de cada tarjeta a partir del Nombre del Proyecto
- [x] 6.6 Corregir bug preexistente: quitar el override de `prefers-color-scheme: dark` heredado del boilerplate (Precision Focus es un tema único)
- [x] 6.7 Cambiar las fuentes globales de Geist Sans/Mono a Inter/JetBrains Mono (`layout.tsx`), conforme a DESIGN.md
- [x] 6.8 Verificación visual manual contra los frames Figma (`node-id=1-1571` y `node-id=1-1642`) con capturas de pantalla del navegador
