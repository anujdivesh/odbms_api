
const { authJwt } = require("../middleware");
const controller = require("../controllers/defineurl.controller");
module.exports = app => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
    const defineurl = require("../controllers/defineurl.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all Tutorials
    router.get("/", defineurl.findAll);
  
    app.use('/api/defineurls', router);

    app.post(
      "/api/defineurl/add",[authJwt.verifyToken, authJwt.isAdmin],
      controller.findOrCreate
    );
    app.get(
      "/api/defineurl/:name",
      controller.findOne
    );
    app.delete(
      "/api/defineurl/:name",[authJwt.verifyToken, authJwt.isAdmin],
      controller.destroy
    );
   
  };