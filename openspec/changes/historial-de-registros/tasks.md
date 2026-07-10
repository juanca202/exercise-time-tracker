## 1. Selección de periodo y lectura de datos

- [x] 1.1 Definir el estado de UI local del mes seleccionado (por defecto: mes actual) y su navegación mes anterior / mes siguiente
- [x] 1.2 Implementar el filtrado de Registros de Tiempo por el mes seleccionado, leyendo el store de Tareas/Registros existente
- [x] 1.3 Implementar la función de agregación única (`groupBy`) sobre los Registros filtrados, que sirva de base a los totales por Tarea, Proyecto y mes
- [x] 1.4 Memoizar el resultado de la agregación por combinación de (periodo seleccionado, Registros de Tiempo, Proyectos)

## 2. Totales

- [x] 2.1 Calcular el total de tiempo acumulado por Tarea (incluyendo Tareas sin Registros como total cero)
- [x] 2.2 Calcular el total de tiempo acumulado por Proyecto dentro del periodo seleccionado (incluyendo Proyectos sin Registros en el periodo como total cero)
- [x] 2.3 Calcular el total de tiempo acumulado del mes seleccionado
- [x] 2.4 Calcular el resumen del periodo: total de registros, cantidad de proyectos involucrados (vía `Set` de `projectId`) y total de horas

## 3. Interfaz

- [x] 3.1 Construir el listado de Registros de Tiempo (Fecha, Proyecto, Tarea, Duración), conforme al prototipo de Figma
- [x] 3.2 Implementar el estado vacío del listado e historial cuando no hay Registros de Tiempo en el periodo
- [x] 3.3 Construir el control de navegación entre periodos (mes anterior / mes siguiente)
- [x] 3.4 Construir el resumen del periodo seleccionado (total de registros, proyectos involucrados, total de horas)

## 4. Verificación

- [x] 4.1 Pruebas unitarias de la función de agregación: por Tarea, por Proyecto y por mes, incluyendo los casos sin Registros — TC-003 a TC-009
- [x] 4.2 Pruebas de componente: listado con datos, estado vacío del historial, navegación entre meses — TC-001, TC-002, TC-008, TC-010, TC-011
- [x] 4.3 Pruebas del resumen del periodo, con y sin Registros — TC-012, TC-013
- [x] 4.4 Medir que la carga del historial con hasta 1000 Registros de Tiempo tome menos de 2 segundos — TC-014, TC-015
- [x] 4.5 Ejecutar `npm run lint` y la suite de pruebas unitarias antes de cerrar el change
