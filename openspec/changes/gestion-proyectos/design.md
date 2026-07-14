## Context

`gestion-de-proyectos` es la primera feature de negocio construida sobre la infraestructura compartida definida en el change hermano `fundamentos-infraestructura-compartida` (tipos de dominio, adaptador de persistencia local, store raíz Zustand con operaciones CRUD "en crudo", layout/sidebar compartidos). Esta feature no rediseña ni extiende esa infraestructura: la consume desde `src/features/proyectos/` siguiendo la arquitectura feature-based de ADR-005, añadiendo únicamente lo que es propio del dominio Proyecto (UI, validación de negocio BR-01/BR-02, adaptación visual a DESIGN.md/Figma).

Restricciones relevantes:

- ADR-004: todo estado compartido pasa por Zustand; no se introduce una store paralela para Proyectos.
- ADR-003: los componentes interactivos (modal, formulario) se construyen sobre Base UI + Tailwind.
- ADR-005: código específico de Proyectos vive en `src/features/proyectos/`; solo se toca `src/shared/` si algo deja de ser exclusivo de esta feature (no se prevé en este change).
- BR-01/BR-02: la validación de Nombre obligatorio/Descripción opcional es una regla de negocio de esta feature, no del store raíz, que se asume agnóstico de reglas de validación por dominio.

## Goals / Non-Goals

**Goals:**

- Definir cómo el modal único de creación/edición (AC-005) se implementa como un solo componente parametrizado por modo (`crear` | `editar`).
- Ubicar la validación de Nombre/Descripción en la capa de la feature (no en el store compartido), de forma que sea reutilizable entre creación y edición.
- Definir cómo el listado de Proyectos se deriva del estado del store compartido sin lógica de persistencia propia.
- Garantizar que ningún archivo de `src/shared/` (store raíz, adaptador de persistencia, layout, sidebar) necesite modificarse para entregar esta feature.

**Non-Goals:**

- No se diseña el store raíz ni el adaptador de persistencia local: se asumen ya provistos por `fundamentos-infraestructura-compartida` y se documenta solo el contrato que esta feature espera de ellos.
- No se implementa el cálculo de "Tiempo registrado" por Proyecto (US-003) ni ninguna lógica de Tareas (US-002).
- No se define aquí el detalle interno del layout/sidebar compartido; solo se describe el punto de integración (el ítem de navegación "Proyectos").

## Decisions

### 1. Modal único parametrizado por modo, no dos componentes

El modal de creación y edición se implementa como un único componente (p. ej. `ProyectoFormModal`) que recibe una prop de modo derivada de si se le pasa o no un Proyecto existente (`proyecto?: Proyecto`). Sin `proyecto`, el modal se comporta en modo creación: título "Nuevo Proyecto", campos vacíos, botón principal "Nuevo Proyecto"/"Crear". Con `proyecto`, se comporta en modo edición: título "Editar Proyecto", campos precargados con `proyecto.nombre`/`proyecto.descripcion`, botón principal "Editar Proyecto"/"Guardar cambios".

**Alternativas consideradas:**

- Dos componentes separados (`CrearProyectoModal`, `EditarProyectoModal`): rechazado porque duplicaría el markup, los estilos Base UI y la lógica de validación, y porque AC-005 exige explícitamente reutilizar "el mismo modal".

### 2. Validación de Nombre/Descripción vive en la feature, no en el store compartido

La regla "Nombre obligatorio tras `trim`, Descripción opcional" se implementa como una función de validación pura dentro de `src/features/proyectos/` (p. ej. `validarProyecto(input): { valido: boolean; errores: { nombre?: string } }`), invocada por el formulario antes de llamar a la operación de creación/edición del store compartido. El store raíz solo recibe datos ya validados y expone las operaciones CRUD "en crudo" (crear/actualizar/listar), sin conocer reglas de negocio de Proyecto.

**Alternativas consideradas:**

- Validar dentro del store raíz compartido: rechazado porque acoplaría el store genérico a reglas de negocio específicas de un dominio (Proyecto), dificultando que otras features con sus propias reglas lo reutilicen, y porque el enunciado del change explícitamente asigna BR-01/BR-02 a esta feature.
- Validar solo en el `input` HTML (`required`): rechazado porque no cubre el caso "solo espacios en blanco" (TC-004/TC-012), que requiere `trim()` explícito antes de evaluar vacío.

### 3. El listado de Proyectos es una proyección de solo lectura del store compartido

El componente de listado (p. ej. `ProyectosListado`) selecciona del store raíz la colección de Proyectos existente (vía el selector/hook que exponga `fundamentos-infraestructura-compartida`) y la renderiza como tarjetas, sin mantener estado propio duplicado ni realizar side-effects de persistencia. El estado vacío (cero Proyectos) se resuelve renderizando la misma lista sin elementos, sin lógica condicional adicional de error (AC-004, TC-008).

### 4. Punto de integración con el sidebar compartido: un único ítem de navegación

Esta feature no modifica el componente de sidebar compartido; únicamente aporta la ruta/vista de Proyectos (App Router, `src/app/.../proyectos/`) y, si el ítem "Proyectos" en el sidebar compartido aún no apunta a ella, se verifica/ajusta esa entrada de navegación como tarea puntual de wiring (AC-008), sin rediseñar el layout.

### 5. Adherencia visual: tokens de DESIGN.md vía Tailwind, sin overrides locales

Los componentes de la feature (modal, tarjetas de listado, botones) usan exclusivamente los tokens del tema Precision Focus ya configurados en Tailwind (colores `surface*`, `primary`, `secondary`, tipografía Inter/JetBrains Mono, radios `sm`/`md`/`lg`, elevación de tarjetas Nivel 1) en lugar de valores hardcodeados, para cumplir AC-007/AC-009 sin duplicar definiciones de diseño dentro de la feature.

## Risks / Trade-offs

- [Riesgo] Si `fundamentos-infraestructura-compartida` aún no expone el selector/hook o las operaciones CRUD esperadas por esta feature en el momento de implementar → Mitigación: las tareas de esta feature declaran explícitamente el contrato esperado (crear, actualizar, listar Proyecto) como dependencia bloqueante; si falta, se coordina con ese change antes de continuar, sin duplicar la infraestructura dentro de `src/features/proyectos/`.
- [Riesgo] Divergencia visual entre la implementación y el prototipo Figma por interpretación subjetiva de detalles no cubiertos por DESIGN.md → Mitigación: comparación visual explícita contra la captura de Figma referenciada (TC-015) antes de dar por cerrada la feature.
- [Riesgo] Normalización inconsistente de espacios en blanco en Nombre entre creación y edición (dos formularios que invocan la validación por separado) → Mitigación: una única función de validación compartida dentro de la feature, invocada por ambos flujos del mismo modal.

## Migration Plan

No aplica: desarrollo greenfield sin datos ni código previo de Proyectos que migrar.

## Open Questions

- Ninguna pendiente para el alcance de US-001: el mecanismo concreto de almacenamiento local (localStorage/IndexedDB) es una decisión ya resuelta por `fundamentos-infraestructura-compartida`, transparente para esta feature.
