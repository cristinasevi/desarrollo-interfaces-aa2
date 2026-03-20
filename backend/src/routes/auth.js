const express = require('express');
const { body } = require('express-validator');
const { registro, login, perfil } = require('../controllers/auth');
const { verificarToken } = require('../middlewares/auth');

const router = express.Router();

// Validaciones para registro
const validacionesRegistro = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio.')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres.'),
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio.')
    .isEmail().withMessage('El email no tiene un formato válido.'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria.')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
];

// Validaciones para login
const validacionesLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio.')
    .isEmail().withMessage('El email no tiene un formato válido.'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria.'),
];

router.post('/registro', validacionesRegistro, registro);
router.post('/login', validacionesLogin, login);
router.get('/perfil', verificarToken, perfil);

module.exports = router;
