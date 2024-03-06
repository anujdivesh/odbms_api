const db = require("../models");
const config = require("../config/auth.config");
const { compareSync } = require("bcryptjs");
const MetaData = db.metadata;
const Data_type = db.data_type;
const Spatial_projection = db.spatial_projection;
const License = db.license;
const Project = db.project;
const Organization = db.organization;
const User = db.user;
const Country = db.country;

const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize.Sequelize;


// Retrieve all Tutorials from the database.
exports.getListing = (req, res) => {
  MetaData.findAll({
    attributes: ['id','title','description','temporal_coverage_from','temporal_coverage_to','language','version','publisher_id','is_restricted','is_checked','createdAt','updatedAt'],
    order: [['createdAt', 'DESC']], // Assuming createdAt is the timestamp of creation
    where:{is_checked:true},
    include: [
      {
        model: Data_type,
        attributes: ['id','datatype_code'],
      },
      {
        model: db.parameter,
        attributes: ['short_name','standard_name','long_name','units','uri'],
        through:{ attributes:[]}
      },
      {
        model: Country,
        attributes: ['country_code','country_name'],
        through:{ attributes:[]}
      },
      {
        model: Spatial_projection,
        attributes: ['name'],
      },
      {
        model: db.spatial_extent,
        attributes:['value','extent_name'],
        through:{ attributes:[]}
      },
      {
        model: Project,
        attributes: ['id','project_code','project_name'],
      },
      {
        model: Organization,
        attributes: ['id','short_name','name','website'],
      },
      {
        model: db.contact,
        attributes: ['id','first_name','last_name','position','email'],
      },
      {
        model: db.user,
        attributes: ['id',"first_name", "last_name","organization_id","country_id"],
      },
      {
        model: db.flag,
        attributes: ['id',"name"],
        through:{ attributes:[]}
      },
      {
        model: db.tag,
        attributes: ['id','name'],
        through:{ attributes:[]}
      },
      {
        model: db.topic,
        attributes: ['id','name'],
        through:{ attributes:[]}
      },
      {
        model: db.sourceurl,
        attributes: ['value','url_name','is_restricted'],
        required: false,
        through:{ attributes:[]},
        where:{
          is_restricted: {
          [Op.ne]: true
        }}
      },
      {
        model: License,
        attributes: ['short_name','name','url'],
      },
    ]
  })
  .then(metadata => {
    if (metadata.length==0){
      res.status(200).send({message:"No Records Found."});
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
exports.getListingTitle = async(req, res) => {
  console.log('-------------------------')
  var topic_arr=[]
  if (req.body.topic_ids != null){
    topic_arr = req.body.topic_ids;
  }
  var tag_arr=[]
  if (req.body.tag_ids != null){
    tag_arr = req.body.tag_ids;
  }
  var param_arr=[]
  if (req.body.parameters != null){
    param_arr = req.body.parameters;
  }
  console.log(tag_arr)
  MetaData.findAll({
    attributes: ['id','title','description','temporal_coverage_from','temporal_coverage_to','language','version','publisher_id','is_restricted','is_checked','createdAt','updatedAt'],
    order: [['createdAt', 'DESC']], // Assuming createdAt is the timestamp of creation
    where:{is_checked:true, 
      [Op.or]: [
        { title:{[Op.iLike]: `%${req.body.title}%`}},
        {
          '$countries.country_code$': {
            [Op.like]: req.body.country // Condition 2: Posts with titles containing 'JavaScript'
          }
        },
        {
          '$data_type.id$': {
            [Op.eq]: req.body.datatype_id // Condition 2: Posts with titles containing 'JavaScript'
          }
        },
        {
          '$parameters.short_name$': {
            [Op.in]: param_arr // Condition 2: Posts with titles containing 'JavaScript'
          }
        },
        {
          '$project.id$': {
            [Op.eq]: req.body.project // Condition 2: Posts with titles containing 'JavaScript'
          }
        },
        {
          '$tags.id$': {
            [Op.in]: tag_arr // Condition 2: Posts with tixtles containing 'JavaScript'
          }
        },
        {
          '$topics.id$': {
            [Op.in]: topic_arr // Condition 2: Posts with titles containing 'JavaScript'
          }
        }
      ]
    },
    include: [
      {
        model: Data_type,
        attributes: ['id','datatype_code'],
        required:false,
      },
      {
        model: db.parameter,
        attributes: ['short_name','standard_name','long_name','units','uri'],
        required:false,
        through:{ attributes:[]}
      },
      {
        model: Country,
        attributes: ['country_code','country_name'],
        required:false,
        through:{ attributes:[]}
      },
      {
        model: Spatial_projection,
        attributes: ['name'],
      },
      {
        model: db.spatial_extent,
        attributes:['value','extent_name'],
        through:{ attributes:[]}
      },
      {
        model: Project,
        attributes: ['id','project_code','project_name'],
        required:false,
      },
      {
        model: Organization,
        attributes: ['id','short_name','name','website'],
      },
      {
        model: db.contact,
        attributes: ['id','first_name','last_name','position','email'],
      },
      {
        model: db.user,
        attributes: ['id',"first_name", "last_name","organization_id","country_id"],
      },
      {
        model: db.flag,
        attributes: ['id',"name"],
        through:{ attributes:[]}
      },
      {
        model: db.tag,
        attributes: ['id','name'],
        through:{ attributes:[]},
        required:false,
      },
      {
        model: db.topic,
        attributes: ['id','name'],
        through:{ attributes:[]},
        required:false,
      },
      {
        model: db.sourceurl,
        attributes: ['value','url_name','is_restricted'],
        required: false,
        through:{ attributes:[]},
        where:{
          is_restricted: {
          [Op.ne]: true
        }}
      },
      {
        model: License,
        attributes: ['short_name','name','url'],
      },
    ]
  })
  .then(metadata => {
    if (metadata.length==0){
      res.status(200).send({message:"No Records Found."});
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


exports.getListingTitleauth = async(req, res) => {
  console.log('-------------------------')
  var topic_arr=[]
  if (req.body.topic_ids != null){
    topic_arr = req.body.topic_ids;
  }
  var tag_arr=[]
  if (req.body.tag_ids != null){
    tag_arr = req.body.tag_ids;
  }
  var param_arr=[]
  if (req.body.parameters != null){
    param_arr = req.body.parameters;
  }
  MetaData.findAll({
    attributes: ['id','title','description','temporal_coverage_from','temporal_coverage_to','language','version','publisher_id','is_restricted','is_checked','createdAt','updatedAt'],
    order: [['createdAt', 'DESC']], // Assuming createdAt is the timestamp of creation
    where:{
      [Op.or]: [
        { title:{[Op.iLike]: `%${req.body.title}%`}},
        {
          '$countries.country_code$': {
            [Op.like]: req.body.country // Condition 2: Posts with titles containing 'JavaScript'
          }
        },
        {
          '$data_type.id$': {
            [Op.eq]: req.body.datatype_id // Condition 2: Posts with titles containing 'JavaScript'
          }
        },
        {
          '$parameters.short_name$': {
            [Op.in]: param_arr // Condition 2: Posts with titles containing 'JavaScript'
          }
        },
        {
          '$project.id$': {
            [Op.eq]: req.body.project // Condition 2: Posts with titles containing 'JavaScript'
          }
        },
        {
          '$tags.id$': {
            [Op.in]: tag_arr // Condition 2: Posts with tixtles containing 'JavaScript'
          }
        },
        {
          '$topics.id$': {
            [Op.in]: topic_arr // Condition 2: Posts with titles containing 'JavaScript'
          }
        }
      ]
    },
    include: [
      {
        model: Data_type,
        attributes: ['id','datatype_code'],
        required:false,
      },
      {
        model: db.parameter,
        attributes: ['short_name','standard_name','long_name','units','uri'],
        required:false,
        through:{ attributes:[]}
      },
      {
        model: Country,
        attributes: ['country_code','country_name'],
        required:false,
        through:{ attributes:[]}
      },
      {
        model: Spatial_projection,
        attributes: ['name'],
      },
      {
        model: db.spatial_extent,
        attributes:['value','extent_name'],
        through:{ attributes:[]}
      },
      {
        model: Project,
        attributes: ['id','project_code','project_name'],
        required:false,
      },
      {
        model: Organization,
        attributes: ['id','short_name','name','website'],
      },
      {
        model: db.contact,
        attributes: ['id','first_name','last_name','position','email'],
      },
      {
        model: db.user,
        attributes: ['id',"first_name", "last_name","organization_id","country_id"],
      },
      {
        model: db.flag,
        attributes: ['id',"name"],
        through:{ attributes:[]}
      },
      {
        model: db.tag,
        attributes: ['id','name'],
        through:{ attributes:[]},
        required:false,
      },
      {
        model: db.topic,
        attributes: ['id','name'],
        through:{ attributes:[]},
        required:false,
      },
      {
        model: db.sourceurl,
        attributes: ['value','url_name','is_restricted'],
        required: false,
        through:{ attributes:[]},
        where:{
          is_restricted: {
          [Op.ne]: true
        }}
      },
      {
        model: License,
        attributes: ['short_name','name','url'],
      },
    ]
  })
  .then(metadata => {
    if (metadata.length==0){
      res.status(200).send({message:"No Records Found."});
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

exports.getListingauth = (req, res) => {
  MetaData.findAll({
    attributes: ['id','title','description','temporal_coverage_from','temporal_coverage_to','language','version','publisher_id','is_restricted','is_checked','createdAt','updatedAt'],
    order: [['createdAt', 'DESC']], // Assuming createdAt is the timestamp of creation
    include: [
      {
        model: Data_type,
        attributes: ['id','datatype_code'],
      },
      {
        model: db.parameter,
        attributes: ['short_name','standard_name','long_name','units','uri'],
        through:{ attributes:[]}
      },
      {
        model: Country,
        attributes: ['country_code','country_name'],
        through:{ attributes:[]}
      },
      {
        model: Spatial_projection,
        attributes: ['name'],
      },
      {
        model: db.spatial_extent,
        attributes:['value','extent_name'],
        through:{ attributes:[]}
      },
      {
        model: Project,
        attributes: ['id','project_code','project_name'],
      },
      {
        model: Organization,
        attributes: ['id','short_name','name','website'],
      },
      {
        model: db.contact,
        attributes: ['id','first_name','last_name','position','email'],
      },
      {
        model: db.user,
        attributes: ['id',"first_name", "last_name","organization_id","country_id"],
      },
      {
        model: db.flag,
        attributes: ['id',"name"],
        through:{ attributes:[]}
      },
      {
        model: db.tag,
        attributes: ['id','name'],
        through:{ attributes:[]}
      },
      {
        model: db.topic,
        attributes: ['id','name'],
        through:{ attributes:[]}
      },
      {
        model: db.sourceurl,
        attributes: ['value','url_name','is_restricted'],
        required: false,
        through:{ attributes:[]},
        where:{
          is_restricted: {
          [Op.ne]: true
        }}
      },
      {
        model: License,
        attributes: ['short_name','name','url'],
      },
    ]
  })
  .then(metadata => {
    if (metadata.length==0){
      res.status(200).send({message:"No Records Found."});
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
exports.getListingauthchecked = (req, res) => {
  MetaData.findAll({
    attributes: ['id','title','description','temporal_coverage_from','temporal_coverage_to','language','version','publisher_id','is_restricted','is_checked','createdAt','updatedAt'],
    order: [['createdAt', 'DESC']], // Assuming createdAt is the timestamp of creation
    where: {is_checked: req.params.is_checked},
    include: [
      {
        model: Data_type,
        attributes: ['id','datatype_code'],
      },
      {
        model: db.parameter,
        attributes: ['short_name','standard_name','long_name','units','uri'],
        through:{ attributes:[]}
      },
      {
        model: Country,
        attributes: ['country_code','country_name'],
        through:{ attributes:[]}
      },
      {
        model: Spatial_projection,
        attributes: ['name'],
      },
      {
        model: db.spatial_extent,
        attributes:['value','extent_name'],
        through:{ attributes:[]}
      },
      {
        model: Project,
        attributes: ['id','project_code','project_name'],
      },
      {
        model: Organization,
        attributes: ['id','short_name','name','website'],
      },
      {
        model: db.contact,
        attributes: ['id','first_name','last_name','position','email'],
      },
      {
        model: db.user,
        attributes: ['id',"first_name", "last_name","organization_id","country_id"],
      },
      {
        model: db.flag,
        attributes: ['id',"name"],
        through:{ attributes:[]}
      },
      {
        model: db.tag,
        attributes: ['id','name'],
        through:{ attributes:[]}
      },
      {
        model: db.topic,
        attributes: ['id','name'],
        through:{ attributes:[]}
      },
      {
        model: db.sourceurl,
        attributes: ['value','url_name','is_restricted'],
        required: false,
        through:{ attributes:[]},
        where:{
          is_restricted: {
          [Op.ne]: true
        }}
      },
      {
        model: License,
        attributes: ['short_name','name','url'],
      },
    ]
  })
  .then(metadata => {
    if (metadata.length==0){
      res.status(200).send({message:"No Records Found."});
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

exports.getListingauthrestricted = (req, res) => {
  MetaData.findAll({
    attributes: ['id','title','description','temporal_coverage_from','temporal_coverage_to','language','version','publisher_id','is_restricted','is_checked','createdAt','updatedAt'],
    order: [['createdAt', 'DESC']], // Assuming createdAt is the timestamp of creation
    where: {is_restricted: req.params.is_restricted},
    include: [
      {
        model: Data_type,
        attributes: ['id','datatype_code'],
      },
      {
        model: db.parameter,
        attributes: ['short_name','standard_name','long_name','units','uri'],
        through:{ attributes:[]}
      },
      {
        model: Country,
        attributes: ['country_code','country_name'],
        through:{ attributes:[]}
      },
      {
        model: Spatial_projection,
        attributes: ['name'],
      },
      {
        model: db.spatial_extent,
        attributes:['value','extent_name'],
        through:{ attributes:[]}
      },
      {
        model: Project,
        attributes: ['id','project_code','project_name'],
      },
      {
        model: Organization,
        attributes: ['id','short_name','name','website'],
      },
      {
        model: db.contact,
        attributes: ['id','first_name','last_name','position','email'],
      },
      {
        model: db.user,
        attributes: ['id',"first_name", "last_name","organization_id","country_id"],
      },
      {
        model: db.flag,
        attributes: ['id',"name"],
        through:{ attributes:[]}
      },
      {
        model: db.tag,
        attributes: ['id','name'],
        through:{ attributes:[]}
      },
      {
        model: db.topic,
        attributes: ['id','name'],
        through:{ attributes:[]}
      },
      {
        model: db.sourceurl,
        attributes: ['value','url_name','is_restricted'],
        required: false,
        through:{ attributes:[]},
        where:{
          is_restricted: {
          [Op.ne]: true
        }}
      },
      {
        model: License,
        attributes: ['short_name','name','url'],
      },
    ]
  })
  .then(metadata => {
    if (metadata.length==0){
      res.status(200).send({message:"No Records Found."});
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

exports.getListingid = (req, res) => {
  MetaData.findAll({
    attributes: ['id','title','description','temporal_coverage_from','temporal_coverage_to','language','version','publisher_id','is_restricted','is_checked','createdAt','updatedAt'],
    order: [['createdAt', 'DESC']], // Assuming createdAt is the timestamp of creation
    where:{is_checked:true, id:req.params.id},
    include: [
      {
        model: Data_type,
        attributes: ['id','datatype_code'],
      },
      {
        model: db.parameter,
        attributes: ['short_name','standard_name','long_name','units','uri'],
        through:{ attributes:[]}
      },
      {
        model: Country,
        attributes: ['country_code','country_name'],
        through:{ attributes:[]}
      },
      {
        model: Spatial_projection,
        attributes: ['name'],
      },
      {
        model: db.spatial_extent,
        attributes:['value','extent_name'],
        through:{ attributes:[]}
      },
      {
        model: Project,
        attributes: ['id','project_code','project_name'],
      },
      {
        model: Organization,
        attributes: ['id','short_name','name','website'],
      },
      {
        model: db.contact,
        attributes: ['id','first_name','last_name','position','email'],
      },
      {
        model: db.user,
        attributes: ['id',"first_name", "last_name","organization_id","country_id"],
      },
      {
        model: db.flag,
        attributes: ['id',"name"],
        through:{ attributes:[]}
      },
      {
        model: db.tag,
        attributes: ['id','name'],
        through:{ attributes:[]}
      },
      {
        model: db.topic,
        attributes: ['id','name'],
        through:{ attributes:[]}
      },
      {
        model: db.sourceurl,
        attributes: ['value','url_name','is_restricted'],
        required: false,
        through:{ attributes:[]},
        where:{
          is_restricted: {
          [Op.ne]: true
        }}
      },
      {
        model: License,
        attributes: ['short_name','name','url'],
      },
    ]
  })
  .then(metadata => {
    if (metadata.length==0){
      res.status(200).send({message:"No Records Found."});
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
exports.getListingidauth = (req, res) => {
  MetaData.findAll({
    attributes: ['id','title','description','temporal_coverage_from','temporal_coverage_to','language','version','publisher_id','is_restricted','is_checked','createdAt','updatedAt'],
    order: [['createdAt', 'DESC']], // Assuming createdAt is the timestamp of creation
    where:{id:req.params.id},
    include:[
      {
        model: Data_type,
        attributes: ['id','datatype_code'],
      },
      {
        model: db.parameter,
        attributes: ['short_name','standard_name','long_name','units','uri'],
        through:{ attributes:[]}
      },
      {
        model: Country,
        attributes: ['country_code','country_name'],
        through:{ attributes:[]}
      },
      {
        model: Spatial_projection,
        attributes: ['name'],
      },
      {
        model: db.spatial_extent,
        attributes:['value','extent_name'],
        through:{ attributes:[]}
      },
      {
        model: Project,
        attributes: ['id','project_code','project_name'],
      },
      {
        model: Organization,
        attributes: ['id','short_name','name','website'],
      },
      {
        model: db.contact,
        attributes: ['id','first_name','last_name','position','email'],
      },
      {
        model: db.user,
        attributes: ['id',"first_name", "last_name","organization_id","country_id"],
      },
      {
        model: db.flag,
        attributes: ['id',"name"],
        through:{ attributes:[]}
      },
      {
        model: db.tag,
        attributes: ['id','name'],
        through:{ attributes:[]}
      },
      {
        model: db.topic,
        attributes: ['id','name'],
        through:{ attributes:[]}
      },
      {
        model: db.sourceurl,
        attributes: ['value','url_name','is_restricted'],
        required: false,
        through:{ attributes:[]},
        where:{
          is_restricted: {
          [Op.ne]: true
        }}
      },
      {
        model: License,
        attributes: ['short_name','name','url'],
      },
    ]
  })
  .then(metadata => {
    if (metadata.length==0){
      res.status(200).send({message:"No Records Found."});
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


exports.getListingASC = (req, res) => {
    MetaData.findAll({
      attributes: ['id','title','description','temporal_coverage_from','temporal_coverage_to','language','version','publisher_id','is_restricted','is_checked','createdAt','updatedAt'],
      order: [['createdAt', req.params.orderby]], // Assuming createdAt is the timestamp of creation
      where:{is_checked:true},
      include: [
        {
          model: Data_type,
          attributes: ['id','datatype_code'],
        },
        {
          model: db.parameter,
          attributes: ['short_name','standard_name','long_name','units','uri'],
          through:{ attributes:[]}
        },
        {
          model: Country,
          attributes: ['country_code','country_name'],
          through:{ attributes:[]}
        },
        {
          model: Spatial_projection,
          attributes: ['name'],
        },
        {
          model: db.spatial_extent,
          attributes:['value','extent_name'],
          through:{ attributes:[]}
        },
        {
          model: Project,
          attributes: ['id','project_code','project_name'],
        },
        {
          model: Organization,
          attributes: ['id','short_name','name','website'],
        },
        {
          model: db.contact,
          attributes: ['id','first_name','last_name','position','email'],
        },
        {
          model: db.user,
          attributes: ['id',"first_name", "last_name","organization_id","country_id"],
        },
        {
          model: db.flag,
          attributes: ['id',"name"],
          through:{ attributes:[]}
        },
        {
          model: db.tag,
          attributes: ['id','name'],
          through:{ attributes:[]}
        },
        {
          model: db.topic,
          attributes: ['id','name'],
          through:{ attributes:[]}
        },
        {
          model: db.sourceurl,
          attributes: ['value','url_name','is_restricted'],
          required: false,
          through:{ attributes:[]},
          where:{
            is_restricted: {
            [Op.ne]: true
          }}
        },
        {
          model: License,
          attributes: ['short_name','name','url'],
        },
      ]
    })
    .then(metadata => {
      if (metadata.length==0){
        res.status(200).send({message:"No Records Found."});
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
exports.getListingASCauth = (req, res) => {
  MetaData.findAll({
    attributes: ['id','title','description','temporal_coverage_from','temporal_coverage_to','language','version','publisher_id','is_restricted','is_checked','createdAt','updatedAt'],
    order: [['createdAt', req.params.orderby]], // Assuming createdAt is the timestamp of creation
    include: [
      {
        model: Data_type,
        attributes: ['id','datatype_code'],
      },
      {
        model: db.parameter,
        attributes: ['short_name','standard_name','long_name','units','uri'],
        through:{ attributes:[]}
      },
      {
        model: Country,
        attributes: ['country_code','country_name'],
        through:{ attributes:[]}
      },
      {
        model: Spatial_projection,
        attributes: ['name'],
      },
      {
        model: db.spatial_extent,
        attributes:['value','extent_name'],
        through:{ attributes:[]}
      },
      {
        model: Project,
        attributes: ['id','project_code','project_name'],
      },
      {
        model: Organization,
        attributes: ['id','short_name','name','website'],
      },
      {
        model: db.contact,
        attributes: ['id','first_name','last_name','position','email'],
      },
      {
        model: db.user,
        attributes: ['id',"first_name", "last_name","organization_id","country_id"],
      },
      {
        model: db.flag,
        attributes: ['id',"name"],
        through:{ attributes:[]}
      },
      {
        model: db.tag,
        attributes: ['id','name'],
        through:{ attributes:[]}
      },
      {
        model: db.topic,
        attributes: ['id','name'],
        through:{ attributes:[]}
      },
      {
        model: db.sourceurl,
        attributes: ['value','url_name','is_restricted'],
        required: false,
        through:{ attributes:[]},
        where:{
          is_restricted: {
          [Op.ne]: true
        }}
      },
      {
        model: License,
        attributes: ['short_name','name','url'],
      },
    ]
  })
  .then(metadata => {
    if (metadata.length==0){
      res.status(200).send({message:"No Records Found."});
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



exports.deletemetadata = (req,res) => {
  const metadataId = req.params.id
  return db.metadata.findByPk(metadataId)
    .then((metadataId) => {
      if (!metadataId) {
        return res.status(200).send({ message: "Metadata Not found." });
      }
        db.metadata.destroy({where:{id:req.params.id}});
        res.send({ message: "Metadata deleted!" });
    })
    .catch((err) => {
      console.log(">> Error while deleting: ", err);
    });
};

function hasDuplicates(array) {
  var valuesSoFar = Object.create(null);
  for (var i = 0; i < array.length; ++i) {
      var value = array[i];
      if (value in valuesSoFar) {
          return true;
      }
      valuesSoFar[value] = true;
  }
  return false;
}

exports.findOrCreate = async(req, res) => {

  var is_restricted_varib = false;
  try{
  const checker = await MetaData.findAll({
    where:{ 
      title: req.body.title,
      temporal_coverage_from:req.body.temporal_coverage_from
     
    },
    include: [
      {
        required:true,
        model: Country,
        attributes:[],
        where:{
             country_code: req.body.country 
        }
      },
    ]
  });

  var myarr=[];
  for(let i = 0 ; i < req.body.extents.length ; i++) {
    //myarr.push()
    myarr.push(req.body.extents[i]['name'])
    myarr.push(req.body.extents[i]['value'])
  }
  console.log(myarr)
  var duplicate = hasDuplicates(myarr);
  var duplicate_msg ="";
  if (duplicate == true){
    duplicate_msg+=" Some M:M fields have duplicate entries. "
  }
  //country check
  var countryarr =[]
  let ans = Array.isArray(req.body.country);
  if (!ans){
    countryarr.push(req.body.country)
  }
  else{
    countryarr = req.body.country
  }
  var boolcheck = true;
  for(let i = 0 ; i < countryarr.length ; i++) {
  //  console.log(countryarr[i])
    const checker2 = await db.country.findOne({
      where:{ 
        country_code: countryarr[i]
       
      }
    });
    if (checker2 == null){
      //res.status(500).send({ message: "Country does not exist!" });
      boolcheck =false;
    }
  }

  //tag check
  var tagarr =[]
  let anstag = Array.isArray(req.body.tag);
  if (!anstag){
    tagarr.push(req.body.tag)
  }
  else{
    tagarr = req.body.tag
  }
  //topic check
  var topicarr =[]
  let anstopic = Array.isArray(req.body.topic);
  if (!anstopic){
    topicarr.push(req.body.topic)
  }
  else{
    topicarr = req.body.topic
  }
  //flag check
  var flagarr =[]
  let ansflag = Array.isArray(req.body.flag);
  if (!ansflag){
    flagarr.push(req.body.flag)
  }
  else{
    flagarr = req.body.flag
  }
  if (req.body.is_restricted != null){
  is_restricted_varib = req.body.is_restricted
  }
  if (checker.length==0 && duplicate == false && boolcheck == true){
  MetaData.create({
    title: req.body.title,
    description:req.body.description,
    temporal_coverage_from: req.body.temporal_coverage_from,
    temporal_coverage_to:req.body.temporal_coverage_to,
    rights: req.body.rights,
    language: req.body.language,
    version: req.body.version,
    datatype:req.body.data_type,
    spatial_projection_id:req.body.spatial_projection_id,
    license_id:req.body.license_id,
    project_id:req.body.project_id,
    publisher_id:req.body.publisher_id,
    is_checked: req.body.is_checked,
    is_restricted: is_restricted_varib,
    user_created_id: req.body.user_created_id
    //contact_id:req.body.contact_id
    })
      .then(async(metadata) => {
        const xx = req.body.extents;

        for(let i = 0 ; i < xx.length ; i++) {
          const spatialEX = await db.spatial_extent.create({extent_name:xx[i].name,value:xx[i].value});
          await metadata.addSpatial_extents(spatialEX);
        }
        //await metadata.setSpatial_extents(xx);
        const uri = req.body.urls;
       // console.log(uri);
        var urll = String(uri)
        let letter = urll.charAt(0);
       // console.log(letter)
        var myarrrr = [];
        myarrrr.push(uri)
     //   console.log(typeof myarrrr);
       // console.log(myarrrr[0].url)
        if (myarrrr[0].url === undefined) {
          for(let i = 0 ; i < uri.length ; i++) {
            const spatialEX2 = await db.sourceurl.create({url_name:uri[i].url,value:uri[i].path, is_restricted: is_restricted_varib});
            await metadata.addSourceurls(spatialEX2);
          }
        }
        else{
          for(let i = 0 ; i < myarrrr.length ; i++) {
            const spatialEX2 = await db.sourceurl.create({url_name:myarrrr[i].url,value:myarrrr[i].path, is_restricted: is_restricted_varib});
            await metadata.addSourceurls(spatialEX2);
          }
        } 
        
        metadata.setCountries(countryarr);
        metadata.setFlags(flagarr);
        metadata.setTags(tagarr);
        metadata.setTopics(topicarr);
        metadata.setContact(req.body.contact_id);
        metadata.setParameters(req.body.parameters)
        res.send({ message: "Metadata registered successfully!" });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });}
      else{
        res.status(200).send({ message: "Metadata Exists!"+duplicate_msg });
      }
      
    }
    catch(err){
      console.log(err)
      res.status(200).send({ message: "Please specify all the required parameters." });
    }
};


  exports.updateMetadata = async(req, res) => {
    var is_restricted_varib = false;
    const countryId = req.params.id
    const metadata = await MetaData.findOne({
      include:[
        {
          model: db.sourceurl,
          attributes: ['value','url_name','is_restricted'],
        }
      ],
      where:{
        id : countryId
      }
    });
    try{
    if (!metadata) {
      return res.status(200).json({ message: 'Metadata not found' });
    }
    else{
      var duplicate = false;
      if(req.body.extents != null){
      var myarr=[];
  for(let i = 0 ; i < req.body.extents.length ; i++) {
    myarr.push(req.body.extents[i]['name'])
    myarr.push(req.body.extents[i]['value'])
  }
  
  var duplicate = hasDuplicates(myarr);
  var duplicate_msg ="";
  if (duplicate == true){
    duplicate_msg+="Some M:M fields have duplicate entries. "
  }
}


    //country check
    var countryarr =[]
    if (req.body.country !=null){
    let ans = Array.isArray(req.body.country);
    if (!ans){
      countryarr.push(req.body.country)
    }
    else{
      countryarr = req.body.country
    }
    var boolcheck = true;
    for(let i = 0 ; i < countryarr.length ; i++) {
      const checker2 = await db.country.findOne({
        where:{ 
          short_name: countryarr[i]
         
        }
      });
      if (checker2 == null){
        //res.status(500).send({ message: "Country does not exist!" });
        boolcheck =false;
      }
    }
  }
  else{
    boolcheck = true;
  }
  
    //tag check
    var tagarr =[]
    let anstag = Array.isArray(req.body.tag);
    if (!anstag){
      tagarr.push(req.body.tag)
    }
    else{
      tagarr = req.body.tag
    }
    //topic check
    var topicarr =[]
    let anstopic = Array.isArray(req.body.topic);
    if (!anstopic){
      topicarr.push(req.body.topic)
    }
    else{
      topicarr = req.body.topic
    }
    //flag check
    var flagarr =[]
    let ansflag = Array.isArray(req.body.flag);
    if (!ansflag){
      flagarr.push(req.body.flag)
    }
    else{
      flagarr = req.body.flag
    }
     //parameters check
     var parameterarr =[]
     let param = Array.isArray(req.body.parameters);
     if (!param){
      parameterarr.push(req.body.parameters)
     }
     else{
      parameterarr = req.body.parameters
     }
     if (req.body.is_restricted != null){
      is_restricted_varib = req.body.is_restricted
      
      /*
      const metadata_sourceurl = await db.sequelize.models.metadata_sourceurl.findAll({
        where:{
          metadata_id: 3
        }
      });
      console.log(metadata.sourceurl)
      db.sourceurl.update(
        {is_restricted: is_restricted_varib},
        {
        where: {
          id:5
        }
      }

      )*/

      await metadata.setSourceurls([]);
      for (i=0; i<metadata.sourceurls.length; i++){

        console.log(metadata.sourceurls[i].dataValues)

        const spatialEX2 = await db.sourceurl.create({url_name:metadata.sourceurls[i].dataValues.url_name,value:metadata.sourceurls[i].dataValues.value, is_restricted: is_restricted_varib});
        await metadata.addSourceurls(spatialEX2);
      }
      }
  
  if (duplicate == false && boolcheck == true){
    
    if(req.body.title != null){
      metadata.title = req.body.title;
    }
    metadata.description = req.body.description;
    metadata.temporal_coverage_from = req.body.temporal_coverage_from;
    metadata.temporal_coverage_to = req.body.temporal_coverage_to;
    metadata.rights = req.body.rights;
    metadata.language = req.body.language;
    metadata.version = req.body.version;
    metadata.user_created_id = req.body.user_created_id;
    if(req.body.data_type != null){
      metadata.datatype = req.body.data_type;
    }
    if(req.body.spatial_projection_id != null ){
      metadata.spatial_projection_id = req.body.spatial_projection_id;
    }
    if(req.body.license_id != null ){
      metadata.license_id = req.body.license_id;
    }
    if(req.body.project_id != null ){
      metadata.project_id = req.body.project_id;
    }
    if(req.body.publisher_id != null ){
      metadata.publisher_id = req.body.publisher_id;
    }
    metadata.is_checked = req.body.is_checked,
    metadata.is_restricted = is_restricted_varib
    //metadata.contact_id = req.body.contact_id
    
    const xx = req.body.extents;
    if (xx != null){
    //console.log(metadata)
    await metadata.setSpatial_extents([]);
    //await db.metadata_spatial_extents.destroy({where:{metadata_id:metadata.id}});
    for(let i = 0 ; i < xx.length ; i++) {
      const spatialEX = await db.spatial_extent.create({extent_name:xx[i].name,value:xx[i].value});
      await metadata.addSpatial_extents(spatialEX);
    }
  }


        const uri = req.body.urls;
      if(uri != null){
        await metadata.setSourceurls([]);
        console.log(uri);
        var urll = String(uri)
        let letter = urll.charAt(0);
        console.log(letter)
        var myarrrr = [];
        myarrrr.push(uri)
        if (myarrrr[0].url === undefined) {
          for(let i = 0 ; i < uri.length ; i++) {
            const spatialEX2 = await db.sourceurl.create({url_name:uri[i].url,value:uri[i].path, is_restricted: is_restricted_varib});
            await metadata.addSourceurls(spatialEX2);
          }
        }
        else{
          for(let i = 0 ; i < myarrrr.length ; i++) {
            const spatialEX2 = await db.sourceurl.create({url_name:myarrrr[i].url,value:myarrrr[i].path, is_restricted: is_restricted_varib});
            await metadata.addSourceurls(spatialEX2);
          }
        }
      }

        if(req.body.contact_id != null ){
        metadata.setContact(req.body.contact_id);
        }
        console.log(req.body.countries)
        if (req.body.countries !=null){
          metadata.setCountries(req.body.countries);
        }
        if (req.body.tag != null){
        metadata.setTags(req.body.tag);
        }
        if (req.body.topic != null){
          metadata.setTopics(req.body.topic);
        }
        if (req.body.flag != null){
          metadata.setFlags(req.body.flag);
        }
        if (req.body.parameters !=null){

        try{
          metadata.setParameters(req.body.parameters);
        }
        catch(err){
            res.status(500).json({ message: 'Please pass in all the required paramters.'+duplicate_msg });
          
          }
        }
    await metadata.save();
    res.status(200).send({ message: "Metadata updated successfully!" });
        
      }
      else{
        res.status(200).json({ message: duplicate_msg });
      }
    }
  }
  catch(err){
  //  console.log(err)
    res.status(500).json({ message: 'Please pass in all the required paramters.'+duplicate_msg });
  }
  
  };

  exports.findByExtent = async(req, res) => {
    console.log(req.query)
    try{
    const min_x_metadata = await MetaData.findAll({
      include:[
      {
          model: db.spatial_extent,
          attributes:['value','extent_name'],
          through:{ attributes:[]},
          where: {
            [Op.and]: [
              { value:{ [Op.gte]:req.query.minx} }, {
                [Op.or]: [
                  { extent_name: 'minx' },
                  { extent_name: 'maxx' }
                ]
              }
            ],
          },  
        }
        ]
      });
      var minx_arr = []
      for(let i = 0 ; i < min_x_metadata.length ; i++) {
        minx_arr.push(min_x_metadata[i].id)
     //   for(let j = 0 ; j < min_x_metadata[i].spatial_extents.length ; j++) {
     //   console.log(min_x_metadata[i].id)
     //     console.log(min_x_metadata[i].spatial_extents[j].extent_name)
     //   }
      }
      const max_x_metadata = await MetaData.findAll({
        attributes: ['id'],
          include:[
          {
              model: db.spatial_extent,
              attributes:[],
              through:{ attributes:[]},
              where: {
                [Op.and]: [
                  { value:{ [Op.lte]:req.query.maxx} }, {
                    [Op.or]: [
                      { extent_name: 'minx' },
                      { extent_name: 'maxx' }
                    ]
                  }
                ],
              },  
            }
            ]
          });
          var maxx_arr = []
          for(let i = 0 ; i < max_x_metadata.length ; i++) {
            maxx_arr.push(max_x_metadata[i].id)
          }
      var x_exist = true;

      if (minx_arr.length ==0 || maxx_arr.length ==0){
        console.log('x does not exist')
        x_exist = false
      }

      const min_y_metadata = await MetaData.findAll({
        include:[
        {
            model: db.spatial_extent,
            attributes:['value','extent_name'],
            through:{ attributes:[]},
            where: {
              [Op.and]: [
                { value:{ [Op.gte]:req.query.miny} }, {
                  [Op.or]: [
                    { extent_name: 'miny' },
                    { extent_name: 'maxy' }
                  ]
                }
              ],
            },  
          }
          ]
        });
        var miny_arr = []
        for(let i = 0 ; i < min_y_metadata.length ; i++) {
          miny_arr.push(min_y_metadata[i].id)
        }
  
      const max_y_metadata = await MetaData.findAll({
        attributes: ['id'],
          include:[
          {
              model: db.spatial_extent,
              attributes:[],
              through:{ attributes:[]},
              where: {
                [Op.and]: [
                  { value:{ [Op.lte]:req.query.maxy} }, {
                    [Op.or]: [
                      { extent_name: 'miny' },
                      { extent_name: 'maxy' }
                    ]
                  }
                ],
              },  
            }
            ]
          });
          var maxy_arr = []
          for(let i = 0 ; i < max_y_metadata.length ; i++) {
            maxy_arr.push(max_y_metadata[i].id)
          }
          var y_exist = true;
          if (miny_arr.length ==0 || maxy_arr.length ==0){
            console.log('y does not exist')
            y_exist = false
          }
          var xexist_arr = mergeAndRemoveDuplicates([minx_arr,maxx_arr]);
          var yexist_arr = mergeAndRemoveDuplicates([miny_arr,maxy_arr]);
          if(!x_exist){
            xexist_arr = [] 
          }
          if(!y_exist){
            yexist_arr = [] 
          }
          

        var bigarray = mergeAndRemoveDuplicates([xexist_arr,yexist_arr]);
          console.log(bigarray)
      if (bigarray.length == 0) {
        return res.status(200).json({ message: 'Metadata not found' });
      }
      else{
        MetaData.findAll({
          attributes: ['id','title','description','temporal_coverage_from','temporal_coverage_to','language','version','publisher_id','is_restricted','is_checked','createdAt','updatedAt'],
          where:{id:bigarray, is_checked:true},
          order: [['createdAt', 'DESC']], // Assuming createdAt is the timestamp of creation
          include: [
            {
              model: Data_type,
              attributes: ['id','datatype_code'],
            },
            {
              model: db.parameter,
              attributes: ['short_name','standard_name','long_name','units','uri'],
              through:{ attributes:[]}
            },
            {
              model: Country,
              attributes: ['country_code','country_name'],
              through:{ attributes:[]}
            },
            {
              model: Spatial_projection,
              attributes: ['name'],
            },
            {
              model: db.spatial_extent,
              attributes:['value','extent_name'],
              through:{ attributes:[]}
            },
            {
              model: Project,
              attributes: ['id','project_code','project_name'],
            },
            {
              model: Organization,
              attributes: ['id','short_name','name','website'],
            },
            {
              model: db.contact,
              attributes: ['id','first_name','last_name','position','email'],
            },
            {
              model: db.user,
              attributes: ['id',"first_name", "last_name","organization_id","country_id"],
            },
            {
              model: db.flag,
              attributes: ['id',"name"],
              through:{ attributes:[]}
            },
            {
              model: db.tag,
              attributes: ['id','name'],
              through:{ attributes:[]}
            },
            {
              model: db.topic,
              attributes: ['id','name'],
              through:{ attributes:[]}
            },
            {
              model: db.sourceurl,
              attributes: ['value','url_name','is_restricted'],
              required: false,
              through:{ attributes:[]},
              where:{
                is_restricted: {
                [Op.ne]: true
              }}
            },
            {
              model: License,
              attributes: ['short_name','name','url'],
            },
          ]
        })
        .then(metadata => {
          if (metadata.length==0){
            res.status(200).send({message:"No Records Found."});
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
      }

  }
  catch(err){
    console.log(err)
    res.status(500).json({ message: 'An error Occured.'+duplicate_msg });
  }
      
  };

  exports.findByExtentauth = async(req, res) => {
    console.log(req.query)
    try{
    const min_x_metadata = await MetaData.findAll({
      include:[
      {
          model: db.spatial_extent,
          attributes:['value','extent_name'],
          through:{ attributes:[]},
          where: {
            [Op.and]: [
              { value:{ [Op.gte]:req.query.minx} }, {
                [Op.or]: [
                  { extent_name: 'minx' },
                  { extent_name: 'maxx' }
                ]
              }
            ],
          },  
        }
        ]
      });
      var minx_arr = []
      for(let i = 0 ; i < min_x_metadata.length ; i++) {
        minx_arr.push(min_x_metadata[i].id)
     //   for(let j = 0 ; j < min_x_metadata[i].spatial_extents.length ; j++) {
     //   console.log(min_x_metadata[i].id)
     //     console.log(min_x_metadata[i].spatial_extents[j].extent_name)
     //   }
      }
      const max_x_metadata = await MetaData.findAll({
        attributes: ['id'],
          include:[
          {
              model: db.spatial_extent,
              attributes:[],
              through:{ attributes:[]},
              where: {
                [Op.and]: [
                  { value:{ [Op.lte]:req.query.maxx} }, {
                    [Op.or]: [
                      { extent_name: 'minx' },
                      { extent_name: 'maxx' }
                    ]
                  }
                ],
              },  
            }
            ]
          });
          var maxx_arr = []
          for(let i = 0 ; i < max_x_metadata.length ; i++) {
            maxx_arr.push(max_x_metadata[i].id)
          }
      var x_exist = true;

      if (minx_arr.length ==0 || maxx_arr.length ==0){
        console.log('x does not exist')
        x_exist = false
      }

      const min_y_metadata = await MetaData.findAll({
        include:[
        {
            model: db.spatial_extent,
            attributes:['value','extent_name'],
            through:{ attributes:[]},
            where: {
              [Op.and]: [
                { value:{ [Op.gte]:req.query.miny} }, {
                  [Op.or]: [
                    { extent_name: 'miny' },
                    { extent_name: 'maxy' }
                  ]
                }
              ],
            },  
          }
          ]
        });
        var miny_arr = []
        for(let i = 0 ; i < min_y_metadata.length ; i++) {
          miny_arr.push(min_y_metadata[i].id)
        }
  
      const max_y_metadata = await MetaData.findAll({
        attributes: ['id'],
          include:[
          {
              model: db.spatial_extent,
              attributes:[],
              through:{ attributes:[]},
              where: {
                [Op.and]: [
                  { value:{ [Op.lte]:req.query.maxy} }, {
                    [Op.or]: [
                      { extent_name: 'miny' },
                      { extent_name: 'maxy' }
                    ]
                  }
                ],
              },  
            }
            ]
          });
          var maxy_arr = []
          for(let i = 0 ; i < max_y_metadata.length ; i++) {
            maxy_arr.push(max_y_metadata[i].id)
          }
          var y_exist = true;
          if (miny_arr.length ==0 || maxy_arr.length ==0){
            console.log('y does not exist')
            y_exist = false
          }
          var xexist_arr = mergeAndRemoveDuplicates([minx_arr,maxx_arr]);
          var yexist_arr = mergeAndRemoveDuplicates([miny_arr,maxy_arr]);
          if(!x_exist){
            xexist_arr = [] 
          }
          if(!y_exist){
            yexist_arr = [] 
          }
          

        var bigarray = mergeAndRemoveDuplicates([xexist_arr,yexist_arr]);
          console.log(bigarray)
      if (bigarray.length == 0) {
        return res.status(200).json({ message: 'Metadata not found' });
      }
      else{
        MetaData.findAll({
          attributes: ['id','title','description','temporal_coverage_from','temporal_coverage_to','language','version','publisher_id','is_restricted','is_checked','createdAt','updatedAt'],
          where:{id:bigarray},
          order: [['createdAt', 'DESC']], // Assuming createdAt is the timestamp of creation
          include: [
            {
              model: Data_type,
              attributes: ['id','datatype_code'],
            },
            {
              model: db.parameter,
              attributes: ['short_name','standard_name','long_name','units','uri'],
              through:{ attributes:[]}
            },
            {
              model: Country,
              attributes: ['country_code','country_name'],
              through:{ attributes:[]}
            },
            {
              model: Spatial_projection,
              attributes: ['name'],
            },
            {
              model: db.spatial_extent,
              attributes:['value','extent_name'],
              through:{ attributes:[]}
            },
            {
              model: Project,
              attributes: ['id','project_code','project_name'],
            },
            {
              model: Organization,
              attributes: ['id','short_name','name','website'],
            },
            {
              model: db.contact,
              attributes: ['id','first_name','last_name','position','email'],
            },
            {
              model: db.user,
              attributes: ['id',"first_name", "last_name","organization_id","country_id"],
            },
            {
              model: db.flag,
              attributes: ['id',"name"],
              through:{ attributes:[]}
            },
            {
              model: db.tag,
              attributes: ['id','name'],
              through:{ attributes:[]}
            },
            {
              model: db.topic,
              attributes: ['id','name'],
              through:{ attributes:[]}
            },
            {
              model: db.sourceurl,
              attributes: ['value','url_name','is_restricted'],
              required: false,
              through:{ attributes:[]},
              where:{
                is_restricted: {
                [Op.ne]: true
              }}
            },
            {
              model: License,
              attributes: ['short_name','name','url'],
            },
          ]
        })
        .then(metadata => {
          if (metadata.length==0){
            res.status(200).send({message:"No Records Found."});
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
      }

  }
  catch(err){
    console.log(err)
    res.status(500).json({ message: 'An error Occured.'+duplicate_msg });
  }
      
  };
  

  function mergeAndRemoveDuplicates(arrays) {
    const mergedArray = [].concat(...arrays);
    const uniqueArray = [...new Set(mergedArray)];
    return uniqueArray;
  }


  exports.findByPoint = async(req, res) => {
    try{
      const min_x_metadata = await MetaData.findAll({
        attributes: ['id'],
          include:[
          {
              model: db.spatial_extent,
              attributes:[],
              through:{ attributes:[]},
              where: {
                [Op.and]: [
                  { value:{ [Op.lte]:req.query.x},extent_name:'minx' },
                ],
              },  
            }
            ]
          });
          var minx_arr = []
          for(let i = 0 ; i < min_x_metadata.length ; i++) {
            minx_arr.push(min_x_metadata[i].id)
          }
    const max_x_metadata = await MetaData.findAll({
      where:{id:minx_arr},
      attributes: ['id'],
        include:[
        {
            model: db.spatial_extent,
            attributes:[],
            through:{ attributes:[]},
            where: {
              [Op.and]: [
                { value:{ [Op.gte]:req.query.x},extent_name:'maxx' },
              ],
            },  
          }
          ]
        });
        var maxx_arr = []
        for(let i = 0 ; i < max_x_metadata.length ; i++) {
          maxx_arr.push(max_x_metadata[i].id)
        }
        
        const min_y_metadata = await MetaData.findAll({
          where:{id:maxx_arr},
          include:[
          {
              model: db.spatial_extent,
              attributes:['value','extent_name'],
              through:{ attributes:[]},
              where: {
                [Op.and]: [
                  { value:{ [Op.lte]:req.query.y},extent_name:'miny' },
                ],
              },  
            }
            ]
          });
          var miny_arr = []
          for(let i = 0 ; i < min_y_metadata.length ; i++) {
            miny_arr.push(min_y_metadata[i].id)
          }
    
        const max_y_metadata = await MetaData.findAll({
          where:{id:miny_arr},
          attributes: ['id'],
            include:[
            {
                model: db.spatial_extent,
                attributes:[],
                through:{ attributes:[]},
                where: {
                  [Op.and]: [
                    { value:{ [Op.gte]:req.query.y},extent_name:'maxy' },
                  ],
                },  
              }
              ]
            });
           var maxy_arr = []
            for(let i = 0 ; i < max_y_metadata.length ; i++) {
              maxy_arr.push(max_y_metadata[i].id)
            }
        
      if (maxy_arr.length == 0) {
        return res.status(200).json({ message: 'Metadata not found' });
      }
      else{
        MetaData.findAll({
          attributes: ['id','title','description','temporal_coverage_from','temporal_coverage_to','language','version','publisher_id','is_restricted','is_checked','createdAt','updatedAt'],
          where:{id:maxy_arr,is_checked:true},
          order: [['createdAt', 'DESC']], // Assuming createdAt is the timestamp of creation
          include: [
            {
              model: Data_type,
              attributes: ['id','datatype_code'],
            },
            {
              model: db.parameter,
              attributes: ['short_name','standard_name','long_name','units','uri'],
              through:{ attributes:[]}
            },
            {
              model: Country,
              attributes: ['country_code','country_name'],
              through:{ attributes:[]}
            },
            {
              model: Spatial_projection,
              attributes: ['name'],
            },
            {
              model: db.spatial_extent,
              attributes:['value','extent_name'],
              through:{ attributes:[]}
            },
            {
              model: Project,
              attributes: ['id','project_code','project_name'],
            },
            {
              model: Organization,
              attributes: ['id','short_name','name','website'],
            },
            {
              model: db.contact,
              attributes: ['id','first_name','last_name','position','email'],
            },
            {
              model: db.user,
              attributes: ['id',"first_name", "last_name","organization_id","country_id"],
            },
            {
              model: db.flag,
              attributes: ['id',"name"],
              through:{ attributes:[]}
            },
            {
              model: db.tag,
              attributes: ['id','name'],
              through:{ attributes:[]}
            },
            {
              model: db.topic,
              attributes: ['id','name'],
              through:{ attributes:[]}
            },
            {
              model: db.sourceurl,
              attributes: ['value','url_name','is_restricted'],
              required: false,
              through:{ attributes:[]},
              where:{
                is_restricted: {
                [Op.ne]: true
              }}
            },
            {
              model: License,
              attributes: ['short_name','name','url'],
            },
          ]
        })
        .then(metadata => {
          if (metadata.length==0){
            res.status(200).send({message:"No Records Found."});
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
      }

  }
  catch(err){
    console.log(err)
    res.status(500).json({ message: 'An error Occured.'+duplicate_msg });
  }
      
  };

  exports.findByPointauth = async(req, res) => {
    try{
      const min_x_metadata = await MetaData.findAll({
        attributes: ['id'],
          include:[
          {
              model: db.spatial_extent,
              attributes:[],
              through:{ attributes:[]},
              where: {
                [Op.and]: [
                  { value:{ [Op.lte]:req.query.x},extent_name:'minx' },
                ],
              },  
            }
            ]
          });
          var minx_arr = []
          for(let i = 0 ; i < min_x_metadata.length ; i++) {
            minx_arr.push(min_x_metadata[i].id)
          }
    const max_x_metadata = await MetaData.findAll({
      where:{id:minx_arr},
      attributes: ['id'],
        include:[
        {
            model: db.spatial_extent,
            attributes:[],
            through:{ attributes:[]},
            where: {
              [Op.and]: [
                { value:{ [Op.gte]:req.query.x},extent_name:'maxx' },
              ],
            },  
          }
          ]
        });
        var maxx_arr = []
        for(let i = 0 ; i < max_x_metadata.length ; i++) {
          maxx_arr.push(max_x_metadata[i].id)
        }
        
        const min_y_metadata = await MetaData.findAll({
          where:{id:maxx_arr},
          include:[
          {
              model: db.spatial_extent,
              attributes:['value','extent_name'],
              through:{ attributes:[]},
              where: {
                [Op.and]: [
                  { value:{ [Op.lte]:req.query.y},extent_name:'miny' },
                ],
              },  
            }
            ]
          });
          var miny_arr = []
          for(let i = 0 ; i < min_y_metadata.length ; i++) {
            miny_arr.push(min_y_metadata[i].id)
          }
    
        const max_y_metadata = await MetaData.findAll({
          where:{id:miny_arr},
          attributes: ['id'],
            include:[
            {
                model: db.spatial_extent,
                attributes:[],
                through:{ attributes:[]},
                where: {
                  [Op.and]: [
                    { value:{ [Op.gte]:req.query.y},extent_name:'maxy' },
                  ],
                },  
              }
              ]
            });
           var maxy_arr = []
            for(let i = 0 ; i < max_y_metadata.length ; i++) {
              maxy_arr.push(max_y_metadata[i].id)
            }
        
      if (maxy_arr.length == 0) {
        return res.status(200).json({ message: 'Metadata not found' });
      }
      else{
        MetaData.findAll({
          attributes: ['id','title','description','temporal_coverage_from','temporal_coverage_to','language','version','publisher_id','is_restricted','is_checked','createdAt','updatedAt'],
          where:{id:maxy_arr},
          order: [['createdAt', 'DESC']], // Assuming createdAt is the timestamp of creation
          include: [
            {
              model: Data_type,
              attributes: ['id','datatype_code'],
            },
            {
              model: db.parameter,
              attributes: ['short_name','standard_name','long_name','units','uri'],
              through:{ attributes:[]}
            },
            {
              model: Country,
              attributes: ['country_code','country_name'],
              through:{ attributes:[]}
            },
            {
              model: Spatial_projection,
              attributes: ['name'],
            },
            {
              model: db.spatial_extent,
              attributes:['value','extent_name'],
              through:{ attributes:[]}
            },
            {
              model: Project,
              attributes: ['id','project_code','project_name'],
            },
            {
              model: Organization,
              attributes: ['id','short_name','name','website'],
            },
            {
              model: db.contact,
              attributes: ['id','first_name','last_name','position','email'],
            },
            {
              model: db.user,
              attributes: ['id',"first_name", "last_name","organization_id","country_id"],
            },
            {
              model: db.flag,
              attributes: ['id',"name"],
              through:{ attributes:[]}
            },
            {
              model: db.tag,
              attributes: ['id','name'],
              through:{ attributes:[]}
            },
            {
              model: db.topic,
              attributes: ['id','name'],
              through:{ attributes:[]}
            },
            {
              model: db.sourceurl,
              attributes: ['value','url_name','is_restricted'],
              required: false,
              through:{ attributes:[]},
              where:{
                is_restricted: {
                [Op.ne]: true
              }}
            },
            {
              model: License,
              attributes: ['short_name','name','url'],
            },
          ]
        })
        .then(metadata => {
          if (metadata.length==0){
            res.status(200).send({message:"No Records Found."});
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
      }

  }
  catch(err){
    console.log(err)
    res.status(500).json({ message: 'An error Occured.'+duplicate_msg });
  }
      
  };

