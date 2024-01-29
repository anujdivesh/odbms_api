const db = require("../models");
const config = require("../config/auth.config");
const Project = db.project;

const Op = db.Sequelize.Op;

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    
    Project.findAll()
    .then(data => {
      if( data.length==0){
        res.status(200).send({message:'No Projects Found!'})
      }
    else{
    res.status(200).send(data);
    }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving projects."
      });
    });
};

/*
exports.findOrCreate = async(req, res) => {
  return Project.findOrCreate({
    where:{
      short_name:{[Op.like] :req.body.short_name}
    },
    defaults:{
      short_name: req.body.short_name,
      name: req.body.name
    }
  })
    .then(async(project) => {
      
      await project.setCountries(req.body.country)
      if (!project) {
        return res.status(500).send({ message: "Params cannot be empty." });
      }
      if (project[1]==true){
        res.status(200).send({message:'Project Created.'})
      }
      else{
        res.status(200).send({message:'Project Exists.'})
      }
  })
    .catch((err) => {
      res.status(500).send({ message: "An Error Occurred."+err });
      
    });
};
*/

exports.findOrCreate = (req, res) => {
  return Project.findOrCreate({
    where:{
      project_code:req.body.project_code
    },
    defaults:{
      project_code: req.body.project_code,
      project_name: req.body.project_name
    }
  })
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: "An Error Occurred."+err });
      }
      if (data[1]==true){
        res.status(200).send({message:'Project Created.'})
      }
      else{
        res.status(200).send({message:'Project Exists.'})
      }
  })
    .catch((err) => {
      res.status(404).send({ message: "An Error Occurred."+err });
      
    });
};


exports.findOne = (req, res) => {

  Project.findAll({
    where:{id:req.params.id}
  })
  .then(metadata => {
    if (metadata.length==0){
      res.status(404).send({message:"No Records Found."});
    }
    else{
    res.send(metadata);
    }
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving metadata."
    });
  });
    
    
};


exports.update = async(req, res) => {

  try{
    const countryId = req.params.id;
    const cont = await Project.findByPk(countryId);
  
    if (!cont) {
      return res.status(404).json({ message: 'Project not found' });
    }
    else{
      if (req.body.project_code != null){
      cont.project_code = req.body.project_code
      }
      if (req.body.project_name != null){
        cont.project_name = req.body.project_name
        }
    await cont.save();
  
    res.status(200).send({ message: "Project updated successfully!" });
    }
  }
  catch(err){
    res.status(500).json({ message: 'Please pass in all the required paramters.' });
  }



};

exports.destroy = (req,res) => {
  const countryId = req.params.id
  return Project.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(404).send({ message: "Project Not found." });
      }
      else{
        Project.destroy({where:{id:req.params.id}});
        res.status(200).send({ message: "Project deleted!" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "An Error Occurred."+err });
    });
};