module.exports.routes = {
  // '*': function(req,res,next){
  //   console.log('looking for:',req.originalUrl);
  //   return next();
  // },

  "POST /count" : {
    "target": "CountController.registerCount"
  },
  "post /user": {
    "target": "UserController.post_create"
  },
  "post /logout": {
    "target": "LogoutController.create"
  },
  "post /me/reset": {
    "target": "MeController.reset"
  },
  "get /me": {
    "target": "UserController.getMe"
  },
  "put /me": {
    "target": "MeController.put_update"
  },
  "post /integration/facebook": {
    "target": "IntegrationController.facebook"
  },
  "get /integration": {
    "target": "IntegrationController.find"
  },
  "get /": {
    "target": "Home$Controller.find"
  },
  "post /me/authenticate": {
    "target": "MeController.authenticate"
  },
  "get /integration/user": {
    "target": "IntegrationController.user"
  },
  "post /forgot": {
    "target": "ForgotController.create"
  },
  "post /test": {
    "target": "TestController.create"
  },
  "post /login": {
    "target": "LoginController.login"
  },
  "get /user/facebook": {
    "target": "UserController.facebook"
  },
  "get /user": {
    "target": "UserController.get_find"
  },
  "get /user/:id": {
    "target": "UserController.get_$id",
    "skipAssets": true
  },
  "delete /user/:id": {
    "target": "UserController.delete_$id",
    "skipAssets": true
  }
};