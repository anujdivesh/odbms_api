
const { authJwt } = require("../middleware");
const controller = require("../controllers/tag.controller");
module.exports = app => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
    const tag = require("../controllers/tag.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all Tutorials
    router.get("/", tag.findAll);
  
    app.use('/api/tags', router);

    app.post(
      "/api/tag/add",[authJwt.verifyToken, authJwt.isAdmin],
      controller.findOrCreate
    );
    app.get(
      "/api/tag/:id",
      controller.findOne
    );
    app.put(
      "/api/tag/:id",[authJwt.verifyToken, authJwt.isAdmin],
      controller.update
    );
    app.delete(
      "/api/tag/:id",[authJwt.verifyToken, authJwt.isAdmin],
      controller.destroy
    );
  };