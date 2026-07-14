import {
  crearEstadoPersistidoInicial,
  VERSION_ESQUEMA_ACTUAL,
  type EstadoPersistido,
} from "./estado-persistido";

const CLAVE_ALMACENAMIENTO = "time-tracker:estado";

function estaDisponibleLocalStorage(): boolean {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

/**
 * Lee el estado persistido desde el almacenamiento local del dispositivo.
 *
 * Si no existe ningún estado previamente escrito, si el entorno no dispone
 * de `localStorage` (renderizado en servidor) o si el contenido almacenado
 * está corrupto, devuelve el estado inicial vacío sin lanzar excepciones.
 */
export function leerEstadoPersistido(): EstadoPersistido {
  if (!estaDisponibleLocalStorage()) {
    return crearEstadoPersistidoInicial();
  }

  const contenidoCrudo = window.localStorage.getItem(CLAVE_ALMACENAMIENTO);
  if (!contenidoCrudo) {
    return crearEstadoPersistidoInicial();
  }

  try {
    const estadoParseado = JSON.parse(
      contenidoCrudo,
    ) as Partial<EstadoPersistido>;
    return {
      ...crearEstadoPersistidoInicial(),
      ...estadoParseado,
      version: estadoParseado.version ?? VERSION_ESQUEMA_ACTUAL,
    };
  } catch {
    return crearEstadoPersistidoInicial();
  }
}

/**
 * Escribe el estado completo en el almacenamiento local del dispositivo.
 * No hace nada si el entorno no dispone de `localStorage` (renderizado en servidor).
 */
export function escribirEstadoPersistido(estado: EstadoPersistido): void {
  if (!estaDisponibleLocalStorage()) {
    return;
  }
  window.localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(estado));
}

/**
 * Se suscribe a cambios externos del estado persistido (p. ej. escritos desde
 * otra pestaña del navegador) y notifica al `listener` con el estado
 * actualizado. Devuelve una función de desuscripción.
 */
export function suscribirEstadoPersistido(
  listener: (estado: EstadoPersistido) => void,
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const manejador = (evento: StorageEvent): void => {
    if (evento.key !== CLAVE_ALMACENAMIENTO || !evento.newValue) {
      return;
    }
    try {
      listener(JSON.parse(evento.newValue) as EstadoPersistido);
    } catch {
      // Contenido corrupto proveniente de otra pestaña: se ignora la notificación.
    }
  };

  window.addEventListener("storage", manejador);
  return () => window.removeEventListener("storage", manejador);
}
