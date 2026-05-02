'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PropertyImages', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      url: {
        type: Sequelize.STRING,
        allowNull: false
      },

      publicId: {
        type: Sequelize.STRING
        // 🔥 útil para Cloudinary (eliminar imágenes luego)
      },

      isPrimary: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
        // 🔥 imagen principal (portada)
      },

      order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
        // 🔥 orden de galería
      },

      propertyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Properties',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // 🔥 índice clave
    await queryInterface.addIndex('PropertyImages', ['propertyId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PropertyImages');
  }
};