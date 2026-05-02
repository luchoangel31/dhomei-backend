const { Sequelize } = require('sequelize');
require('dotenv').config();

// ======================
// DEBUG DE CONEXIÓN
// ======================
console.log("🔎 CONFIGURACIÓN DB:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);

// ======================
// CONEXIÓN A POSTGRESQL
// ======================
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
);

// ======================
// TEST DE CONEXIÓN
// ======================
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL conectado correctamente");
  } catch (error) {
    console.error("❌ Error conectando a PostgreSQL:", error);
  }
}

testConnection();

module.exports = sequelize;