module.exports = (sequelize, Sequelize) => {
    const Defineurl = sequelize.define("defineurl", {
      name: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false, // Disallow null values
      validate: {
        notEmpty: true, // Ensure the value is not an empty string
      }
      }
    });  
    return Defineurl;
  };
  