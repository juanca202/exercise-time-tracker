## Context

Esta es la historia de mayor complejidad del proyecto (8 story points) porque, por decisión explícita del usuario, agrupa cuatro subcapacidades en un mismo panel principal de Tareas: CRUD de Tarea, un temporizador global con una regla de exclusividad no trivial, ingreso manual de tiempo, y un cálculo de meta/total semanal con una frontera de fechas específica. El mayor riesgo técnico está en la máquina de estados del temporizador (auto-detención al iniciar uno nuevo) y en el requisito de rendimiento (<1s); el resto son validaciones y cálculos de bajo riesgo.

Se construye sobre la infraestructura ya existente del cambio hermano `fundamentos-infraestructura-compartida`: tipos de dominio (`Tarea`, `RegistroDeTiempo`, `TemporizadorActivo`), adaptador de persistencia local y store raíz con CRUD crudo — este cambio NO redefine esos contratos, solo los consume desde `src/features/tareas/`. La entidad `Proyecto` se referencia únicamente por su `id` ya existente en el store compartido (dependencia funcional de dominio con `gestion-proyectos`, no de implementación).

## Goals / Non-Goals

**Goals:**

- Definir el patrón de reutilización del modal "Nueva Tarea"/"Editar Tarea" (AC-004) como un único componente parametrizado por modo.
- Definir la máquina de estados del temporizador único global, incluyendo la transición de auto-detención (BR-02/BR-03, AC-006 a AC-008) y cómo se garantiza el requisito de <1s (AC-012).
- Definir la validación compartida de Duración > 0 (BR-04) para los dos orígenes de Registro de Tiempo (temporizador y manual).
- Definir el cálculo del rango Lunes-Viernes de la semana en curso para Total Semanal y Meta Semanal fija de 40h, dejando explícita la decisión de RS-001.

**Non-Goals:**

- No se diseña el CRUD de Proyecto (pertenece a `gestion-proyectos`).
- No se diseña el store raíz, el adaptador de persistencia ni el helper de cálculo de mes (pertenecen a `fundamentos-infraestructura-compartida`); este documento solo describe cómo `tareas` los consume.
- No se diseña el Total Mensual (stat card reutilizado desde `US-003 Historial de registros`, fuera de alcance de esta historia).
- No se contempla pausa/reanudación de temporizador (solo iniciar/detener, según BR-02/BR-03) ni un rango de semana configurable por el usuario (la Meta Semanal y el Total Semanal son fijos).

## Decisions

### 1. Modal único de creación/edición de Tarea

El prototipo Figma solo define un modal ("Nueva Tarea"); por decisión del usuario (AC-004), la edición reutiliza el mismo componente. Se implementa un único componente `TareaFormModal` en `src/features/tareas/components/`, parametrizado por una prop de modo (`crear` | `editar`):

- En modo `crear`: campos `proyectoId` y `nombre` vacíos; título del modal y etiqueta del botón principal = "Nueva Tarea".
- En modo `editar`: campos precargados con los datos de la Tarea existente; título y etiqueta del botón principal = "Editar Tarea". Por decisión de US-001/Contexto, solo el Nombre es editable (BR-01 no permite reasignar el Proyecto de una Tarea existente vía esta historia; no hay AC que lo requiera).
- Ambos modos comparten la misma validación: `proyectoId` obligatorio (debe referenciar un Proyecto existente en el store) y `nombre` no vacío (AC-001, AC-002). El componente no conoce los detalles de UI de Proyecto — solo consume una lista de `{ id, nombre }` ya resuelta por el store compartido.
- Construido con Base UI (`Dialog`) + Tailwind, según ADR-002/ADR-003, y con los tokens del tema Precision Focus de DESIGN.md (radios 0.25rem para inputs/botones, backdrop blur 8px, tipografía Inter) para cumplir AC-005/AC-016.

Alternativa considerada y descartada: dos componentes separados (`NuevaTareaModal` y `EditarTareaModal`). Se descarta porque el Figma de referencia no define un segundo diseño y duplicaría lógica de validación sin necesidad (Observaciones de US-002).

### 2. Máquina de estados del temporizador (único, global)

El temporizador activo es un único valor en el store raíz (`temporizadorActivo: TemporizadorActivo | null`), no un estado por Tarea. Estados y transiciones:

```
INACTIVO ──iniciar(tareaId)──> EN_EJECUCION(tareaId, horaInicio)
EN_EJECUCION(tareaId=A) ──detener()──> INACTIVO
                                        + persistir RegistroDeTiempo(tareaId=A, duración=horaFin-horaInicio)

EN_EJECUCION(tareaId=A) ──iniciar(tareaId=B, B≠A)──>
    1. calcular duración = ahora - horaInicio(A)
    2. validar duración > 0 (BR-04) → si falla, no persistir Registro de A (ver TC-010: caso solo alcanzable a nivel de store, no de UI)
    3. persistir RegistroDeTiempo(tareaId=A, duración)
    4. transicionar a EN_EJECUCION(tareaId=B, horaInicio=ahora)
```

- Esta lógica vive en una única acción del store (`iniciarTemporizador(tareaId)`) que internamente detecta si ya hay un temporizador activo en otra Tarea y ejecuta los pasos 1-4 de forma síncrona antes de escribir el nuevo estado, cumpliendo BR-03 ("detener... calcular... persistir... antes de iniciar el nuevo") en un solo tick de React/Zustand.
- `detenerTemporizador()` es una acción separada e idempotente cuando no hay temporizador activo (no-op).
- Rendimiento (<1s, AC-012): al no haber I/O de red (persistencia local síncrona vía el adaptador de `fundamentos-infraestructura-compartida`), toda la transición se ejecuta en el mismo ciclo de evento del click; no se requiere optimización adicional más allá de evitar reflows innecesarios. Se recomienda medir con Performance API en el TC-013 (E2E) como guardrail, no como mecanismo de cumplimiento.
- La UI (`TareaListItem`) deriva el estado visual (▷ inactivo / indicador "En Ejecución") comparando `temporizadorActivo?.tareaId` contra el `id` de cada Tarea — no hay estado de temporizador duplicado por fila (AC-011).

Alternativa considerada y descartada: modelar el temporizador como una máquina de estados explícita con una librería (XState). Se descarta por sobre-ingeniería: solo hay dos estados y una transición especial; una acción de store con un `if` cubre el caso sin dependencias nuevas, consistente con el principio de "constante/función pura" ya aplicado en RS-001 para el cálculo de semana.

### 3. Validación compartida de Duración > 0

BR-04 aplica tanto al Registro generado por el temporizador (AC-009) como al ingresado manualmente (AC-014). Se centraliza en una única función pura `validarDuracion(duracionMs: number): boolean` (o equivalente) dentro de `src/features/tareas/`, invocada:

- Por la acción de store `detenerTemporizador()` / el paso 2 de auto-detención antes de persistir.
- Por el formulario de ingreso manual, tanto en validación de UI (deshabilitar submit) como en la acción de store `crearRegistroManual()` (defensa en profundidad — no confiar solo en la validación de formulario, ver TC-010 que se ejecuta a nivel de store).

Límite exacto (TC-016): cualquier valor estrictamente mayor que cero es válido; el sistema no impone un mínimo distinto de "mayor que cero" (la granularidad del campo Duración del formulario manual se decide en `work-plan`/`TK-XXX`, p. ej. minutos vs. horas:minutos).

### 4. Cálculo de Meta Semanal, Total Semanal y porcentaje

Por decisión de RS-001, el rango de acumulación del Total Semanal es Lunes-Viernes de la semana en curso (no Lunes-Domingo), para coincidir exactamente con el rango de la Meta Semanal fija de BR-05/AC-017. Se implementa como funciones puras propias en `src/features/tareas/`, sin agregar `Intl.Locale`, `date-fns` ni `day.js` (evita la brecha de soporte de Firefox para `Intl.Locale.getWeekInfo()` y la falta de "locale-awareness" por defecto de `date-fns`, documentadas en RS-001):

- `META_SEMANAL_HORAS = 40` (constante, `8 * 5`, no configurable — AC-017).
- `rangoSemanaLaboralActual(fecha: Date): { inicio: Date; fin: Date }` devuelve el Lunes 00:00:00.000 y el Viernes 23:59:59.999 (hora local) de la semana que contiene `fecha`.
- `calcularTotalSemanal(registros: RegistroDeTiempo[], fecha: Date): number` filtra por `rangoSemanaLaboralActual` y suma Duraciones (incluye Registros por temporizador y manuales, AC-018); excluye explícitamente Sábado/Domingo aunque caigan en el mismo rango calendario (TC-024) y la semana calendario anterior (TC-021).
- `calcularPorcentajeMeta(totalSemanalHoras: number): number` = `(totalSemanalHoras / META_SEMANAL_HORAS) * 100`, sin techo en 100% (AC-019, TC-023: 110% se muestra tal cual, sin truncar).

Estas funciones son puras (reciben la fecha "actual" como parámetro) para ser 100% testeables en unit tests sin mockear el reloj del sistema más que con un `Date` inyectado.

## Risks / Trade-offs

- [Riesgo] La auto-detención (BR-03) requiere que "detener A" y "calcular/persistir su Registro" ocurran de forma atómica antes de "iniciar B"; un bug de orden dejaría a A sin Registro o a la app con dos temporizadores activos. → Mitigación: una única acción de store síncrona que ejecuta los 4 pasos en secuencia sin `await` intermedio evitable, cubierta por TC-008 (E2E) y por un test unitario directo de la acción del store.
- [Riesgo] El caso límite de Duración = 0 al detener (TC-010) no es alcanzable manualmente desde la UI (requiere que Hora Fin = Hora Inicio al milisegundo). → Mitigación: se prueba a nivel de store/acción directamente, no vía interacción E2E, tal como recomienda el propio TC-010.
- [Riesgo] Fijar el rango Lunes-Viernes como constante de código (no derivada del locale del navegador) difiere de la convención regional de algunos usuarios (p. ej. EE. UU./Canadá, que suelen usar Domingo como inicio de semana). → Mitigación: decisión de negocio explícita y documentada en RS-001/BR-05 para mantener coherencia con la Meta Semanal fija; queda abierta como mejora futura (preferencia configurable) fuera de alcance de esta historia.
- [Trade-off] No usar una librería de fechas (date-fns/day.js) para el cálculo de semana reduce dependencias y es 100% predecible offline, a costa de escribir y mantener manualmente las funciones puras de rango de semana (ya validado como aceptable en RS-001 dado el bajo riesgo del cálculo).
- [Riesgo] El requisito de rendimiento <1s (AC-012) podría degradarse si a futuro se agrega I/O asíncrono (p. ej. sincronización remota) a la acción de persistencia. → Mitigación: mientras la persistencia sea local y síncrona (offline-first, ver SRS-001 §2.4), no aplica; si se introduce I/O asíncrono en el futuro, deberá re-evaluarse este diseño.

## Migration Plan

No aplica: desarrollo greenfield sobre un módulo nuevo (`src/features/tareas/`); no hay datos ni comportamiento previo que migrar. El único prerequisito operativo es que el store raíz y el adaptador de persistencia de `fundamentos-infraestructura-compartida` estén disponibles (ya lo están, según la nota de dependencia de la propuesta).

## Open Questions

- Granularidad exacta del campo Duración en el formulario de ingreso manual (minutos vs. horas y minutos vs. segundos): se decide en `work-plan`/`TK-XXX`, sin impacto en las reglas de negocio de este documento (BR-04 exige solo ">0", independientemente de la unidad).
- Representación visual del porcentaje de Meta Semanal por encima de 100% (p. ej. si la barra de progreso se recorta visualmente a 100% mientras el número muestra 110%, o si la barra también se extiende): AC-019/TC-023 no lo especifican; se resuelve en `work-plan` o durante la implementación de la UI, respetando que el valor numérico nunca se trunque.
