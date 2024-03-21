module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("member", {
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
  country_id : {
    allowNull: false,
     type: Sequelize.STRING
 }
  });

  return User;
};
