import { describe, expect, it } from "vitest";
import { crearRegistroDeTiempoDePrueba } from "@/shared/domain/object-mother";
import {
  calcularDuracionAcumuladaMinutos,
  obtenerUltimaActividad,
} from "./calcular-duracion-acumulada-tarea";

describe("calcularDuracionAcumuladaMinutos", () => {
  it("suma las Duraciones de todos los Registros de la Tarea", () => {
    const registros = [
      crearRegistroDeTiempoDePrueba({
        tareaId: "tarea-1",
        duracionMinutos: 120,
      }),
      crearRegistroDeTiempoDePrueba({
        tareaId: "tarea-1",
        duracionMinutos: 30,
      }),
      crearRegistroDeTiempoDePrueba({
        tareaId: "tarea-2",
        duracionMinutos: 999,
      }),
    ];

    expect(calcularDuracionAcumuladaMinutos(registros, "tarea-1")).toBe(150);
  });

  it("devuelve 0 cuando la Tarea no tiene ningún Registro", () => {
    expect(calcularDuracionAcumuladaMinutos([], "tarea-1")).toBe(0);
  });
});

describe("obtenerUltimaActividad", () => {
  it("devuelve el creadoEn más reciente entre los Registros de la Tarea", () => {
    const registros = [
      crearRegistroDeTiempoDePrueba({
        tareaId: "tarea-1",
        creadoEn: "2026-07-10T08:00:00.000Z",
      }),
      crearRegistroDeTiempoDePrueba({
        tareaId: "tarea-1",
        creadoEn: "2026-07-13T09:00:00.000Z",
      }),
      crearRegistroDeTiempoDePrueba({
        tareaId: "tarea-1",
        creadoEn: "2026-07-12T09:00:00.000Z",
      }),
    ];

    expect(obtenerUltimaActividad(registros, "tarea-1")).toBe(
      "2026-07-13T09:00:00.000Z",
    );
  });

  it("devuelve undefined cuando la Tarea no tiene ningún Registro", () => {
    expect(obtenerUltimaActividad([], "tarea-1")).toBeUndefined();
  });

  it("ignora los Registros de otras Tareas", () => {
    const registros = [
      crearRegistroDeTiempoDePrueba({
        tareaId: "tarea-2",
        creadoEn: "2026-07-13T09:00:00.000Z",
      }),
    ];

    expect(obtenerUltimaActividad(registros, "tarea-1")).toBeUndefined();
  });
});
