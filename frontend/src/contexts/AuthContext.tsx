import { createContext, useContext, useEffect, useReducer } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Tipos
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'user' | 'moderator' | 'admin';
}

interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  cargando: boolean;
}

type AuthAction =
  | { type: 'LOGIN'; payload: { usuario: Usuario; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_CARGANDO'; payload: boolean };

// Reducer
export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        usuario: action.payload.usuario,
        token: action.payload.token,
        cargando: false,
      };
    case 'LOGOUT':
      return { usuario: null, token: null, cargando: false };
    case 'SET_CARGANDO':
      return { ...state, cargando: action.payload };
    default:
      return state;
  }
}

// Context
const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    usuario: null,
    token: localStorage.getItem('token'),
    cargando: true,
  });

  // Al arrancar, verificar si el token guardado sigue siendo válido
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: 'SET_CARGANDO', payload: false });
      return;
    }

    axios.get(`${API_URL}/auth/perfil`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        dispatch({ type: 'LOGIN', payload: { usuario: res.data.usuario, token } });
      })
      .catch(() => {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
      });
  }, []);

  const login = async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    const { token, usuario } = res.data;
    localStorage.setItem('token', token);
    dispatch({ type: 'LOGIN', payload: { usuario, token } });
    return usuario;
  };

  const registro = async (nombre: string, email: string, password: string) => {
    const res = await axios.post(`${API_URL}/auth/registro`, { nombre, email, password });
    const { token, usuario } = res.data;
    localStorage.setItem('token', token);
    dispatch({ type: 'LOGIN', payload: { usuario, token } });
    return usuario;
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, registro, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
