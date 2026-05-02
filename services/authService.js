const bcrypt = require('bcryptjs');
const geoip = require('geoip-lite');

const { User, RefreshToken } = require('../models');

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require('../utils/jwt');

/* ======================
   HELPERS
====================== */
const getClientIp = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    '0.0.0.0'
  );
};

const getLocation = (ip) => {
  const geo = geoip.lookup(ip);
  if (!geo) return 'Ubicación desconocida';
  return `${geo.city || 'Ciudad desconocida'}, ${geo.country}`;
};

const getDevice = (req) => {
  return req.headers['user-agent'] || 'Dispositivo desconocido';
};

/* ======================
   REGISTER
====================== */
const registerUser = async (data, req) => {

  const { email, password } = data;

  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw new Error('El usuario ya existe');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    ...data,
    password: hashedPassword
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const ip = getClientIp(req);
  const location = getLocation(ip);
  const device = getDevice(req);

  // 🔥 crear sesión
  const session = await RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    device,
    ip,
    location
  });

  return {
    user,
    accessToken,
    refreshToken,
    sessionId: session.id // ✅ consistente
  };
};

/* ======================
   LOGIN
====================== */
const loginUser = async (email, password, req) => {

  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Credenciales inválidas');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const ip = getClientIp(req);
  const location = getLocation(ip);
  const device = getDevice(req);

  // 🔥 crear sesión
  const session = await RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    device,
    ip,
    location
  });

  return {
    user,
    accessToken,
    refreshToken,
    sessionId: session.id // ✅ consistente
  };
};

/* ======================
   🔁 REFRESH SESSION
====================== */
const refreshSession = async (refreshToken, req) => {

  if (!refreshToken) {
    throw new Error('Refresh token requerido');
  }

  const payload = verifyRefreshToken(refreshToken);

  if (!payload) {
    throw new Error('Refresh token inválido o expirado');
  }

  const storedToken = await RefreshToken.findOne({
    where: {
      token: refreshToken,
      isRevoked: false
    }
  });

  if (!storedToken) {
    throw new Error('Refresh token no válido');
  }

  // 🔥 detección de robo
  if (storedToken.replacedByToken) {
    await RefreshToken.update(
      { isRevoked: true },
      { where: { userId: storedToken.userId } }
    );

    throw new Error('Token comprometido. Todas las sesiones cerradas.');
  }

  if (new Date() > storedToken.expiresAt) {
    await storedToken.update({ isRevoked: true });
    throw new Error('Refresh token expirado');
  }

  const user = await User.findByPk(payload.id);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  /* ======================
     ROTACIÓN
  ====================== */

  const newRefreshToken = generateRefreshToken(user);
  const newAccessToken = generateAccessToken(user);

  const ip = getClientIp(req);
  const location = getLocation(ip);
  const device = getDevice(req);

  // 🔥 nueva sesión
  const newSession = await RefreshToken.create({
    token: newRefreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    device,
    ip,
    location
  });

  // 🔥 invalidar anterior
  await storedToken.update({
    isRevoked: true,
    replacedByToken: newRefreshToken
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionId: newSession.id // ✅ consistente
  };
};

/* ======================
   LOGOUT
====================== */
const logoutUser = async (refreshToken) => {

  if (!refreshToken) return true;

  await RefreshToken.update(
    { isRevoked: true },
    { where: { token: refreshToken } }
  );

  return true;
};

const logoutAllDevices = async (userId) => {

  await RefreshToken.update(
    { isRevoked: true },
    { where: { userId } }
  );

  return true;
};

const logoutSessionById = async (sessionId, userId) => {

  await RefreshToken.update(
    { isRevoked: true },
    {
      where: {
        id: sessionId,
        userId
      }
    }
  );

  return true;
};

const getUserSessions = async (userId) => {

  return await RefreshToken.findAll({
    where: {
      userId,
      isRevoked: false
    },
    attributes: [
      'id',
      'token',
      'device',
      'ip',
      'location',
      'createdAt'
    ],
    order: [['createdAt', 'DESC']]
  });
};

module.exports = {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  logoutAllDevices,
  logoutSessionById,
  getUserSessions
};