module.exports = (sequelize, Sequelize) => {
    const Defineextent = sequelize.define("defineextent", {
      name: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false, // Disallow null values
      validate: {
        notEmpty: true, // Ensure the value is not an empty string
      }
      }
    });  
    return Defineextent;
  };
  