'use strict';
const mysql = require('mysql');
const DB = mysql.createPool({
  user : 'root',
  password : 'root',
  database : 'k_blog',
  host : 'localhost',
  port : ''
});

module.exports = DB;