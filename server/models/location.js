'use strict';
export default function(sequelize, DataTypes) {
  var Location = sequelize.define('Location', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: {
        args: true,
        msg: 'id already exists'
      },
      validate: {
        isUUID: {
          args: 4,
          msg: 'id must be uuid'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    maleResidents: DataTypes.INTEGER,
    femaleResidents: DataTypes.INTEGER
  }, {
  });
  return Location;
};