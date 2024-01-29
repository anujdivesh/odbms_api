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
      short_name:req.body.short_name
    },
    defaults:{
      short_name: req.body.short_name,
      standard_name: req.body.standard_name,
      long_name: req.body.long_name,
      units: req.body.units,
      uri: req.body.uri
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

  const countryId = req.params.short_name
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
    const countryId = req.params.short_name;
    const cont = await Parameter.findByPk(countryId);
  
    if (!cont) {
      return res.status(404).json({ message: 'Parameter not found' });
    }
    else{
  
      //project.short_name = req.body.short_name,
      if (req.body.name != null){
      cont.name = req.body.name
      }
      if (req.body.units != null){
        cont.units = req.body.units
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
  const countryId = req.params.short_name
  console.log(countryId)
  return Parameter.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(404).send({ message: "Parameter Not found." });
      }
      else{
        Parameter.destroy({where:{short_name:req.params.short_name}});
        res.status(200).send({ message: "Parameter deleted!" });
      }
    })
    .catch((err) => {
      res.status(404).send({ message: "An Error Occurred."+err });
    });
};