const express = require('express');
const {
  getEstadisticas,
  getUsuarios,
  getPeliculasPopulares,
  getBusquedasPopulares,
} = require('../controllers/admin');
const { verificarToken, soloAdmin } = require('../middlewares/auth');

const router = express.Router();

// Todas las rutas admin requieren token + rol admin
router.use(verificarToken);
router.use(soloAdmin);

router.get('/estadisticas', getEstadisticas);
router.get('/usuarios', getUsuarios);
router.get('/peliculas-populares', getPeliculasPopulares);
router.get('/busquedas-populares', getBusquedasPopulares);

module.exports = router;
