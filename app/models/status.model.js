module.exports = (sequelize, Sequelize) => {
    const Status = sequelize.define("status", {
      name: {
        type: Sequelize.STRING,
        allowNull: false, // Disallow null values
      validate: {
        notEmpty: true, // Ensure the value is not an empty string
      }
      }
    });  
    return Status;
  };
  