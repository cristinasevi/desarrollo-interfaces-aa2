import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext.tsx';
import { useFavorites } from '../contexts/FavoritesContext.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import './Navigation.css';

export default function Navigation() {
  const { theme, toggleTheme } = useTheme()!;
  const { favorites } = useFavorites();
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navigation">
      <div className="navigation__container">
        <Link to="/" className="navigation__logo">
          🎬 CineScope
        </Link>

        <div className="navigation__links">
          <Link to="/">Inicio</Link>
          <Link to="/search">Buscar</Link>
          {usuario && (
            <Link to="/favorites">
              Favoritos
              {favorites.length > 0 && (
                <span className="navigation__badge">{favorites.length}</span>
              )}
            </Link>
          )}
          {/* Perfil solo para usuarios normales */}
          {usuario && usuario.rol === 'user' && (
            <Link to="/perfil">Mi perfil</Link>
          )}
          {/* Panel moderador (accesible también por admin) */}
          {usuario?.rol === 'moderator' && (
            <Link to="/moderador">Panel</Link>
          )}
          {/* Dashboard solo para admin */}
          {usuario?.rol === 'admin' && (
            <>
              <Link to="/moderador">Panel</Link>
              <Link to="/admin">Dashboard</Link>
            </>
          )}
        </div>

        <div className="navigation__actions">
          {usuario ? (
            <div className="navigation__user">
              <span className="navigation__username">
                {usuario.rol === 'admin' && '🛡️'}
                {usuario.rol === 'moderator' && '🎭'}
                {usuario.rol === 'user' && '👤'}
                {' '}{usuario.nombre}
              </span>
              <button className="navigation__logout" onClick={handleLogout}>
                Salir
              </button>
            </div>
          ) : (
            <div className="navigation__auth">
              <Link to="/login" className="navigation__login">Entrar</Link>
              <Link to="/registro" className="navigation__register">Registro</Link>
            </div>
          )}
          <button
            className="navigation__theme"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}
