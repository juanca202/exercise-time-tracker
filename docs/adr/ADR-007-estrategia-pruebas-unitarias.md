# ADR-007: Estrategia de pruebas unitarias

Estado: Accepted
Fecha de creación: 2026-07-06
Última actualización: 2026-07-06
Decisores: Equipo de desarrollo
Etiquetas: testing, unit-tests, vitest, testing-library

## Contexto

Sin una estrategia de pruebas unitarias explícita y compartida, cada desarrollador puede adoptar su propio framework, ubicación de archivos, patrón de estructura y nivel de cobertura. Esto fragmenta la suite de pruebas del proyecto y dificulta confiar en ella como red de seguridad ante regresiones, además de complicar la revisión de pruebas escritas con convenciones distintas.

## Decision

Las pruebas unitarias del proyecto se implementan con Vitest + Testing Library. Los archivos de prueba se ubican junto al código bajo prueba (co-localización), en lugar de en un directorio de pruebas separado. Cada prueba sigue el patrón Arrange-Act-Assert (AAA) y utiliza el patrón Object Mother para la construcción de los datos/objetos de prueba. Se exige una cobertura de pruebas mínima del 80%. Toda prueba debe ser aislada (sin depender de estado compartido con otras pruebas) y determinista (mismo resultado en cada ejecución, sin depender de tiempo real, red, orden de ejecución u otros factores externos).

## Consecuencias

### Positivas

- Suite de pruebas rápida y confiable gracias a Vitest.
- Las pruebas quedan centradas en el comportamiento observable por quien usa el código (Testing Library) en lugar de detalles de implementación.
- La co-localización facilita encontrar y mantener las pruebas junto al código que verifican.
- El patrón Object Mother produce fixtures de prueba reutilizables y legibles.
- El umbral de cobertura del 80% actúa como red de seguridad mínima frente a regresiones.

### Negativas / trade-offs

- Perseguir el umbral de cobertura como número puede incentivar pruebas de bajo valor si no se vigila también su calidad.
- El patrón Object Mother requiere mantenimiento propio a medida que evolucionan los modelos de datos del dominio.

## Referencias

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [ADR-008: Uso de Playwright para las pruebas E2E](ADR-008-uso-de-playwright-para-e2e.md)
