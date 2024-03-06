const db = require("../models");
const config = require("../config/auth.config");
const Defineextent = db.defineextent;

const Op = db.Sequelize.Op;

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    
    Defineextent.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving extent definitions."
      });
    });
};


exports.findOrCreate = (req, res) => {
  return Defineextent.findOrCreate({
    where:{
      name:{[Op.like] :req.body.name}
    },
    defaults:{
      name: req.body.name,
    }
  })
    .then(data => {
      if (!data) {
        return res.status(500).send({ message: "Params cannot be empty." });
      }
      if (data[1]==true){
        res.status(200).send({message:'Extent Definition Created.'})
      }
      else{
        res.status(200).send({message:'Extent Definition Exists.'})
      }
  })
    .catch((err) => {
      res.status(500).send({ message: "An Error Occurred."+err });
      
    });
};

exports.findOne = (req, res) => {

  const countryId = req.params.name
  return Defineextent.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(200).send({ message: "Extent Definition not found." });
      }
      else{
        res.status(200).send(countryId);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "An Error Occurred."+err });
    });
    
};

exports.update = (req, res) => {
  const countryId = req.body.name_old
  const nameNew = req.body.name_new
  return Defineextent.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(200).send({ message: "Extent Definition Not found." });
      }
      else{
        Defineextent.update(
          {
          name: req.body.name_new,
        },{
          where:{
            name:req.body.name_old
          }
        })
          .then(data => {
            console.log(data)
            if (data == 1){
              res.status(200).send({message:'Extent Definition updated.'})
            }
            else{
              res.status(500).send({message:'Extent Definition does not exist.'})
            }
        })
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "An Error Occurred."+err });
    });

};

exports.destroy = (req,res) => {
  const countryId = req.params.name
  return Defineextent.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(200).send({ message: "Extent Definition Not found." });
      }
      else{
        Defineextent.destroy({where:{name:req.params.name}});
        res.status(200).send({ message: "Extent Definition deleted!" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "An Error Occurred."+err });
    });
};