# ADR-008: Uso de Playwright para las pruebas E2E

Estado: Accepted
Fecha de creación: 2026-07-06
Última actualización: 2026-07-06
Decisores: Equipo de desarrollo
Etiquetas: testing, e2e, playwright

## Contexto

Las pruebas unitarias (ver [ADR-007](ADR-007-estrategia-pruebas-unitarias.md)) validan unidades de código de forma aislada, pero no garantizan que los flujos completos de usuario funcionen correctamente de punta a punta a través de un navegador real. El proyecto necesita una herramienta de automatización end-to-end común para validar estos flujos críticos, en lugar de dejar la elección librada a cada feature.

## Decision

Las pruebas end-to-end del proyecto se implementan con Playwright. No se introducen otras herramientas de automatización E2E (Cypress, Selenium, Puppeteer, etc.) como convención vigente.

## Consecuencias

### Positivas

- Soporte multi-navegador (Chromium, Firefox, WebKit) desde una misma API de pruebas.
- Ejecución paralela nativa y trazas/reportes integrados que facilitan depurar fallos.

### Negativas / trade-offs

- Las pruebas E2E son más lentas y costosas de mantener que las unitarias.
- Requieren infraestructura de CI capaz de ejecutar navegadores headless.

## Referencias

- [Playwright Documentation](https://playwright.dev/)
- [ADR-007: Estrategia de pruebas unitarias](ADR-007-estrategia-pruebas-unitarias.md)
