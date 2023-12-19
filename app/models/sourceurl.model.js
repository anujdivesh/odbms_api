module.exports = (sequelize, Sequelize) => {
    const Sourceurl = sequelize.define("sourceurl", {
      value: {
        type: Sequelize.STRING
      },
      is_restricted:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });  
    return Sourceurl;
  };
  