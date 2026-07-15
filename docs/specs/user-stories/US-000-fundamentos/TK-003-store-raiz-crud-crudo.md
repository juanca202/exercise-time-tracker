# TK-003: Store raíz compartido (CRUD crudo)

**Estado**: Ready
**Historia**: [US-000](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Exponer, en un store raíz compartido, operaciones CRUD crudas de creación, actualización y listado para cada entidad (Proyecto, Tarea, Registro de Tiempo), sin aplicar validación ni reglas de negocio propias de cada historia funcional, de modo que sea la única superficie de API estable que consumen Proyectos, Tareas e Historial de registros.

## Dependencias

- [TK-001: Tipos de dominio compartidos](TK-001-tipos-dominio-compartidos.md) — el store persiste y expone `Proyecto`, `Tarea` y `RegistroDeTiempo`.
- [TK-002: Adaptador de persistencia local](TK-002-adaptador-persistencia-local.md) — el store usa `crearAdaptadorLocalStorage` como motor de almacenamiento del middleware `persist` de Zustand, y `useHasHydrated` como gate de hidratación en los componentes que lo consuman.
- Zustand (`zustand`, `zustand/middleware`) — creación del store y persistencia.

## Referencias

- **Arquitectura:** [ADR-004: Uso de Zustand para manejo de estado](../../../adr/ADR-004-uso-de-zustand.md), [ADR-005: Arquitectura del proyecto basada en features](../../../adr/ADR-005-arquitectura-feature-based.md) (ubicación en módulo compartido), [ADR-007: Estrategia de pruebas unitarias](../../../adr/ADR-007-estrategia-pruebas-unitarias.md).

## Archivos afectados

```text
exercise-time-tracker/
└── src/
    └── shared/
        └── store/
            ├── + app-store.ts        # useAppStore: estado + CRUD crudo (crear/actualizar) por entidad
            └── + app-store.test.ts   # cobertura de crear/actualizar/listar por entidad
```

## Plan de implementación

- [ ] **IT-01** — Crear `useAppStore` con Zustand (`create`) y el middleware `persist`, implementando su opción `storage` (`PersistStorage`) como un adaptador delgado que delega `getItem`/`setItem` en `read()`/`write()` del `AdaptadorPersistencia` creado con `crearAdaptadorLocalStorage<AppStoreState>("time-tracker/app-store", 1)` (TK-002).
      El campo `version` del adaptador (TK-002) actúa como versión de esquema del store (AC-002).
- [ ] **IT-02** — Definir el estado `{ proyectos: Proyecto[]; tareas: Tarea[]; registrosDeTiempo: RegistroDeTiempo[] }`, con arrays vacíos como valor inicial antes de hidratar.
- [ ] **IT-03** — Exponer `crearProyecto(proyecto: Proyecto): void`, `actualizarProyecto(id: string, cambios: Partial<Omit<Proyecto, "id">>): void` y el selector `useProyectos(): Proyecto[]` (lee `proyectos` del store) — sin validar campos ni aplicar reglas de negocio propias de una historia funcional (BR-01).
- [ ] **IT-04** — Exponer `crearTarea(tarea: Tarea): void`, `actualizarTarea(id: string, cambios: Partial<Omit<Tarea, "id">>): void` y el selector `useTareas(): Tarea[]`, con las mismas restricciones que IT-03.
- [ ] **IT-05** — Exponer `crearRegistroDeTiempo(registro: RegistroDeTiempo): void`, `actualizarRegistroDeTiempo(id: string, cambios: Partial<Omit<RegistroDeTiempo, "id">>): void` y el selector `useRegistrosDeTiempo(): RegistroDeTiempo[]`, con las mismas restricciones que IT-03.
- [ ] **IT-06** — Suscribirse al adaptador de persistencia (`subscribe` de TK-002) para re-sincronizar el estado del store cuando los datos cambian en otra pestaña del navegador.
- [ ] **IT-07** — Cubrir con pruebas Vitest (ADR-007) cada operación cruda (`crear*`, `actualizar*`, selectores `use*`) por entidad, verificando que ninguna aplica validación ni transformación adicional sobre los datos recibidos.
