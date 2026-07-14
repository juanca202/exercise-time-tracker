import type { EstadoPersistido } from "./estado-persistido";

/**
 * Clave bajo la que se guarda el estado persistido en el almacenamiento
 * local. Se exporta únicamente para que los E2E (Playwright) puedan sembrar
 * `localStorage` con datos de prueba antes de que la aplicación arranque
 * (`page.addInitScript`), sin duplicar este literal ni acoplarse a un valor
 * que podría desincronizarse silenciosamente del adaptador real.
 */
export const CLAVE_ALMACENAMIENTO = "time-tracker:estado";

function hayAlmacenamientoLocalDisponible(): boolean {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

/**
 * Lee el estado persistido desde el almacenamiento local del navegador (AC-002).
 * Devuelve `null` si todavía no hay nada persistido, si el contenido guardado
 * no es JSON válido, o si el entorno no expone almacenamiento local (p. ej. el
 * servidor durante el renderizado inicial).
 */
export function leer(): EstadoPersistido | null {
  if (!hayAlmacenamientoLocalDisponible()) {
    return null;
  }

  const crudo = window.localStorage.getItem(CLAVE_ALMACENAMIENTO);
  if (crudo === null) {
    return null;
  }

  try {
    return JSON.parse(crudo) as EstadoPersistido;
  } catch {
    return null;
  }
}

/**
 * Escribe el estado completo en el almacenamiento local del navegador (AC-002,
 * BR-02), de modo que sobreviva a un cierre inesperado de la aplicación o a un
 * reinicio del dispositivo. No hace nada si el entorno no expone almacenamiento
 * local.
 */
export function escribir(estado: EstadoPersistido): void {
  if (!hayAlmacenamientoLocalDisponible()) {
    return;
  }

  window.localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(estado));
}

/**
 * Se suscribe a cambios externos del estado persistido (p. ej. escritos desde
 * otra pestaña) y devuelve una función para desuscribirse. No notifica los
 * cambios que la propia pestaña realiza mediante {@link escribir}, ya que el
 * evento `storage` del navegador solo se dispara en las demás pestañas.
 */
export function suscribir(
  listener: (estado: EstadoPersistido) => void,
): () => void {
  if (!hayAlmacenamientoLocalDisponible()) {
    return () => {};
  }

  const manejarCambioDeAlmacenamiento = (evento: StorageEvent): void => {
    if (evento.key !== null && evento.key !== CLAVE_ALMACENAMIENTO) {
      return;
    }

    const estadoActualizado = leer();
    if (estadoActualizado !== null) {
      listener(estadoActualizado);
    }
  };

  window.addEventListener("storage", manejarCambioDeAlmacenamiento);
  return () =>
    window.removeEventListener("storage", manejarCambioDeAlmacenamiento);
}
