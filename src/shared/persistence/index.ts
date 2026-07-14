export type { EstadoPersistido } from "./estado-persistido";
export {
  crearEstadoPersistidoInicial,
  VERSION_ESQUEMA_ACTUAL,
} from "./estado-persistido";
export {
  leerEstadoPersistido,
  escribirEstadoPersistido,
  suscribirEstadoPersistido,
} from "./local-storage-adapter";
