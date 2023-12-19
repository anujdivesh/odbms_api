
const { authJwt } = require("../middleware");
const controller = require("../controllers/defineextent.controller");

module.exports = app => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
    const defineextent = require("../controllers/defineextent.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all Tutorials
    router.get("/", defineextent.findAll);
  
    app.use('/api/defineextents', router);

    app.post(
      "/api/defineextent/add",[authJwt.verifyToken, authJwt.isAdmin],
      controller.findOrCreate
    );
    app.get(
      "/api/defineextent/:name",
      controller.findOne
    );
    app.delete(
      "/api/defineextent/:name",[authJwt.verifyToken, authJwt.isAdmin],
      controller.destroy
    );
   
  };