const { Sequelize } = require('sequelize');
require('dotenv').config();

// ======================
// DEBUG
// ======================
console.log("🔎 DATABASE_URL:");
console.log(process.env.DATABASE_URL ? "✅ DATABASE_URL detectada" : "❌ DATABASE_URL no encontrada");

// ======================
// ✅ CONEXIÓN POSTGRESQL (NEON)
// ======================
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',

  protocol: 'postgres',

  logging: false,

  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// ======================
// TEST DE CONEXIÓN
// ======================
async function testConnection() {

  try {

    await sequelize.authenticate();

    console.log("✅ PostgreSQL conectado correctamente");

  } catch (error) {

    console.error("❌ Error conectando PostgreSQL:");
    console.error(error);
  }
}

testConnection();

module.exports = sequelize;