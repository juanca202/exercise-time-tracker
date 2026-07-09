# TC-006 — Total acumulado de un Proyecto sin Registros dentro del periodo seleccionado

Tipo: Límite
Prioridad: Baja
Criterio de aceptación: AC-003 (Salidas del sistema) — Total de tiempo acumulado por Proyecto dentro del periodo seleccionado
Artefacto padre: US-30274
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Objetivo

Validar el caso límite de un Proyecto que tiene Registros de Tiempo en otros meses pero ninguno dentro del periodo actualmente seleccionado, para confirmar que su total en ese periodo se muestra como cero.

## Precondiciones

- El Proyecto "App Móvil" tiene Registros de Tiempo únicamente en un mes distinto al periodo seleccionado.
- El usuario abre la app en el entorno de desarrollo local con el mes actual seleccionado, mes en el que "App Móvil" no tiene registros.

## Datos de prueba

| Campo                                     | Valor                                             | Notas                                                    |
| ----------------------------------------- | ------------------------------------------------- | -------------------------------------------------------- |
| Proyecto "App Móvil"                      | Registros solo en el mes anterior al seleccionado | [propuesto]                                              |
| Total esperado en el periodo seleccionado | 0h                                                | Boundary: proyecto existente sin actividad en el periodo |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                             | Resultado esperado del paso                                                           |
| --- | ------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 1   | Usuario | Abre la app en el entorno de desarrollo local con el mes actual seleccionado                       | La sección se carga sin errores                                                       |
| 2   | Sistema | Calcula el total del Proyecto "App Móvil" considerando solo los Registros del periodo seleccionado | El cálculo no incluye registros de otros meses ni falla al no encontrar coincidencias |
| 3   | Sistema | Muestra el total del Proyecto "App Móvil" para el periodo seleccionado                             | Se muestra "0h" (o equivalente) sin errores                                           |

## Resultado esperado final

El total acumulado del Proyecto "App Móvil" en el periodo seleccionado se presenta como 0h, sin afectar el cálculo de los demás Proyectos con actividad en ese mes.

## Observaciones

- Relacionado con TC-009 (mes sin registros), pero enfocado en el total de un Proyecto específico en lugar del periodo completo.
- **Automatización:** Parcial. Requiere distinguir "mes seleccionado" vs "mes anterior" en base al reloj real del sistema. Se requiere fijar o mockear el reloj para que el fixture (registros fuera del periodo) y la aserción del total coincidan de forma determinista.
