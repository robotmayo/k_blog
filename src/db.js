'use strict';
const mysql = require('mysql');
require('dotenv').config({ path : require('path').join(__dirname, '../.env') });
const DB = mysql.createPool({
  user : process.env.KBLOG_DB_USER,
  password : process.env.KBLOG_DB_PASSWORD,
  database : process.env.KBLOG_DB_DATABASE,
  host : process.env.KBLOG_DB_HOST,
  port : ''
});

module.exports = DB;