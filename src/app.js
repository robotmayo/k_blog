'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const App = express();
App.use(bodyParser.json());
App.use(session({
  secret : 'DJ KHALED',
  cookie : {
    path : '/',
    httpOnly : true,
    secure : false,
    maxAge : 30 * 24 * 60 * 60 * 1000 // 30 Days
  },
  store : require('./auth').store,
  saveUninitialized : false,
  resave : false
}));

App.get('/', (req, res) => {
  req.session.name = 'DERP';
  console.log('WE HERE');
  res.json({hi : 'hi'})
})

App.listen(8000);