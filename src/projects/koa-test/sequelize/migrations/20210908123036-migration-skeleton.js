'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Authors', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: Sequelize.DataTypes.STRING,
      lastName: Sequelize.DataTypes.STRING,
      middleName: Sequelize.DataTypes.STRING,
      birthDate: Sequelize.DataTypes.DATE,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    return queryInterface.createTable('Books', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: Sequelize.DataTypes.STRING,
      publicationYear: Sequelize.DataTypes.INTEGER,
      authorId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Authors',
          },
          key: 'id',
        },
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Books');
    return queryInterface.dropTable('Authors');
  },
};
