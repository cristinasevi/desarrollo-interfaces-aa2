import { describe, it, expect } from "vitest";
import { authReducer } from "../contexts/AuthContext";

describe("authReducer", () => {
  const estadoInicial = {
    usuario: null,
    token: null,
    cargando: true,
  };

  it("LOGIN guarda el usuario y el token", () => {
    const usuario = { id: 1, nombre: "Cristina", email: "c@test.com", rol: "user" as const };

    const nuevoEstado = authReducer(estadoInicial, {
      type: "LOGIN",
      payload: { usuario, token: "abc123" },
    });

    expect(nuevoEstado.usuario).toEqual(usuario);
    expect(nuevoEstado.token).toBe("abc123");
    expect(nuevoEstado.cargando).toBe(false);
  });

  it("LOGIN funciona con rol admin", () => {
    const usuario = { id: 2, nombre: "Admin", email: "a@test.com", rol: "admin" as const };

    const nuevoEstado = authReducer(estadoInicial, {
      type: "LOGIN",
      payload: { usuario, token: "token-admin" },
    });

    expect(nuevoEstado.usuario?.rol).toBe("admin");
  });

  it("LOGIN funciona con rol moderator", () => {
    const usuario = { id: 3, nombre: "Mod", email: "m@test.com", rol: "moderator" as const };

    const nuevoEstado = authReducer(estadoInicial, {
      type: "LOGIN",
      payload: { usuario, token: "token-mod" },
    });

    expect(nuevoEstado.usuario?.rol).toBe("moderator");
  });

  it("LOGOUT limpia el usuario y el token", () => {
    const estadoLogueado = {
      usuario: { id: 1, nombre: "Cristina", email: "c@test.com", rol: "user" as const },
      token: "abc123",
      cargando: false,
    };

    const nuevoEstado = authReducer(estadoLogueado, { type: "LOGOUT" });

    expect(nuevoEstado.usuario).toBeNull();
    expect(nuevoEstado.token).toBeNull();
    expect(nuevoEstado.cargando).toBe(false);
  });

  it("SET_CARGANDO actualiza el flag", () => {
    const nuevoEstado = authReducer(estadoInicial, {
      type: "SET_CARGANDO",
      payload: false,
    });

    expect(nuevoEstado.cargando).toBe(false);
  });

  it("una acción desconocida devuelve el estado sin cambios", () => {
    const nuevoEstado = authReducer(estadoInicial, { type: "DESCONOCIDA" } as any);

    expect(nuevoEstado).toEqual(estadoInicial);
  });
});
