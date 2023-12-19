const db = require("../models");
const config = require("../config/auth.config");
const Topic = db.topic;

const Op = db.Sequelize.Op;

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    
    Topic.findAll()
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
  return Topic.findOrCreate({
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
        res.status(200).send({message:'Topic Created.'})
      }
      else{
        res.status(200).send({message:'Topic Exists.'})
      }
  })
    .catch((err) => {
      res.status(500).send({ message: "An Error Occurred."+err });
      
    });
};

exports.findOne = (req, res) => {

  const countryId = req.params.id
  return Topic.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(404).send({ message: "Topic not found." });
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
  const countryId = req.params.id
  return Topic.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(404).send({ message: "Topic Not found." });
      }
      else{
        Topic.update(
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
              res.status(200).send({message:'Topic updated.'})
            }
            else{
              res.status(500).send({message:'Topic does not exist.'})
            }
        })
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "An Error Occurred."+err });
    });

};

exports.destroy = (req,res) => {
  const countryId = req.params.id
  return Topic.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(404).send({ message: "Topic Not found." });
      }
      else{
        Topic.destroy({where:{id:req.params.id}});
        res.status(200).send({ message: "Topic deleted!" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "An Error Occurred."+err });
    });
};