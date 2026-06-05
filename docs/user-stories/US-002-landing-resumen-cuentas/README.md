# US-002: Landing — resumen de cuentas y atajos

- Estado: Ready
- Fecha de creación: 2026-05-29
- Última actualización: 2026-05-29

## Descripción

**COMO** usuario autenticado  
**QUIERO** ver un resumen de mis cuentas, los últimos movimientos y atajos a operaciones frecuentes  
**PARA** tener contexto financiero rápido y acceder con menos pasos a transferencias u otros servicios

## Referencias

- **Diseño / prototipo (Figma):** [Pantallas taller SDD — frame nodo 1-1605](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=1-1605&m=dev)

## Criterios de aceptación

### Reglas de negocio

- **BR-01** — La pantalla de inicio **DEBE** mostrar al menos una sección de cuentas con nombre, identificador enmascarado y saldo presentado al usuario.
- **BR-02** — La pantalla **DEBE** mostrar una lista de últimos movimientos con descripción, fecha relativa y signo del importe.
- **BR-03** — La pantalla **DEBE** ofrecer atajos visibles hacia la funcionalidad de transferencias y, si el producto las mantiene en el alcance, hacia otros servicios indicados en la maqueta de la demo.
- **BR-04** — Los textos y estructura **DEBEN** ser comprensibles en español acorde a la audiencia de la banca digital de demostración.
- **BR-05** — La página de inicio **DEBE** estar disponible solo en contexto autenticado según las reglas de **US-001**; para la ejecución de esta historia se **ASUME** que **US-001** ya está implementada y operativa, y los datos mostrados en la demo **PUEDEN** ser estáticos o mock mientras producto no defina integración con núcleo de cuentas real.
- **BR-06** — Los atajos como «Servicios» y «Pagos QR» **DEBEN** definir con producto su comportamiento cuando apunten a rutas no implementadas (404 o placeholder).
- **BR-07** — Los saldos y movimientos de esta historia son de demo y la integración con sistemas reales **DEBE** planificarse en historias posteriores.

### Escenarios

```gherkin
Escenario: SC-01 - Resumen de cuentas autenticado
DADO un usuario autenticado
CUANDO accede al resumen (ruta de inicio)
ENTONCES ve al menos dos cuentas con saldo y número enmascarado

Escenario: SC-02 - Últimos movimientos
DADO un usuario autenticado en el resumen
CUANDO revisa la sección de movimientos
ENTONCES ve al menos tres movimientos con descripción, fecha e importe con signo

Escenario: SC-03 - Atajo a transferencias
DADO un usuario autenticado en el resumen
CUANDO usa el atajo de transferencias
ENTONCES navega a la ruta de transferencias del producto

Escenario: SC-04 - Acceso al resumen sin sesión
DADO un visitante sin sesión
CUANDO intenta abrir el resumen
ENTONCES es redirigido según las reglas de autenticación (véase US-001)
```

## Complejidad sugerida

- **Story points:** 3 (Fibonacci: 1, 2, 3, 5, 8, 13)
- **Justificación:** UI de varias secciones y datos mock; sin integración backend real en la demo actual.

## Unidades de trabajo

- react-base-project

## Validación

### INVEST

| Letra | Criterio      | Resultado | Notas                                           |
| ----- | ------------- | --------- | ----------------------------------------------- |
| **I** | Independiente | Cumple    | Se ejecuta asumiendo US-001 ya implementada.    |
| **N** | Negociable    | Cumple    | Origen de datos y número de cuentas negociable. |
| **V** | Valiosa       | Cumple    | Punto central de navegación tras login.         |
| **E** | Estimable     | Cumple    | Alcance visible en la maqueta de Figma.         |
| **S** | Pequeña       | Cumple    | Una página de resumen con secciones claras.     |
| **T** | Testeable     | Cumple    | Contenido y enlaces verificables por pruebas.   |

### Definition of Ready (DoR)

| Criterio DoR                       | Estado | Notas                                                                                                                                   |
| ---------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Dependencias listas                | Cumple | US-001 se asume implementada para esta ejecución.                                                                                       |
| Inputs/outputs claros              | Cumple | Lista de cuentas/movimientos y enlaces de atajos.                                                                                       |
| Unidades de trabajo definidas      | Cumple | Listadas arriba.                                                                                                                        |
| Sin decisiones técnicas pendientes | Cumple | Para el alcance demo de esta historia, el origen de datos mock/estático queda aceptado; la integración real se difiere según **BR-07**. |
| Referencias de UI                  | Cumple | Enlace a Figma en **Referencias**.                                                                                                      |
| Sin aclaraciones pendientes        | Cumple | Lo diferido queda documentado en **Observaciones** y en **BR-06** / **BR-07** sin bloquear la ejecución.                                |

## Observaciones

- El comportamiento concreto de los atajos «Servicios» y «Pagos QR» cuando la ruta destino no exista (404 o placeholder) debe acordarse con producto (**BR-06**).
- La integración con núcleo de cuentas real y datos productivos se planifica en historias posteriores (**BR-07**).
