## 1. Utilidad colorFromString

- [x] 1.1 Implementar `colorFromString(input: string): string` en `src/shared/color-from-string.ts` (hash del string → índice en paleta fija de colores del prototipo / tema)
- [x] 1.2 Pruebas unitarias: misma entrada → mismo color; entradas distintas pueden diferir; el valor es un color CSS válido (hex)

## 2. Icono de Tarea Reciente

- [x] 2.1 Crear componente de icono (documento/check) alineado al glifo de Figma nodo 1:1452, en `src/shared/icons/`
- [x] 2.2 Contenedor 40×40 (`rounded-[2px]`) que aplica `backgroundColor: colorFromString(task.name)` e icono centrado

## 3. UI — Tareas Recientes

- [x] 3.1 Integrar el cuadro de icono a la izquierda de cada fila en `RecentTasksList`
- [x] 3.2 Actualizar pruebas de `RecentTasksList` para cubrir la presencia del icono / contenedor

## 4. UI — Tarjeta de Proyecto

- [x] 4.1 Aplicar `colorFromString(project.name)` como `backgroundColor` de la barra lateral izquierda en `ProjectCard`
- [x] 4.2 Actualizar pruebas de `ProjectCard` para cubrir el color dinámico según el nombre

## 5. Validación

- [x] 5.1 Validar visualmente contra `figma-tareas.png` / Figma nodo 1:1452 (icono + variedad de fondos por nombre)
- [x] 5.2 Validar visualmente en la pantalla Proyectos que las barras laterales varían según el nombre del Proyecto
