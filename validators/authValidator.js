const { body, validationResult } = require('express-validator');

// ======================
// 📌 VALIDAR ERRORES
// ======================
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }

  next();
};

// ======================
// 🧑 REGISTRO
// ======================
exports.registerValidator = [
  body('name')
    .notEmpty().withMessage('El nombre es obligatorio'),

  body('email')
    .isEmail().withMessage('Email inválido'),

  body('phone')
    .notEmpty().withMessage('Teléfono obligatorio'),

  body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener mínimo 6 caracteres'),

  body('accountType')
    .isIn(['individual', 'company'])
    .withMessage('Tipo de cuenta inválido'),

  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Rol inválido'),

  body('subscriptionPlan')
    .optional()
    .isIn(['free', 'pro', 'enterprise'])
    .withMessage('Plan inválido'),

  validate
];

// ======================
// 🔐 LOGIN
// ======================
exports.loginValidator = [
  body('email')
    .isEmail().withMessage('Email inválido'),

  body('password')
    .notEmpty().withMessage('Password obligatorio'),

  validate
];