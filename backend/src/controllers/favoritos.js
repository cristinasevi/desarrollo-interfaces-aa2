const db = require('../database/db');

// GET /api/favoritos
const getFavoritos = async (req, res) => {
  try {
    const [favoritos] = await db.query(
      'SELECT * FROM favoritos WHERE usuario_id = ? ORDER BY created_at DESC',
      [req.usuario.id]
    );
    res.json({ favoritos });
  } catch (error) {
    console.error('Error obteniendo favoritos:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// POST /api/favoritos
const addFavorito = async (req, res) => {
  const { pelicula_id, titulo, poster_path, vote_average, release_date } = req.body;

  if (!pelicula_id || !titulo) {
    return res.status(400).json({ mensaje: 'pelicula_id y titulo son obligatorios.' });
  }

  try {
    await db.query(
      `INSERT INTO favoritos (usuario_id, pelicula_id, titulo, poster_path, vote_average, release_date)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE titulo = titulo`,
      [req.usuario.id, pelicula_id, titulo, poster_path, vote_average, release_date]
    );

    res.status(201).json({ mensaje: 'Añadido a favoritos.' });
  } catch (error) {
    console.error('Error añadiendo favorito:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// DELETE /api/favoritos/:peliculaId
const removeFavorito = async (req, res) => {
  const { peliculaId } = req.params;

  try {
    await db.query(
      'DELETE FROM favoritos WHERE usuario_id = ? AND pelicula_id = ?',
      [req.usuario.id, peliculaId]
    );
    res.json({ mensaje: 'Eliminado de favoritos.' });
  } catch (error) {
    console.error('Error eliminando favorito:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

module.exports = { getFavoritos, addFavorito, removeFavorito };
