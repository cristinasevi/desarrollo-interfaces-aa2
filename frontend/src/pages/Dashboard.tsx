import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import Loading from '../components/Loading';
import './Dashboard.css';

interface Estadisticas {
  total_usuarios: number;
  total_favoritos: number;
  total_busquedas: number;
  nuevos_esta_semana: number;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  created_at: string;
}

export default function Dashboard() {
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [cargandoStats, setCargandoStats] = useState(true);
  const [errorStats, setErrorStats] = useState('');

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Filtros y ordenación
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('created_at');
  const [direccion, setDireccion] = useState('DESC');
  const [pagina, setPagina] = useState(1);

  // Cargar estadísticas
  useEffect(() => {
    setCargandoStats(true);
    setErrorStats('');
    apiClient.get('/admin/estadisticas')
      .then(res => setEstadisticas(res.data))
      .catch(() => setErrorStats('Error al cargar estadísticas.'))
      .finally(() => setCargandoStats(false));
  }, []);

  // Cargar usuarios
  useEffect(() => {
    setCargando(true);
    apiClient.get('/admin/usuarios', {
      params: { busqueda, orden, direccion, pagina }
    })
      .then(res => {
        setUsuarios(res.data.usuarios);
        setTotal(res.data.total);
      })
      .catch(() => setError('Error al cargar usuarios.'))
      .finally(() => setCargando(false));
  }, [busqueda, orden, direccion, pagina]);

  const toggleOrden = (columna: string) => {
    if (orden === columna) {
      setDireccion(direccion === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setOrden(columna);
      setDireccion('ASC');
    }
    setPagina(1);
  };

  const totalPaginas = Math.ceil(total / 10);

  // Renderizado de la sección de estadísticas
  const renderStats = () => {
    if (cargandoStats) {
      return <div className="dashboard__stats-loading"><Loading /></div>;
    }

    if (errorStats) {
      return <p className="dashboard__error">{errorStats}</p>;
    }

    if (!estadisticas) {
      return <p className="dashboard__empty">No hay estadísticas disponibles.</p>;
    }

    return (
      <div className="dashboard__stats">
        <div className="stat-card">
          <span className="stat-card__icon">👥</span>
          <div>
            <p className="stat-card__value">{estadisticas.total_usuarios}</p>
            <p className="stat-card__label">Usuarios registrados</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-card__icon">❤️</span>
          <div>
            <p className="stat-card__value">{estadisticas.total_favoritos}</p>
            <p className="stat-card__label">Favoritos guardados</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-card__icon">🔍</span>
          <div>
            <p className="stat-card__value">{estadisticas.total_busquedas}</p>
            <p className="stat-card__label">Búsquedas realizadas</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-card__icon">🆕</span>
          <div>
            <p className="stat-card__value">{estadisticas.nuevos_esta_semana}</p>
            <p className="stat-card__label">Nuevos esta semana</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1>Dashboard Admin</h1>
      </div>

      <div className="dashboard__content">
        {/* Tarjetas de resumen */}
        {renderStats()}

        {/* Tabla de usuarios */}
        <div className="dashboard__table-section">
          <div className="dashboard__table-header">
            <h2>Usuarios ({total})</h2>
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
              className="dashboard__search"
            />
          </div>

          {error && <p className="dashboard__error">{error}</p>}

          {cargando ? <Loading /> : (
            <>
              <table className="dashboard__table">
                <thead>
                  <tr>
                    <th onClick={() => toggleOrden('nombre')} className="sortable">
                      Nombre {orden === 'nombre' ? (direccion === 'ASC' ? '↑' : '↓') : '↕'}
                    </th>
                    <th onClick={() => toggleOrden('email')} className="sortable">
                      Email {orden === 'email' ? (direccion === 'ASC' ? '↑' : '↓') : '↕'}
                    </th>
                    <th onClick={() => toggleOrden('rol')} className="sortable">
                      Rol {orden === 'rol' ? (direccion === 'ASC' ? '↑' : '↓') : '↕'}
                    </th>
                    <th onClick={() => toggleOrden('created_at')} className="sortable">
                      Fecha registro {orden === 'created_at' ? (direccion === 'ASC' ? '↑' : '↓') : '↕'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        {busqueda
                          ? `No se encontraron usuarios para "${busqueda}"`
                          : 'No hay usuarios registrados todavía'
                        }
                      </td>
                    </tr>
                  ) : (
                    usuarios.map(u => (
                      <tr key={u.id}>
                        <td>{u.nombre}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`rol-badge ${u.rol}`}>{u.rol}</span>
                        </td>
                        <td>{new Date(u.created_at).toLocaleDateString('es-ES')}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Paginación */}
              {totalPaginas > 1 && (
                <div className="dashboard__pagination">
                  <button onClick={() => setPagina(p => p - 1)} disabled={pagina === 1}>
                    ← Anterior
                  </button>
                  <span>{pagina} / {totalPaginas}</span>
                  <button onClick={() => setPagina(p => p + 1)} disabled={pagina === totalPaginas}>
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
