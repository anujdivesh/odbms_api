const db = require("../models");
const config = require("../config/auth.config");
const datatype = db.data_type;

const Op = db.Sequelize.Op;

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    
    datatype.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data types."
      });
    });
};

exports.findOrCreate = (req, res) => {
  return datatype.findOrCreate({
    where:{
      datatype_code:{[Op.like] :req.body.datatype_code}
    },
    defaults:{
      datatype_code: req.body.datatype_code,
      datatype_name: req.body.datatype_name,
    }
  })
    .then(data => {
      if (!data) {
        return res.status(500).send({ message: "Params cannot be empty." });
      }
      if (data[1]==true){
        res.status(200).send({message:'Data Type Created.'})
      }
      else{
        res.status(200).send({message:'Data Type Exists.'})
      }
  })
    .catch((err) => {
      res.status(500).send({ message: "An Error Occurred."+err });
      
    });
};

exports.findOne = (req, res) => {

  const countryId = req.params.datatype_code
  return datatype.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(404).send({ message: "Data type not found." });
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
  const countryId = req.params.datatype_code
  return datatype.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(404).send({ message: "Data type Not found." });
      }
      else{
        datatype.update(
          {
            datatype_name: req.body.datatype_name,
        },{
          where:{
            datatype_code:req.params.datatype_code
          }
        })
          .then(data => {
            console.log(data)
            if (data == 1){
              res.status(200).send({message:'Data type updated.'})
            }
            else{
              res.status(500).send({message:'Data type does not exist.'})
            }
        })
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "An Error Occurred."+err });
    });

};

exports.destroy = (req,res) => {
  const countryId = req.params.datatype_code
  return datatype.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(404).send({ message: "Data type Not found." });
      }
      else{
        datatype.destroy({where:{datatype_code:req.params.datatype_code}});
        res.status(200).send({ message: "Data type deleted!" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "An Error Occurred."+err });
    });
};