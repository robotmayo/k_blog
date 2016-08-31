'use strict';
require('dotenv').config({ path : require('path').join(__dirname, '../.env') });
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');

const SECRET = require('./auth').SECRET;
const authMW = jwt({secret : SECRET});

function init(){
  const App = express();
  App.use(bodyParser.json());

  App.use(require('./routes')(express.Router(), authMW));
  App.use(function(err, req, res, next){
    if(err.name === 'UnauthorizedError'){
      res.status(401);
      res.json({error : 'Unauthorized'});
      return;
    }
    next();
  });
  return App;
}
module.exports = init;

if(require.main === module){
  init().listen(process.env.KBLOG_PORT || 8000);
  console.log(`Listening on : ${process.env.KBLOG_PORT || 8000}`)
}