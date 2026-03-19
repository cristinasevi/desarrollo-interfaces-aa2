import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext.tsx';
import { getImageUrl } from '../services/tmdbApi.ts';
import type { Movie } from '../types/movie.ts';
import './MovieCard.css';

export default function MovieCard({ movie }: { movie: Movie }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(movie.id);

  const handleFavoriteClick = (e: any) => {
    e.preventDefault();
    toggleFavorite(movie);
  };

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average.toFixed(1);

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="movie-card__poster">
        <img
          src={getImageUrl(movie.poster_path, 'w500')}
          alt={movie.title}
          loading="lazy"
        />
        <button
          className={`movie-card__favorite ${favorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
        >
          {favorite ? '❤️' : '🤍'}
        </button>
        <div className="movie-card__rating">
          <span>⭐</span>
          <span>{rating}</span>
        </div>
      </div>
      <div className="movie-card__info">
        <h3>{movie.title}</h3>
        <p>{year}</p>
      </div>
    </Link>
  );
}
