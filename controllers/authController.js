const authService = require('../services/authService');

// ======================
// HELPERS
// ======================
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ======================
// REGISTER
// ======================
const register = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email y password son requeridos'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password mínimo 6 caracteres'
      });
    }

    const { user, accessToken, refreshToken } =
      await authService.registerUser(req.body, req);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado',
      user,
      accessToken,
      refreshToken,
      data: {
        user,
        accessToken,
        refreshToken
      }
    });

  } catch (error) {

    console.error("❌ REGISTER ERROR:", error.message);

    res.status(500).json({
      success: false,
      error: 'Error en registro'
    });
  }
};

// ======================
// LOGIN
// ======================
const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Credenciales requeridas'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido'
      });
    }

    const { user, accessToken, refreshToken } =
      await authService.loginUser(email, password, req);

    res.json({
      success: true,
      message: 'Login correcto',
      user,
      accessToken,
      refreshToken,
      data: {
        user,
        accessToken,
        refreshToken
      }
    });

  } catch (error) {

    console.error("❌ LOGIN ERROR:", error.message);

    res.status(401).json({
      success: false,
      error: 'Credenciales inválidas'
    });
  }
};

// ======================
// 🔁 REFRESH TOKEN (ROTACIÓN + sessionId)
// ======================
const refresh = async (req, res) => {
  try {

    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token requerido'
      });
    }

    // 🔥 IMPORTANTE: pasar req
    const {
      accessToken,
      refreshToken: newRefreshToken,
      currentSessionId
    } = await authService.refreshSession(refreshToken, req);

    res.json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
      currentSessionId, // 🔥 CLAVE PARA FRONTEND
      data: {
        accessToken,
        refreshToken: newRefreshToken,
        currentSessionId
      }
    });

  } catch (error) {

    console.error("❌ REFRESH ERROR:", error.message);

    res.status(401).json({
      success: false,
      error: error.message || 'Refresh token inválido'
    });
  }
};

// ======================
// 🚪 LOGOUT (una sesión)
// ======================
const logout = async (req, res) => {
  try {

    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token requerido'
      });
    }

    await authService.logoutUser(refreshToken);

    res.json({
      success: true,
      message: 'Logout exitoso'
    });

  } catch (error) {

    console.error("❌ LOGOUT ERROR:", error.message);

    res.status(500).json({
      success: false,
      error: 'Error en logout'
    });
  }
};

// ======================
// 🌍 LOGOUT GLOBAL
// ======================
const logoutAll = async (req, res) => {
  try {

    await authService.logoutAllDevices(req.user.id);

    res.json({
      success: true,
      message: 'Sesiones cerradas en todos los dispositivos'
    });

  } catch (error) {

    console.error("❌ LOGOUT ALL ERROR:", error.message);

    res.status(500).json({
      success: false,
      error: 'Error cerrando sesiones'
    });
  }
};

// ======================
// 📱 LISTAR SESIONES
// ======================
const sessions = async (req, res) => {
  try {

    const sessions = await authService.getUserSessions(req.user.id);

    res.json({
      success: true,
      sessions
    });

  } catch (error) {

    console.error("❌ SESSIONS ERROR:", error.message);

    res.status(500).json({
      success: false,
      error: 'Error obteniendo sesiones'
    });
  }
};

// ======================
// ❌ LOGOUT POR SESIÓN ESPECÍFICA
// ======================
const logoutSession = async (req, res) => {
  try {

    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID requerido'
      });
    }

    await authService.logoutSessionById(sessionId, req.user.id);

    res.json({
      success: true,
      message: 'Sesión cerrada correctamente'
    });

  } catch (error) {

    console.error("❌ LOGOUT SESSION ERROR:", error.message);

    res.status(500).json({
      success: false,
      error: 'Error cerrando sesión'
    });
  }
};

// ======================
// PERFIL
// ======================
const perfil = async (req, res) => {

  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'No autorizado'
    });
  }

  res.json({
    success: true,
    user: req.user
  });
};

// ======================
// ADMIN
// ======================
const admin = async (req, res) => {

  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Acceso denegado'
    });
  }

  res.json({
    success: true,
    message: 'Bienvenido Admin 👑',
    user: req.user
  });
};

module.exports = {
  register,
  login,
  perfil,
  admin,
  refresh,
  logout,
  logoutAll,
  sessions,
  logoutSession
};