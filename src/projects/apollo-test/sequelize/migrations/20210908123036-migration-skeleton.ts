import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface, dataTypes: typeof DataTypes) => {
    await queryInterface.createTable('Authors', {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: dataTypes.STRING,
      lastName: dataTypes.STRING,
      middleName: dataTypes.STRING,
      birthDate: dataTypes.DATE,
      createdAt: {
        allowNull: false,
        type: dataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: dataTypes.DATE,
      },
    });
    return queryInterface.createTable('Books', {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: dataTypes.STRING,
      publicationYear: dataTypes.INTEGER,
      authorId: {
        type: dataTypes.INTEGER,
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
        type: dataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: dataTypes.DATE,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('Books');
    return queryInterface.dropTable('Authors');
  },
};
