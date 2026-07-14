# TC-020 — Dados varios Registros de Tiempo (por temporizador y manuales) dentro de la semana en curso, cuando el sistema calcula el Total Semanal, entonces muestra la suma correcta de sus Duraciones

**Perspectiva**: Happy Path
**Automatización**: Automatizable (Unit)
**Prioridad**: Media
**Criterio de aceptación**: AC-018 — Calcular y mostrar el Total Semanal sumando Registros de Tiempo de la semana laboral en curso (Lunes a Viernes)
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación está corriendo en entorno local de desarrollo, sin backend.
- La fecha actual del sistema es 2026-07-13, Lunes (semana laboral en curso: 2026-07-13 Lunes al 2026-07-17 Viernes, según BR-05/AC-018).
- Existen los siguientes Registros de Tiempo dentro de la semana laboral en curso: uno generado por temporizador de 2 horas y uno manual de 1 hora 30 minutos, ambos asociados a Tareas existentes.

## Datos de prueba

| Campo                     | Valor                                  | Notas                        |
| ------------------------- | -------------------------------------- | ---------------------------- |
| Registro 1 (temporizador) | 2h 00min, fecha 2026-07-13 [propuesto] | Dentro de la semana en curso |
| Registro 2 (manual)       | 1h 30min, fecha 2026-07-14 [propuesto] | Dentro de la semana en curso |

## Pasos de ejecución

| #   | Actor   | Acción                                                                                                                                       | Resultado esperado del paso            |
| --- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| 1   | sistema | Identifica todos los Registros de Tiempo (por temporizador y manuales) cuya fecha cae dentro de la semana laboral en curso (Lunes a Viernes) | Se identifican los Registros 1 y 2     |
| 2   | sistema | Suma las Duraciones de los Registros identificados                                                                                           | El Total Semanal calculado es 3h 30min |
| 3   | usuario | Observa el stat card "Total Semanal" en el panel principal de Tareas                                                                         | Se muestra 3h 30min                    |

## Resultado esperado final

El Total Semanal mostrado refleja exactamente la suma de las Duraciones de todos los Registros de Tiempo (temporizador + manuales) generados dentro de la semana laboral en curso (Lunes a Viernes): 3h 30min.

## Observaciones

El caso límite de registros de la semana anterior se cubre en TC-021. El caso límite de registros de Sábado/Domingo dentro del rango calendario de la semana pero fuera de la semana laboral (Lunes-Viernes) se cubre en TC-024.
