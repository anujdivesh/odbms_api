const db = require("../models");
const config = require("../config/auth.config");
const Flag = db.flag;

const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
    
    Flag.findAll()
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
  return Flag.findOrCreate({
    where:{
      name:req.body.name
    },
    defaults:{
      name: req.body.name
    }
  })
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: "Params cannot be empty." });
      }
      if (data[1]==true){
        res.status(200).send({message:'Flag Created.'})
      }
      else{
        res.status(200).send({message:'Flag Exists.'})
      }
  })
    .catch((err) => {
      res.status(404).send({ message: "An Error Occurred."+err });
      
    });
};

exports.findOne = (req, res) => {

  const countryId = req.params.id
  return Flag.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(404).send({ message: "Flag Not found." });
      }
      else{
        res.status(200).send(countryId);
      }
    })
    .catch((err) => {
      res.status(404).send({ message: "An Error Occurred."+err });
    });
    
};

exports.update = (req, res) => {
  const countryId = req.params.id
  return Flag.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(404).send({ message: "Flag Not found." });
      }
      else{
        Flag.update(
          {
            name: req.body.name,
        },{
          where:{
            id:req.params.id
          }
        })
          .then(data => {
            console.log(data)
            if (data == 1){
              res.status(200).send({message:'Flag updated.'})
            }
            else{
              res.status(404).send({message:'Flag does not exist.'})
            }
        })
      }
    })
    .catch((err) => {
      res.status(404).send({ message: "An Error Occurred."+err });
    });

};

exports.destroy = (req,res) => {
  const countryId = req.params.id
  console.log(countryId)
  return Flag.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(404).send({ message: "Flag Not found." });
      }
      else{
        Flag.destroy({where:{id:req.params.id}});
        res.status(200).send({ message: "Flag deleted!" });
      }
    })
    .catch((err) => {
      res.status(404).send({ message: "An Error Occurred."+err });
    });
};