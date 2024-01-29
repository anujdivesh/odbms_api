module.exports = (sequelize, Sequelize) => {
    const Request = sequelize.define("request", {
      user_request_id: {
        type: Sequelize.STRING,
        allowNull: false, // Disallow null values
      validate: {
        notEmpty: true, // Ensure the value is not an empty string
      }
      },
      status: {
        type: Sequelize.STRING
      },
      comments: {
        type: Sequelize.STRING
      },
      download_link: {
        type: Sequelize.STRING
      }
    });
  
    return Request;
  };
  