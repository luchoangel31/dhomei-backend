console.log('✅ AUTH ROUTER CARGADO');

const express = require('express');
const router = express.Router();

// ✅ CONTROLLER
const authController = require('../controllers/authController');

// ✅ MIDDLEWARE
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// ✅ VALIDADORES
const {
  registerValidator,
  loginValidator
} = require('../validators/authValidator');

// ======================
// VALIDAR SECRET
// ======================
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no definido');
}

// ======================
// 🔐 REGISTER
// ======================
router.post(
  '/register',
  registerValidator,
  authController.register
);

// ======================
// 🔑 LOGIN
// ======================
router.post(
  '/login',
  loginValidator,
  authController.login
);

// ======================
// 🔁 REFRESH TOKEN
// ======================
router.post(
  '/refresh',
  authController.refresh
);

// ======================
// 🚪 LOGOUT (una sesión)
// ======================
router.post(
  '/logout',
  authController.logout
);

// ======================
// 🌍 LOGOUT GLOBAL (🔥 NUEVO)
// ======================
router.post(
  '/logout-all',
  authMiddleware,
  authController.logoutAll
);

// ======================
// 📱 LISTAR SESIONES (🔥 NUEVO)
// ======================
router.get(
  '/sessions',
  authMiddleware,
  authController.sessions
);

// ======================
// ❌ LOGOUT POR SESIÓN (🔥 CLAVE)
// ======================
router.delete(
  '/sessions/:sessionId',
  authMiddleware,
  authController.logoutSession
);

// ======================
// 🔒 PERFIL
// ======================
router.get(
  '/perfil',
  authMiddleware,
  authController.perfil
);

// ======================
// 👑 ADMIN
// ======================
router.get(
  '/admin',
  authMiddleware,
  roleMiddleware('admin'),
  authController.admin
);

module.exports = router;