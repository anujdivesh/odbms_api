module.exports = (sequelize, Sequelize) => {
    const Country = sequelize.define("country", {
      country_code: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false, // Disallow null values
      validate: {
        notEmpty: true, // Ensure the value is not an empty string
      }
      },
      country_name: {
        type: Sequelize.STRING,
        allowNull: false, // Disallow null values
      validate: {
        notEmpty: true, // Ensure the value is not an empty string
      }
      }
    });
  
    return Country;
  };
  