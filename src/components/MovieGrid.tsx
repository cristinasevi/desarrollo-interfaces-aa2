import MovieCard from '../components/MovieCard.tsx';
import type { Movie } from '../types/movie.ts';
import './MovieGrid.css';

export default function MovieGrid({ movies, title }: { movies: Movie[], title?: string }) {
  if (movies.length === 0) {
    return (
      <div className="movie-grid--empty">
        <p>No se encontraron películas</p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {title && <h2 className="movie-grid__title">{title}</h2>}
      <div className="movie-grid__container">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
