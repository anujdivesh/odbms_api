
const controller = require("../controllers/spatial_extent.controller");

module.exports = app => {
  
    const spatial_extent = require("../controllers/spatial_extent.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all Tutorials
    router.get("/", spatial_extent.findAll);
  
    app.use('/api/spatial_extents', router);

    app.post(
      "/api/spatial_extents/add",
      spatial_extent.create
    );
    app.post(
      "/api/spatial_extents/addmeta",
      spatial_extent.addMetadata
    );
  };