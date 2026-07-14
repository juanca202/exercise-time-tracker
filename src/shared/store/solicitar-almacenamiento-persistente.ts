/**
 * Solicita al navegador almacenamiento persistente de forma best-effort
 * (AC-005): no bloquea el render, no requiere que el usuario conceda permiso
 * explícito, y su resultado (concedido o no) no condiciona ninguna
 * funcionalidad. No hace nada si la API no existe en el navegador.
 */
export function solicitarAlmacenamientoPersistente(): void {
  if (
    typeof navigator === "undefined" ||
    navigator.storage?.persist === undefined
  ) {
    return;
  }

  navigator.storage.persist().catch(() => {
    // Best-effort: se ignora tanto el rechazo de la promesa como la denegación
    // del permiso, ya que ninguna funcionalidad depende de este resultado.
  });
}
