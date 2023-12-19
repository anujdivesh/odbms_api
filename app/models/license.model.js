module.exports = (sequelize, Sequelize) => {
    const License = sequelize.define("license", {
      short_name: {
        type: Sequelize.STRING,
        allowNull: false, // Disallow null values
      validate: {
        notEmpty: true, // Ensure the value is not an empty string
      }
      },
        name: {
            type: Sequelize.STRING,
            allowNull: false, // Disallow null values
          validate: {
            notEmpty: true, // Ensure the value is not an empty string
          }
          },
      url: {
        type: Sequelize.STRING,
        allowNull: false, // Disallow null values
      validate: {
        notEmpty: true, // Ensure the value is not an empty string
      }
      }
    });  
    return License;
  };
  