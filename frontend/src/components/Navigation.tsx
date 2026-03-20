import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext.tsx';
import { useFavorites } from '../contexts/FavoritesContext.tsx';
import './Navigation.css';

export default function Navigation() {
  const { theme, toggleTheme } = useTheme()!;
  const { favorites } = useFavorites();

  return (
    <nav className="navigation">
      <div className="navigation__container">
        <Link to="/" className="navigation__logo">
          🎬 CineScope
        </Link>

        <div className="navigation__links">
          <Link to="/">Inicio</Link>
          <Link to="/search">Buscar</Link>
          <Link to="/favorites">
            Favoritos
            {favorites.length > 0 && (
              <span className="navigation__badge">{favorites.length}</span>
            )}
          </Link>
        </div>

        <button
          className="navigation__theme"
          onClick={toggleTheme}
          aria-label="Cambiar tema"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}
