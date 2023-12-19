const db = require("../models");
const config = require("../config/auth.config");
const { user: User, role: Role, refreshToken: RefreshToken } = db;

const Op = db.Sequelize.Op;

var nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  let org = req.body.organization_id;
  if (req.body.organizationid == ""){
    org = null
  }
  User.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    organization_id: org,
    country_id: req.body.country_id
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });

      let refreshToken = await RefreshToken.createToken(user);

      let authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
          refreshToken: refreshToken,
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });


    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });
      
      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    const user = await refreshToken.getMember();
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};


exports.forgotPassword = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      const secret = config.secret + user.password;
    const token = jwt.sign({ email: user.email, id: user.id }, secret, {
      expiresIn: "15m",
    });
    const link = `http://localhost:8081/api/auth/resetPassword/${user.id}/${token}`;

    var transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port:587,
      auth: {
        user: "svcSMTP-Cloud@spc.int",
        pass: "m9Td#(fOVNcQj#z",
      },
    });
    var messagebody ="Bula!<br/><br/> Click on the link to reset your password: <a href="+link+">Reset Password Link</a>";
    var mailOptions = {
      from: "svcSMTP-Cloud@spc.int",
      to: user.email,
      subject: "Password Reset",
      html: messagebody,
    };
    
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('Error');
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    
    res.status(200).send(link)
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.resetPassword = async(req, res) => {
  const { id, token } = req.params;
 // console.log(req.params);
 // res.send("Done")
  const oldUser = await User.findOne({ id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = config.secret + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Verified" });
    //res.send("Verified");
   // res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
   // console.log(error);
    res.send("Token has Expired.");
  }
};

exports.resetPasswordpost = async(req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ id: id });
  if (!oldUser) {
    return res.json({ status: "User does not exists!" });
  }
  const secret = config.secret + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
        User.update(
          {
            password: bcrypt.hashSync(req.body.password, 8)
        },{
          where:{
            id:id
          }
        })
      
    res.send("Password updated successfully. Please login and try again!");
   // res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Token has Expired.");
  }
};

exports.findOrCreateRole = (req, res) => {
  return Role.findOrCreate({
    where:{
      name:req.body.name
    },
    defaults:{
      id:req.body.id,
      name:req.body.name
    }
  })
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: "An Error Occurred."+err });
      }
      if (data[1]==true){
        res.status(200).send({message:'Role Created.'})
      }
      else{
        res.status(200).send({message:'Role Exists.'})
      }
  })
    .catch((err) => {
      res.status(404).send({ message: "An Error Occurred."+err });
      
    });
};

exports.findAllRole = (req, res) => {
    
  Role.findAll()
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
        err.message || "Some error occurred while retrieving roles."
    });
  });
};

exports.destroyRefresh = async (req,res) => {
  //const refreshToken = req.body.refreshToken
  let refreshToken = await RefreshToken.findOne({ where: { token: req.body.refreshToken } });
  console.log(refreshToken)
  const x = RefreshToken.verifyExpiration(refreshToken)
  RefreshToken.destroy({ where: { id: refreshToken.id } });
  //RefreshToken.setExpiryDate('2023-08-18 15:36:41')
  console.log('Amnuj');
  console.log(x);

  return RefreshToken.findByPk(refreshToken)
    .then((refreshToken) => {
      console.log(refreshToken)
      if (!refreshToken) {
        return res.status(404).send({ message: "Token Not found." });
      }
      else{
        RefreshToken.destroy({where:{token:req.body.refreshToken}});
        res.status(200).send({ message: "Token deleted!" });
      }
    })
    .catch((err) => {
      res.status(404).send({ message: "An Error Occurred."+err });
    });
};