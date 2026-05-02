'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Properties', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false
      },

      slug: {
        type: Sequelize.STRING,
        unique: true
      },

      description: {
        type: Sequelize.TEXT
      },

      price: {
        type: Sequelize.FLOAT,
        allowNull: false
      },

      currency: {
        type: Sequelize.STRING,
        defaultValue: 'USD'
      },

      operationType: {
        type: Sequelize.ENUM('sale', 'rent'),
        allowNull: false
      },

      propertyType: {
        type: Sequelize.STRING,
        allowNull: false
      },

      country: {
        type: Sequelize.STRING
      },

      city: {
        type: Sequelize.STRING
      },

      district: {
        type: Sequelize.STRING
      },

      address: {
        type: Sequelize.STRING
      },

      lat: {
        type: Sequelize.FLOAT
      },

      lng: {
        type: Sequelize.FLOAT
      },

      status: {
        type: Sequelize.ENUM(
          'pending',
          'approved',
          'rejected',
          'sold',
          'rented'
        ),
        defaultValue: 'pending'
      },

      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      isFeatured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
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

    // 🔥 ÍNDICES (CLAVE PARA PERFORMANCE)
    await queryInterface.addIndex('Properties', ['userId']);
    await queryInterface.addIndex('Properties', ['city']);
    await queryInterface.addIndex('Properties', ['district']);
    await queryInterface.addIndex('Properties', ['price']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Properties');
  }
};