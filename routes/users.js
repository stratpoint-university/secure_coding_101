var express = require('express');
var router = express.Router();
var emailRegex = /^[\\w!#$%&’*+/=?`{|}~^-]+(?:\\.[\\w!#$%&’*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$/;

function authenticatePasswordUser(user){
  return 'password';
}

function isAuthenticated(user, password){
  if (authenticatePasswordUser(user)== password){
    return true;
  }else {
    return false;
  }
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  if (isAuthenticated(req.params.userID, req.params.password)){
    res.send('respond with a resource');
  }else {
    res.send('respond with an invalid password resource');
  }
  
});

module.exports = router;
