module.exports = (sequelize, Sequelize) => {
    const Contact = sequelize.define("contact", {
      first_name: {
        type: Sequelize.STRING,
        allowNull: false, // Disallow null values
      validate: {
        notEmpty: true, // Ensure the value is not an empty string
      }
      },
      last_name: {
        type: Sequelize.STRING
      },
      designation: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false, // Disallow null values
      validate: {
        notEmpty: true, // Ensure the value is not an empty string
      }
      }
    });
  
    return Contact;
  };
  