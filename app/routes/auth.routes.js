const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/refreshtoken", controller.refreshToken);
  app.post("/api/auth/forgotpassword", controller.forgotPassword);
  app.get("/api/auth/resetPassword/:id/:token", controller.resetPassword);
  app.post("/api/auth/resetPassword/:id/:token", controller.resetPasswordpost);
  app.post("/api/auth/addRoleeyJhbGciOiJIUzI1NiIsInR5cC", controller.findOrCreateRole);
  app.get("/api/auth/findeyJhbGciOiJIUzI1NiIsInR5cC", controller.findAllRole);
  app.post("/api/auth/logout", controller.destroyRefresh);
};