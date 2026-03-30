const db = require('../database/db');

// POST /api/busquedas
const registrarBusqueda = async (req, res) => {
  const { termino, resultados = 0 } = req.body;

  if (!termino || !termino.trim()) {
    return res.status(400).json({ mensaje: 'El término de búsqueda es obligatorio.' });
  }

  try {
    await db.query(
      'INSERT INTO busquedas (usuario_id, termino, resultados) VALUES (?, ?, ?)',
      [req.usuario.id, termino.trim().toLowerCase(), resultados]
    );
    res.status(201).json({ mensaje: 'Búsqueda registrada.' });
  } catch (error) {
    console.error('Error registrando búsqueda:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

module.exports = { registrarBusqueda };
