import type { EstadoPersistido } from "./estado-persistido";

/** Clave usada en el almacenamiento local del navegador. */
const CLAVE_ALMACENAMIENTO = "time-tracker:estado";

/**
 * Adaptador de persistencia local: expone una interfaz reducida y estable
 * (lectura, escritura, suscripción) sobre el almacenamiento local del
 * navegador (`localStorage`), sin exponer operaciones parciales por entidad
 * (eso es responsabilidad del store raíz).
 */
export interface AdaptadorPersistenciaLocal {
  /** Lee de forma síncrona el estado guardado, o `null` si no hay nada persistido aún. */
  leer(): EstadoPersistido | null;
  /** Escribe el estado completo en el almacenamiento local. */
  escribir(estado: EstadoPersistido): void;
  /**
   * Se suscribe a cambios externos del estado persistido (p. ej. desde otra
   * pestaña). Devuelve una función para desuscribirse.
   */
  suscribir(listener: (estado: EstadoPersistido) => void): () => void;
}

const hayAlmacenamientoLocalDisponible = (): boolean =>
  typeof globalThis !== "undefined" &&
  typeof (globalThis as { localStorage?: Storage }).localStorage !==
    "undefined";

/**
 * Crea el adaptador de persistencia local basado en `localStorage`. Es seguro
 * de instanciar en el servidor: toda operación verifica primero la
 * disponibilidad de `localStorage`.
 */
export const crearAdaptadorPersistenciaLocal =
  (): AdaptadorPersistenciaLocal => ({
    leer(): EstadoPersistido | null {
      if (!hayAlmacenamientoLocalDisponible()) {
        return null;
      }

      const contenidoCrudo =
        globalThis.localStorage.getItem(CLAVE_ALMACENAMIENTO);

      if (!contenidoCrudo) {
        return null;
      }

      try {
        return JSON.parse(contenidoCrudo) as EstadoPersistido;
      } catch {
        return null;
      }
    },

    escribir(estado: EstadoPersistido): void {
      if (!hayAlmacenamientoLocalDisponible()) {
        return;
      }

      globalThis.localStorage.setItem(
        CLAVE_ALMACENAMIENTO,
        JSON.stringify(estado),
      );
    },

    suscribir(listener: (estado: EstadoPersistido) => void): () => void {
      if (
        typeof globalThis === "undefined" ||
        typeof globalThis.addEventListener !== "function"
      ) {
        return () => {};
      }

      const manejarEventoStorage = (evento: StorageEvent): void => {
        if (evento.key !== CLAVE_ALMACENAMIENTO || !evento.newValue) {
          return;
        }

        try {
          listener(JSON.parse(evento.newValue) as EstadoPersistido);
        } catch {
          // Estado corrupto proveniente de otra pestaña: se ignora.
        }
      };

      globalThis.addEventListener("storage", manejarEventoStorage);

      return () => {
        globalThis.removeEventListener("storage", manejarEventoStorage);
      };
    },
  });

/** Instancia compartida del adaptador de persistencia local. */
export const adaptadorPersistenciaLocal = crearAdaptadorPersistenciaLocal();
