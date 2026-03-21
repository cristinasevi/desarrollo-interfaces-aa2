import { describe, it, expect } from 'vitest';

// Test del reducer de autenticación
import { authReducer } from '../contexts/AuthContext';

describe('authReducer', () => {
  const estadoInicial = {
    usuario: null,
    token: null,
    cargando: true,
  };

  it('debe manejar LOGIN correctamente', () => {
    const usuario = { id: 1, nombre: 'Cristina', email: 'cristina@test.com', rol: 'user' as const };
    const token = 'token123';

    const nuevoEstado = authReducer(estadoInicial, {
      type: 'LOGIN',
      payload: { usuario, token },
    });

    expect(nuevoEstado.usuario).toEqual(usuario);
    expect(nuevoEstado.token).toBe(token);
    expect(nuevoEstado.cargando).toBe(false);
  });

  it('debe manejar LOGOUT correctamente', () => {
    const estadoLogueado = {
      usuario: { id: 1, nombre: 'Cristina', email: 'cristina@test.com', rol: 'user' as const },
      token: 'token123',
      cargando: false,
    };

    const nuevoEstado = authReducer(estadoLogueado, { type: 'LOGOUT' });

    expect(nuevoEstado.usuario).toBeNull();
    expect(nuevoEstado.token).toBeNull();
    expect(nuevoEstado.cargando).toBe(false);
  });

  it('debe manejar SET_CARGANDO correctamente', () => {
    const nuevoEstado = authReducer(estadoInicial, {
      type: 'SET_CARGANDO',
      payload: false,
    });

    expect(nuevoEstado.cargando).toBe(false);
  });

  it('no debe modificar el estado con una acción desconocida', () => {
    const nuevoEstado = authReducer(estadoInicial, { type: 'DESCONOCIDA' } as any);
    expect(nuevoEstado).toEqual(estadoInicial);
  });
});
