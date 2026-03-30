import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import Loading from '../components/Loading';
import './DashboardModerador.css';

interface Estadisticas {
  total_usuarios: number;
  total_favoritos: number;
  total_busquedas: number;
  nuevos_esta_semana: number;
}

interface Pelicula {
  pelicula_id: number;
  titulo: string;
  poster_path: string | null;
  vote_average: number;
  veces_guardada: number;
}

interface Busqueda {
  termino: string;
  veces: number;
}

export default function DashboardModerador() {
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [busquedas, setBusquedas] = useState<Busqueda[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      setError('');
      try {
        const [statsRes, pelisRes, busqRes] = await Promise.all([
          apiClient.get('/moderador/estadisticas'),
          apiClient.get('/moderador/peliculas-populares'),
          apiClient.get('/moderador/busquedas-populares'),
        ]);
        setEstadisticas(statsRes.data);
        setPeliculas(pelisRes.data.peliculas);
        setBusquedas(busqRes.data.busquedas);
      } catch {
        setError('Error al cargar los datos del panel.');
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  if (cargando) return <Loading />;

  return (
    <div className="mod-dashboard">
      <div className="mod-dashboard__header">
        <h1>🎬 Panel de Moderación</h1>
        <p className="mod-dashboard__subtitle">
          Monitoriza la actividad de la plataforma
        </p>
      </div>

      <div className="mod-dashboard__content">
        {error && <p className="mod-dashboard__error">{error}</p>}

        {/* Tarjetas de estadísticas */}
        {estadisticas && (
          <div className="mod-dashboard__stats">
            <div className="mod-stat-card">
              <span className="mod-stat-card__icon">👥</span>
              <div>
                <p className="mod-stat-card__value">{estadisticas.total_usuarios}</p>
                <p className="mod-stat-card__label">Usuarios registrados</p>
              </div>
            </div>
            <div className="mod-stat-card">
              <span className="mod-stat-card__icon">❤️</span>
              <div>
                <p className="mod-stat-card__value">{estadisticas.total_favoritos}</p>
                <p className="mod-stat-card__label">Favoritos guardados</p>
              </div>
            </div>
            <div className="mod-stat-card">
              <span className="mod-stat-card__icon">🔍</span>
              <div>
                <p className="mod-stat-card__value">{estadisticas.total_busquedas}</p>
                <p className="mod-stat-card__label">Búsquedas realizadas</p>
              </div>
            </div>
            <div className="mod-stat-card">
              <span className="mod-stat-card__icon">🆕</span>
              <div>
                <p className="mod-stat-card__value">{estadisticas.nuevos_esta_semana}</p>
                <p className="mod-stat-card__label">Nuevos esta semana</p>
              </div>
            </div>
          </div>
        )}

        <div className="mod-dashboard__grid">
          {/* Películas más guardadas */}
          <div className="mod-dashboard__section">
            <h2>🏆 Películas más guardadas</h2>
            {peliculas.length === 0 ? (
              <p className="mod-dashboard__empty">No hay datos todavía.</p>
            ) : (
              <div className="mod-peliculas-lista">
                {peliculas.map((p, i) => (
                  <div key={p.pelicula_id} className="mod-pelicula-item">
                    <span className="mod-pelicula-item__rank">#{i + 1}</span>
                    <div className="mod-pelicula-item__info">
                      <span className="mod-pelicula-item__titulo">{p.titulo}</span>
                      <span className="mod-pelicula-item__meta">
                        ⭐ {Number(p.vote_average).toFixed(1)} · ❤️ {p.veces_guardada} guardados
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Búsquedas más populares */}
          <div className="mod-dashboard__section">
            <h2>📈 Términos más buscados</h2>
            {busquedas.length === 0 ? (
              <p className="mod-dashboard__empty">No hay búsquedas registradas.</p>
            ) : (
              <div className="mod-busquedas-lista">
                {busquedas.map((b, i) => (
                  <div key={b.termino} className="mod-busqueda-item">
                    <span className="mod-busqueda-item__rank">#{i + 1}</span>
                    <span className="mod-busqueda-item__termino">"{b.termino}"</span>
                    <span className="mod-busqueda-item__veces">{b.veces}x</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
