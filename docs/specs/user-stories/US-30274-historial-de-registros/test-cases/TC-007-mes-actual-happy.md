# TC-007 — Visualización del total acumulado por mes al abrir el historial (mes actual)

Tipo: Happy Path
Prioridad: Alta
Criterio de aceptación: AC-004 (Salidas del sistema) — Total de tiempo acumulado por mes y navegación entre periodos
Artefacto padre: US-30274
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Objetivo

Validar que al abrir la sección de Historial de registros, el sistema selecciona por defecto el mes actual y calcula correctamente el total acumulado de ese periodo.

## Precondiciones

- Existen Registros de Tiempo con fechas dentro del mes calendario actual.
- El usuario abre la app en el entorno de desarrollo local.

## Datos de prueba

| Campo                         | Valor                                                    | Notas       |
| ----------------------------- | -------------------------------------------------------- | ----------- |
| Registros del mes actual      | 3 Registros de Tiempo con fechas dentro del mes en curso | [propuesto] |
| Total esperado del mes actual | Suma de las duraciones de esos 3 registros               | [propuesto] |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                     | Resultado esperado del paso                                                        |
| --- | ------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| 1   | Usuario | Abre la app en el entorno de desarrollo local y navega a la sección Historial de registros | La sección se carga sin errores                                                    |
| 2   | Sistema | Selecciona el mes calendario actual como periodo por defecto                               | El periodo mostrado corresponde al mes en curso                                    |
| 3   | Sistema | Calcula y muestra el total acumulado del mes actual                                        | El total mostrado coincide con la suma de los Registros de Tiempo del mes en curso |

## Resultado esperado final

La pantalla de Historial de registros muestra, por defecto, el mes actual con su total de tiempo acumulado correctamente calculado.

## Observaciones

- **Automatización:** Parcial. El comportamiento "mes actual por defecto" depende explícitamente de la fecha real del sistema. Se requiere mockear o fijar el reloj para que el fixture de registros y la aserción del total coincidan de forma determinista en cualquier fecha de ejecución.
