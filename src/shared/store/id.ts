/**
 * Genera un identificador único y estable para una nueva entidad de dominio.
 * Usa `crypto.randomUUID()` cuando está disponible (navegadores modernos y
 * Node.js); recurre a un identificador aleatorio equivalente en su defecto.
 */
export const generarId = (): string => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};
