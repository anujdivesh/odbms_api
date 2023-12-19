const db = require("../models");
const config = require("../config/auth.config");
const Parameter = db.parameter;

const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
    
    Parameter.findAll()
    .then(data => {
      if( data.length==0){
        res.status(200).send({message:'Empty'})
      }
      else{
        res.status(200).send(data);
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving countries."
      });
    });
};

exports.findOrCreate = (req, res) => {
  return Parameter.findOrCreate({
    where:{
      abbrev:req.body.abbrev
    },
    defaults:{
      abbrev: req.body.abbrev,
      name: req.body.name,
      unit: req.body.unit
    }
  })
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: "Params cannot be empty." });
      }
      if (data[1]==true){
        res.status(200).send({message:'Parameter Created.'})
      }
      else{
        res.status(200).send({message:'Parameter Exists.'})
      }
  })
    .catch((err) => {
      res.status(404).send({ message: "An Error Occurred."+err });
      
    });
};

exports.findOne = (req, res) => {

  const countryId = req.params.abbrev
  return Parameter.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(404).send({ message: "Parameter Not found." });
      }
      else{
        res.status(200).send(countryId);
      }
    })
    .catch((err) => {
      res.status(404).send({ message: "An Error Occurred."+err });
    });
    
};

exports.update = async(req, res) => {

  try{
    const countryId = req.params.abbrev;
    const cont = await Parameter.findByPk(countryId);
  
    if (!cont) {
      return res.status(404).json({ message: 'Parameter not found' });
    }
    else{
  
      //project.short_name = req.body.short_name,
      if (req.body.name != null){
      cont.name = req.body.name
      }
      if (req.body.unit != null){
        cont.unit = req.body.unit
        }
    await cont.save();
  
    res.status(200).send({ message: "Parameter updated successfully!" });
    }
  }
  catch(err){
    res.status(500).json({ message: 'Please pass in all the required paramters.' });
  }




};

exports.destroy = (req,res) => {
  const countryId = req.params.abbrev
  console.log(countryId)
  return Parameter.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(404).send({ message: "Parameter Not found." });
      }
      else{
        Parameter.destroy({where:{abbrev:req.params.abbrev}});
        res.status(200).send({ message: "Parameter deleted!" });
      }
    })
    .catch((err) => {
      res.status(404).send({ message: "An Error Occurred."+err });
    });
};