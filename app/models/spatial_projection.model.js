module.exports = (sequelize, Sequelize) => {
    const SpatialProjection = sequelize.define("spatial_projection", {
      name: {
        type: Sequelize.STRING,
        allowNull: false, // Disallow null values
      validate: {
        notEmpty: true, // Ensure the value is not an empty string
      }
      }
    });
  
    return SpatialProjection;
  };
  