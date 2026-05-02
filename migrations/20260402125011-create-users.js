'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      phone: {
        type: Sequelize.STRING
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false
      },

      accountType: {
        type: Sequelize.ENUM('individual', 'company'),
        allowNull: false
      },

      companyName: {
        type: Sequelize.STRING
      },

      role: {
        type: Sequelize.STRING,
        defaultValue: 'user'
      },

      subscriptionPlan: {
        type: Sequelize.STRING
      },

      planExpiresAt: {
        type: Sequelize.DATE
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};