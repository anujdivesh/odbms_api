
const { authJwt } = require("../middleware");
const controller = require("../controllers/metadata.controller");

module.exports = app => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
    const metadata = require("../controllers/metadata.controller.js");
  
    var router = require("express").Router();
  
    router.get("/", controller.getListingASC);
  
    app.get('/api/metadata/orderby/:orderby', controller.getListingASC);

    app.post(
        "/api/metadata/add",[authJwt.verifyToken, authJwt.isAdmin],
        controller.findOrCreate
      );
      app.delete(
        "/api/metadata/:id",[authJwt.verifyToken, authJwt.isAdmin],
        controller.deletemetadata
      );
      app.put(
        "/api/metadata/:id",[authJwt.verifyToken, authJwt.isAdmin],
        controller.updateMetadata
      );
      app.get(
        "/api/metadata",
        controller.getListing
      );
      app.get(
        "/api/metadata/id/:id",
        controller.getListingid
      );
      app.get(
        "/api/auth/metadata/id/:id",[authJwt.verifyToken, authJwt.isAdmin],
        controller.getListingidauth,
      );
      app.get(
        "/api/auth/metadata/is_checked/:is_checked",[authJwt.verifyToken, authJwt.isAdmin],
        controller.getListingauthchecked
      );
      app.get(
        "/api/auth/metadata/is_restricted/:is_restricted",[authJwt.verifyToken, authJwt.isAdmin],
        controller.getListingauthrestricted
      );
      app.get(
        "/api/auth/metadata",[authJwt.verifyToken, authJwt.isAdmin],
        controller.getListingauth
      );
      app.get(
        "/api/auth/metadata/orderby/:orderby",[authJwt.verifyToken, authJwt.isAdmin],
        controller.getListingASCauth
      );
      app.get(
        "/api/metadata/findByExtent",
        controller.findByExtent
      );
      app.get(
        "/api/metadata/findByMultipleParam",
        controller.getListingTitle
      );
      app.get(
        "/api/metadata/findByPoint",
        controller.findByPoint
      );
      app.get(
        "/api/auth/metadata/findByExtent",
        controller.findByExtentauth
      );
      app.get(
        "/api/auth/metadata/findByMultipleParam",
        controller.getListingTitleauth
      );
      app.get(
        "/api/auth/metadata/findByPoint",
        controller.findByPointauth
      );
  };