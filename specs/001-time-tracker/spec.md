# Feature Specification: Time Tracker

**Feature Branch**: `001-time-tracker`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "Implementación de aplicación Time Tracker (LB-001) — herramienta personal para registrar tiempo en tareas dentro de proyectos, con temporizador y entrada manual, totales mensuales, persistencia local offline-first. Diseño: DESIGN.md (Precision Focus) y wireframes del laboratorio."

**Constitution**: Features MUST comply with `.specify/memory/constitution.md`. When a matching story exists in `docs/user-stories/`, align **BR-XX** / **SC-XX** identifiers or document deviations in _Assumptions_.

## Clarifications

### Session 2026-06-05

- Q: ¿Formato de entrada manual — fecha + hora inicio/fin (spec) o fecha + proyecto/tarea + duración (wireframe LB-TT-img-1)? → A: Con temporizador la duración se calcula con hora de inicio y fin reales; en registro manual el usuario ingresa duración directamente y no ingresa hora de inicio ni fin.
- Q: ¿Columnas de la tabla en Historial — fecha/inicio/fin/duración (spec) o fecha/proyecto/tarea/duración (wireframe LB-TT-img-3)? → A: Fecha, Proyecto, Tarea, Duración (como wireframe LB-TT-img-3).
- Q: ¿Totales en panel Tareas — solo mensual, semanal+mensual, o con meta semanal? → A: Totales semanal y mensual con mensaje de progreso/meta semanal; jornada 8 h/día laboral, meta semanal 40 h, meta mensual = días laborables del mes (lun–vie, sin fines de semana) × 8 h.
- Q: ¿Comportamiento de "Tareas Recientes" y botón Play (wireframe LB-TT-img-1)? → A: Últimas tareas con registro de tiempo; Play inicia el temporizador en esa tarea.
- Q: ¿"Tiempo registrado" en tarjetas de Proyectos (wireframe LB-TT-img-5) — histórico total, mes actual o período de Historial? → A: Del período seleccionado en Historial, sincronizado con ese filtro.
- Q: ¿Biblioteca y criterio de selección de iconos en la interfaz? → A: `@heroicons/react`; en cada ubicación usar el icono (variante outline o solid) que más se aproxime al diseño del wireframe de referencia.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Gestión de Proyectos y Tareas (Priority: P1)

Como usuario personal, quiero crear proyectos y asociarles tareas para organizar en qué contexto registro mi tiempo de trabajo.

**Why this priority**: Sin proyectos y tareas no existe contenedor para registros de tiempo; es la base de todo el flujo.

**Independent Test**: Se puede verificar creando un proyecto con nombre y descripción, luego una tarea vinculada a ese proyecto, y comprobando que ambos persisten tras recargar la aplicación.

**Acceptance Scenarios**:

1. **Given** que no existen proyectos, **When** el usuario crea un proyecto con nombre obligatorio y descripción opcional, **Then** el proyecto queda guardado y visible en la vista de Proyectos.
2. **Given** que existe al menos un proyecto, **When** el usuario crea una tarea seleccionando ese proyecto e ingresando un nombre, **Then** la tarea queda asociada exclusivamente a ese proyecto y visible en el listado de tareas.
3. **Given** que el usuario intenta crear un proyecto sin nombre, **When** confirma el formulario, **Then** el sistema impide el guardado e indica que el nombre es obligatorio.
4. **Given** que no existen proyectos, **When** el usuario intenta crear una tarea, **Then** el sistema indica que debe existir al menos un proyecto antes de crear tareas.

---

### User Story 2 - Temporizador de Tiempo (Priority: P2)

Como usuario, quiero iniciar y detener un temporizador sobre una tarea para registrar automáticamente el tiempo que dedico sin calcularlo manualmente.

**Why this priority**: Es el valor central de la aplicación; reduce fricción frente al registro manual.

**Independent Test**: Se puede verificar iniciando el temporizador en una tarea, esperando un intervalo, deteniéndolo y comprobando que se generó un registro con duración positiva y totales actualizados.

**Acceptance Scenarios**:

1. **Given** una tarea existente sin temporizador activo, **When** el usuario inicia el temporizador en esa tarea, **Then** el sistema muestra estado "En ejecución" con la hora de inicio y la tarea activa identificada.
2. **Given** un temporizador activo en la tarea A, **When** el usuario inicia el temporizador en la tarea B, **Then** el sistema detiene automáticamente el temporizador de A (generando su registro según BR-05), y activa el de B.
3. **Given** un temporizador activo, **When** el usuario lo detiene, **Then** el sistema calcula duración (hora fin − hora inicio), persiste el registro inmediatamente y deja de mostrar temporizador activo.
4. **Given** un temporizador activo, **When** el usuario recarga la aplicación, **Then** el temporizador sigue en ejecución con la misma tarea y hora de inicio (BR-01).
5. **Given** el listado de Tareas Recientes, **When** el usuario pulsa Play en una fila, **Then** el sistema inicia el temporizador en esa tarea (aplicando BR-04 si ya hay uno activo).

---

### User Story 3 - Registro Manual de Tiempo (Priority: P3)

Como usuario, quiero ingresar tiempo de forma manual en una tarea para registrar trabajo pasado que no conté con el temporizador.

**Why this priority**: Complementa el temporizador y cubre el caso de uso diferido descrito en el objetivo del ejercicio.

**Independent Test**: Se puede verificar abriendo el panel "Entrada Manual" (wireframe LB-TT-img-1), completando fecha, proyecto/tarea y duración, guardando y viendo el registro en el historial.

**Acceptance Scenarios**:

1. **Given** una tarea existente, **When** el usuario ingresa fecha, selecciona proyecto/tarea y una duración válida (> 0), **Then** el sistema crea un registro con esa duración sin solicitar hora de inicio ni fin al usuario.
2. **Given** un intento de registro manual con duración vacía o ≤ 0, **When** el usuario confirma, **Then** el sistema rechaza el registro e informa el error (BR-05).
3. **Given** un registro manual guardado, **When** el usuario consulta totales de la tarea y del proyecto, **Then** el tiempo ingresado se incluye en los cálculos (BR-06).
4. **Given** un registro creado por temporizador, **When** el usuario consulta sus datos, **Then** la duración corresponde al intervalo real entre hora de inicio y hora de fin del temporizador (no a una duración ingresada manualmente).

---

### User Story 4 - Visualización de Totales e Historial (Priority: P4)

Como usuario, quiero ver cuánto tiempo he dedicado por tarea, proyecto y mes, y revisar el historial detallado de registros para analizar mi productividad.

**Why this priority**: Cierra el ciclo de valor permitiendo revisar y validar lo registrado; depende de datos creados en historias anteriores pero es demostrable con datos de prueba.

**Independent Test**: Se puede verificar con registros precargados, seleccionando un mes en el historial y comprobando totales por proyecto, totales por tarea y tabla de registros filtrada.

**Acceptance Scenarios**:

1. **Given** registros en varias tareas de un proyecto dentro del período seleccionado, **When** el usuario abre la vista de Proyectos, **Then** cada tarjeta muestra **TIEMPO REGISTRADO** sumando solo registros de ese período (wireframe LB-TT-img-5).
2. **Given** registros en una tarea, **When** el usuario consulta el listado de tareas, **Then** cada tarea muestra su total acumulado de horas (histórico completo de la tarea).
3. **Given** registros en distintos meses, **When** el usuario selecciona un período mensual en Historial, **Then** la vista muestra resumen por proyecto y tabla de registros correspondientes a ese mes, y la vista Proyectos refleja el mismo período en sus totales.
4. **Given** el período seleccionado en Historial es octubre 2023, **When** el usuario navega a Proyectos sin cambiar el período, **Then** el tiempo registrado en cada tarjeta coincide con la suma de registros de octubre 2023 de ese proyecto.
5. **Given** el historial de registros, **When** el usuario lo consulta, **Then** cada fila de la tabla muestra fecha, proyecto, tarea y duración (wireframe LB-TT-img-3); hora inicio y hora fin no se muestran en la interfaz aunque se persistan internamente.
6. **Given** registros filtrados por período, **When** el usuario consulta el pie de Historial, **Then** ve conteo de registros encontrados, cantidad de proyectos con actividad y total de horas del período (wireframe LB-TT-img-3).
7. **Given** registros en la semana y mes calendario actual, **When** el usuario abre la vista Tareas, **Then** ve tarjetas TOTAL SEMANAL y TOTAL MENSUAL y un mensaje con el porcentaje alcanzado de la meta semanal (wireframe LB-TT-img-1).
8. **Given** una meta semanal fija de 40 h y un total semanal de 34 h, **When** el usuario consulta Tareas, **Then** el mensaje de progreso refleja 85 % de la meta semanal (34 ÷ 40).

---

### Edge Cases

- ¿Qué ocurre si se inicia y detiene el temporizador en menos de un segundo? El sistema no debe crear un registro con duración ≤ 0 (BR-05); debe informar que el intervalo es demasiado corto.
- ¿Qué pasa si el usuario borra datos del almacenamiento local del navegador? La aplicación inicia vacía sin errores críticos; no hay recuperación en la nube (BR-01).
- ¿Cómo se comporta la app sin conexión a internet? Todas las operaciones funcionan con datos locales; no se requiere red (BR-01).
- ¿Qué ocurre al crear una tarea sin proyectos disponibles? El flujo de creación se bloquea con mensaje orientativo (ver US-1 escenario 4).
- ¿Qué pasa si dos pestañas intentan manejar temporizadores? Solo un temporizador activo es válido en toda la aplicación; la última acción del usuario prevalece al sincronizar estado local (BR-04).
- ¿Cómo cumple BR-05 un registro manual sin hora inicio/fin ingresada por el usuario? El sistema deriva y persiste hora inicio y hora fin internamente a partir de la fecha y la duración ingresada, sin exponer esos campos en el formulario manual.
- ¿Qué ocurre si no hay registros en la semana actual? TOTAL SEMANAL muestra 0 h y el mensaje de meta semanal muestra 0 %.
- ¿Cómo se cuentan días laborables del mes? Solo lunes a viernes del mes calendario; sábados y domingos no cuentan para la meta mensual.
- ¿Cuántas tareas muestra el listado reciente? Las **5** tareas con registro de tiempo más reciente; si hay menos de 5, muestra todas las disponibles.
- ¿Qué muestra un proyecto sin registros en el período seleccionado? **TIEMPO REGISTRADO** en `0:00` (o equivalente vacío), sin ocultar la tarjeta del proyecto.
- ¿Cuál es el período por defecto al iniciar? Mes calendario actual; persiste entre sesiones junto con el resto del estado local.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: El sistema MUST persistir proyectos, tareas, registros de tiempo, período seleccionado y estado del temporizador activo exclusivamente en almacenamiento local del dispositivo (BR-01).
- **FR-002**: El sistema MUST permitir crear un proyecto con nombre obligatorio y descripción opcional.
- **FR-003**: El sistema MUST permitir crear una tarea con nombre obligatorio asociada a un único proyecto existente (BR-02).
- **FR-004**: El sistema MUST garantizar que cada registro de tiempo pertenezca a exactamente una tarea (BR-03).
- **FR-005**: El sistema MUST permitir iniciar un temporizador en una tarea, guardando estado "En ejecución", identificador de tarea y hora de inicio.
- **FR-006**: El sistema MUST permitir solo un temporizador activo en toda la aplicación a la vez (BR-04).
- **FR-007**: Si existe un temporizador activo y el usuario inicia otro en otra tarea, el sistema MUST detener automáticamente el anterior, calcular su duración y persistir su registro antes de activar el nuevo.
- **FR-008**: Al detener el temporizador activo, el sistema MUST calcular y persistir inmediatamente un registro con fecha, hora inicio, hora fin y duración.
- **FR-009**: El sistema MUST rechazar registros cuya duración calculada sea menor o igual a cero (BR-05).
- **FR-010**: El sistema MUST permitir crear registros de tiempo manualmente indicando fecha, proyecto/tarea y duración; el usuario MUST NOT ingresar hora de inicio ni hora de fin en este flujo (wireframe LB-TT-img-1).
- **FR-010a**: En registros manuales, el sistema MUST persistir hora inicio y hora fin derivadas internamente para cumplir BR-05, sin requerir entrada del usuario.
- **FR-010b**: En registros por temporizador, el sistema MUST calcular la duración a partir de la hora de inicio y hora de fin reales del intervalo temporizado.
- **FR-011**: El sistema MUST calcular el total de horas de una tarea como la suma de duraciones de sus registros (BR-06).
- **FR-012**: El sistema MUST calcular el total de horas de un proyecto como la suma de duraciones de registros de todas sus tareas; en la vista Proyectos ese total MUST filtrarse por el período seleccionado (BR-06).
- **FR-013**: El sistema MUST mostrar historial de registros con totales por tarea y por proyecto.
- **FR-014**: El sistema MUST ofrecer filtrado o selección de período mensual en la vista de historial para visualizar totales acumulados por mes.
- **FR-015**: La interfaz MUST seguir el sistema de diseño `DESIGN.md` (tema Precision Focus): paleta, tipografía, espaciado, elevación y patrones de componentes definidos en ese documento.
- **FR-016**: La vista principal de Tareas MUST incluir panel de temporizador activo, panel de entrada manual (campos: Fecha, Proyecto/Tarea, Duración, botón "Guardar Registro"), tarjetas TOTAL SEMANAL y TOTAL MENSUAL, mensaje de progreso de meta semanal y listado de tareas recientes, conforme al wireframe LB-TT-img-1.
- **FR-016a**: El listado Tareas Recientes MUST mostrar las tareas ordenadas por último registro de tiempo (más reciente primero), con nombre de tarea, proyecto, duración del último registro y tiempo relativo (_"Completado hace X"_, _"Ayer"_, etc.).
- **FR-016b**: Cada fila de Tareas Recientes MUST incluir botón Play que inicia el temporizador en esa tarea.
- **FR-016c**: El enlace "Ver Historial" en Tareas Recientes MUST navegar a la vista Historial de registros.
- **FR-025**: El sistema MUST calcular la meta semanal como **40 horas** (5 días laborales × 8 h).
- **FR-026**: El sistema MUST calcular la meta mensual como **días laborables del mes calendario actual** (lunes a viernes, excluyendo sábados y domingos) × **8 h**.
- **FR-027**: El porcentaje de meta semanal MUST calcularse como `(total semanal registrado ÷ 40) × 100`, redondeado al entero más cercano, y mostrarse en el mensaje de progreso de Tareas.
- **FR-028**: TOTAL SEMANAL MUST sumar la duración de registros de la semana calendario actual (lunes 00:00 a domingo 23:59). TOTAL MENSUAL MUST sumar registros del mes calendario actual.
- **FR-017**: La creación de tarea MUST realizarse mediante modal con selección de proyecto existente, conforme al wireframe LB-TT-img-2.
- **FR-018**: La vista de Proyectos MUST listar proyectos en tarjetas con nombre, descripción, etiqueta **TIEMPO REGISTRADO** y total del **período seleccionado**, botón "Nuevo Proyecto", tarjeta punteada "Crear Nuevo Proyecto" y navegación lateral compartida, conforme al wireframe LB-TT-img-5.
- **FR-029**: El sistema MUST mantener un **período mensual seleccionado** global (mes/año), controlado desde Historial, que sincroniza totales en Proyectos y filtros en Historial.
- **FR-029a**: Al cambiar el período en Historial, los totales de **TIEMPO REGISTRADO** en Proyectos MUST actualizarse sin recargar la aplicación.
- **FR-019**: La creación de proyecto MUST realizarse mediante modal con nombre obligatorio y descripción opcional, conforme al wireframe LB-TT-img-4.
- **FR-020**: La vista de Historial MUST incluir selector de período mensual con navegación anterior/siguiente, tarjetas de resumen por proyecto, tabla con columnas Fecha / Proyecto / Tarea / Duración, y pie con registros encontrados, proyectos y total de horas, conforme al wireframe LB-TT-img-3.
- **FR-021**: La navegación lateral MUST permitir acceder a las vistas Tareas, Proyectos e Historial de registros.
- **FR-022**: Los estados activos del temporizador MUST distinguirse visualmente usando los tokens de estado activo (verde secundario / borde de foco) definidos en `DESIGN.md`.
- **FR-023**: Las duraciones en listas e historial MUST presentarse con tipografía monoespaciada para alineación tabular, según `DESIGN.md`. Hora inicio y hora fin MUST NOT mostrarse en la tabla de historial.
- **FR-024**: La interfaz de usuario MUST mostrarse en español.
- **FR-030**: Los iconos de la interfaz MUST renderizarse con componentes de `@heroicons/react`, seleccionando en cada caso el icono y variante (outline o solid) que mejor coincida con el wireframe de referencia correspondiente (LB-TT-img-1 a LB-TT-img-5).

### Key Entities

- **Proyecto**: Agrupador de trabajo. Atributos: nombre (obligatorio), descripción (opcional). Relación: contiene muchas tareas.
- **Tarea**: Unidad de trabajo dentro de un proyecto. Atributos: nombre (obligatorio). Relación: pertenece a un único proyecto; tiene muchos registros de tiempo.
- **Registro de Tiempo**: Entrada de tiempo dedicado a una tarea. Atributos: fecha, duración (> 0), hora inicio y hora fin. Origen: (a) _temporizador_ — inicio/fin reales, duración calculada; (b) _manual_ — duración ingresada por el usuario, inicio/fin derivados por el sistema sin entrada del usuario. Relación: pertenece a una única tarea.
- **Temporizador Activo** (estado): Representación del temporizador en ejecución. Atributos: identificador de tarea, hora de inicio, estado "En ejecución". Solo puede existir uno a la vez en toda la aplicación.
- **Período Seleccionado** (estado): Mes y año activos para filtrar Historial y totales en Proyectos. Valor por defecto: mes calendario actual. Control UI en Historial; efecto compartido en Proyectos.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Un usuario puede crear su primer proyecto y su primera tarea en menos de 2 minutos sin documentación externa.
- **SC-002**: Un usuario puede iniciar un temporizador, trabajar y detenerlo; el registro aparece en historial en menos de 5 segundos tras detener.
- **SC-003**: El 100 % de los registros persistidos tienen duración estrictamente mayor que cero y campos fecha, hora inicio y hora fin completos.
- **SC-004**: Al iniciar un segundo temporizador con uno activo, el registro del temporizador anterior queda guardado antes de que el nuevo muestre estado activo (sin pérdida de tiempo registrado).
- **SC-005**: Los totales mostrados por tarea y por proyecto coinciden con la suma manual de registros visibles en el período consultado.
- **SC-006**: Tras recargar la aplicación, proyectos, tareas, registros y temporizador activo (si existía) se restauran sin intervención del usuario.
- **SC-007**: La aplicación permite completar los cuatro flujos principales (crear proyecto/tarea, temporizador, registro manual, consultar historial mensual) sin conexión a internet.
- **SC-008**: Las cinco vistas definidas (Tareas, Nueva Tarea, Proyectos, Nuevo Proyecto, Historial) son reconocibles frente a sus wireframes de referencia en una revisión visual con el equipo.
- **SC-009**: El porcentaje de meta semanal mostrado coincide con `(horas registradas en la semana actual ÷ 40) × 100` con tolerancia de ±1 punto porcentual por redondeo.
- **SC-010**: El **TIEMPO REGISTRADO** de cada tarjeta en Proyectos coincide con la suma de registros de ese proyecto en el período seleccionado en Historial.

## Assumptions

- Usuario único personal; no se requiere autenticación, multiusuario ni sincronización entre dispositivos en este alcance.
- La entrada manual solicita fecha, proyecto/tarea y duración (wireframe LB-TT-img-1); el usuario no ingresa hora de inicio ni fin. La duración en registros por temporizador se calcula con las horas reales de inicio y fin.
- Los wireframes de referencia están disponibles en `specs/001-time-tracker/assets/` (LB-TT-img-1 a LB-TT-img-5) como insumo vinculante de layout y composición.
- El selector de período en Historial opera por mes calendario (mes/año); es el alcance de "totales acumulados por mes" del objetivo.
- Jornada laboral de referencia: **8 h/día**. Meta semanal: **40 h**. Meta mensual: días laborables del mes (lun–vie) × 8 h; no se excluyen festivos ni se permite configurar metas por el usuario en v1.
- El mensaje de progreso en Tareas muestra el porcentaje de meta **semanal** (wireframe LB-TT-img-1); la meta mensual se usa como referencia implícita del total mensual mostrado, sin mensaje de porcentaje mensual obligatorio en v1.
- Tareas Recientes: hasta 5 tareas ordenadas por último registro; Play inicia temporizador; enlace Ver Historial navega a Historial.
- **TIEMPO REGISTRADO** en Proyectos usa el período mensual seleccionado en Historial (estado global). Los totales semanal/mensual del panel Tareas usan siempre la semana y el mes calendario actual, independientes del período de Historial.
- No se incluyen edición ni eliminación de proyectos, tareas o registros en el flujo principal del ejercicio.
- No se incluyen exportación de datos, integraciones externas, notificaciones ni reportes gráficos avanzados más allá de resúmenes tabulares.
- `DESIGN.md` está disponible en la raíz del repositorio como insumo de diseño vinculante para la interfaz.
- Los wireframes de referencia del laboratorio (LB-TT-img-1 a LB-TT-img-5) definen composición y layout; detalles no especificados en wireframes se resuelven con patrones de `DESIGN.md`.
- Iconografía: `@heroicons/react` como biblioteca única de iconos; la elección concreta de icono y variante (outline/solid) se alinea visualmente con cada wireframe de referencia.
- Idioma de la interfaz: español, alineado con `.agents/MEMORY.md`.
