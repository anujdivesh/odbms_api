
const { authJwt } = require("../middleware");
const controller = require("../controllers/request.controller");

module.exports = app => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
    const request = require("../controllers/request.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all Tutorials
    router.get("/", request.findAll);

  
    app.use('/api/requests', router);


    app.post("/api/requestuser", controller.findAllbyUser);

    app.post(
      "/api/request/add",[authJwt.verifyToken, authJwt.isRegisteredOrAdmin],
      controller.findOrCreate
    );
    app.get(
      "/api/request/:id",
      controller.findOne
    );
    app.put(
      "/api/requestuser/:id",[authJwt.verifyToken, authJwt.isRegisteredOrAdmin],
      controller.update
    );
    app.delete(
      "/api/requestuser/:id",[authJwt.verifyToken, authJwt.isRegisteredOrAdmin],
      controller.destroy
    );
    app.put(
      "/api/request/:id",[authJwt.verifyToken, authJwt.isAdmin],
      controller.updateadmin
    );
    app.delete(
      "/api/request/:id",[authJwt.verifyToken, authJwt.isAdmin],
      controller.destroyadmin
    );
   
  };