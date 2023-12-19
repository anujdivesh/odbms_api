module.exports = (sequelize, Sequelize) => {
    const Topic = sequelize.define("topic", {
      name: {
        type: Sequelize.STRING,
        allowNull: false, // Disallow null values
      validate: {
        notEmpty: true, // Ensure the value is not an empty string
      }
      }
    });  
    return Topic;
  };
  