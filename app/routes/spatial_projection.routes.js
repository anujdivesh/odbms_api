
const { authJwt } = require("../middleware");
const controller = require("../controllers/spatial_projection.controller");
module.exports = app => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
    const spatial_projection = require("../controllers/spatial_projection.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all Tutorials
    router.get("/", spatial_projection.findAll);
  
    app.use('/api/spatialprojections', router);

    app.post(
      "/api/spatialprojection/add",[authJwt.verifyToken, authJwt.isAdmin],
      controller.findOrCreate
    );
    app.get(
      "/api/spatialprojection/:id",
      controller.findOne
    );
    app.put(
      "/api/spatialprojection/:id",[authJwt.verifyToken, authJwt.isAdmin],
      controller.update
    );
    app.delete(
      "/api/spatialprojection/:id",[authJwt.verifyToken, authJwt.isAdmin],
      controller.destroy
    );
  };