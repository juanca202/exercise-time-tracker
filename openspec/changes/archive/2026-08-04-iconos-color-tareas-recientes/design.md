## Context

La change `gestion-de-tareas-y-registro-de-tiempo` ya entregó el listado de "Tareas Recientes", pero omitió el cuadro de icono con fondo de color del prototipo Figma (nodo 1:1452). El diseño muestra un glifo de documento/check sobre un cuadrado 40×40 con bordes redondeados y fondos distintos por fila. En Proyectos, `ProjectCard` ya tiene una barra vertical izquierda fija (`bg-secondary`); el producto pide reutilizar la misma utilidad de color con el **nombre del Proyecto** para que esa barra sea dinámica. En ambos casos el color se deriva del nombre, sin persistirlo.

## Goals / Non-Goals

**Goals:**

- Añadir el icono decorativo a cada fila de `RecentTasksList`, fiel al prototipo.
- Implementar `colorFromString` en `src/shared/` (determinista, sin dependencias externas).
- Usar el nombre de la Tarea como input del color de fondo del cuadro de icono.
- Usar el nombre del Proyecto como input del color de la barra lateral de `ProjectCard`.

**Non-Goals:**

- No mostrar aún duración acumulada ni "Completado hace…" del prototipo de Tareas Recientes (fuera del pedido).
- No persistir el color en los modelos `Task` / `Project` ni en `localStorage`.
- No generar iconos distintos por tipo de tarea; un solo glifo para todas las filas.
- No elegir color por el usuario.

## Decisions

- **Paleta fija indexada por hash:** hashear el string (p. ej. djb2 o FNV) y elegir `palette[hash % N]`. Preferida frente a HSL libre para evitar fondos ilegibles y acercarse a los tonos del prototipo (`#2e3a59`, `#2c3c51`, `#64f9bc`, `secondary`, etc.).
- **Ubicación `src/shared/color-from-string.ts`:** utilidad pura, sin React; un solo contrato para Tareas y Proyectos.
- **Icono como componente SVG** en `src/shared/icons/`, exportado desde el asset de Figma, con glifo claro sobre el fondo.
- **Aplicación en UI:** `style={{ backgroundColor: colorFromString(...) }}` tanto en el contenedor 40×40 de Tareas Recientes como en la barra `w-1.5` de `ProjectCard`; no tokens Tailwind dinámicos (Tailwind no genera clases desde strings en runtime).

## Risks / Trade-offs

- [Riesgo] Dos nombres distintos pueden colisionar en el mismo color de la paleta → Mitigación: paleta con suficientes entradas; colisiones aceptables (solo decorativo).
- [Riesgo] Fondos claros con icono blanco pierden contraste → Mitigación: paleta curada con contraste verificado para uso como fondo de icono; la barra de Proyecto tolera mejor cualquier tono de la paleta.
- [Trade-off] Color se recalcula al editar el nombre → deseado; no hay estado obsoleto.

## Migration Plan

Sin migración de datos. Despliegue: merge del código; usuarios ven iconos y barras dinámicas en el siguiente render.

## Open Questions

_Ninguna pendiente para arrancar implementación._
