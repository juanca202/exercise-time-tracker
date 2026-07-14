/**
 * Estado vacío de la pantalla de Historial de registros (AC-001).
 *
 * Se muestra tanto cuando el almacenamiento local no tiene ningún Registro
 * de Tiempo persistido (arreglo vacío) como cuando falló por completo el
 * parseo del storage (JSON inválido): en ambos casos se degrada a este
 * mismo estado legible en lugar de una pantalla en blanco o un crash.
 */
export function EstadoVacioHistorial({
  huboErrorDeLectura = false,
}: {
  /** `true` cuando la causa es un fallo de parseo del storage, no un historial legítimamente vacío. */
  huboErrorDeLectura?: boolean;
}) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-2 rounded-precision-lg border border-dashed border-outline-variant bg-surface-container-lowest px-6 py-16 text-center"
    >
      <p className="text-base font-medium text-on-surface">
        No hay registros de tiempo aún
      </p>
      {huboErrorDeLectura ? (
        <p className="max-w-md text-sm text-on-surface-variant">
          No se pudieron leer los registros guardados en este dispositivo. Los
          datos guardados previamente podrían haberse dañado.
        </p>
      ) : (
        <p className="max-w-md text-sm text-on-surface-variant">
          Los Registros de Tiempo que generes desde el temporizador o de forma
          manual aparecerán aquí.
        </p>
      )}
    </div>
  );
}
