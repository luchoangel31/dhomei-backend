const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// ======================
// ✅ CONEXIÓN
// ======================
const sequelize = require('../config/database');

// ======================
// ✅ MODELOS
// ======================
const UserModel = require('./User');
const PropertyModel = require('./Property');
const RefreshTokenModel = require('./RefreshToken');

// ======================
// ✅ INICIALIZAR MODELOS
// ======================
const User = UserModel(sequelize, DataTypes);
const Property = PropertyModel(sequelize, DataTypes);
const RefreshToken = RefreshTokenModel(sequelize, DataTypes); // 🔥 FIX CLAVE

// ======================
// ✅ RELACIONES
// ======================

// USER → PROPERTIES
User.hasMany(Property, {
  foreignKey: 'userId',
  as: 'properties',
  onDelete: 'CASCADE'
});

Property.belongsTo(User, {
  foreignKey: 'userId',
  as: 'owner'
});

// 🔐 USER → REFRESH TOKENS
User.hasMany(RefreshToken, {
  foreignKey: 'userId',
  as: 'refreshTokens',
  onDelete: 'CASCADE'
});

RefreshToken.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// ======================
// ❌ NADA DE SYNC AQUÍ
// ======================

// ======================
// ✅ EXPORTAR
// ======================
module.exports = {
  sequelize,
  Sequelize,
  User,
  Property,
  RefreshToken
};