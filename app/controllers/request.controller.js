const db = require("../models");
const config = require("../config/auth.config");
const Request = db.request;
const Metadata = db.metadata;
const Status = db.status;
const Op = db.Sequelize.Op;

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    
    Request.findAll({
        order: [['createdAt', 'DESC']], // Assuming createdAt is the ti
        include: [
          {
            model: Metadata,
            attributes:['id'],
            through:{ attributes:[]}
          },
          {
            model: Status,
            attributes:['id','name']
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
            err.message || "Some error occurred while retrieving requests."
        });
      });

};

exports.findAllbyUser = (req, res) => {
    
  Request.findAll({
    order: [['createdAt', 'DESC']], // Assuming createdAt is the ti
    where:{user_request_id:req.body.user_request_id},
    include: [
      {
        model: Metadata,
        attributes:['id'],
        through:{ attributes:[]}
      },
      {
        model: Status,
        attributes:['id','name']
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
        err.message || "Some error occurred while retrieving requests."
    });
  });

};

exports.findOrCreate = async(req, res) => {
    try{
     //requests check
  var requestarr =[]
  let ans = Array.isArray(req.body.requests);
  if (!ans){
    requestarr.push(req.body.requests)
  }
  else{
    requestarr = req.body.requests
  }


    Request.create({
        user_request_id: req.body.user_request_id,
        comments:req.body.comments,
        download_link: req.body.download_link,
        status_id:req.body.status_id,
      
    })
    .then(async(request) => {
        //console.log(requestarr)
        request.setMetadata(requestarr);
        res.send({ message: "Request submitted successfully!" });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });

    }
    catch(err){
      console.log(err)
      res.status(404).send({ message: "Please specify all the required parameters." });
    }
  };


exports.findOne = (req, res) => {
  const countryId = req.params.id
  Request.findAll({
    order: [['createdAt', 'DESC']], // Assuming createdAt is the ti
    where:{id:countryId},
    include: [
      {
        model: Metadata,
        attributes:['id'],
        through:{ attributes:[]}
      },
      {
        model: Status,
        attributes:['id','name']
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
        err.message || "Some error occurred while retrieving requests."
    });
  });
    
};

exports.update = async(req, res) => {

  try{
    const countryId = req.params.id;
    const cont = await Request.findOne({
        where:{
            id:countryId,
            user_request_id: req.body.user_request_id
        }
    });
  
    if (!cont) {
      return res.status(404).json({ message: 'Request not found' });
    }
    else{
  
      //project.short_name = req.body.short_name,
     //if (req.body.user_request_id != null){
     // cont.user_request_id = req.body.user_request_id
      //}
      if (req.body.status != null){
        cont.status = req.body.status
        }
        if (req.body.comments != null){
          cont.comments = req.body.comments
          }
          if (req.body.download_link != null){
            cont.comments = req.body.download_link
            }
            if (req.body.status_id != null){
              cont.status_id = req.body.status_id
              }
    if (req.body.metadata !=null){
       // cont.setMetadata(["2"])
        cont.setMetadata(req.body.metadata);
        }
    await cont.save();
  
    res.status(200).send({ message: "Request updated successfully!" });
    }
  }
  catch(err){
    res.status(500).json({ message: 'Please pass in all the required paramters.' });
  }



};

exports.updateadmin = async(req, res) => {

  try{
    const countryId = req.params.id;
    const cont = await Request.findOne({
        where:{
            id:countryId
        }
    });
  
    if (!cont) {
      return res.status(404).json({ message: 'Request not found' });
    }
    else{
  
      //project.short_name = req.body.short_name,
     if (req.body.user_request_id != null){
      cont.user_request_id = req.body.user_request_id
      }
      if (req.body.status != null){
        cont.status = req.body.status
        }
        if (req.body.comments != null){
          cont.comments = req.body.comments
          }
          if (req.body.download_link != null){
            cont.comments = req.body.download_link
            }
            if (req.body.status_id != null){
              cont.status_id = req.body.status_id
              }
    if (req.body.metadata !=null){
       // cont.setMetadata(["2"])
        cont.setMetadata(req.body.metadata);
        }
    await cont.save();
  
    res.status(200).send({ message: "Request updated successfully!" });
    }
  }
  catch(err){
    res.status(500).json({ message: 'Please pass in all the required paramters.' });
  }



};

exports.destroyadmin = (req,res) => {
  const countryId = req.params.id
  return Request.findByPk(countryId)
    .then((countryId) => {
      if (!countryId) {
        return res.status(404).send({ message: "Request Not found." });
      }
      else{
        Request.destroy({where:{id:req.params.id}});
        res.status(200).send({ message: "Request deleted!" });
      }
    })
    .catch((err) => {
      res.status(404).send({ message: "An Error Occurred."+err });
    });
};
exports.destroy = async(req,res) => {
  try{
    const countryId = req.params.id;
    const cont = await Request.findOne({
        where:{
            id:countryId,
            user_request_id: req.body.user_request_id
        }
    });
    if (!cont) {
      return res.status(404).json({ message: 'Request not found' });
    }
    else{
  
      cont.destroy({where:{id:req.params.id}});
      res.status(200).send({ message: "Request deleted!" });
    
    }
  }
  catch(err){
  //  console.log(err)
    res.status(500).json({ message: 'Please pass in all the required parameters.' });
  }



};