
const { authJwt } = require("../middleware");
const controller = require("../controllers/flag.controller");

module.exports = app => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
    const flag = require("../controllers/flag.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all Tutorials
    router.get("/", flag.findAll);
  
    app.use('/api/flags', router);

    app.post(
      "/api/flag/add",
      controller.findOrCreate,
    );
    app.get(
      "/api/flag/:id",
      controller.findOne
    );
    app.put(
      "/api/flag/:id",[authJwt.verifyToken, authJwt.isAdmin],
      controller.update
    );
    app.delete(
      "/api/flag/:id",[authJwt.verifyToken, authJwt.isAdmin],
      controller.destroy
    );
  };