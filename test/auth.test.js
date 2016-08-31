import test from 'ava';
import * as auth from '../src/auth';
import * as model from '../src/model';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

function genName(t){
  return crypto.randomBytes(t || 8).toString('hex');
}

test('auth.validateUserInfo',  t => {
  t.plan(4);
  t.throws(auth.validateUserInfo(), 'missing username');
  t.throws(auth.validateUserInfo('shrek'), 'missing password');
  t.throws(auth.validateUserInfo(genName(100), 'ppass'), 'username too long');
  t.throws(auth.validateUserInfo('GETOUTOFMYSWAMP', '       '), 'invalid password');
});


test('auth.addUser', async t => {
  t.plan(1);
  const username = genName();
  const j = await auth.addUser(username, 'password');
  const decoded = jwt.verify(j, auth.SECRET);
  // Make sure the password is stored as hashed
  const userData = await model.getUserByUsername(username);
  t.truthy(bcrypt.compareSync('password', userData.password));
});

test('auth.getJWT', t => {
  t.plan(1);
  const user = {
    id : 0,
    username : 'smash mouth',
    author : true
  };
  const decoded = jwt.verify(auth.getJWT(user), auth.SECRET);
  user.iat = decoded.iat;
  t.deepEqual(
    decoded,
    user
  );
});

test('auth.login', async t => {
  t.plan(1);
  const username = genName();
  const j = await auth.addUser(username, 'password');
  
  const loginJWT = await auth.login(username, 'password');
  const decoded = jwt.verify(loginJWT, auth.SECRET);
  const jDecoded = jwt.verify(j, auth.SECRET);
  
  jDecoded.iat = decoded.iat;
  t.deepEqual(
    decoded,
    jDecoded
  );
});




