/** Paleta on-brand (DESIGN.md, tema "Precision Focus") usada por {@link colorFromString}. */
const ACCENT_PALETTE = ["#182442", "#006c4b", "#16263a", "#75777e"] as const;

/**
 * Deriva un color determinístico de la paleta de marca a partir de un string.
 *
 * El mismo valor de entrada siempre retorna el mismo color, sin necesidad de
 * almacenar ese color junto a la entidad (p. ej. útil para acentos visuales
 * derivados del nombre de un Proyecto o una Tarea).
 */
export function colorFromString(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % ACCENT_PALETTE.length;
  return ACCENT_PALETTE[index];
}
