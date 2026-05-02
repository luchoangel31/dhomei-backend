module.exports = (sequelize, DataTypes) => {

  const PropertyImage = sequelize.define('PropertyImage', {

    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },

    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }

  });

  return PropertyImage;

};