module.exports = app => {
    const sourceurl = require("../controllers/sourceurl.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all Tutorials
    router.get("/", sourceurl.findAll);
  
    app.use('/api/sourceurls', router);
  };