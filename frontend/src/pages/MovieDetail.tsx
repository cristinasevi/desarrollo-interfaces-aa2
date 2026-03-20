import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetail, getMovieCredits, getSimilarMovies, getImageUrl } from '../services/tmdbApi.ts';
import { useFavorites } from '../contexts/FavoritesContext.tsx';
import MovieGrid from '../components/MovieGrid.tsx';
import Loading from '../components/Loading.tsx';
import type { MovieDetail as MovieDetailType, CastMember, Movie } from '../types/movie.ts';
import './MovieDetail.css';

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const { isFavorite, toggleFavorite } = useFavorites()!;
  
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchMovieData = async () => {
      setLoading(true);
      setError('');

      try {
        const movieData = await getMovieDetail(Number(id));
        const castData = await getMovieCredits(Number(id));
        const similarData = await getSimilarMovies(Number(id));

        setMovie(movieData);
        setCast(castData.slice(0, 6)); // Solo los primeros 6 actores
        setSimilar(similarData.results.slice(0, 6)); // Solo 6 películas similares
      } catch (err) {
        setError('Error al cargar la película');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="movie-detail__error">
        <h2>😢 {error}</h2>
        <Link to="/" className="movie-detail__back">
          Volver al inicio
        </Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-detail__error">
        <h2>😢 Película no encontrada</h2>
        <Link to="/" className="movie-detail__back">Volver al inicio</Link>
      </div>
    );
  }

  const favorite = isFavorite(movie.id);
  const year = new Date(movie.release_date).getFullYear();
  const rating = movie.vote_average.toFixed(1);
  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;

  return (
    <div className="movie-detail">
      {/* Backdrop */}
      <div 
        className="movie-detail__backdrop"
        style={{ backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'original')})` }}
      >
        <div className="movie-detail__backdrop-overlay"></div>
      </div>

      {/* Contenido principal */}
      <div className="movie-detail__content">
        <div className="movie-detail__header">
          <img
            src={getImageUrl(movie.poster_path, 'w500')}
            alt={movie.title}
            className="movie-detail__poster"
          />

          <div className="movie-detail__info">
            <h1>{movie.title}</h1>
            
            <div className="movie-detail__meta">
              <span className="movie-detail__rating">
                ⭐ {rating}
              </span>
              <span>{year}</span>
              <span>{hours}h {minutes}min</span>
              <span>{movie.original_language.toUpperCase()}</span>
            </div>

            <div className="movie-detail__genres">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>

            <button
              className={`movie-detail__favorite ${favorite ? 'active' : ''}`}
              onClick={() => toggleFavorite(movie)}
            >
              {favorite ? '❤️ En favoritos' : '🤍 Añadir a favoritos'}
            </button>

            <div className="movie-detail__overview">
              <h2>Sinopsis</h2>
              <p>{movie.overview || 'No hay sinopsis disponible.'}</p>
            </div>
          </div>
        </div>

        {/* Reparto */}
        {cast.length > 0 && (
          <section className="movie-detail__section">
            <h2>Reparto principal</h2>
            <div className="movie-detail__cast">
              {cast.map((actor) => (
                <div key={actor.id} className="cast-card">
                  <img
                    src={getImageUrl(actor.profile_path, 'w200')}
                    alt={actor.name}
                  />
                  <div className="cast-card__info">
                    <h4>{actor.name}</h4>
                    <p>{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Películas similares */}
        {similar.length > 0 && (
          <section className="movie-detail__section">
            <h2>Películas similares</h2>
            <MovieGrid movies={similar} />
          </section>
        )}
      </div>
    </div>
  );
}
