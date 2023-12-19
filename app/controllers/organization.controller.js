const db = require("../models");
const config = require("../config/auth.config");
const Organization = db.organization;

const Op = db.Sequelize.Op;

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    
  Organization.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving organizations."
      });
    });
};

exports.findOrCreate = (req, res) => {
  return Organization.findOrCreate({
    where:{
      short_name:{[Op.like] :req.body.short_name}
    },
    defaults:{
      short_name: req.body.short_name,
      name: req.body.name,
      website: req.body.website
    }
  })
    .then(data => {
      if (!data) {
        return res.status(500).send({ message: "Params cannot be empty." });
      }
      if (data[1]==true){
        res.status(200).send({message:'Organization Created.'})
      }
      else{
        res.status(200).send({message:'Organization Exists.'})
      }
  })
    .catch((err) => {
      res.status(500).send({ message: "An Error Occurred."+err });
      
    });
};

exports.findOne = (req, res) => {

  const countryId = req.params.short_name
  return Organization.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(404).send({ message: "Organization not found." });
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
  const countryId = req.params.short_name;
  const org = await Organization.findByPk(countryId);

  if (!org) {
    return res.status(404).json({ message: 'Organization not found' });
  }
  else{

    //project.short_name = req.body.short_name,
    if (req.body.name != null){
    org.name = req.body.name
    }
    if (req.body.website != null){
      org.website = req.body.website
      }
  await org.save();

  res.status(200).send({ message: "Organization updated successfully!" });
  }
}
catch(err){
  res.status(500).json({ message: 'Please pass in all the required paramters.' });
}
};

exports.destroy = (req,res) => {
  const countryId = req.params.short_name
  return Organization.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(404).send({ message: "Organization Not found." });
      }
      else{
        Organization.destroy({where:{short_name:req.params.short_name}});
        res.status(200).send({ message: "Organization deleted!" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "An Error Occurred."+err });
    });
};