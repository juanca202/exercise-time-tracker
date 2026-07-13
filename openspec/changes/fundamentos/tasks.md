## 1. Tipos compartidos y persistencia

- [ ] 1.1 Definir los tipos de dominio (`Project`, `Task`, `TimeRecord`, `activeTimer`) en `src/shared/types`, completos desde el inicio — sin placeholders declarados a futuro.
- [ ] 1.2 Implementar el adaptador de storage de persistencia local en `src/shared/persistence` envolviendo `localStorage` detrás de una interfaz `get`/`set`/`subscribe`, incluyendo un campo `schemaVersion`.
- [ ] 1.3 Crear el store raíz de Zustand con el middleware `persist` conectado al adaptador de storage del punto 1.2.
- [ ] 1.4 Implementar el hook `useHasHydrated()` y gatear las lecturas de estado persistido detrás de él.
- [ ] 1.5 Llamar a `navigator.storage.persist()` al cargar la app.

## 2. CRUD crudo por entidad

- [ ] 2.1 Implementar `addProject`/`updateProject`/`listProjects` en el store raíz — sin validación, persistido de inmediato.
- [ ] 2.2 Implementar `addTask`/`updateTask`/`listTasks` en el store raíz — sin validación, persistido de inmediato.
- [ ] 2.3 Implementar `addTimeRecord`/`listTimeRecords` en el store raíz — sin validación, persistido de inmediato.
- [ ] 2.4 Verificar que los datos de las tres entidades sobreviven al reload a través del CRUD crudo (pruebas unitarias contra el store, sin UI involucrada todavía).

## 3. Helpers compartidos

- [ ] 3.1 Implementar `getRecordMonth(record: TimeRecord)` en `src/shared` (mes calendario del Start Time del registro, sin prorrateo), documentado con TSDoc según ADR-006 para que `tareas` e `historial-de-registros` lo importen de forma idéntica.

## 4. App shell y navegación

- [ ] 4.1 Scaffoldear `src/features/projects`, `src/features/tasks`, `src/features/history` según ADR-005 (puntos de entrada vacíos, sin contenido de pantalla).
- [ ] 4.2 Construir el layout compartido de nivel superior siguiendo el frame Figma "Aside - SideNavBar".
- [ ] 4.3 Construir el sidebar con los enlaces Proyectos / Tareas / Historial de registros, todos apuntando a sus rutas finales (`/proyectos`, `/tareas`, `/historial`).
- [ ] 4.4 Crear páginas stub para `/proyectos`, `/tareas`, `/historial`, cada una renderizando un placeholder mínimo de "Próximamente" para que las rutas resuelvan sin error.

## 5. Verificación

- [ ] 5.1 Confirmar que el app shell (layout + sidebar + las 3 rutas stub) es completamente usable con la red deshabilitada (offline-first).
- [ ] 5.2 Confirmar que no existe ningún gate de autenticación antes de llegar a ninguna sección.
- [ ] 5.3 Confirmar que `npm run build`, `npm run lint` y `npm run test:run` se ejecutan con éxito con las 3 rutas stub resolviendo sin error.
- [ ] 5.4 Confirmar que el AC-008 de US-001 (navegación del sidebar) se satisface de punta a punta.
- [ ] 5.5 Documentar (TSDoc según ADR-006, en los módulos de store/persistencia/layout/sidebar) que estos archivos son superficie de API estable para que `proyectos`, `tareas` e `historial-de-registros` consuman — no modifiquen — de modo que los changes downstream solo toquen sus propios archivos de feature.
