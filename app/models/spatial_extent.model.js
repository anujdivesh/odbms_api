module.exports = (sequelize, Sequelize) => {
    const SpatialExtent = sequelize.define("spatial_extent", {
      value:{
        type:Sequelize.DOUBLE
      }
    });  
    return SpatialExtent;
  };
  