const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET;

/* =========================
   🔐 AUTH MIDDLEWARE PRO
========================= */
module.exports = async (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token no proporcionado'
      });
    }

    const token = authHeader.split(' ')[1];

    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {

      // 🔥 TOKEN EXPIRADO (CLAVE PARA FRONTEND)
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Token expirado',
          code: 'TOKEN_EXPIRED'
        });
      }

      // 🔥 TOKEN INVÁLIDO
      return res.status(401).json({
        success: false,
        error: 'Token inválido',
        code: 'TOKEN_INVALID'
      });
    }

    // 🔍 VALIDAR USUARIO EN DB
    const user = await User.findByPk(payload.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no existe'
      });
    }

    // 🔐 ADJUNTAR USER
    req.user = user;

    next();

  } catch (error) {

    console.error('🔥 AUTH ERROR:', error);

    return res.status(500).json({
      success: false,
      error: 'Error interno de autenticación'
    });
  }
};