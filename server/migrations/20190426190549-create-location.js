'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Locations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        unique: true,
        validate: {
          isUUID: {
            args: 4,
            msg: 'id must be uuid'
          }
        }
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
      },
      maleResidents: Sequelize.INTEGER,
      femaleResidents: Sequelize.INTEGER,
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
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Locations');
  }
};