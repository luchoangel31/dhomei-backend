module.exports = (sequelize, DataTypes) => {

  const RefreshToken = sequelize.define('RefreshToken', {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    token: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    /* ======================
       EXPIRACIÓN
    ====================== */
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },

    /* ======================
       CONTEXTO DISPOSITIVO
    ====================== */
    device: {
      type: DataTypes.STRING,
      allowNull: true
    },

    ip: {
      type: DataTypes.STRING,
      allowNull: true
    },

    location: { // 🔥 NUEVO
      type: DataTypes.STRING,
      allowNull: true
    },

    /* ======================
       SEGURIDAD
    ====================== */
    isRevoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    replacedByToken: { // 🔥 CLAVE PARA ROTACIÓN
      type: DataTypes.TEXT,
      allowNull: true
    }

  }, {
    tableName: 'refresh_tokens',
    timestamps: true,

    indexes: [
      {
        unique: true,
        fields: ['token']
      },
      {
        fields: ['userId']
      },
      {
        fields: ['isRevoked']
      },
      {
        fields: ['expiresAt'] // 🔥 mejora performance limpieza
      }
    ]
  });

  return RefreshToken;
};