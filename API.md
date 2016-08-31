### Api
The api uses [JSON Web Tokens](https://auth0.com/learn/json-web-tokens/) for authentication. Therefore some routes require them.

Home
====

`GET /`

Description
===========
Returns the most recent posts

Parameters
=========


Headers
=======

Example
=======
`curl -XGET 'localhost:8000/'`

Returns

```json
{
  "payload" : [{
    "title" : "Title",
    "comments" : []
    }]
}
```

Register
========

`POST /register`

Description
===========
Register a new user. This method uses JSON Web Tokens, you will need this token
to access protected routes.

Parameters
=========
- **username**(REQUIRED) - String
- **password**(REQUIRED) - String
- **author** - Boolean - Determents if its an author

Headers
=======

Example
=======
`curl -XPOST -H "Content-type: application/json" -d '{"username" : "myname", "password" : "somepassword", "author" : true}' 'localhost:8000/register'`

Returns

```json
{
  "jwt" : "*encoded data*"
}
```

Login
========

`POST /login`

Description
===========
Login as the user

Parameters
=========
- **username**(REQUIRED) - String
- **password**(REQUIRED) - String

Headers
=======

Example
=======
`curl -XPOST -H "Content-type: application/json" -d '{"username" : "myname", "password" : "somepassword"}' 'localhost:8000/login'`

Returns

```json
{
  "jwt" : "*encoded data*"
}
```

Create Post
========

`POST /blog/new`

Description
===========
Create a new post

Parameters
=========
- **title**(REQUIRED) - String
- **body**(REQUIRED) - String

Headers
=======
`Authorization: Bearer *YOURTOKEN*`

Example
=======
`curl -XPOST -H 'Authorization: Bearer *YOURTOKEN*' -H "Content-type: application/json" -d '{"title" : "2001",  "body" : "SOMEBODY ONCE TOLD ME"}' 'localhost:8000/blog/new'`

Returns

```json
{
  "success" : "true",
  "postId" : 1
}
```

A Single Post
====

`GET /post/:id`

Description
===========
Returns the post at the specified ID.

Parameters
=========


Headers
=======

Example
=======
`curl -XGET 'localhost:8000/post/1'`

Returns

```json
{
  "post" : {
    "title" : "Title",
    "body" : "some body",
    "author" : "some author",
    "comments" : []
    }
}
```

Add Comment
========

`POST /comment/:postId`

Description
===========
Add comment to a post

Parameters
=========
- **body**(REQUIRED) - String

Headers
=======
`Authorization: Bearer *YOURTOKEN*`

Example
=======
`curl -XPOST -H 'Authorization: Bearer *YOURTOKEN*' -H "Content-type: application/json" -d '{"body" : "SOMEBODY ONCE TOLD ME"}' 'localhost:8000/comment/1'`

Returns

```json
{
  "success" : "true"
}
```
