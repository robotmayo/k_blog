'use strict';
const EE = require('events');
const bcrypt = require('bcryptjs');

const store = new EE();
const DB = require('./db');
const query = require('./query').bind(null, DB);


store.destroy = function storeDestroy(sid, callback){
    query('DELETE FROM sessions WHERE session_id = ?', sid)
    .then(callback.bind(null, null))
    .catch(callback);
}

store.get = function storeGet(sid, callback){
  query('SELECT * FROM sessions WHERE session_id = ?', sid)
  .then(r => callback(null, {userID : r.user_id}))
  .catch(callback);
}

store.set = function storeSet(sid, session, callback){
  query('INSERT INTO sessions SET user_id = ? , session_id = ?', [session.userID, sid])
  .then(callback.bind(null, null))
  .catch(callback);
}

module.exports.store = store;

// Assumes that the username and password is validated, all it does is hash and
// store
function addUser(username, password, author){
  const hash = bcrypt.hashSync(password, 8);
  return query(
    'INSERT INTO users SET username = ?, password = ?, author = ?',
    [username, hash, author]
  )
  .then(results => results.insertId); // TODO: Handle non inserts
}
module.exports.addUser = addUser;

function validateUser(username, password){
  return query(
    `SELECT id, username, password, author 
    FROM kblog_users WHERE username = ?`,
    username
  )
  .then(userData => {
    const validPass = bcrypt.compareSync(password, userData.password);
    if(!validPass) return Promise.reject(new Error('INVALID_PASSWORD'));
    return {username : userData.username, author : userData.author, id : userData.id};
  });
}
module.exports = validateUser;




