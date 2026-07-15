/**
 * Estado vacío de la pantalla de Historial de registros (AC-001).
 *
 * Se muestra tanto cuando el almacenamiento local no tiene ningún Registro
 * de Tiempo persistido (arreglo vacío) como cuando falló por completo el
 * parseo del storage (JSON inválido): el adaptador de persistencia
 * compartido (`@/shared/persistence`) degrada un storage corrupto al mismo
 * estado vacío que un historial legítimamente sin Registros —no distingue
 * ambos casos—, por lo que ambos se resuelven a este mismo estado legible
 * en lugar de una pantalla en blanco o un crash.
 */
export function EstadoVacioHistorial() {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-2 rounded-precision-lg border border-dashed border-outline-variant bg-surface-container-lowest px-6 py-16 text-center"
    >
      <p className="text-body-lg font-semibold text-primary">
        No hay registros de tiempo aún
      </p>
      <p className="max-w-md text-body-md text-on-surface-variant">
        Los Registros de Tiempo que generes desde el temporizador o de forma
        manual aparecerán aquí.
      </p>
    </div>
  );
}
