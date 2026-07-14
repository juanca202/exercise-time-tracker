## 1. Scaffold del módulo de feature

- [x] 1.1 Crear la estructura `src/features/proyectos/` (subcarpetas para componentes, hooks/lógica y tipos propios de la feature) siguiendo la convención feature-based de ADR-005.
- [x] 1.2 Verificar/importar los tipos de dominio Proyecto y el contrato del store raíz/adaptador de persistencia expuestos por `fundamentos-infraestructura-compartida`; si algo del contrato esperado (crear, actualizar, listar Proyecto) no existe aún, coordinar con ese change antes de continuar en lugar de duplicarlo.
- [x] 1.3 Crear la ruta de la sección Proyectos en `src/app/` (App Router) que renderiza el punto de entrada de la feature.

## 2. Validación de negocio (BR-01/BR-02)

- [x] 2.1 Implementar la función pura de validación de Proyecto (`nombre` obligatorio tras `trim`, `descripcion` opcional) dentro de `src/features/proyectos/`, retornando el error de campo requerido cuando corresponda.
- [x] 2.2 Cubrir con pruebas unitarias (Vitest) los casos: Nombre y Descripción completos, solo Nombre, Nombre vacío, Nombre solo espacios en blanco (TC-001 a TC-004, TC-010 a TC-012).

## 3. Modal único de creación/edición (AC-005)

- [x] 3.1 Construir el componente de modal (Base UI + Tailwind) parametrizado por modo creación/edición: título y etiqueta del botón principal "Nuevo Proyecto" o "Editar Proyecto" según si recibe un Proyecto existente.
- [x] 3.2 Precargar Nombre y Descripción cuando el modal se abre en modo edición.
- [x] 3.3 Conectar el formulario a la función de validación de la tarea 2.1: bloquear el guardado y mostrar el error junto al campo Nombre cuando sea inválido, en ambos modos.
- [x] 3.4 Conectar el guardado exitoso a las operaciones de creación/actualización del store compartido (sin lógica de persistencia propia en la feature).
- [x] 3.5 Pruebas de integración/E2E del flujo completo: crear Proyecto (TC-001, TC-002) y editar Proyecto (TC-009, TC-010), incluyendo verificación de que el Nombre original se conserva si la edición se bloquea (TC-011, TC-012).

## 4. Listado de Proyectos (AC-004)

- [x] 4.1 Construir el componente de listado que lee la colección de Proyectos desde el store compartido (selector/hook de solo lectura, sin estado duplicado).
- [x] 4.2 Implementar el estado vacío del listado (cero Proyectos) sin errores ni elementos falsos (TC-008).
- [x] 4.3 Integrar la acción "Nuevo Proyecto" y la acción "Editar" por tarjeta, invocando el modal de la sección 3 en el modo correspondiente.
- [x] 4.4 Pruebas de listado con Proyectos existentes y listado vacío (TC-007, TC-008).

## 5. Persistencia y recarga (AC-003)

- [x] 5.1 Prueba E2E: crear un Proyecto, recargar la aplicación y verificar que el Proyecto sigue visible con los mismos datos (TC-005).
- [x] 5.2 Prueba E2E: crear un volumen mayor de Proyectos (p. ej. 20), recargar la aplicación y verificar que todos persisten sin pérdida ni duplicación (TC-006).

## 6. Fidelidad visual (AC-007, AC-009)

- [x] 6.1 Aplicar exclusivamente los tokens Tailwind del tema Precision Focus (colores `surface*`/`primary`/`secondary`, tipografía Inter/JetBrains Mono, radios, elevación de tarjetas Nivel 1) en el modal y el listado, sin valores hardcodeados.
- [x] 6.2 Comparar la pantalla de Proyectos implementada contra el prototipo de Figma referenciado en US-001 y ajustar layout, espaciado y componentes hasta lograr fidelidad visual aceptable (TC-015).
- [x] 6.3 Validar (revisión manual guiada por checklist de DESIGN.md o prueba de regresión visual) que no existan desviaciones de color, tipografía, espaciado o componentes respecto a DESIGN.md (TC-013).

## 7. Navegación lateral (AC-008)

- [x] 7.1 Verificar si el ítem "Proyectos" del sidebar compartido ya apunta a la ruta creada en 1.3; si no, wirear el enlace sin modificar el diseño ni la estructura del componente de sidebar compartido.
- [x] 7.2 Prueba E2E: navegar desde otra sección de la aplicación hacia Proyectos mediante la navegación lateral y verificar que el ítem "Proyectos" queda marcado como activo (TC-014).
