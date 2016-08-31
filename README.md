Simple Blog Api
===============

### Getting Started
The only outside dependency is `mysql`. So you will need that installed or 
update the `.env` file to point to your hosted instance.

Once `mysql` is setup run `db.sql` then `tables.sql` on the database. These files
are located in the `build` folder. Set up your .env file using 
`config.env.example` as the template. Finally to start simple run `node app.js`.

By default the app runs at `localhost:8000`. You can change this in the env file.


Testing is handle by `ava`. To run : `npm run test`.

You can find the API at [API.md](/API.md)













