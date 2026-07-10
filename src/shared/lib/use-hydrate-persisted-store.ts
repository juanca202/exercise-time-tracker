import { useEffect } from "react";

interface PersistedStoreApi {
  persist: { rehydrate: () => unknown };
}

/**
 * Dispara la rehidratación (solo en cliente) de un store de Zustand creado
 * con `persist({ skipHydration: true })` (ADR-011). Evita que la lectura
 * síncrona de `localStorage` se ejecute durante el render de hidratación de
 * Next.js: sin esto, el HTML prerenderizado (sin acceso a `localStorage`)
 * no coincide con el primer render del cliente en cuanto existe algún dato
 * persistido, produciendo un hydration mismatch de React.
 */
export function useHydratePersistedStore(store: PersistedStoreApi): void {
  useEffect(() => {
    store.persist.rehydrate();
  }, [store]);
}
