
const { authJwt } = require("../middleware");
const controller = require("../controllers/parameter.controller");

module.exports = app => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
    const parameter = require("../controllers/parameter.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all Tutorials
    router.get("/", parameter.findAll);
  
    app.use('/api/parameters', router);

    app.post(
      "/api/parameter/add",[authJwt.verifyToken, authJwt.isAdmin],
      controller.findOrCreate,
    );
    app.get(
      "/api/parameter/:short_name",
      parameter.findOne
    );
    app.put(
      "/api/parameter/:short_name",[authJwt.verifyToken, authJwt.isAdmin],
      controller.update
    );
    app.delete(
      "/api/parameter/:short_name",[authJwt.verifyToken, authJwt.isAdmin],
      controller.destroy
    );
  };