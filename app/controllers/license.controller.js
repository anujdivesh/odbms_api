const db = require("../models");
const config = require("../config/auth.config");
const License = db.license;

const Op = db.Sequelize.Op;

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    
    License.findAll()
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


exports.findOrCreate = (req, res) => {
  return License.findOrCreate({
    where:{
      short_name:{[Op.like] :req.body.short_name}
    },
    defaults:{
      short_name: req.body.short_name,
      name: req.body.name,
      url: req.body.url,
    }
  })
    .then(data => {
      if (!data) {
        return res.status(500).send({ message: "Params cannot be empty." });
      }
      if (data[1]==true){
        res.status(200).send({message:'License Created.'})
      }
      else{
        res.status(200).send({message:'License Exists.'})
      }
  })
    .catch((err) => {
      res.status(500).send({ message: "An Error Occurred."+err });
      
    });
};

exports.findOne = (req, res) => {

  const countryId = req.params.id
  return License.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(404).send({ message: "License not found." });
      }
      else{
        res.status(200).send(countryId);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "An Error Occurred."+err });
    });
    
};

exports.update = async(req, res) => {

  try{
    const countryId = req.params.id
    const cont = await License.findByPk(countryId);
  
    if (!cont) {
      return res.status(404).json({ message: 'License not found' });
    }
    else{
  
      //project.short_name = req.body.short_name,
      if (req.body.short_name != null){
      cont.short_name = req.body.short_name
      }
      if (req.body.name != null){
        cont.name = req.body.name
        }
        if (req.body.url != null){
          cont.url = req.body.url
          }
    await cont.save();
  
    res.status(200).send({ message: "License updated successfully!" });
    }
  }
  catch(err){
    res.status(500).json({ message: 'Please pass in all the required paramters.' });
  }

};

exports.destroy = (req,res) => {
  const countryId = req.params.id
  return License.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(404).send({ message: "License not found." });
      }
      else{
        License.destroy({where:{id:req.params.id}});
        res.status(200).send({ message: "License deleted!" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "An Error Occurred."+err });
    });
};