'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Author', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: Sequelize.DataTypes.STRING,
      lastName: Sequelize.DataTypes.STRING,
      middleName: Sequelize.DataTypes.STRING,
      birthDate: Sequelize.DataTypes.DATE,
    });
    return queryInterface.createTable('Book', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: Sequelize.DataTypes.STRING,
      authorId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Author',
          },
          key: 'id',
        },
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Book');
    return queryInterface.dropTable('Author');
  },
};
