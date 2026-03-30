const db = require('../database/db');

// GET /api/moderador/estadisticas
// Igual que admin pero sin datos de usuarios individuales
const getEstadisticas = async (req, res) => {
  try {
    const [[{ total_favoritos }]] = await db.query(
      'SELECT COUNT(*) as total_favoritos FROM favoritos'
    );

    const [[{ total_busquedas }]] = await db.query(
      'SELECT COUNT(*) as total_busquedas FROM busquedas'
    );

    const [[{ total_usuarios }]] = await db.query(
      'SELECT COUNT(*) as total_usuarios FROM usuarios WHERE rol = "user"'
    );

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
    console.error('Error obteniendo estadísticas de moderador:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// GET /api/moderador/peliculas-populares
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
    console.error('Error obteniendo películas populares (moderador):', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// GET /api/moderador/busquedas-populares
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
    console.error('Error obteniendo búsquedas (moderador):', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

module.exports = {
  getEstadisticas,
  getPeliculasPopulares,
  getBusquedasPopulares,
};
