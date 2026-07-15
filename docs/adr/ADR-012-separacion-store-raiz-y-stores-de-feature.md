# ADR-012: Separación entre el store raíz (CRUD crudo) y stores de feature (estado de negocio)

**Estado**: Draft
**Fecha de creación**: 2026-07-15
**Última actualización**: 2026-07-15
**Decisores**: juanca202
**Etiquetas**: zustand, estado, arquitectura-feature-based, límites-de-módulo

## Contexto

[ADR-004](ADR-004-uso-de-zustand.md) establece Zustand como mecanismo exclusivo de estado global, pero no fija un límite entre el estado compartido por todo el proyecto y el estado de negocio propio de una sola feature. A medida que el proyecto crece, distintas features necesitan modelar su propia lógica de negocio con estado (máquinas de estados, datos transitorios, flujos multi-paso) además de leer y escribir las entidades de dominio compartidas (Proyecto, Tarea, Registro de Tiempo). Si esa lógica se agrega directamente al store raíz compartido, dos problemas emergen: (a) el store raíz deja de ser una superficie estable y predecible para todas las features que lo consumen, y (b) cambios en la lógica de negocio de una feature obligan a modificar un módulo compartido usado por el resto del proyecto, acoplando features que deberían ser independientes entre sí ([ADR-005](ADR-005-arquitectura-feature-based.md)).

## Decision

El **store raíz compartido** expone únicamente operaciones **CRUD crudas** de las entidades de dominio (crear, actualizar, listar), sin validación ni reglas de negocio propias de ninguna feature. Cualquier estado de negocio, máquina de estados o dato transitorio exclusivo de una sola feature (por ejemplo: un temporizador en ejecución, filtros de UI, el paso actual de un wizard) se modela en un **store de Zustand dedicado dentro de esa feature**, separado del store raíz, y solo esa feature lo consume directamente. Un store de feature puede leer datos del store raíz y, si necesita persistencia, usar el mismo adaptador de persistencia compartido (ver [ADR-011](ADR-011-persistencia-local-con-web-storage-api.md)) como una instancia independiente — nunca extendiendo el estado del store raíz.

## Consecuencias

### Positivas

- El store raíz permanece como una superficie de API estable: agregar o cambiar lógica de negocio de una feature nunca requiere tocar un módulo compartido consumido por el resto del proyecto.
- Las features permanecen desacopladas entre sí ([ADR-005](ADR-005-arquitectura-feature-based.md)): la lógica y el estado de una feature viven junto a ella, no dispersos en un módulo compartido.
- Los stores de feature son más fáciles de razonar y probar de forma aislada al tener un alcance acotado a una sola responsabilidad de negocio.

### Negativas / trade-offs

- Más de un store activo en la aplicación: requiere criterio consistente para decidir si un dato nuevo pertenece al store raíz (CRUD crudo de una entidad de dominio) o a un store de feature (estado de negocio), lo que puede generar inconsistencia entre distintos autores si no se refuerza en code review.
- Un dato que empieza como estado propio de una feature y luego resulta necesario para otras requiere una migración explícita al store raíz (o a un nuevo módulo compartido), en vez de estar ya disponible.

## Fitness function

Apto: Sí
Estado: Creada
Herramienta: ESLint (`no-restricted-imports`)
Ubicación: `eslint.config.mjs` (bloque `files: ["src/shared/store/**/*.{js,jsx,ts,tsx}"]`)
Comando: `pnpm run lint`

## Referencias

- [ADR-004: Uso de Zustand para manejo de estado](ADR-004-uso-de-zustand.md)
- [ADR-005: Arquitectura del proyecto basada en features](ADR-005-arquitectura-feature-based.md)
- [ADR-011: Persistencia local con Web Storage API (localStorage)](ADR-011-persistencia-local-con-web-storage-api.md)
