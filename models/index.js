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
const PropertyImageModel = require('./PropertyImage');
const RefreshTokenModel = require('./RefreshToken');

// ======================
// ✅ INICIALIZAR MODELOS
// ======================
const User = UserModel(sequelize, DataTypes);

const Property =
PropertyModel(sequelize, DataTypes);

const PropertyImage =
PropertyImageModel(sequelize, DataTypes);

const RefreshToken =
RefreshTokenModel(sequelize, DataTypes);

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

// PROPERTY → IMAGES
Property.hasMany(PropertyImage, {
  foreignKey: 'propertyId',
  as: 'images',
  onDelete: 'CASCADE'
});

PropertyImage.belongsTo(Property, {
  foreignKey: 'propertyId',
  as: 'property'
});

// USER → REFRESH TOKENS
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
// ✅ EXPORTAR
// ======================
module.exports = {
  sequelize,
  Sequelize,
  User,
  Property,
  PropertyImage,
  RefreshToken
};