/** Hash djb2 (unsigned 32-bit). */
function hashString(input: string): number {
  let hash = 5381;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 33) ^ input.charCodeAt(index);
  }
  return hash >>> 0;
}

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

/** Convierte HSL (h 0–360, s/l 0–100) a hex `#rrggbb`. */
function hslToHex(hue: number, saturation: number, lightness: number): string {
  const s = saturation / 100;
  const l = lightness / 100;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const huePrime = hue / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));
  const m = l - chroma / 2;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (huePrime < 1) {
    red = chroma;
    green = x;
  } else if (huePrime < 2) {
    red = x;
    green = chroma;
  } else if (huePrime < 3) {
    green = chroma;
    blue = x;
  } else if (huePrime < 4) {
    green = x;
    blue = chroma;
  } else if (huePrime < 5) {
    red = x;
    blue = chroma;
  } else {
    red = chroma;
    blue = x;
  }

  const toHex = (channel: number) =>
    clampByte((channel + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

/**
 * Genera un color CSS hex vivo y determinista a partir de un string
 * (mismo input → mismo color; inputs distintos tienden a hues distintos).
 */
export function colorFromString(input: string): string {
  const hash = hashString(input);
  // Ángulo áureo ≈ 137.508° reparte mejor los tonos que `hash % 360` solo.
  const hue = Math.round((hash * 137.508) % 360);
  const saturation = 72 + (hash % 16); // 72–87 %
  // Amarillos/verdes claros se perciben más luminosos: bajar L en ese rango.
  const baseLightness = 38 + ((hash >>> 10) % 8); // 38–45 %
  const lightness =
    hue >= 40 && hue <= 100 ? Math.min(baseLightness, 36) : baseLightness;

  return hslToHex(hue, saturation, lightness);
}

/** Indica si un color hex es lo bastante claro como para usar tinta oscura encima. */
export function isLightColor(hex: string): boolean {
  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return luminance > 0.6;
}
