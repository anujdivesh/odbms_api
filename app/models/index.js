const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./usercontrol.model..js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.refreshToken = require("../models/refreshToken.model.js")(sequelize, Sequelize);
db.organization = require("../models/organization.model.js")(sequelize, Sequelize);
db.country = require("../models/country.model.js")(sequelize, Sequelize);
db.project = require("../models/project.model.js")(sequelize, Sequelize);
db.license = require("../models/license.model.js")(sequelize, Sequelize);
db.spatial_projection = require("../models/spatial_projection.model.js")(sequelize, Sequelize);
db.data_type = require("../models/datatype.model.js")(sequelize, Sequelize);
db.metadata = require("../models/metadata.model.js")(sequelize, Sequelize);
db.tag = require("../models/tag.model.js")(sequelize, Sequelize);
db.topic = require("../models/topic.model.js")(sequelize, Sequelize);
db.spatial_extent = require("../models/spatial_extent.model.js")(sequelize, Sequelize);
db.sourceurl = require("../models/sourceurl.model.js")(sequelize, Sequelize);
db.defineextent = require("../models/defineextent.model.js")(sequelize, Sequelize);
db.defineurl = require("../models/defineurl.model.js")(sequelize, Sequelize);
db.contact = require("../models/contact.model.js")(sequelize, Sequelize);
db.parameter = require("../models/parameter.model.js")(sequelize, Sequelize);
db.request = require("../models/request.model.js")(sequelize, Sequelize);
db.flag = require("../models/flag.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.refreshToken.belongsTo(db.user, {
  foreignKey: 'userId', targetKey: 'id'
});
db.user.hasOne(db.refreshToken, {
  foreignKey: 'userId', targetKey: 'id'
});

//one to many relations
db.country.belongsToMany(db.metadata, {
  through: "metadata_country",
  foreignKey: "country_id",
  otherKey: "metadata_id"
});

db.metadata.belongsToMany(db.country, {
  through: "metadata_country",
  foreignKey: "metadata_id",
  otherKey: "country_id"
});

db.flag.belongsToMany(db.metadata, {
  through: "metadata_flag",
  foreignKey: "flag_id",
  otherKey: "metadata_id"
});

db.metadata.belongsToMany(db.flag, {
  through: "metadata_flag",
  foreignKey: "metadata_id",
  otherKey: "flag_id"
});

/*
db.country.belongsToMany(db.project, {
  through: "project_country",
  foreignKey: "country_id",
  otherKey: "project_id"
});

db.project.belongsToMany(db.country, {
  through: "project_country",
  foreignKey: "project_id",
  otherKey: "country_id"
});
*/


db.tag.belongsToMany(db.metadata, {
  through: "metadata_tag",
  foreignKey: "tag_id",
  otherKey: "metadata_id"
});

db.metadata.belongsToMany(db.tag, {
  through: "metadata_tag",
  foreignKey: "metadata_id",
  otherKey: "tag_id"
});

db.topic.belongsToMany(db.metadata, {
  through: "metadata_topic",
  foreignKey: "topic_id",
  otherKey: "metadata_id"
});

db.metadata.belongsToMany(db.topic, {
  through: "metadata_topic",
  foreignKey: "metadata_id",
  otherKey: "topic_id"
});


db.spatial_extent.belongsToMany(db.metadata, {
  through: "metadata_spatial_extent",
  foreignKey: "spatial_extent_id",
  //as:'metadata'
  otherKey: "metadata_id"
});

db.metadata.belongsToMany(db.spatial_extent, {
  through: "metadata_spatial_extent",
  foreignKey: "metadata_id",
  //as:'spatial_extents'
  otherKey: "spatial_extent_id"
});

db.sourceurl.belongsToMany(db.metadata, {
  through: "metadata_sourceurl",
  foreignKey: "sourceurl_id",
  otherKey: "metadata_id"
});

db.metadata.belongsToMany(db.sourceurl, {
  through: "metadata_sourceurl",
  foreignKey: "metadata_id",
  otherKey: "sourceurl_id"
});

db.parameter.belongsToMany(db.metadata, {
  through: "metadata_parameter",
  foreignKey: "parameter_id",
  otherKey: "metadata_id"
});

db.metadata.belongsToMany(db.parameter, {
  through: "metadata_parameter",
  foreignKey: "metadata_id",
  otherKey: "parameter_id"
});


db.metadata.belongsToMany(db.request, {
  through: "metadata_request",
  foreignKey: "metadata_id",
  otherKey: "request_id"
});

db.request.belongsToMany(db.metadata, {
  through: "metadata_request",
  foreignKey: "request_id",
  otherKey: "metadata_id"
});





//One to one relations
db.data_type.hasOne(db.metadata, {foreignKey: 'datatype'});
db.metadata.belongsTo(db.data_type, {foreignKey: 'datatype'});

db.spatial_projection.hasOne(db.metadata, {foreignKey: 'spatial_projection_id'});
db.metadata.belongsTo(db.spatial_projection, {foreignKey: 'spatial_projection_id'});

db.license.hasOne(db.metadata, {foreignKey: 'license_id'});
db.metadata.belongsTo(db.license, {foreignKey: 'license_id'});

db.project.hasOne(db.metadata, {foreignKey: 'project_idx'});
db.metadata.belongsTo(db.project, {foreignKey: 'project_idx'});

db.organization.hasOne(db.metadata, {foreignKey: 'publisher_id'});
db.metadata.belongsTo(db.organization, {foreignKey: 'publisher_id'});

db.user.hasOne(db.metadata, {foreignKey: 'user_created_id'});
db.metadata.belongsTo(db.user, {foreignKey: 'user_created_id'});

db.contact.hasOne(db.metadata, {foreignKey: 'contact_id'});
db.metadata.belongsTo(db.contact, {foreignKey: 'contact_id'});

//db.country.hasOne(db.project, {foreignKey: 'country_id'});
//db.project.belongsTo(db.country, {foreignKey: 'country_id'});

db.organization.hasOne(db.user, {foreignKey: 'organization_id'});
db.user.belongsTo(db.organization, {foreignKey: 'organization_id'});

db.country.hasOne(db.user, {foreignKey: 'country_id'});
db.user.belongsTo(db.country, {foreignKey: 'country_id'});

db.defineextent.hasOne(db.spatial_extent, {foreignKey: 'extent_name'});
db.spatial_extent.belongsTo(db.defineextent, {foreignKey: 'extent_name'});

db.defineurl.hasOne(db.sourceurl, {foreignKey: 'url_name'});
db.sourceurl.belongsTo(db.defineurl, {foreignKey: 'url_name'});

db.ROLES = ["user", "admineyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJlbWFpbCI6Im", "registered"];

module.exports = db;
