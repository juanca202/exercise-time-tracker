import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Proyecto, RegistroDeTiempo, Tarea } from "@/shared/domain/types";

/**
 * Estado y CRUD crudo del store raíz compartido (ADR-004).
 *
 * Expone únicamente operaciones de creación/reemplazo por entidad, sin
 * validación ni reglas de negocio propias de ninguna feature funcional: cada
 * feature (Proyectos, Tareas, Historial de registros) construye su propia
 * lógica de negocio componiendo sobre este CRUD.
 *
 * Persiste vía `localStorage` a través del middleware `persist` de Zustand
 * (RS-002): no se introduce IndexedDB ni otro adaptador para el volumen
 * actual (≤1000 Registros de Tiempo).
 */
export interface TimeTrackerState {
  proyectos: Proyecto[];
  tareas: Tarea[];
  registrosDeTiempo: RegistroDeTiempo[];
  agregarProyecto: (proyecto: Proyecto) => void;
  agregarTarea: (tarea: Tarea) => void;
  agregarRegistroDeTiempo: (registro: RegistroDeTiempo) => void;
  /** Reemplaza el arreglo completo de Registros de Tiempo (uso en siembra/tests). */
  establecerRegistrosDeTiempo: (registros: RegistroDeTiempo[]) => void;
  /** Reemplaza el arreglo completo de Tareas (uso en siembra/tests). */
  establecerTareas: (tareas: Tarea[]) => void;
  /** Reemplaza el arreglo completo de Proyectos (uso en siembra/tests). */
  establecerProyectos: (proyectos: Proyecto[]) => void;
}

export const TIME_TRACKER_STORAGE_KEY = "time-tracker-storage";

/** Snapshot expuesto por el external store de hidratación (ver más abajo). */
interface EstadoDeHidratacion {
  hasHydrated: boolean;
  parseError: boolean;
}

const ESTADO_INICIAL: EstadoDeHidratacion = {
  hasHydrated: false,
  parseError: false,
};

/**
 * External store minimalista (patrón `useSyncExternalStore`) para el
 * resultado de la última hidratación completada por Zustand `persist` en el
 * cliente. Es estado de módulo -- no un `useState`/efecto de React -- porque
 * `onRehydrateStorage` se invoca de forma síncrona durante la propia
 * evaluación del módulo, antes de que cualquier componente se monte.
 *
 * Se expone vía `useSyncExternalStore` (no `useEffect` + `setState`) para
 * evitar el anti-patrón de disparar una actualización de estado síncrona
 * dentro de un efecto (regla `react-hooks/set-state-in-effect`): aquí sí
 * corresponde un external store real, ya que la fuente de verdad
 * (`localStorage`/Zustand `persist`) vive fuera de React.
 */
let estadoDeHidratacion: EstadoDeHidratacion = ESTADO_INICIAL;
const listenersDeHidratacion = new Set<() => void>();

function publicarHidratacion(parseError: boolean): void {
  estadoDeHidratacion = { hasHydrated: true, parseError };
  listenersDeHidratacion.forEach((listener) => listener());
}

function suscribirseAHidratacion(listener: () => void): () => void {
  listenersDeHidratacion.add(listener);
  return () => listenersDeHidratacion.delete(listener);
}

function obtenerSnapshotDeHidratacion(): EstadoDeHidratacion {
  return estadoDeHidratacion;
}

function obtenerSnapshotDeHidratacionEnServidor(): EstadoDeHidratacion {
  // En el servidor nunca hay `localStorage`: la hidratación jamás ocurre.
  return ESTADO_INICIAL;
}

export const useTimeTrackerStore = create<TimeTrackerState>()(
  persist(
    (set) => ({
      proyectos: [],
      tareas: [],
      registrosDeTiempo: [],
      agregarProyecto: (proyecto) =>
        set((state) => ({ proyectos: [...state.proyectos, proyecto] })),
      agregarTarea: (tarea) =>
        set((state) => ({ tareas: [...state.tareas, tarea] })),
      agregarRegistroDeTiempo: (registro) =>
        set((state) => ({
          registrosDeTiempo: [...state.registrosDeTiempo, registro],
        })),
      establecerRegistrosDeTiempo: (registros) =>
        set({ registrosDeTiempo: registros }),
      establecerTareas: (tareas) => set({ tareas }),
      establecerProyectos: (proyectos) => set({ proyectos }),
    }),
    {
      name: TIME_TRACKER_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (_state, error) => {
        // Un JSON malformado en el storage llega aquí como `error` (ya
        // capturado internamente por Zustand): degradamos a estado vacío
        // (los arreglos permanecen en sus valores iniciales) en lugar de
        // dejar la app en un loading infinito o propagar la excepción.
        publicarHidratacion(Boolean(error));
        if (error) {
          console.error(
            "No se pudo hidratar los datos persistidos de Time Tracker; se usa un estado vacío.",
            error,
          );
        }
      },
    },
  ),
);

/**
 * Gate de hidratación: `true` una vez que Zustand `persist` terminó de leer
 * (o intentar leer) el storage local en el cliente.
 *
 * Implementado con `useSyncExternalStore` sobre el external store de
 * hidratación de arriba: durante el render de hidratación de Next.js, React
 * usa `obtenerSnapshotDeHidratacionEnServidor` (siempre `false`, igual que en
 * el servidor) para que el primer paint del cliente coincida con el HTML del
 * servidor; una vez montado, se resuscribe al store real y refleja el
 * resultado de la rehidratación de `localStorage` (RS-002). Esto evita el
 * hydration-mismatch de Next.js sin recurrir a `setState` dentro de un
 * `useEffect`. Todo componente que lea datos persistidos debe esperar a que
 * este hook devuelva `hasHydrated: true` antes de renderizar contenido
 * dependiente de esos datos.
 */
export function useHasHydrated(): EstadoDeHidratacion {
  return useSyncExternalStore(
    suscribirseAHidratacion,
    obtenerSnapshotDeHidratacion,
    obtenerSnapshotDeHidratacionEnServidor,
  );
}
