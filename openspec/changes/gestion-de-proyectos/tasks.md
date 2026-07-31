## 1. Modelo y persistencia

- [x] 1.1 Definir el tipo `Proyecto` (`id`, `name`, `description`) y el store raíz de persistencia en `localStorage`
- [x] 1.2 Implementar crear/leer/actualizar/eliminar (CRUD crudo) de Proyecto en el store raíz
- [x] 1.3 Envolver las escrituras en `try/catch`, detectar `QuotaExceededError` y exponer un estado de error no bloqueante — delegado a `zustand/middleware`'s `persist` + `createJSONStorage`, que ya envuelve cada escritura en `try/catch` internamente sobre nuestro adaptador

## 2. Store de feature y reglas de negocio

- [x] 2.1 Crear el store de feature de Proyectos (Zustand) que consume el store raíz — implementado como hook `useProjectActions` (sin estado propio distinto del de los stores raíz, ver `design.md` actualizado)
- [x] 2.2 Implementar la validación de bloqueo de eliminación: consultar si el Proyecto tiene Tareas asociadas antes de eliminar
- [x] 2.3 Validar Nombre obligatorio (máx. 100 caracteres) en creación y edición — validación nativa del formulario (`required`, `maxLength`)

## 3. UI — Pantalla de Proyectos

- [x] 3.1 Construir la pantalla "Proyectos" con el listado de tarjetas (Nombre, Descripción)
- [x] 3.2 Añadir el formulario/modal de creación y edición de Proyecto
- [x] 3.3 Añadir la acción de eliminar, mostrando el aviso de bloqueo cuando corresponda — sin paso de confirmación adicional (no lo exige ningún AC ni el diseño de Figma)
- [x] 3.4 Aplicar los tokens de `DESIGN.md` (tema Precision Focus) con Tailwind CSS; los enlaces/botones usan HTML semántico salvo el modal, que sí usa `Dialog` de Base UI (overlay con foco atrapado)

## 4. Integración con el layout

- [x] 4.1 Montar la pantalla de Proyectos dentro del shell de `layout-de-la-aplicacion`

## 5. Pruebas

- [x] 5.1 Pruebas unitarias del store de feature (crear, editar, eliminar, bloqueo de eliminación)
- [x] 5.2 Pruebas de componentes (Testing Library) del formulario y del listado
- [x] 5.3 Validar visualmente contra el wireframe `figma-proyectos.png` — validado además contra el diseño de alta fidelidad en Figma vía MCP (nodos 1:1576, 1:1611, 1:1712) y probado interactivamente (crear/editar/eliminar/persistencia)
