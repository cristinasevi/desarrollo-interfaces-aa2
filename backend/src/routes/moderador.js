const express = require('express');
const {
  getEstadisticas,
  getPeliculasPopulares,
  getBusquedasPopulares,
} = require('../controllers/moderador');
const { verificarToken, soloModerador } = require('../middlewares/auth');

const router = express.Router();

// Todas las rutas moderador requieren token + rol moderator o admin
router.use(verificarToken);
router.use(soloModerador);

router.get('/estadisticas', getEstadisticas);
router.get('/peliculas-populares', getPeliculasPopulares);
router.get('/busquedas-populares', getBusquedasPopulares);

module.exports = router;
