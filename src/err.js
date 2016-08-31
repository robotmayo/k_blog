'use strict';
const log = require('logbro');

module.exports = function err(e, isUserbound, status){
  log.error(e.stack);
  e.isUserbound = isUserbound === true;
  e.status = status || 500;
  e.isOurs = true;
  return e;
};