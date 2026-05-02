module.exports = (sequelize, DataTypes) => {

  const Property = sequelize.define('Property', {

    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    // ======================
    // IDENTIDAD
    // ======================
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    slug: {
      type: DataTypes.STRING,
      unique: true
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    // ======================
    // PRECIO
    // ======================
    price: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },

    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD'
    },

    // ======================
    // OPERACIÓN
    // ======================
    operationType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['sale','rent']]
      }
    },

    propertyType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['house','apartment','land','office','commercial']]
      }
    },

    // ======================
    // UBICACIÓN
    // ======================
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },

    city: {
      type: DataTypes.STRING,
      allowNull: false
    },

    district: {
      type: DataTypes.STRING
    },

    address: {
      type: DataTypes.STRING
    },

    latitude: {
      type: DataTypes.DECIMAL(10,8)
    },

    longitude: {
      type: DataTypes.DECIMAL(11,8)
    },

    // ======================
    // ESTADO
    // ======================
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
      validate: {
        isIn: [['active','sold','rented','paused']]
      }
    },

    // ======================
    // MÉTRICAS
    // ======================
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    // ======================
    // RELACIÓN
    // ======================
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // 🔥 CLAVE para evitar error de relación
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }

  }, {
    tableName: 'Properties',
    freezeTableName: true // 🔥 evita conflictos de nombres
  });

  return Property;
};