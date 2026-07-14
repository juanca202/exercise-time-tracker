/**
 * Punto único de importación del adaptador de persistencia local. Expone
 * `leer`/`escribir`/`suscribir` como interfaz reducida y estable (BR-03): agregar
 * una entidad o un campo no cambia esta interfaz, solo el contenido de
 * `EstadoPersistido`.
 */
export { leer, escribir, suscribir } from "./adaptador";
export {
  crearEstadoPersistidoInicial,
  VERSION_ESQUEMA_ESTADO_PERSISTIDO,
  type EstadoPersistido,
} from "./estado-persistido";
