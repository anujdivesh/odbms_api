const db = require("../models");
const config = require("../config/auth.config");
const Spatial_extent = db.spatial_extent;
const MetaData = db.metadata;

const Op = db.Sequelize.Op;

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    
    Spatial_extent.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

exports.create = (req, res) => {
  return Spatial_extent.create({
    name: req.body.name,
  })
    .then((spatial_extent) => {
      res.send(spatial_extent)
    })
    .catch((err) => {
      console.log(">> Error while creating Tag: ", err);
    });
};

exports.addMetadata = (req, res) => {
  return Spatial_extent.findByPk(req.body.id)
    .then((tag) => {
      if (!tag) {
        console.log("Tag not found!");
        return null;
      }
      return MetaData.findByPk(req.body.metadata).then((tutorial) => {
        if (!tutorial) {
          console.log("Tutorial not found!");
          return null;
        }

        tag.addMetadata(tutorial)
        res.send('spatialExtent added')
        
      });
    })
    .catch((err) => {
      console.log(">> Error while adding Tutorial to Tag: ", err);
    });
};