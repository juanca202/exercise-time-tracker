/**
 * Genera un identificador único para entidades del dominio de Time Tracking.
 *
 * Usa `crypto.randomUUID` cuando está disponible; si no, recurre a un
 * generador basado en timestamp + aleatoriedad (entornos sin Web Crypto).
 */
export function generateId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
