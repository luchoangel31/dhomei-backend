module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {

    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // 👤 Tipo de entidad
    accountType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['individual', 'company']]
      }
    },

    // 🏢 Solo si es empresa
    companyName: {
      type: DataTypes.STRING
    },

    // 🎭 Rol interno del sistema
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
      validate: {
        isIn: [['user', 'admin']]
      }
    },

    // ✅ Verificación futura
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    // 💎 Plan de suscripción
    subscriptionPlan: {
      type: DataTypes.STRING,
      defaultValue: 'free',
      validate: {
        isIn: [['free', 'pro', 'enterprise']]
      }
    },

    planExpiresAt: {
      type: DataTypes.DATE
    }

  }, {
    tableName: 'Users',
    freezeTableName: true // 🔥 CLAVE para evitar errores de Sequelize
  });

  return User;
};