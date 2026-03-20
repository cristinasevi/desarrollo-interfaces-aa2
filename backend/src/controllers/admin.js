const db = require('../database/db');

// GET /api/admin/estadisticas
const getEstadisticas = async (req, res) => {
  try {
    // Total usuarios registrados
    const [[{ total_usuarios }]] = await db.query(
      'SELECT COUNT(*) as total_usuarios FROM usuarios WHERE rol = "user"'
    );

    // Total favoritos guardados
    const [[{ total_favoritos }]] = await db.query(
      'SELECT COUNT(*) as total_favoritos FROM favoritos'
    );

    // Total búsquedas realizadas
    const [[{ total_busquedas }]] = await db.query(
      'SELECT COUNT(*) as total_busquedas FROM busquedas'
    );

    // Usuarios nuevos esta semana
    const [[{ nuevos_esta_semana }]] = await db.query(
      `SELECT COUNT(*) as nuevos_esta_semana FROM usuarios 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) AND rol = "user"`
    );

    res.json({
      total_usuarios,
      total_favoritos,
      total_busquedas,
      nuevos_esta_semana,
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// GET /api/admin/usuarios
const getUsuarios = async (req, res) => {
  const { busqueda = '', orden = 'created_at', direccion = 'DESC', pagina = 1 } = req.query;
  const limite = 10;
  const offset = (pagina - 1) * limite;

  // Validar columnas permitidas para ordenar (prevenir SQL injection)
  const columnasPermitidas = ['nombre', 'email', 'created_at', 'rol'];
  const columna = columnasPermitidas.includes(orden) ? orden : 'created_at';
  const dir = direccion === 'ASC' ? 'ASC' : 'DESC';

  try {
    const [usuarios] = await db.query(
      `SELECT id, nombre, email, rol, activo, created_at 
       FROM usuarios 
       WHERE (nombre LIKE ? OR email LIKE ?)
       ORDER BY ${columna} ${dir}
       LIMIT ? OFFSET ?`,
      [`%${busqueda}%`, `%${busqueda}%`, limite, offset]
    );

    const [[{ total }]] = await db.query(
      'SELECT COUNT(*) as total FROM usuarios WHERE nombre LIKE ? OR email LIKE ?',
      [`%${busqueda}%`, `%${busqueda}%`]
    );

    res.json({ usuarios, total, pagina: Number(pagina), limite });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// GET /api/admin/peliculas-populares
const getPeliculasPopulares = async (req, res) => {
  try {
    const [peliculas] = await db.query(
      `SELECT pelicula_id, titulo, poster_path, vote_average,
              COUNT(*) as veces_guardada
       FROM favoritos
       GROUP BY pelicula_id, titulo, poster_path, vote_average
       ORDER BY veces_guardada DESC
       LIMIT 10`
    );
    res.json({ peliculas });
  } catch (error) {
    console.error('Error obteniendo películas populares:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// GET /api/admin/busquedas-populares
const getBusquedasPopulares = async (req, res) => {
  try {
    const [busquedas] = await db.query(
      `SELECT termino, COUNT(*) as veces
       FROM busquedas
       GROUP BY termino
       ORDER BY veces DESC
       LIMIT 10`
    );
    res.json({ busquedas });
  } catch (error) {
    console.error('Error obteniendo búsquedas:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

module.exports = {
  getEstadisticas,
  getUsuarios,
  getPeliculasPopulares,
  getBusquedasPopulares,
};
