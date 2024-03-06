const db = require("../models");
const config = require("../config/auth.config");
const Contact = db.contact;

const Op = db.Sequelize.Op;

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    
    Contact.findAll()
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
          err.message || "Some error occurred while retrieving contacts."
      });
    });
};

exports.findOrCreate = (req, res) => {
    return Contact.findOrCreate({
      where:{
        email:req.body.email
      },
      defaults:{
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        position:req.body.position,
        email: req.body.email
      }
    })
      .then(data => {
        if (!data) {
          return res.status(404).send({ message: "An Error Occurred."+err });
        }
        if (data[1]==true){
          res.status(200).send({message:'Contact Created.'})
        }
        else{
          res.status(200).send({message:'Contact Exists.'})
        }
    })
      .catch((err) => {
        res.status(404).send({ message: "An Error Occurred."+err });
        
      });
  };


exports.findOne = (req, res) => {
  const countryId = req.params.id
  return Contact.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(200).send({ message: "Contact Not found." });
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
    const countryId = req.params.id;
    const cont = await Contact.findByPk(countryId);
  
    if (!cont) {
      return res.status(200).json({ message: 'Contact not found' });
    }
    else{
  
      //project.short_name = req.body.short_name,
      if (req.body.first_name != null){
      cont.first_name = req.body.first_name
      }
      if (req.body.last_name != null){
        cont.last_name = req.body.last_name
        }
        if (req.body.position != null){
          cont.position = req.body.position
          }
          if (req.body.email != null){
            cont.email = req.body.email
            }
    await cont.save();
  
    res.status(200).send({ message: "Contact updated successfully!" });
    }
  }
  catch(err){
    res.status(500).json({ message: 'Please pass in all the required paramters.' });
  }



};

exports.destroy = (req,res) => {
  const countryId = req.params.id
  return Contact.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(200).send({ message: "Contact Not found." });
      }
      else{
        Contact.destroy({where:{id:req.params.id}});
        res.status(200).send({ message: "Contact deleted!" });
      }
    })
    .catch((err) => {
      res.status(404).send({ message: "An Error Occurred."+err });
    });
};