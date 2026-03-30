import { useState, useEffect } from 'react';
import { getOmdbData, getRottenTomatoesRating } from '../services/omdbApi';
import type { OmdbData } from '../services/omdbApi';
import './OmdbInfo.css';

interface Props {
  titulo: string;
  año: number;
}

export default function OmdbInfo({ titulo, año }: Props) {
  const [datos, setDatos] = useState<OmdbData | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    getOmdbData(titulo, año).then((data) => {
      setDatos(data);
      setCargando(false);
    });
  }, [titulo, año]);

  // Si no hay API key o no hay datos, no renderizar nada
  if (cargando || !datos) return null;

  const rt = getRottenTomatoesRating(datos.Ratings);

  return (
    <div className="omdb-info">
      <h2>Más información</h2>

      <div className="omdb-info__grid">
        {datos.Director && datos.Director !== 'N/A' && (
          <div className="omdb-info__item">
            <span className="omdb-info__label">🎬 Director</span>
            <span className="omdb-info__value">{datos.Director}</span>
          </div>
        )}

        {datos.Actors && datos.Actors !== 'N/A' && (
          <div className="omdb-info__item">
            <span className="omdb-info__label">🎭 Reparto</span>
            <span className="omdb-info__value">{datos.Actors}</span>
          </div>
        )}

        {datos.Country && datos.Country !== 'N/A' && (
          <div className="omdb-info__item">
            <span className="omdb-info__label">🌍 País</span>
            <span className="omdb-info__value">{datos.Country}</span>
          </div>
        )}

        {datos.BoxOffice && datos.BoxOffice !== 'N/A' && (
          <div className="omdb-info__item">
            <span className="omdb-info__label">💰 Recaudación</span>
            <span className="omdb-info__value">{datos.BoxOffice}</span>
          </div>
        )}

        {rt && (
          <div className="omdb-info__item">
            <span className="omdb-info__label">🍅 Rotten Tomatoes</span>
            <span className="omdb-info__value omdb-info__rt">{rt}</span>
          </div>
        )}

        {datos.imdbRating && datos.imdbRating !== 'N/A' && (
          <div className="omdb-info__item">
            <span className="omdb-info__label">⭐ IMDb</span>
            <span className="omdb-info__value">{datos.imdbRating}/10</span>
          </div>
        )}

        {datos.Awards && datos.Awards !== 'N/A' && (
          <div className="omdb-info__item omdb-info__item--full">
            <span className="omdb-info__label">🏆 Premios</span>
            <span className="omdb-info__value">{datos.Awards}</span>
          </div>
        )}
      </div>
    </div>
  );
}
