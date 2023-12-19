module.exports = (sequelize, Sequelize) => {
    const Parameter = sequelize.define("parameter", {
      abbrev: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false, // Disallow null values
      validate: {
        notEmpty: true, // Ensure the value is not an empty string
      }
      },
      name: {
        type:Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true, // Ensure the value is not an empty string
        }
      },
      unit: {
        type:Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true, // Ensure the value is not an empty string
        }
      },
    });  
    return Parameter;
  };
  