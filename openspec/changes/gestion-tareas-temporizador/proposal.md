## Why

Time Tracker existe para que una persona pueda llevar un control preciso del tiempo que dedica a cada actividad; sin la gestión de Tareas, el temporizador, el ingreso manual de tiempo y la meta semanal, la app no ofrece ningún valor tangible al usuario final, aunque ya existan los fundamentos compartidos (store raíz, tipos de dominio, persistencia) y la gestión de Proyectos. Esta historia (US-002) implementa el núcleo funcional que convierte esos cimientos en una herramienta usable: crear/editar Tareas dentro de un Proyecto, iniciar y detener un único temporizador activo por vez (con auto-detención al cambiar de Tarea), registrar tiempo manualmente cuando no se usó el temporizador, y visualizar el progreso frente a una meta semanal fija de 40 horas.

## What Changes

- Se agrega gestión de Tareas (CRUD de Nombre) asociadas obligatoriamente a un Proyecto existente (BR-01), reutilizando un único modal ("Nueva Tarea" / "Editar Tarea") para crear y editar (AC-001 a AC-005, AC-016).
- Se agrega un temporizador global único por aplicación: iniciar desde el ícono ▷ de una Tarea, detenerlo manualmente, y auto-detención + persistencia automática del temporizador anterior si se inicia uno nuevo en otra Tarea mientras el primero sigue activo (BR-02, BR-03, AC-006 a AC-012), con el requisito de rendimiento de completar inicio/detención en menos de 1 segundo.
- Se agrega ingreso manual de Registros de Tiempo (Tarea, Fecha, Duración) como alternativa al temporizador, con validación de Duración estrictamente mayor que cero (BR-04, AC-013 a AC-015).
- Se agrega el widget de Meta Semanal: valor fijo de 40 horas (8h × 5 días laborales, no configurable), Total Semanal acumulado exclusivamente de Lunes a Viernes (excluye Sábado/Domingo y semanas anteriores, según BR-05 y la decisión de [RS-001](../../../docs/specs/user-stories/US-002-tareas/research/RS-001-inicio-semana-total-semanal.md)), y porcentaje alcanzado ((Total Semanal ÷ Meta Semanal) × 100), sin techo visual en 100% (AC-017 a AC-019).

Esta historia agrupa, por decisión explícita del usuario documentada en las Observaciones e INVEST de US-002, cuatro subcapacidades relacionadas pero con reglas y superficies de prueba propias: Tareas, Temporizador, Registro Manual y Meta Semanal. Se descomponen en capabilities separadas para mantener cada spec cohesivo y facilitar `TK-XXX` independientes en `work-plan`.

## Capabilities

### New Capabilities

- `gestion-de-tareas`: creación, edición (Nombre) y persistencia de Tareas asociadas obligatoriamente a un Proyecto existente, incluyendo el modal compartido "Nueva Tarea"/"Editar Tarea" y la fidelidad visual/adherencia a DESIGN.md de la pantalla de Tareas y ese modal (AC-001 a AC-005, AC-016).
- `temporizador`: máquina de estados del único temporizador activo en toda la aplicación — iniciar, detener, auto-detención y persistencia del temporizador anterior al iniciar uno nuevo en otra Tarea, visibilidad clara del estado y requisito de rendimiento (<1s) (AC-006 a AC-012).
- `registro-manual-de-tiempo`: creación y persistencia de Registros de Tiempo manuales (Tarea, Fecha, Duración) con validación de Duración > 0 (AC-013 a AC-015).
- `meta-semanal`: cálculo y visualización de la Meta Semanal fija (40 h), el Total Semanal (Lunes a Viernes de la semana en curso) y el porcentaje alcanzado (AC-017 a AC-019).

### Modified Capabilities

_Ninguna._ No existen capabilities previas archivadas en `openspec/specs/`; todas las capabilities listadas arriba son nuevas.

## Impact

- Código nuevo: módulo `src/features/tareas/` (feature-based, según [ADR-005](../../../docs/adr/ADR-005-arquitectura-feature-based.md)), que consume — sin redefinir — el store raíz, los tipos de dominio (`Tarea`, `RegistroDeTiempo`, `TemporizadorActivo`), el adaptador de persistencia y el helper compartido de cálculo de mes provistos por el cambio hermano `fundamentos-infraestructura-compartida`.
- Dependencia funcional de dominio (no de implementación) con el cambio hermano `gestion-proyectos`: `gestion-de-tareas` referencia la entidad `Proyecto` únicamente por su identificador ya existente en el store compartido; esta propuesta no rediseña ni implementa el CRUD de Proyecto.
- UI nueva: pantalla de Tareas (panel principal), modal "Nueva Tarea"/"Editar Tarea", controles de temporizador, formulario de ingreso manual y widget de Meta Semanal — construidos con Base UI + Tailwind CSS ([ADR-002](../../../docs/adr/ADR-002-uso-de-tailwind-css.md), [ADR-003](../../../docs/adr/ADR-003-uso-de-base-ui.md)) y estado con Zustand ([ADR-004](../../../docs/adr/ADR-004-uso-de-zustand.md)).
- Sin cambios en backend/API (la app es offline-first, sin servidor). Sin dependencias nuevas de terceros: el rango Lunes-Viernes se calcula con una función pura propia, sin `Intl.Locale`, `date-fns` ni `day.js` (ver RS-001).
- Desarrollo greenfield: no hay código de Tareas/temporizador preexistente en el repositorio que deba migrarse o eliminarse.
