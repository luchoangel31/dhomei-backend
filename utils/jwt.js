const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// ======================
// VALIDAR VARIABLES ENV
// ======================
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error('❌ JWT_SECRET o REFRESH_TOKEN_SECRET no definidos en .env');
}

// ======================
// GENERAR ACCESS TOKEN
// ======================
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      accountType: user.accountType
    },
    JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    }
  );
};

// ======================
// GENERAR REFRESH TOKEN 🔥 MEJORADO
// ======================
const generateRefreshToken = (user) => {

  const jti = uuidv4(); // 🔥 identificador único de sesión

  return jwt.sign(
    {
      id: user.id,
      jti // 🔥 clave para rotación y seguridad
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
    }
  );
};

// ======================
// VERIFICAR ACCESS TOKEN
// ======================
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// ======================
// VERIFICAR REFRESH TOKEN
// ======================
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

// ======================
// EXPORTS
// ======================
module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};