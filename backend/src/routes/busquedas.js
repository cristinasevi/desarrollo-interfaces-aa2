const express = require('express');
const { registrarBusqueda } = require('../controllers/busquedas');
const { verificarToken } = require('../middlewares/auth');

const router = express.Router();

router.use(verificarToken);

router.post('/', registrarBusqueda);

module.exports = router;
