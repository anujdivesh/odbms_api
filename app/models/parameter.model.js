module.exports = (sequelize, Sequelize) => {
    const Parameter = sequelize.define("parameter", {
      short_name: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false, // Disallow null values
      validate: {
        notEmpty: true, // Ensure the value is not an empty string
      }
      },
      standard_name: {
        type:Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true, // Ensure the value is not an empty string
        }
      },
      long_name: {
        type:Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true, // Ensure the value is not an empty string
        }
      },
      units: {
        type:Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true, // Ensure the value is not an empty string
        }
      },
      uri: {
        type:Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true, // Ensure the value is not an empty string
        }
      }
    });  
    return Parameter;
  };
  