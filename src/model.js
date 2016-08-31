'use strict';
const DB = require('./db');
const query = require('./query')
  .bind(null, DB);
const RECENT_POSTS = `
  SELECT p.title, k.username, p.id 
  FROM blog_posts AS p
  JOIN kblog_users AS k
  ON p.author_id = k.id
  ORDER BY created DESC
  LIMIT 20;
`;

const GET_POST_BY_ID = `
  SELECT p.title, k.username, p.id, p.body
  FROM blog_posts AS p
  JOIN kblog_users AS k
  ON p.author_id = k.id
  WHERE p.id = ?;
`;

const GET_COMMENTS_BY_POST_ID = `
  SELECT c.body, k.username FROM post_comments AS c
  JOIN kblog_users AS k
  ON k.id = c.user_id
  WHERE c.post_id = ?;
`;


/**
 * getUserByUsername
 *  
 * @param  {string} username 
 * @return {UserData} 
 */ 
function getUserByUsername(username) {
  return query(
    `SELECT id, username, password, is_author
      FROM kblog_users WHERE username = ?`,
    username
  ).then(r => Object.assign({}, r[0], {is_author : r[0].is_author === 1}));
}
module.exports.getUserByUsername = getUserByUsername;


/**
 * addUser - Adds a user, note this expects the password to already be hashed!
 *  
 * @param  {string} username   
 * @param  {string} passwordHash The hashed password not the unhashed!
 * @param  {boolean} author       
 * @return {number} userId
 */ 
function addUser(username, passwordHash, author) {
  return query(
      'INSERT INTO kblog_users SET username = ?, password = ?, is_author = ?', [username, passwordHash, author]
    )
    .then(r => r.insertId);
}
module.exports.addUser = addUser;


/**
 * addPost
 *  
 * @param  {number} userID  
 * @param  {string} title   
 * @param  {string} body    
 * @return {number} postId
 */ 
function addPost(userID, title, body) {
  return query(
      'INSERT INTO blog_posts SET author_id = ?, title = ?, body = ?', [userID, title, body])
    .then(r => r.insertId);
}
module.exports.addPost = addPost;


/**
 * getRecentPosts - Returns the most recent 20 posts
 *  
 * @return {posts[]} 
 */ 
function getRecentPosts() {
  return query(RECENT_POSTS)
}
module.exports.getRecentPosts = getRecentPosts;


/**
 * getPostById - Returns the post and its comments
 *  
 * @param  {number} id 
 * @return {post}    
 */ 
function getPostById(id) {
  return Promise.all([query(GET_POST_BY_ID, id), getCommentsByPostId(id)])
    .then(results => {
      return Object.assign({
        comments: results[1]
      }, results[0][0])
    });
}
module.exports.getPostById = getPostById;


/**
 * getCommentsByPostId
 *  
 * @param  {number} id 
 * @return {comments[]} 
 */ 
function getCommentsByPostId(id) {
  return query(GET_COMMENTS_BY_POST_ID, id);
}
module.exports.getCommentsByPostId = getCommentsByPostId;


/**
 * addComment
 *  
 * @param  {number} postId  
 * @param  {number} userId  
 * @param  {string} body    
 * @return {number} commentId         
 */ 
function addComment(postId, userId, body) {
  return query(
      'INSERT INTO post_comments SET post_id = ?, user_id = ?, body = ?', [postId, userId, body]
    )
    .then(r => r.insertId);
}
module.exports.addComment = addComment;