const express = require('express');
const { getFavoritos, addFavorito, removeFavorito } = require('../controllers/favoritos');
const { verificarToken } = require('../middlewares/auth');

const router = express.Router();

// Todas las rutas de favoritos requieren token
router.use(verificarToken);

router.get('/', getFavoritos);
router.post('/', addFavorito);
router.delete('/:peliculaId', removeFavorito);

module.exports = router;
