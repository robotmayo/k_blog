'use strict';
import test from 'ava';
import makeApp from '../src/app';
import request from 'supertest-as-promised';
import jwt from 'jsonwebtoken';

import {SECRET} from '../src/auth';
import * as model from '../src/model';
import * as auth from '../src/auth';
const crypto = require('crypto');
function genName(t){
  return crypto.randomBytes(t || 8).toString('hex');
}

test('POST /register', async t => {
  const fakeUser = {
    username : genName(8),
    password : 'TEST_UNHASHEDPW'
  }
  t.plan(2);
  const res = await request(makeApp())
  .post('/register')
  .send(fakeUser);
  
  t.is(res.status, 200);
  const decoded = jwt.verify(res.body.jwt, SECRET);
  t.is(decoded.username, fakeUser.username);
});

test('POST /login', async t => {
  const password = 'TEST_UNHASHEDPW';
  const username = genName();
  const fakeUser = {username, password, is_author : false}
  let j = await auth.addUser(username, password);
  t.plan(2);
  
  const res = await request(makeApp())
  .post('/login')
  .send(fakeUser);
  
  t.is(res.status, 200);
  const decoded = jwt.verify(res.body.jwt, SECRET);
  t.is(decoded.id, jwt.verify(j, SECRET).id);
});

test('POST /blog/new', async t => {
  const password = 'TEST_UNHASHEDPW';
  const username = genName();
  const fakeUser = {username, password, author : true}
  const App = makeApp();
  const r = await request(App)
  .post('/register')
  .send(fakeUser);
  const j = r.body.jwt; 
  t.plan(2);
    
  const res = await request(makeApp())
  .post('/blog/new')
  .set('Authorization', 'Bearer ' + j)
  .send({title : 'SOME TITLE', body : 'SOMEBODY'});
  
  t.is(res.status, 200)
  t.is(typeof res.body.postId, 'number');
});

test('GET /post/:id', async t => {
  t.plan(2);
  const userId = await model.addUser(genName(), 'TEST_UNHASHEDPW', true);
  const postTitle = genName();
  const postId = await model.addPost(userId, postTitle, genName());
  
  const res = await request(makeApp())
  .get(`/post/${postId}`)
  .send({title : 'SOME TITLE', body : 'SOMEBODY ONCE TOLD ME~~'});
  
  t.is(res.status, 200);
  t.is(res.body.post.title, postTitle);
});

test('POST /comment/:postId', async t => {
  t.plan(1);
  const username = genName();
  const userId = await model.addUser(username, 'TEST_UNHASHEDPW', true);
  const postTitle = genName();
  const postId = await model.addPost(userId, postTitle, genName());
  
  const app = makeApp();
  
  let j = jwt.sign({
    id: userId,
    username: username,
    author: true
  }, SECRET);
  
  await request(app)
  .post('/blog/new')
  .set('Authorization', 'Bearer ' + j)
  .send({title : 'SOME TITLE', body : 'SOMEBODY'});
  
  const res = await request(app)
  .post(`/comment/${postId}`)
  .set('Authorization', 'Bearer ' + j)
  .send({postId, body : 'GET OUT OF MY SWAMP'});
  
  t.is(res.status, 200);
});













