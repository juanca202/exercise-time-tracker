## 1. Estructura base

- [x] 1.1 Crear `src/shared/layout/` con el componente de barra lateral y el mapeo sección↔ruta ("Tareas", "Proyectos", "Historial de registros")
- [x] 1.2 Crear el componente de encabezado de sección (nombre del producto + título de la sección activa)
- [x] 1.3 Montar la barra lateral y el encabezado en `src/app/layout.tsx` envolviendo `{children}`

## 2. Navegación y estado activo

- [x] 2.1 Implementar el resaltado del ítem activo usando `usePathname()` contra el mapeo sección↔ruta
- [x] 2.2 Verificar que el encabezado muestra el título correcto al navegar entre "Tareas", "Proyectos" e "Historial de registros"

## 3. Estilos y sistema de diseño

- [x] 3.1 Aplicar los tokens de `DESIGN.md` (tema Precision Focus) con Tailwind CSS a la barra lateral y el encabezado
- [x] 3.2 (Revisado en `design.md`) Los enlaces de la barra lateral usan `next/link` y HTML semántico en vez de Base UI: no hay ningún patrón de Base UI (overlay, disclosure, menú con popup) que aplique a una lista de enlaces siempre visible

## 4. Pruebas

- [x] 4.1 Pruebas unitarias (Vitest + Testing Library) para el resaltado de sección activa y el título del encabezado
- [x] 4.2 Validar visualmente contra los wireframes (`figma-tareas.png`, `figma-proyectos.png`, `figma-historial.png`) — verificado además contra el diseño de alta fidelidad en Figma vía MCP (nodo 1:1625): iconos, colores y tipografía extraídos y aplicados 1:1
