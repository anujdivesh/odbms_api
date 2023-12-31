module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("member", {
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    organization_id : {
      type: Sequelize.INTEGER
  },
  country_id : {
    allowNull: false,
     type: Sequelize.STRING
 }
  });

  return User;
};
