'use strict';
import test from 'ava';
import * as model from '../src/model';
const crypto = require('crypto');

test.after.always(() => {
  require('../src/db')
    .end();
});

function genName(t){
  return crypto.randomBytes(t || 8).toString('hex');
}

async function genFakePost(){
  const title = genName();
  const body = genName(100);
  let id = await model.addPost(1, title, body);
  return {id, title, body};
}

async function genFakeComment(postId, userId){
  const body = genName(16);
  let id = await model.addComment(postId, userId || 1, body);
  return {id, body};
}

test('model.getUserByUsername', async t => {
  t.plan(1);
  const password = 'TEST_UNHASHEDPW';
  const fakeUser = {username : genName(), password, is_author : false}
  let id = await model.addUser(fakeUser.username, password);
  fakeUser.id = id;
  let user = await model.getUserByUsername(fakeUser.username);
  t.deepEqual(user, fakeUser);
});

test('model.addPost', async t => {
  t.plan(1);
  let postId = await model.addPost(1, 'TEST_TITLE', 'TEST_BODY');
  t.is(typeof postId, 'number');
});

test('getPostById', async t => {
  t.plan(4);
  const fakeUser = {username : genName()}
  let fakeUserId = await model.addUser(fakeUser.username, 'TEST_UNHASHEDPW');
  fakeUser.id = fakeUserId;
  let fakePost = await genFakePost();
  let fakeComment = await genFakeComment(fakePost.id, fakeUser.id);
  let post = await model.getPostById(fakePost.id);
  let fakeComments = [{username : fakeUser.username, body : fakeComment.body}];
  const expectedObj = {
    title : fakePost.title,
    body : fakePost.body,
    id : fakePost.id,
    comments : fakeComments
  };
  t.is(post.title, expectedObj.title);
  t.is(post.body, expectedObj.body);
  t.is(post.id, expectedObj.id);
  t.deepEqual(post.comments, expectedObj.comments);
});

test('model.getCommentsByPostId', async t => {
  t.plan(1);
  const fakeUser = {username : genName()}
  let fakeUserId = await model.addUser(fakeUser.username, 'TEST_UNHASHEDPW');
  fakeUser.id = fakeUserId;
  let fakePost = await genFakePost();
  let fakeComment = await genFakeComment(fakePost.id, fakeUser.id);
  let comments = await model.getCommentsByPostId(fakePost.id);
  let fakeComments = [{username : fakeUser.username, body : fakeComment.body}];
  t.deepEqual(comments, fakeComments);
});

test('model.addComment', async t => {
  t.plan(1);
  const fakeUser = {username : genName()}
  let fakeUserId = await model.addUser(fakeUser.username, 'TEST_UNHASHEDPW');
  fakeUser.id = fakeUserId;
  let fakePost = await genFakePost();
  let fakeComment = await genFakeComment(fakePost.id, fakeUser.id);
  t.is(typeof fakeComment.id, 'number');
});

test('model.addUser', t => {
  t.plan(1);
  const name = crypto.randomBytes(8).toString('hex');
  return model.addUser(name, 'TEST_UNHASHEDPW', true)
    .then(insertId => {
      return model.getUserByUsername(name)
      .then(user => {
        t.deepEqual(
          user, {
            id : insertId,
            username: name,
            password: 'TEST_UNHASHEDPW',
            is_author: true
          }
        );
      });
    })
    .catch(err => t.fail(err.stack))
});






