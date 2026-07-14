## 1. Scaffold del módulo de feature

- [x] 1.1 Crear la estructura `src/features/tareas/` (`components/`, `hooks/`, `lib/`, `types.ts` si aplica) según arquitectura feature-based (ADR-005), sin duplicar los tipos de dominio de `fundamentos-infraestructura-compartida`.
- [x] 1.2 Verificar y, si falta, exponer desde el store raíz compartido los selectores/acciones que esta feature necesita consumir (Tareas, RegistrosDeTiempo, TemporizadorActivo, lista de Proyectos por `id`/`nombre`), sin modificar su contrato existente.
- [x] 1.3 Crear la ruta/página del panel principal de Tareas en `src/app/` (App Router) que monta el layout/sidebar compartido y el contenedor de la feature `tareas`.

## 2. Gestión de Tareas (CRUD + modal)

- [x] 2.1 Implementar el componente `TareaFormModal` (Base UI `Dialog` + Tailwind) parametrizado por modo `crear`/`editar`, con campos Proyecto (select sobre Proyectos existentes) y Nombre.
- [x] 2.2 Implementar la validación de creación: Proyecto obligatorio y Nombre no vacío (AC-001, AC-002), bloqueando la confirmación y mostrando el error correspondiente sin cerrar el modal.
- [x] 2.3 Conectar la creación de Tarea a la acción del store compartido, persistiendo la asociación al Proyecto (AC-003).
- [x] 2.4 Implementar el modo edición: precarga de Proyecto/Nombre existentes, título y etiqueta del botón principal cambiados a "Editar Tarea", y guardado del nuevo Nombre (AC-004).
- [x] 2.5 Implementar el listado "Tareas Recientes" en el panel principal (`TareaListItem`), incluyendo la acción de abrir el modal en modo edición por Tarea.
- [x] 2.6 Escribir tests unitarios (Vitest + Testing Library) para: creación válida, rechazo sin Proyecto, rechazo sin Nombre, edición de Nombre, y persistencia tras recarga simulada (TC-001 a TC-005).

## 3. Máquina de estados del temporizador

- [x] 3.1 Implementar la acción de store `iniciarTemporizador(tareaId)`: si no hay temporizador activo, persiste estado "En Ejecución" + hora de inicio + `tareaId` (AC-006).
- [x] 3.2 Implementar la acción de store `detenerTemporizador()`: calcula Duración = Hora Fin − Hora Inicio, valida Duración > 0 (BR-04/AC-009) y, si es válida, persiste el Registro de Tiempo de forma inmediata (AC-008, AC-010); si la Duración es 0, no persiste nada.
- [x] 3.3 Extender `iniciarTemporizador(tareaId)` para detectar un temporizador activo en otra Tarea y ejecutar de forma síncrona: detener → calcular Duración → persistir Registro → iniciar el nuevo temporizador (BR-02, BR-03, AC-007), antes de escribir el nuevo estado activo.
- [x] 3.4 Implementar el ícono ▷ y el control de detener en `TareaListItem`, conectados a las acciones anteriores, mostrando claramente el estado activo/inactivo y la Tarea asociada (AC-011).
- [x] 3.5 Escribir tests unitarios de la acción de store para: inicio simple, auto-detención al cambiar de Tarea, y el caso límite de Duración calculada igual a cero (TC-007, TC-008, TC-010).
- [x] 3.6 Escribir un test E2E (Playwright) que mida con la Performance API el tiempo de inicio y de detención+persistencia del temporizador, verificando que ambos sean menores a 1 segundo (AC-012, TC-013).

## 4. Ingreso manual de tiempo + validación

- [x] 4.1 Implementar el formulario de ingreso manual de tiempo (Tarea, Fecha, Duración) accesible desde el panel principal de Tareas (AC-013).
- [x] 4.2 Implementar/reutilizar la función pura `validarDuracion(duracion)` (Duración > 0) compartida entre el flujo manual y el del temporizador (BR-04).
- [x] 4.3 Conectar el formulario a la acción de store `crearRegistroManual()`, aplicando la validación tanto en UI (deshabilitar submit) como en la acción del store (defensa en profundidad), persistiendo el Registro válido (AC-014, AC-015).
- [x] 4.4 Escribir tests unitarios para: creación válida, rechazo de Duración = 0 y negativa, aceptación del valor positivo mínimo, y persistencia tras recarga simulada (TC-014 a TC-017).

## 5. Meta Semanal, Total Semanal y porcentaje

- [x] 5.1 Implementar la constante `META_SEMANAL_HORAS = 40` y el widget "Meta semanal" que la muestra sin ningún control de edición (AC-017).
- [x] 5.2 Implementar la función pura `rangoSemanaLaboralActual(fecha)` que devuelve el Lunes 00:00:00.000 y el Viernes 23:59:59.999 (hora local) de la semana que contiene `fecha`, según la decisión de RS-001.
- [x] 5.3 Implementar `calcularTotalSemanal(registros, fecha)`, sumando Duraciones (temporizador + manuales) dentro del rango de 5.2 y excluyendo explícitamente Sábado/Domingo y semanas anteriores.
- [x] 5.4 Implementar `calcularPorcentajeMeta(totalSemanalHoras)` = (Total Semanal ÷ Meta Semanal) × 100, sin techo visual en 100%.
- [x] 5.5 Conectar el stat card "Total Semanal" y el widget de porcentaje al store compartido de Registros de Tiempo, recalculando en tiempo real al crear/detener un Registro.
- [x] 5.6 Escribir tests unitarios para: suma dentro de la semana laboral, exclusión de la semana calendario anterior, exclusión de Sábado/Domingo, porcentaje por debajo de 100%, y porcentaje por encima de 100% sin truncar (TC-019 a TC-024).

## 6. Fidelidad visual y adherencia al sistema de diseño

- [x] 6.1 Ajustar estilos de la pantalla de Tareas (panel principal) y del modal de creación/edición para usar exclusivamente los tokens de color, tipografía, espaciado y componentes de DESIGN.md (tema Precision Focus), sin estilos ad-hoc (AC-005).
- [x] 6.2 Comparar la implementación contra el prototipo de alta fidelidad en Figma (pantalla Tareas y modal Nueva Tarea) y ajustar layout/colores/tipografía/espaciado/componentes hasta lograr fidelidad visual (AC-016).
- [x] 6.3 Configurar pruebas de regresión visual (snapshot testing con Playwright) para la pantalla de Tareas y el modal, cubriendo TC-006 y TC-018.
- [x] 6.4 Verificar accesibilidad básica (foco, roles ARIA, navegación por teclado) del modal y de los controles de temporizador, aprovechando las garantías de Base UI (ADR-003).
