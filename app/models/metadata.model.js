module.exports = (sequelize, Sequelize) => {
    const MetaData = sequelize.define("metadata", {
      title: {
        type: Sequelize.STRING,
        allowNull: false, // Disallow null values
      validate: {
        notEmpty: true, // Ensure the value is not an empty string
      }
      },
      description: {
        type: Sequelize.STRING
      },
      temportal_coverage_from: {
        type: Sequelize.DATE
      },
      temportal_coverage_to: {
        type: Sequelize.DATE
      },
      language: {
        type: Sequelize.STRING,
        defaultValue:"en"
      },
      version: {
        type: Sequelize.STRING,
        default:"v1.0.0"
      },
      datatype:{
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true, // Ensure the value is not an empty string
        }
        },
    spatial_projection_id:{
        type: Sequelize.INTEGER,
        notNull: true,
        defaultValue:1
        },
    license_id:{
        type: Sequelize.INTEGER,
        notNull: true,
        defaultValue:1
        },
    project_id:{
        type: Sequelize.STRING,
        notNull: true,
        defaultValue:"COSPPAC"
        },
    publisher_id:{
        type: Sequelize.INTEGER,
        },
    user_created_id:{
      type: Sequelize.INTEGER,
      },
    is_checked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
    is_restricted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    });
  
    return MetaData;
  };
  