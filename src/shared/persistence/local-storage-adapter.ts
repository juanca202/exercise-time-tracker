/**
 * Único punto de acceso a `localStorage` del proyecto (ver ADR-011). Ninguna
 * otra feature o componente debe leer o escribir `localStorage` directamente;
 * el fitness function de ESLint bloquea ese acceso fuera de este módulo.
 */

const SCHEMA_VERSION = 1;

function buildKey(key: string): string {
  return `timetracker:v${SCHEMA_VERSION}:${key}`;
}

/** Interfaz mínima que necesita `zustand/middleware`'s `persist` (getItem/setItem/removeItem). */
export const localStorageAdapter = {
  getItem(key: string): string | null {
    if (typeof window === "undefined") {
      return null;
    }
    return window.localStorage.getItem(buildKey(key));
  },
  setItem(key: string, value: string): void {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(buildKey(key), value);
  },
  removeItem(key: string): void {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.removeItem(buildKey(key));
  },
};

/**
 * Suscribe a cambios de una clave persistida provenientes de otra pestaña del
 * navegador (evento `storage`). Devuelve la función de desuscripción.
 */
export function onStorageChange(key: string, callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const fullKey = buildKey(key);
  const handler = (event: StorageEvent) => {
    if (event.key === fullKey) {
      callback();
    }
  };

  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}
