
const { authJwt } = require("../middleware");
const controller = require("../controllers/datatype.controller");
module.exports = app => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
    const datatype = require("../controllers/datatype.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all Tutorials
    router.get("/", datatype.findAll);
  
    app.use('/api/datatypes', router);

    app.post(
      "/api/datatype/add",[authJwt.verifyToken, authJwt.isAdmin],
      controller.findOrCreate
    );
    app.get(
      "/api/datatype/:datatype_code",
      controller.findOne
    );
    app.put(
      "/api/datatype/:datatype_code",[authJwt.verifyToken, authJwt.isAdmin],
      controller.update
    );
    app.delete(
      "/api/datatype/:datatype_code",[authJwt.verifyToken, authJwt.isAdmin],
      controller.destroy
    );
  };