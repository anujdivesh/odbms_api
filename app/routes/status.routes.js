
const { authJwt } = require("../middleware");
const controller = require("../controllers/status.controller");
module.exports = app => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
    const status = require("../controllers/status.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all Tutorials
    router.get("/", status.findAll);
  
    app.use('/api/status', router);

    app.post(
      "/api/status/add",[authJwt.verifyToken, authJwt.isAdmin],
      controller.findOrCreate
    );
    app.get(
      "/api/status/:id",
      controller.findOne
    );
    app.put(
      "/api/status/:id",[authJwt.verifyToken, authJwt.isAdmin],
      controller.update
    );
    app.delete(
      "/api/status/:id",[authJwt.verifyToken, authJwt.isAdmin],
      controller.destroy
    );
  };