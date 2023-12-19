
const { authJwt } = require("../middleware");
const controller = require("../controllers/country.controller");

module.exports = app => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
    const country = require("../controllers/country.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all Tutorials
    router.get("/", country.findAll);
  
    app.use('/api/countries', router);

    app.post(
      "/api/country/add",
      controller.findOrCreate,
    );
    app.get(
      "/api/country/:country_code",
      controller.findOne
    );
    app.put(
      "/api/country/:country_code",[authJwt.verifyToken, authJwt.isAdmin],
      controller.update
    );
    app.delete(
      "/api/country/:country_code",[authJwt.verifyToken, authJwt.isAdmin],
      controller.destroy
    );
  };