## 1. Andamiaje del módulo de feature

- [x] 1.1 Crear la estructura de carpetas `src/features/historial/` (componentes, hooks, selectores, tipos locales si aplica) siguiendo la convención feature-based de ADR-005.
- [x] 1.2 Agregar la ruta de la pantalla "Historial de registros" en `src/app/` (App Router) y su entrada en el layout/sidebar compartido de navegación provisto por `fundamentos-infraestructura-compartida`.
- [x] 1.3 Crear el hook `useHistorialRegistros` (o equivalente) que lee el arreglo de Registros de Tiempo del store raíz compartido y expone el flag de hidratación (`hasHydrated`) antes de renderizar datos.
- [x] 1.4 Sembrar Registros de Tiempo de prueba vía el CRUD crudo del store compartido para poder desarrollar y probar esta feature en paralelo a `gestion-tareas-temporizador`.

## 2. Lectura y listado del historial completo (AC-001)

- [x] 2.1 Implementar el listado/tabla del historial completo de Registros de Tiempo (Tarea, Proyecto, fecha, duración), consumiendo el hook de 1.3.
- [x] 2.2 Implementar el estado vacío ("No hay registros de tiempo aún") cuando no existan Registros de Tiempo persistidos, sin filas fantasma ni totales erróneos.
- [x] 2.3 Implementar el manejo controlado de datos corruptos/parseo inválido del almacenamiento (captura de error, degradación a estado vacío o de error, sin excepción no controlada ni pantalla en blanco).
- [x] 2.4 Escribir tests unitarios/E2E para TC-001 (happy), TC-002 (error de datos corruptos) y TC-003 (historial vacío).

## 3. Total por Tarea (AC-002)

- [x] 3.1 Implementar el selector puro `calcularTotalPorTarea(registros)` que agrupa por `tareaId` y suma `duracion`, excluyendo/normalizando duraciones inválidas (negativas o no numéricas).
- [x] 3.2 Asegurar que una Tarea sin Registros asociados resuelva a total 0 en la capa de presentación.
- [x] 3.3 Integrar el total por Tarea en la pantalla (aunque el prototipo Figma no le dé una tarjeta visual propia, per Observaciones de US-003).
- [x] 3.4 Escribir tests unitarios para TC-004 (happy), TC-005 (duración inválida) y TC-006 (Tarea sin registros).

## 4. Total por Proyecto (AC-003)

- [x] 4.1 Implementar el selector puro `calcularTotalPorProyecto(registros, tareas, proyectos)` que compone `calcularTotalPorTarea` con la relación Tarea → Proyecto, sumando los totales de Tareas válidas por Proyecto.
- [x] 4.2 Excluir Tareas huérfanas (con `proyectoId` inexistente) del cálculo de cualquier Proyecto, sin interrumpir el cálculo de los Proyectos válidos.
- [x] 4.3 Asegurar que un Proyecto sin Tareas con Registros de Tiempo resuelva a total 0.
- [x] 4.4 Exponer el selector de forma reutilizable (export público desde `src/features/historial/` o promovido a `src/shared/` si `gestion-proyectos` ya lo necesita) para que la pantalla de Proyectos consuma el mismo cálculo sin duplicar la regla de negocio.
- [x] 4.5 Integrar los totales por Proyecto como stat cards en la pantalla de Historial de registros, según el prototipo Figma.
- [x] 4.6 Escribir tests de integración para TC-007 (happy), TC-008 (Tarea huérfana) y TC-009 (Proyecto sin registros).

## 5. Total por mes reutilizando el helper compartido (AC-004)

- [x] 5.1 Implementar el selector puro `calcularTotalPorMes(registros)` que agrupa por año-mes invocando el helper de cálculo de mes de `fundamentos-infraestructura-compartida` sobre la fecha/Hora de Inicio de cada registro (sin reimplementar la lógica de atribución de mes).
- [x] 5.2 Excluir Registros con fecha de inicio no parseable del cálculo, sin generar meses espurios ni corromper los totales válidos.
- [x] 5.3 Verificar explícitamente el caso de cruce de medianoche de fin de mes (RS-001): un Registro del temporizador con Hora de Inicio en un mes y Hora Fin en el mes siguiente se contabiliza íntegro en el mes de inicio.
- [x] 5.4 Integrar los totales por mes en la pantalla de Historial de registros.
- [x] 5.5 Escribir tests unitarios para TC-010 (happy), TC-011 (fecha inválida) y TC-012 (cruce de mes, según RS-001).

## 6. Optimización de rendimiento para 1000 registros (AC-005)

- [x] 6.1 Memoizar los tres selectores de agregación (por Tarea, Proyecto y mes) para que solo se recalculen cuando cambie el arreglo de Registros de Tiempo del store, no en cada render.
- [x] 6.2 Generar un script/utilidad de siembra de datos sintéticos (500 y 1000 Registros de Tiempo, distribuidos entre múltiples Proyectos/Tareas/meses) para pruebas de volumen, reutilizable por TC-013/TC-014.
- [x] 6.3 Escribir/automatizar la medición de rendimiento E2E (Playwright o `chrome-devtools` performance trace) desde navegación hasta reportes interactivos, para TC-013 (500 registros) y TC-014 (1000 registros), verificando el umbral de <2000 ms.
- [x] 6.4 Confirmar que no hay congelamiento de interfaz (UI freeze) perceptible con el volumen máximo de 1000 registros.

## 7. Fidelidad visual (AC-006, AC-007)

- [x] 7.1 Aplicar los tokens de `DESIGN.md` (tema Precision Focus: colores, tipografía Inter/JetBrains Mono, espaciado, elevación, formas) a todos los componentes de la pantalla, usando Tailwind CSS (ADR-002) sin estilos hardcodeados.
- [x] 7.2 Construir los componentes interactivos (tabla, tarjetas de totales, estados de carga/vacío) sobre Base UI (ADR-003). La tabla del historial usa marcado semántico plano (`<table>`) en vez de un primitivo de Base UI: Base UI no ofrece un componente de tabla y el listado no tiene ordenamiento/selección interactivos (ver comentario en `TablaHistorial.tsx`); las tarjetas de totales y el estado de carga sí usan `Progress`/`Separator` de Base UI donde aplica.
- [x] 7.3 Ajustar layout, colores, tipografía, espaciado y componentes para que coincidan con el prototipo de alta fidelidad en Figma de la pantalla "Historial de registros".
- [x] 7.4 Ejecutar/automatizar TC-015 (auditoría de estilos computados vs. DESIGN.md) y TC-016 (comparación visual vs. prototipo Figma), documentando discrepancias si las hubiera.

> **Observación (7.3/7.4, TC-016):** el MCP de Figma configurado en este entorno no tiene acceso de lectura al archivo referenciado en US-003 (`YYHDIH7CBsZrZ4VKXvbzkR`) -- responde "no tienes acceso de edición" -- por lo que no fue posible comparar programáticamente contra el prototipo real. La pantalla se implementó siguiendo estrictamente los tokens de `DESIGN.md` (tema Precision Focus) y el layout descrito en design.md (stat cards por Proyecto, tabla de historial, totales por Tarea/mes). TC-015 (auditoría de tokens) se automatizó y pasa (`e2e/historial-design-tokens.spec.ts`); TC-016 (diff visual contra Figma) queda pendiente de una revisión manual por parte de alguien con acceso al archivo Figma antes de dar la pantalla por definitivamente cerrada a nivel pixel-perfect.
