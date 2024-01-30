# 2.0.0

Breaking change is route change from single route to 2 routes: `todos` and `todo`

* Add database
* Add container to docker-compose file
* Add `/data` layer
* Update APIs
* Updated openapi - but didn't test
* Add supertest, curl, and mocked tests at a variety of layers
* Add CRUD generic class
* Kept in-mem db and updated that layer too
* Get secret from keyvault for config (mongoDB connection string)
* Update routes to /todos and /todo
* Force mongo db and collection to be `todo` - make sure infra also has this
* /status route with random password (env var on container)

# 1.0.4

* Fix log location
* Fix route 404
* Fix response middleware
* Fix app.use calls/order
* Add script to run test with logs
* Add test for 404
* Ignore any logs

# 1.0.3

fix package.json name and dep -> devDep
fix mono .launch file for workspace location for jest
change .launch file to use npm test (makes it easier to maintain)
