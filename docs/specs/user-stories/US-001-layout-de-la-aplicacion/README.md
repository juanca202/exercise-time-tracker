# US-001: Layout de la Aplicación

**Estado:** Ready
**Fecha de creación:** 2026-07-30
**Última actualización:** 2026-07-30

## Descripción

**COMO** usuario de Time Tracker
**QUIERO** contar con una estructura de navegación consistente en toda la aplicación (barra lateral con acceso a Tareas, Proyectos e Historial de registros)
**PARA** moverme fácilmente entre las secciones del producto y reconocer en todo momento en qué sección me encuentro

## Contexto

Esta es la historia inicial del backlog: entrega el "shell" de la aplicación (barra lateral de navegación y encabezado de sección) sobre el que se construyen el resto de las pantallas — [US-002 (Gestión de Proyectos)](../US-002-gestion-de-proyectos/README.md), [US-003 (Gestión de Tareas y Registro de Tiempo)](../US-003-gestion-de-tareas-y-registro-de-tiempo/README.md) y [US-004 (Reportes e Historial de Tiempo)](../US-004-reportes-e-historial-de-tiempo/README.md) — sin depender de ninguna de ellas.

## Referencias

- **SRS:** [SRS-001-timetracker-app](../../requirements/SRS-001-timetracker-app/README.md) — RIU-001, RIU-002, RIU-003, RD-001, RD-003.
- **Diseño / prototipo:** [Figma – exercise-time-tracker](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker) — barra lateral común a todas las pantallas.
- **Wireframes:** [figma-tareas.png](../../requirements/SRS-001-timetracker-app/assets/figma-tareas.png), [figma-proyectos.png](../../requirements/SRS-001-timetracker-app/assets/figma-proyectos.png), [figma-historial.png](../../requirements/SRS-001-timetracker-app/assets/figma-historial.png)
- **Sistema de diseño:** [DESIGN.md](../../../../DESIGN.md) — tema Precision Focus.

## Criterios de aceptación

- **AC-001 (Interacción de usuario):** la interfaz DEBE mostrar una navegación lateral con acceso a las secciones "Tareas", "Proyectos" e "Historial de registros". (RIU-003)
- **AC-002 (Interacción de usuario):** la navegación lateral DEBE indicar visualmente cuál sección está activa en cada momento, fiel a los wireframes de referencia. (RIU-002, RD-003)
- **AC-003 (Interacción de usuario):** el encabezado de cada pantalla DEBE mostrar el nombre del producto ("TimeTracker") y el título de la sección activa. (RIU-002, RD-003)
- **AC-004 (Usabilidad):** la interfaz DEBE adherirse a la paleta de colores, tipografía, espaciado y patrones de componentes de [DESIGN.md](../../../../DESIGN.md) (tema Precision Focus). (RIU-001, RD-001)

---

## Complejidad sugerida

- **Story points:** 2
- **Justificación:** Layout estático sin lógica de negocio ni persistencia; el riesgo principal es la fidelidad visual al sistema de diseño y a los wireframes.

## Repositorios

- exercise-time-tracker

## Validación

### INVEST

| Letra | Criterio      | Resultado | Notas                                                                                                                   |
| ----- | ------------- | --------- | ----------------------------------------------------------------------------------------------------------------------- |
| **I** | Independiente | Cumple    | No depende de ninguna otra US; es la base de la que dependen las demás pantallas.                                       |
| **N** | Negociable    | Cumple    | El detalle visual admite ajuste sin cambiar el valor central (navegación consistente).                                  |
| **V** | Valiosa       | Cumple    | Sin un shell de navegación consistente, el resto de las pantallas no tiene dónde montarse ni cómo comunicarse entre sí. |
| **E** | Estimable     | Cumple    | Alcance acotado a un componente de layout/navegación.                                                                   |
| **S** | Pequeña       | Cumple    | Cabe en un incremento pequeño (barra lateral + encabezado).                                                             |
| **T** | Testeable     | Cumple    | AC-001 a AC-004 son verificables de forma objetiva.                                                                     |

### Definition of Ready (DoR)

| Criterio DoR                       | Estado | Notas                                                                                  |
| ---------------------------------- | ------ | -------------------------------------------------------------------------------------- |
| Dependencias listas                | Cumple | No depende de otra US del backlog.                                                     |
| Inputs/outputs claros              | Cumple | Sin entrada de datos; la salida es la estructura de navegación visible en toda la app. |
| Repositorios definidos             | Cumple | exercise-time-tracker (repositorio único, monorepo).                                   |
| Sin decisiones técnicas pendientes | Cumple | No requiere modelo de datos ni flujos; es un componente de presentación.               |
| Referencias de UI                  | Cumple | Wireframes de las tres pantallas y enlace a Figma disponibles.                         |
| Sin aclaraciones pendientes        | Cumple | Ninguna.                                                                               |

## Observaciones

- Ninguna.
- Ninguna.
- Ninguna.
- Ninguna.
