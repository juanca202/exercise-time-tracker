# TC-013 — Resumen de un periodo sin Registros de Tiempo

Tipo: Límite
Prioridad: Baja
Criterio de aceptación: AC-006 (Interacción de usuario) — Resumen del periodo seleccionado
Artefacto padre: US-30274
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Objetivo

Validar el caso límite del resumen del periodo cuando el mes seleccionado no tiene ningún Registro de Tiempo, confirmando que los tres valores del resumen se muestran en cero de forma consistente.

## Precondiciones

- El mes calendario seleccionado no tiene ningún Registro de Tiempo asociado.
- El usuario abre la app en el entorno de desarrollo local y navega a ese mes sin registros.

## Datos de prueba

| Campo                   | Valor | Notas       |
| ----------------------- | ----- | ----------- |
| Registros en el periodo | 0     | [propuesto] |
| Proyectos involucrados  | 0     | [propuesto] |
| Total de horas          | 0h    | [propuesto] |

## Pasos de ejecución

| #   | Actor   | Acción                                                                            | Resultado esperado del paso                                          |
| --- | ------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | Usuario | Navega, desde la sección Historial de registros, a un mes sin Registros de Tiempo | La vista cambia al periodo sin registros                             |
| 2   | Sistema | Calcula el resumen del periodo                                                    | El cálculo no falla al no encontrar registros para ese mes           |
| 3   | Sistema | Muestra el resumen en la interfaz                                                 | Se muestran "0 registros", "0 proyectos" y "0h" de forma consistente |

## Resultado esperado final

El resumen del periodo sin Registros de Tiempo muestra los tres valores (registros, proyectos, horas) en cero, sin inconsistencias entre ellos ni errores de cálculo.

## Observaciones

- Relacionado con TC-009 (navegación a un mes sin registros): este TC valida específicamente el bloque de resumen (AC-006) para ese mismo escenario.
- **Automatización:** Parcial. Requiere navegar a "un mes sin registros" mediante los controles de navegación, cuyo punto de partida es el mes real del sistema. Se requiere fijar o mockear el reloj (o exponer un mecanismo de selección directa de periodo) para no depender de cuántos clics de "mes anterior" hacen falta según la fecha de ejecución.
