import { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { getImageUrl } from '../services/tmdbApi';
import { Link } from 'react-router-dom';
import './PerfilUsuario.css';

export default function PerfilUsuario() {
  const { usuario } = useAuth();
  const { favorites, removeFavorite } = useFavorites();

  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('titulo');
  const [direccion, setDireccion] = useState('ASC');

  if (!usuario) return null;

  const toggleOrden = (columna: string) => {
    if (orden === columna) {
      setDireccion(d => d === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setOrden(columna);
      setDireccion('ASC');
    }
  };

  const favoritosFiltrados = useMemo(() => {
    let lista = [...favorites];

    if (busqueda.trim()) {
      lista = lista.filter(f =>
        f.title.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    lista.sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      if (orden === 'titulo') {
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
      } else if (orden === 'año') {
        valA = a.release_date ? new Date(a.release_date).getFullYear() : 0;
        valB = b.release_date ? new Date(b.release_date).getFullYear() : 0;
      } else if (orden === 'puntuacion') {
        valA = a.vote_average;
        valB = b.vote_average;
      }

      if (valA < valB) return direccion === 'ASC' ? -1 : 1;
      if (valA > valB) return direccion === 'ASC' ? 1 : -1;
      return 0;
    });

    return lista;
  }, [favorites, busqueda, orden, direccion]);

  const icono = (col: string) => {
    if (orden !== col) return '↕';
    return direccion === 'ASC' ? '↑' : '↓';
  };

  return (
    <div className="perfil">
      <div className="perfil__header">
        <h1>Mi perfil</h1>
        <p>Bienvenido/a de nuevo, {usuario.nombre}</p>
      </div>

      <div className="perfil__content">
        {/* Tarjetas de resumen */}
        <div className="perfil__stats">
          <div className="perfil__stat-card">
            <span className="perfil__stat-icon">❤️</span>
            <div>
              <p className="perfil__stat-value">{favorites.length}</p>
              <p className="perfil__stat-label">Películas favoritas</p>
            </div>
          </div>
          <div className="perfil__stat-card perfil__stat-card--email">
            <span className="perfil__stat-icon">👤</span>
            <div className="perfil__stat-texto">
              <p className="perfil__stat-value perfil__stat-value--email">{usuario.email}</p>
              <p className="perfil__stat-label">Email</p>
            </div>
          </div>
        </div>

        {/* Tabla de favoritos */}
        <div className="perfil__seccion">
          <div className="perfil__seccion-header">
            <h2>Mis favoritos ({favoritosFiltrados.length})</h2>
            <input
              type="text"
              placeholder="Buscar por título..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="perfil__search"
            />
          </div>

          {favorites.length === 0 ? (
            <div className="perfil__vacio">
              <p>😢 Todavía no tienes favoritos</p>
              <Link to="/" className="perfil__link-accion">Explorar películas</Link>
            </div>
          ) : (
            <table className="perfil__table">
              <thead>
                <tr>
                  <th className="perfil__col-poster"></th>
                  <th onClick={() => toggleOrden('titulo')} className="sortable">
                    Título {icono('titulo')}
                  </th>
                  <th onClick={() => toggleOrden('año')} className="sortable">
                    Año {icono('año')}
                  </th>
                  <th onClick={() => toggleOrden('puntuacion')} className="sortable">
                    Puntuación {icono('puntuacion')}
                  </th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {favoritosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="perfil__table-empty">
                      No se encontraron películas para "{busqueda}"
                    </td>
                  </tr>
                ) : (
                  favoritosFiltrados.map(pelicula => (
                    <tr key={pelicula.id}>
                      <td className="perfil__col-poster">
                        <Link to={`/movie/${pelicula.id}`}>
                          <img
                            src={getImageUrl(pelicula.poster_path, 'w200')}
                            alt={pelicula.title}
                            className="perfil__poster"
                          />
                        </Link>
                      </td>
                      <td>
                        <Link to={`/movie/${pelicula.id}`} className="perfil__table-link">
                          {pelicula.title}
                        </Link>
                      </td>
                      <td>
                        {pelicula.release_date
                          ? new Date(pelicula.release_date).getFullYear()
                          : 'N/A'}
                      </td>
                      <td>⭐ {pelicula.vote_average.toFixed(1)}</td>
                      <td>
                        <button
                          onClick={() => removeFavorite(pelicula.id)}
                          className="perfil__table-remove"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
