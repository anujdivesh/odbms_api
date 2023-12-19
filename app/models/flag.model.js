module.exports = (sequelize, Sequelize) => {
    const Flag = sequelize.define("flag", {
      name: {
        type: Sequelize.STRING,
        allowNull: false, // Disallow null values
      validate: {
        notEmpty: true, // Ensure the value is not an empty string
      }
      }
    });
  
    return Flag;
  };
  