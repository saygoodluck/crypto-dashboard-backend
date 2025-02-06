'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('User', {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      telegramId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: true
      },
      firstName: {
        allowNull: true,
        type: Sequelize.STRING
      },
      lastName: {
        allowNull: true,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('User');
  }
};
