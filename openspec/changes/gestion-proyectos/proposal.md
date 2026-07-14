## Why

Time Tracker es una aplicación offline-first para organizar el tiempo dedicado a Tareas, y el Proyecto es la agrupación lógica base sobre la que se crean esas Tareas (US-002). Hoy no existe forma de crear, editar ni visualizar Proyectos, por lo que ninguna Tarea puede organizarse todavía. Esta funcionalidad es la primera pieza del flujo y debe entregarse antes de abordar Tareas o Historial de registros.

## What Changes

- Alta de un módulo de feature `src/features/proyectos/` que implementa el CRUD (crear, editar, listar) de Proyecto descrito en US-001.
- Un único modal de creación/edición reutilizado para ambos flujos (AC-005): se titula "Nuevo Proyecto" al crear y "Editar Proyecto" al editar (incluyendo la etiqueta del botón principal), precargado con los datos existentes cuando se edita.
- Validación de campo Nombre obligatorio (no vacío tras `trim`) y Descripción opcional (BR-01, BR-02), bloqueando el guardado y mostrando el error junto al campo cuando el Nombre está vacío o solo contiene espacios, tanto en creación (AC-002) como en edición (AC-006).
- Vista de listado de Proyectos que lee del store compartido y refleja el estado vacío (sin Proyectos) sin errores (AC-004).
- Persistencia local de cada Proyecto (Nombre, Descripción) reutilizando el store raíz y el adaptador de persistencia ya provistos por la infraestructura compartida (AC-003); esta feature no define ni modifica el mecanismo de persistencia, solo lo consume.
- Interfaz adherida al sistema de diseño DESIGN.md (tema Precision Focus) y fiel al prototipo de alta fidelidad en Figma (AC-007, AC-009).
- Verificación/uso del ítem "Proyectos" en la navegación lateral compartida para acceder a esta sección desde cualquier otra (AC-008); no se rediseña el layout ni el sidebar, ambos provistos por la infraestructura compartida.

## Capabilities

### New Capabilities

- `gestion-de-proyectos`: creación, edición y listado de Proyecto con validación de Nombre obligatorio/Descripción opcional, persistencia local a través del store compartido, y adherencia visual al sistema de diseño Precision Focus y al prototipo de Figma.

### Modified Capabilities

_(ninguna: `openspec/specs/` no tiene capacidades existentes; este es el primer change que define especificaciones para el dominio Proyectos)_

## Impact

- **Código nuevo**: `src/features/proyectos/` (componentes de UI del modal y del listado, hook(s)/lógica de validación específica de Proyecto, tipos o mapeos propios de la feature si aplican).
- **Dependencias (no modificadas por este change)**: store raíz Zustand y adaptador de persistencia local, y layout/sidebar compartidos, todos provistos por el change hermano `fundamentos-infraestructura-compartida`. `gestion-de-proyectos` los consume vía las APIs que esa infraestructura exponga, sin duplicar ni redefinir su lógica de persistencia o navegación.
- **Sin migración**: desarrollo greenfield, no existe código previo de Proyectos que migrar.
- **Fuera de alcance**: cálculo de "Tiempo registrado" por Proyecto (corresponde a US-003) y cualquier lógica de Tareas (US-002).
