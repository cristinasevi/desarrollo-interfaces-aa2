import { useFavorites } from '../contexts/FavoritesContext.tsx';
import MovieGrid from '../components/MovieGrid.tsx';
import './Favorites.css';

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="favorites">
      <div className="favorites__header">
        <h1>Mis Favoritos</h1>
        <p>{favorites.length} película{favorites.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="favorites__content">
        {favorites.length === 0 ? (
          <div className="favorites__empty">
            <p>😢 No tienes películas favoritas</p>
            <p>Empieza a añadir películas haciendo clic en el corazón ❤️</p>
          </div>
        ) : (
          <MovieGrid movies={favorites} />
        )}
      </div>
    </div>
  );
}
