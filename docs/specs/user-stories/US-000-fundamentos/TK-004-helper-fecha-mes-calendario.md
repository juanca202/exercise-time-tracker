# TK-004: Helper de fecha — mes calendario

**Estado**: Ready
**Historia**: [US-000](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Proveer, en un único módulo compartido, el cálculo del mes calendario de un Registro de Tiempo, de modo que Tareas e Historial de registros lo consuman de forma idéntica sin duplicar la lógica ni depender entre sí para obtenerla.

## Dependencias

- [TK-001: Tipos de dominio compartidos](TK-001-tipos-dominio-compartidos.md) — el helper recibe el campo `fecha` de `RegistroDeTiempo`.

## Referencias

- **Arquitectura:** [ADR-005: Arquitectura del proyecto basada en features](../../../adr/ADR-005-arquitectura-feature-based.md) (ubicación en módulo compartido), [ADR-006: Documentación de código con TSDoc](../../../adr/ADR-006-documentacion-con-tsdoc.md), [ADR-007: Estrategia de pruebas unitarias](../../../adr/ADR-007-estrategia-pruebas-unitarias.md).

## Archivos afectados

```text
exercise-time-tracker/
└── src/
    └── shared/
        └── date/
            ├── + obtener-mes-calendario.ts        # obtenerMesCalendario(): clave "YYYY-MM" a partir de RegistroDeTiempo.fecha
            └── + obtener-mes-calendario.test.ts
```

## Plan de implementación

- [ ] **IT-01** — Implementar `obtenerMesCalendario(registro: Pick<RegistroDeTiempo, "fecha">): string`, que devuelve la clave del mes calendario en formato `"YYYY-MM"` a partir de `registro.fecha` (`"YYYY-MM-DD"`).
- [ ] **IT-02** — Documentar con TSDoc (ADR-006) el formato de entrada y salida, y que la función es pura: interpreta `fecha` como fecha calendario (no como instante), sin depender de la zona horaria del entorno de ejecución.
- [ ] **IT-03** — Cubrir con pruebas Vitest (ADR-007): primer día del mes, último día del mes y cambio de año (`"2026-12-31"` → `"2026-12"`, `"2027-01-01"` → `"2027-01"`).
