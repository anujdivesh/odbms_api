
const { authJwt } = require("../middleware");
const controller = require("../controllers/license.controller");
module.exports = app => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
    const license = require("../controllers/license.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all Tutorials
    router.get("/", license.findAll);
  
    app.use('/api/licenses', router);

    app.post(
      "/api/license/add",[authJwt.verifyToken, authJwt.isAdmin],
      controller.findOrCreate
    );
    app.get(
      "/api/license/:id",
      controller.findOne
    );
    app.put(
      "/api/license/:id",[authJwt.verifyToken, authJwt.isAdmin],
      controller.update
    );
    app.delete(
      "/api/license/:id",[authJwt.verifyToken, authJwt.isAdmin],
      controller.destroy
    );
  };