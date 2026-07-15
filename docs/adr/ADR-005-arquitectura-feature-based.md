# ADR-005: Arquitectura del proyecto basada en features (feature-based)

Estado: Accepted
Fecha de creación: 2026-07-06
Última actualización: 2026-07-15
Decisores: Equipo de desarrollo
Etiquetas: architecture, feature-based, project-structure

## Contexto

La forma en que se organiza el código fuente impacta directamente en la capacidad de escalar el proyecto sin aumentar el acoplamiento entre módulos no relacionados. Una organización basada en tipo técnico (por ejemplo, carpetas planas como `components/`, `hooks/`, `services/` en la raíz) tiende a mezclar código de features distintas en los mismos directorios, dificultando ubicar, modificar o eliminar una funcionalidad completa a medida que el proyecto crece.

## Decision

El código fuente se organiza principalmente por feature/dominio de negocio: cada feature agrupa sus propios componentes, hooks, estado y lógica en un mismo módulo. El código verdaderamente transversal (UI compartida, utilidades genéricas, configuración) se ubica en módulos compartidos explícitos, separados de las features, y solo se promueve a ese espacio compartido cuando es usado por más de una feature.

## Consecuencias

### Positivas

- Alta cohesión dentro de cada feature: todo lo relacionado con una funcionalidad vive junto.
- Bajo acoplamiento entre features al no depender directamente unas de otras.
- Más fácil localizar, modificar o eliminar una funcionalidad completa sin rastrear código disperso por todo el proyecto.

### Negativas / trade-offs

- Requiere criterio consistente para decidir qué código es "compartido" vs "de feature"; aplicado de forma inconsistente puede derivar en duplicación.
- Puede introducir una capa adicional de indirección para funcionalidad muy pequeña que no justifica su propio módulo de feature.

## Fitness function

Apto: Sí
Estado: Creada
Herramienta: Vitest (script de test sobre el árbol de imports)
Ubicación: src/architecture/adr-005-feature-isolation.test.ts
Comando: pnpm exec vitest run src/architecture/adr-005-feature-isolation.test.ts

## Referencias

- [Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
