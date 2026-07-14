## Objetivo

Implementa todas las specs ubicadas en `openspec/changes` de forma completamente autónoma, sin solicitar confirmaciones ni hacer preguntas durante la ejecución.

## Reglas generales

- Implementa todas las specs encontradas.
- Ejecuta las implementaciones en paralelo utilizando subagentes.
- Cada spec debe ejecutarse en un worktree independiente creado desde la rama actual.
- Cada subagente es completamente responsable de su spec de principio a fin.
- Si encuentras ambigüedades o información faltante, toma la decisión técnica más razonable siguiendo la arquitectura, convenciones y patrones existentes del proyecto.
- Nunca detengas la ejecución para pedir aclaraciones.
- No esperes aprobación del usuario en ningún momento.

## Flujo obligatorio para cada spec

Para cada spec ejecuta el siguiente ciclo:

1. Crear un worktree independiente.
2. Implementar completamente la spec.
3. Ejecutar todas las pruebas, validaciones y verificaciones necesarias.
4. Ejecutar el skill `code-review`.
5. Analizar el resultado.

Si el resultado es:

- Aprobado → continuar.
- Aprobado con observaciones → corregir todas las observaciones posibles y volver a ejecutar `code-review`.
- Rechazado o existen pendientes → corregir todos los problemas y volver a ejecutar `code-review`.

Cuando `code-review` quede en estado **Aprobado** o **Aprobado con observaciones**, ejecutar inmediatamente el skill:

`trace-validate`

Analizar el resultado de `trace-validate`.

Si detecta cualquiera de los siguientes casos:

- requisitos sin implementar
- funcionalidad no contemplada
- comportamiento inconsistente con la spec
- criterios de aceptación incumplidos
- trazabilidad incompleta
- mejoras obligatorias

Entonces:

- corregir la implementación
- actualizar el código necesario
- ejecutar nuevamente todas las pruebas
- volver a ejecutar `code-review`
- volver a ejecutar `trace-validate`

## Ciclo de validación

Repite el siguiente ciclo tantas veces como sea necesario:

Implementación
→ Pruebas
→ code-review
→ Correcciones
→ code-review
→ trace-validate
→ Correcciones
→ Pruebas
→ code-review
→ trace-validate

No detengas el ciclo hasta cumplir el criterio de salida.

## Criterio de salida de una spec

Una spec únicamente puede considerarse finalizada cuando:

- todas las pruebas pasan
- `code-review` devuelve **Aprobado** o **Aprobado con observaciones**
- `trace-validate` devuelve **Aprobado** o **Aprobado con observaciones**
- no quedan acciones obligatorias pendientes
- no existen requisitos sin implementar

## Integración

Cuando una spec haya finalizado:

- verificar que el worktree no tenga cambios sin commit
- resolver posibles conflictos con la rama origen si existieran
- volver a ejecutar las pruebas después de resolver conflictos
- realizar el merge del worktree hacia la rama desde la cual fue creado
- eliminar el worktree temporal

## Ejecución global

Procesa todas las specs encontradas hasta completar el conjunto completo.

No pauses la ejecución entre specs.

Mantén el máximo paralelismo posible respetando las dependencias entre ellas.

## Comunicación

No muestres progreso.

No solicites confirmaciones.

No hagas preguntas.

No detengas la ejecución por incertidumbres razonables.

Únicamente responde cuando absolutamente todas las specs hayan sido:

- implementadas
- revisadas
- validadas
- integradas mediante merge
- con estado final **Aprobado** o **Aprobado con observaciones** tanto en `code-review` como en `trace-validate`.

La única respuesta final deberá ser un resumen indicando:

- specs implementadas
- estado final de cada una
- commits generados
- merges realizados
- validaciones ejecutadas
- confirmación de que no existen pendientes.
