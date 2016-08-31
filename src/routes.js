'use strict';
const DB = require('./db');
const auth = require('./auth');
const model = require('./model');

function errResponse(err, res){
  if(err.isOurs && err.isUserbound){
      res.status(err.status);
      return res.json({error : err.message});
  }
  res.status(500);
  res.json({error : 'an unknown error occured'});
}

function routes(router, jwt){
  router.post('/register', (req, res) => {
    auth.addUser(req.body.username, req.body.password, req.body.author === true)
    .then(signedJWT => {
      res.json({jwt : signedJWT});
    })
    .catch(err => errResponse(err, res));
  });

  router.post('/login', (req, res) => {
    auth.login(req.body.username, req.body.password)
    .then(signedJWT => {
      res.json({jwt : signedJWT})
    })
    .catch(err => errResponse(err, res));
  });
  
  router.get('/', (req, res) =>{
    model.getRecentPosts()
    .then(posts => {
      res.json({payload : posts});
    })
    .catch(err => errResponse(err, res));
  });
  
  router.post('/blog/new', jwt, function(req , res){
    const user = req.user;
    if(req.user.author !== true) return errResponse(new Error('Not an author'))
    model.addPost(user.id, req.body.title, req.body.body)
    .then(postId => res.json({success : true, postId}))
    .catch(err => errResponse(err, res));
  });
  
  router.get('/post/:id', function(req, res){
    model.getPostById(req.params.id)
    .then(post => res.json({post}))
    .catch(err => errResponse(err, res));
  });
  
  router.post('/comment/:postId', jwt, function(req, res){
    model.addComment(req.params.postId, req.user.id, req.body.body)
    .then(() => res.json({success : true}))
    .catch(err => errResponse(err, res));
  });
  
  return router;
}



module.exports = routes;
