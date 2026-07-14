## 1. Tipos de dominio compartidos

- [x] 1.1 Crear el módulo `src/shared/domain/` con los tipos completos de `Proyecto`, `Tarea` (relación obligatoria con `Proyecto`), `RegistroDeTiempo` (relación obligatoria con `Tarea`) y `TemporizadorActivo`, sin campos placeholder ni "por definir" (AC-001).
- [x] 1.2 Exportar un `index.ts` (o barrel equivalente) desde `src/shared/domain/` para que Proyectos, Tareas e Historial de registros importen los tipos desde un único punto.
- [x] 1.3 Escribir pruebas unitarias (Vitest, co-localizadas según ADR-007) que verifiquen que los tipos exportados cubren los campos y relaciones exigidos (p. ej. mediante tipos de utilidad o fixtures Object Mother que instancien cada entidad completa).

## 2. Adaptador de persistencia local

- [x] 2.1 Crear `src/shared/persistence/` con el tipo `EstadoPersistido` (colecciones de Proyecto, Tarea, RegistroDeTiempo, TemporizadorActivo, más campo `version` de esquema).
- [x] 2.2 Implementar la operación de lectura (`leer`) del estado persistido desde el almacenamiento local del navegador.
- [x] 2.3 Implementar la operación de escritura (`escribir`) del estado completo al almacenamiento local (AC-002, BR-02).
- [x] 2.4 Implementar la operación de suscripción (`suscribir`) que notifica cambios externos del estado persistido y devuelve una función de desuscripción.
- [x] 2.5 Escribir pruebas unitarias (Vitest + fixtures Object Mother) que verifiquen lectura, escritura, suscripción/desuscripción y presencia del campo `version` en el estado persistido.

## 3. Store raíz con CRUD crudo por entidad

- [x] 3.1 Crear el store raíz con Zustand en `src/shared/store/` integrando el adaptador de persistencia (middleware `persist` o equivalente) sobre el módulo de la sección 2.
- [x] 3.2 Exponer operaciones CRUD crudas tipadas de creación, actualización y listado para Proyecto, Tarea y Registro de Tiempo, sin validación ni reglas de negocio propias de ninguna historia funcional (AC-003, BR-01).
- [x] 3.3 Exponer el indicador de hidratación (`haHidratado`) en el store raíz, en `false` hasta completar la rehidratación desde el adaptador de persistencia, y en `true` una vez finalizada (AC-004).
- [x] 3.4 Implementar, en el punto de arranque de la aplicación, la solicitud best-effort de almacenamiento persistente al navegador (`navigator.storage?.persist?.()`) sin bloquear el render (AC-005).
- [x] 3.5 Escribir pruebas unitarias (Vitest) que verifiquen: creación/actualización/listado crudos por entidad sin validación adicional, transición correcta de `haHidratado` de `false` a `true`, y que la solicitud de almacenamiento persistente no falla ni bloquea cuando la API no existe en el entorno de prueba.

## 4. Helper compartido de mes calendario

- [x] 4.1 Crear `src/shared/date/mes-calendario.ts` con una función pura que reciba un `RegistroDeTiempo` (o su fecha) y devuelva su mes calendario en un formato único y estable (AC-006).
- [x] 4.2 Exportar la función desde el barrel de `src/shared/date/` (o `src/shared/` según convención elegida) para que Tareas e Historial de registros la importen desde el mismo punto.
- [x] 4.3 Escribir pruebas unitarias (Vitest, casos límite: fin/inicio de mes, distintos años) que verifiquen que la función devuelve el mismo resultado para el mismo registro sin importar quién la invoque.

## 5. Layout de nivel superior y sidebar de navegación

- [x] 5.1 Extraer del frame Figma "Aside - SideNavBar" los tokens de diseño (colores, tipografía, espaciado) relevantes y mapearlos a la configuración de Tailwind CSS (ADR-002).
- [x] 5.2 Construir el componente de sidebar en `src/shared/ui/` (o ubicación equivalente) sobre primitivas de Base UI (ADR-003), con enlaces de navegación a `/tareas`, `/proyectos` y `/historial` usando `Link` de Next.js.
- [x] 5.3 Integrar el sidebar en `src/app/layout.tsx` como barra de navegación lateral fija visible en toda la aplicación (AC-007).
- [x] 5.4 Integrar en el layout raíz la invocación de la solicitud de almacenamiento persistente definida en la tarea 3.4, si no se ubicó ya ahí directamente.
- [x] 5.5 Verificar y ajustar visualmente el sidebar contra el frame Figma "Aside - SideNavBar" hasta lograr fidelidad en colores, tipografía, espaciado y componentes (AC-012).
- [x] 5.6 Escribir pruebas unitarias (Testing Library) que verifiquen que el sidebar renderiza los tres enlaces de navegación y que cada uno apunta a su ruta final correspondiente.

## 6. Rutas stub de las tres secciones

- [x] 6.1 Crear la ruta `src/app/tareas/page.tsx` con una página placeholder "Próximamente", sin gate de autenticación (AC-008, AC-009).
- [x] 6.2 Crear la ruta `src/app/proyectos/page.tsx` con una página placeholder "Próximamente", sin gate de autenticación (AC-008, AC-009).
- [x] 6.3 Crear la ruta `src/app/historial/page.tsx` con una página placeholder "Próximamente", sin gate de autenticación (AC-008, AC-009).
- [x] 6.4 Escribir pruebas E2E (Playwright, ADR-008) que naveguen desde el layout raíz a `/tareas`, `/proyectos` y `/historial` usando el sidebar, verificando que cada ruta resuelve sin error y sin pasar por ninguna pantalla de login.

## 7. Verificación final de la base compartida

- [x] 7.1 Ejecutar la suite de pruebas unitarias completa (`npm run test:run`) y confirmar cobertura mínima del 80% sobre los módulos nuevos (ADR-007).
- [x] 7.2 Ejecutar las pruebas E2E (`npm run test:e2e`) con la red deshabilitada en el entorno de prueba para confirmar que layout, sidebar y las 3 rutas funcionan sin depender de servicios externos (AC-011).
- [x] 7.3 Ejecutar lint y verificación de formato (`npm run lint`, `npm run format:check`) sobre todos los módulos nuevos (ADR-009).
- [x] 7.4 Revisar manualmente que ningún archivo fuera de `src/shared/domain/`, `src/shared/persistence/`, `src/shared/store/`, `src/shared/date/`, `src/shared/ui/`, `src/app/layout.tsx` y las 3 rutas stub necesitó modificarse para completar esta historia, confirmando el alcance acotado exigido por BR-03/AC-010.
