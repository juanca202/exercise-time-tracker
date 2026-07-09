# ADR-006: Documentación de código con TSDoc

Estado: Accepted
Fecha de creación: 2026-07-06
Última actualización: 2026-07-06
Decisores: Equipo de desarrollo
Etiquetas: documentation, tsdoc, code-quality

## Contexto

El código sin documentación clara de su intención dificulta el mantenimiento y el onboarding, especialmente en lógica no trivial (reglas de negocio, invariantes, workarounds). Tratar la documentación como una tarea diferida (planificada para "después" o al cierre de un sprint) tiende a no ejecutarse nunca y produce documentación desactualizada respecto al código real. Al mismo tiempo, exigir documentación exhaustiva sobre cualquier símbolo, incluida la lógica trivial, genera ruido de bajo valor que desincentiva mantenerla.

## Decision

La documentación de código (funciones, tipos y módulos públicos que lo requieran) se escribe usando TSDoc, como parte del mismo cambio que introduce o modifica ese código — no como tarea diferida ni en un paso posterior. No es obligatorio documentar toda pieza de código: la documentación no se exige en lógica simple o trivial cuyo comportamiento sea evidente a partir del nombre y la firma del símbolo.

## Consecuencias

### Positivas

- La documentación se mantiene sincronizada con el código porque se escribe en el mismo cambio, no en una tarea separada.
- El tooling del ecosistema (IDEs, generadores de documentación) puede aprovechar TSDoc de forma consistente en todo el proyecto.
- Se evita ruido documental en código trivial, manteniendo el foco en lo que realmente aporta contexto.

### Negativas / trade-offs

- Requiere criterio del desarrollador para juzgar qué se considera "trivial", lo que puede generar inconsistencia entre distintos autores si no se refuerza en code review.

## Referencias

- [TSDoc](https://tsdoc.org/)
