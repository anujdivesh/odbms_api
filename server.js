const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;


db.sequelize.sync();
// force: true will drop the table if it already exists

//db.sequelize.sync({force: true}).then(() => {
//  console.log('Drop and Resync Database with { force: true }');
 // initial();
  //initialCountry();
//});

//db.sequelize.sync({force: true}).then(() => {
//  console.log('Drop and Resync Database with { force: true }');
//  initial();
//});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Ocean Data management system secured with JWT" });
});

// routes
require('./app/routes/auth.routes')(app);
//require('./app/routes/user.routes')(app);
require('./app/routes/organization.routes')(app);
require('./app/routes/country.routes')(app);
require('./app/routes/flag.routes')(app);
require('./app/routes/project.routes')(app);
require('./app/routes/license.routes')(app);
require('./app/routes/spatial_projection.routes')(app);
require('./app/routes/datatype.routes')(app);
require('./app/routes/metadata.routes')(app);
require('./app/routes/tag.routes')(app);
require('./app/routes/topic.routes')(app);
require('./app/routes/defineextent.routes')(app);
require('./app/routes/defineurl.routes')(app);
require('./app/routes/contact.routes')(app);
require('./app/routes/parameter.routes')(app);
require('./app/routes/request.routes')(app);


// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

