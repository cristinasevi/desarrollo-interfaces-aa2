const jwt = require('jsonwebtoken');

// Verifica que el token JWT sea válido
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. Token requerido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ mensaje: 'Token inválido o expirado.' });
  }
};

// Solo permite acceso a admins
const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol admin.' });
  }
  next();
};

// Permite acceso a moderadores y admins
const soloModerador = (req, res, next) => {
  if (!['moderator', 'admin'].includes(req.usuario.rol)) {
    return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol moderador o admin.' });
  }
  next();
};

// Solo permite acceso a users normales o admins (cualquier usuario autenticado)
const soloUser = (req, res, next) => {
  if (!['user', 'moderator', 'admin'].includes(req.usuario.rol)) {
    return res.status(403).json({ mensaje: 'Acceso denegado.' });
  }
  next();
};

module.exports = { verificarToken, soloAdmin, soloModerador, soloUser };
