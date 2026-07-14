# US-000: Fundamentos (infraestructura, layout y store compartido)

**Estado**: Ready
**Fecha de creación**: 2026-07-13
**Última actualización**: 2026-07-13

## Descripción

**COMO** equipo de desarrollo de Time Tracker
**QUIERO** contar con una base técnica compartida — tipos de dominio, persistencia local, un store raíz con CRUD real por entidad y el app shell de navegación — antes de implementar cualquier historia funcional
**PARA** que Proyectos, Tareas e Historial de registros se implementen sin depender funcionalmente entre sí ni necesitar modificar los mismos archivos compartidos, consumiendo datos reales desde su primer commit

## Contexto

Time Tracker es una aplicación greenfield, offline-first, sin backend (SRS-001 §2.1, §2.4): todos los datos (Proyectos, Tareas y Registros de Tiempo) se persisten exclusivamente en el almacenamiento local del dispositivo. Esta historia es la primera del flujo: fija de una sola vez los archivos que las historias de Proyectos, Tareas e Historial de registros necesitan consumir (tipos de dominio, persistencia, store raíz, helper de fecha compartido y app shell de navegación), de modo que esas historias queden sin dependencia funcional ni de archivos entre sí y puedan planificarse e implementarse en paralelo. Sigue [ADR-005](../../../adr/ADR-005-arquitectura-feature-based.md) (arquitectura feature-based), [ADR-004](../../../adr/ADR-004-uso-de-zustand.md) (Zustand), [ADR-003](../../../adr/ADR-003-uso-de-base-ui.md) (Base UI) y [ADR-002](../../../adr/ADR-002-uso-de-tailwind-css.md) (Tailwind CSS).

## Reglas de negocio

- **BR-01:** El store raíz compartido DEBE exponer únicamente operaciones CRUD crudas (crear, actualizar, listar) por entidad, sin validación ni reglas de negocio propias de cada historia funcional. → verificado por AC-003
- **BR-02:** Los datos de Proyecto, Tarea y Registro de Tiempo DEBEN persistir exclusivamente en el almacenamiento local del dispositivo. → verificado por AC-002
- **BR-03:** Ninguna historia funcional (Proyectos, Tareas, Historial de registros) DEBE necesitar modificar el store compartido, el adaptador de persistencia, el layout o el sidebar para agregar su propia lógica o pantalla. → verificado por AC-010

## Referencias

- **Diseño / prototipo:** [Figma - exercise-time-tracker (frame "Aside - SideNavBar")](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker?node-id=9-331&m=dev)
- **Especificación funcional:** [SRS-001: Especificación de Requisitos - Time Tracker](../../requirements/SRS-001-timetracker-app/README.md) (secciones 2.1, 2.4, 3.2.1 RIU-003)

## Criterios de aceptación

- **AC-001 (Procesamiento de datos):** El sistema DEBE definir los tipos de dominio completos de Proyecto, Tarea, Registro de Tiempo y Temporizador Activo en un módulo compartido, sin campos placeholder ni marcados como "por definir", de modo que Proyectos, Tareas e Historial de registros los consuman de forma idéntica desde su primer commit.
- **AC-002 (Fiabilidad):** El sistema DEBE implementar un adaptador de persistencia local (con operaciones de lectura, escritura y suscripción, más un campo de versión de esquema) de modo que los datos de Proyecto, Tarea y Registro de Tiempo sobrevivan a un cierre inesperado de la aplicación o a un reinicio del dispositivo.
- **AC-003 (Reglas de negocio):** El sistema DEBE exponer, en un store raíz compartido, operaciones CRUD crudas de creación, actualización y listado para cada entidad (Proyecto, Tarea, Registro de Tiempo), sin aplicar validación ni reglas de negocio propias de cada historia funcional.
- **AC-004 (Fiabilidad):** El sistema DEBE gatear toda lectura de estado persistido detrás de un indicador de hidratación, de modo que el render inicial del servidor y el primer render del cliente coincidan y no se produzcan errores de hydration-mismatch.
- **AC-005 (Fiabilidad):** El sistema DEBE solicitar almacenamiento persistente al navegador (best-effort) al cargar la aplicación.
- **AC-006 (Mantenibilidad):** El sistema DEBE proveer, en un único módulo compartido, el cálculo del mes calendario de un Registro de Tiempo, de modo que Tareas e Historial de registros lo consuman de forma idéntica sin duplicar la lógica ni depender entre sí para obtenerla.
- **AC-007 (Interacción de usuario):** La aplicación DEBE mostrar un layout de nivel superior con una barra de navegación lateral fija, con enlaces a Tareas, Proyectos e Historial de registros apuntando a sus rutas finales (`/tareas`, `/proyectos`, `/historial`), siguiendo el frame Figma "Aside - SideNavBar" (ver Referencias).
- **AC-008 (Salidas del sistema):** El sistema DEBE resolver las rutas `/tareas`, `/proyectos` y `/historial` con una página funcional para cada una (aunque sea un placeholder mínimo de "Próximamente"), de modo que la navegación no produzca errores antes de que cada historia funcional implemente su pantalla final.
- **AC-009 (Seguridad):** El sistema NO DEBE requerir autenticación ni ningún gate de acceso antes de llegar a cualquiera de las tres secciones (Tareas, Proyectos, Historial de registros).
- **AC-010 (Mantenibilidad):** El store raíz, el adaptador de persistencia, el layout y el sidebar de navegación DEBEN ser la única superficie de API estable que consumen Proyectos, Tareas e Historial de registros; ninguna historia funcional DEBE necesitar modificar esos archivos compartidos para agregar su propia lógica o pantalla.
- **AC-011 (Compatibilidad):** La aplicación (layout, sidebar y las 3 rutas) DEBE ser completamente utilizable con la red deshabilitada, sin depender de ningún servicio externo.
- **AC-012 (Interacción de usuario):** La implementación del layout y el sidebar DEBE ser visualmente fiel (colores, tipografía, espaciado y componentes) al frame "Aside - SideNavBar" del prototipo Figma referenciado.

---

## Complejidad sugerida

- **Story points:** 5
- **Justificación:** El alcance abarca varios módulos nuevos (tipos de dominio, adaptador de persistencia, store raíz, helper de fecha compartido, layout y sidebar, 3 rutas stub), aunque ninguno incluye lógica de negocio ni UI real más allá de placeholders. El riesgo técnico es bajo y acotado, pero es un cuello de botella duro: nada de lo que dependa de ella (Proyectos, Tareas, Historial de registros) puede empezar hasta que esta historia esté completa.

## Repositorios

- exercise-time-tracker

## Validación

### INVEST

| Letra | Criterio      | Resultado | Notas                                                                                                                                                  |
| ----- | ------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **I** | Independiente | Cumple    | No depende de ninguna otra US; por diseño es la base que hace posible que Proyectos, Tareas e Historial de registros dejen de depender entre sí.       |
| **N** | Negociable    | Cumple    | La ubicación exacta de módulos y el detalle de implementación admiten ajuste técnico posterior sin afectar el valor entregado.                         |
| **V** | Valiosa       | Cumple    | Sin esta base, las tres historias funcionales competirían por los mismos archivos (store, persistencia, sidebar); habilita su implementación paralela. |
| **E** | Estimable     | Cumple    | Alcance acotado y delimitado por los AC-XXX; sencillo de estimar.                                                                                      |
| **S** | Pequeña       | Cumple    | Alcance deliberadamente mínimo: sin lógica de negocio ni pantallas reales más allá de stubs; cabe en un incremento único.                              |
| **T** | Testeable     | Cumple    | Cada AC-XXX es verificable de forma objetiva (build/lint/test, navegación funcional, ausencia de gate de auth, fidelidad visual).                      |

### Definition of Ready (DoR)

| Criterio DoR                       | Estado | Notas                                                                                                                                                                                                               |
| ---------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dependencias listas                | Cumple | Ninguna dependencia externa; es la primera historia del flujo, no depende de ninguna otra.                                                                                                                          |
| Inputs/outputs claros              | Cumple | Sin input directo del usuario final; output: módulos compartidos (tipos, persistencia, store, helper) y app shell navegable.                                                                                        |
| Repositorios definidos             | Cumple | exercise-time-tracker.                                                                                                                                                                                              |
| Sin decisiones técnicas pendientes | Cumple | El límite CRUD crudo vs. lógica de negocio y el mecanismo de persistencia (local, sin backend) quedan fijados por los AC-XXX y Observaciones; el detalle de módulos concretos se resuelve en planificación técnica. |
| Referencias de UI                  | Cumple | Frame Figma "Aside - SideNavBar" referenciado.                                                                                                                                                                      |
| Sin aclaraciones pendientes        | Cumple | Ninguna.                                                                                                                                                                                                            |

## Observaciones

- Las reglas de negocio propias de cada historia funcional (validación de campos, máquina de estados del temporizador, meta semanal, selectores de totales por Tarea/Proyecto/Mes) permanecen fuera del alcance de esta historia y son responsabilidad de [US-001 (Proyectos)](../US-001-proyectos/README.md), [US-002 (Tareas)](../US-002-tareas/README.md) y [US-003 (Historial de registros)](../US-003-historial-de-registros/README.md) respectivamente, para no diluir la trazabilidad de sus propios AC-XXX.
- Ninguna aclaración pendiente.
