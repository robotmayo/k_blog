'use strict';
const EE = require('events');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = 'DJ KHALED';
const err = require('./err');
const model = require('./model');


/**
 * validateUserInfo
 *  
 * @param  {string} username 
 * @param  {string} password 
 * @return {Promise<undefined | Error>}          description 
 */ 
function validateUserInfo(username, password) {
  if (!username) return Promise.reject(err(new Error('missing username'), true, 400));
  if (!password) return Promise.reject(err(new Error('missing password'), true, 400));
  if (username.length > 30) return Promise.reject(err(new Error('username too long'), true, 400));
  if (password.trim() === '') return Promise.reject(err(new Error('invalid password'), true, 400));
  return Promise.resolve();
}
module.exports.validateUserInfo = validateUserInfo;


/**
 * addUser - Adds a user also salting and hashing their password before saving
 *  
 * @param  {string} username description 
 * @param  {string} password description 
 * @param  {boolean} author   description 
 * @return {Promise<AuthJWT|Error>}          description 
 */ 
function addUser(username, password, author) {
  const hash = bcrypt.hashSync(password, 8);
  return model.addUser(username, hash, author)
    .then(id => getJWT({
      id,
      username,
      author
    }))
}
module.exports.addUser = addUser;


/**
 * getJWT - Basic auth JWT
 *  
 * @param  {object} userData
 * @param  {string} userData.username
 * @param  {number} userData.id
 * @param  {boolean} userData.author
 * @return {string}  Encoded JWT
 */ 
function getJWT(userData) {
  return jwt.sign({
    id: userData.id,
    username: userData.username,
    author: userData.author
  }, SECRET);
}
module.exports.getJWT = getJWT;


/**
 * login - description
 *  
 * @param  {string} username
 * @param  {string} password Expects this to be the unhashsed password 
 * @return {Promise<AuthJWT | Error}  
 */ 
function login(username, password) {
  return model.getUserByUsername(username)
    .then(userData => {
      const validPass = bcrypt.compareSync(password, userData.password);
      if (!validPass) return Promise.reject(err(new Error('invalid password'), true, 400));
      return getJWT({
        username: userData.username,
        author: userData.author,
        id: userData.id
      });
    });
}
module.exports.login = login;
module.exports.SECRET = SECRET;