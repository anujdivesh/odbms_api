module.exports = (sequelize, Sequelize) => {
    const Tag = sequelize.define("tag", {
      name: {
        type: Sequelize.STRING,
        allowNull: false, // Disallow null values
      validate: {
        notEmpty: true, // Ensure the value is not an empty string
      }
      }
    });  
    return Tag;
  };
  