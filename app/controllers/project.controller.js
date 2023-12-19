const db = require("../models");
const config = require("../config/auth.config");
const Project = db.project;

const Op = db.Sequelize.Op;

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    
    Project.findAll({
      include: [
        {
          model: db.country,
          attributes: ['country_code','country_name'],
          through:{ attributes:[]}
        },
      ]
    })
    .then(data => {
      res.send(data);
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

exports.findOrCreate = async(req, res) => {
  try{
  const checker = await Project.findAll({
    where:{ 
      project_code: req.body.project_code
     
    }
  });
  var countrys = req.body.countries;
  var boolcheck = true;
  for(let i = 0 ; i < countrys.length ; i++) {
    const checker2 = await db.country.findOne({
      where:{ 
        country_code: countrys[i]
       
      }
    });
    if (checker2.length==0){
      //res.status(500).send({ message: "Country does not exist!" });
      boolcheck =false;
    }
  }
  


  if (checker.length==0 && boolcheck==true){
    Project.create({
      project_code: req.body.project_code,
      project_name:req.body.project_name
    })
      .then(async(project) => {
        
        project.setCountries(req.body.countries)
        res.send({ message: "Project registered successfully!" });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });}
      else{
        res.status(404).send({ message: "Project Exists!" });
      }
      
    }
    catch(err){
      res.status(404).send({ message: "Please specify all the required parameters." });
    }
};


exports.findOne = (req, res) => {

  Project.findAll({
    where:{project_code:req.params.project_code},
    include: [
      {
        model: db.country,
        //attributes: ['short_name','name'],
        through:{ attributes:[]},
      }
    ]
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
  const countryId = req.params.project_code;
  const project = await Project.findByPk(countryId);
  var countrys = req.body.countries;
  var boolcheck = true;
  if(req.body.countries != null){
  for(let i = 0 ; i < countrys.length ; i++) {
    console.log(countrys[i])
    const checker2 = await db.country.findOne({
      where:{ 
        country_code: countrys[i]
       
      }
    });
    if (checker2.length==0){
      //res.status(500).send({ message: "Country does not exist!" });
      boolcheck =false;
    }
  }
}


  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }
  else{

  if (boolcheck==true){
    //project.short_name = req.body.short_name,
    if (req.body.project_name != null){
    project.project_name = req.body.project_name
    }
    if (req.body.countries != null){
    await project.setCountries(req.body.countries)
    }
    
  await project.save();

  res.status(200).send({ message: "Project updated successfully!" });
  }
  else{
    res.status(500).json({ message: 'Country does not exist.' });
  }
  }
}
catch(err){
  res.status(500).json({ message: 'Please pass in all the required paramters.' });
}

};

exports.destroy = (req,res) => {
  const countryId = req.params.project_code
  return Project.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(404).send({ message: "Project Not found." });
      }
      else{
        Project.destroy({where:{project_code:req.params.project_code}});
        res.status(200).send({ message: "Project deleted!" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "An Error Occurred."+err });
    });
};