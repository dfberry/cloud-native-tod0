## Questions

* Why does the todo-nodejs-mongo-aca API allow all traffic 
* Why does the todo-nodejs-mongo-aca API CORS have the portals but not the client (web)?
* The azure.yml service name must match a resource's tag named `azd-service-name` - that's how it finds the correct service to deploy to. 

## Problems

* can't send more than 1 env to client container without array error - could see the error in the deployment log
* web doesn't have the env-config.js in client-todo deploy - removing the filter from the entrypoint.js in case the issue is the variable naming
    * in azure portal - use monitoring/Console to get onto container and rerun the entrypoint.sh script
    * change `"postbuild": "npm run envconfig && shx cp ./entrypoint.sh ./dist || echo 'post-build completed'"`,
    * add as azure.yml predeploy script

## order of operations

* Package creates images but endpoint URLs aren't known so can't be built into image
* Provisioning pushes images to container registry and figures out endpoint URIs by end, into the .env of the environment in .azure
* Deploy -> pushing container image, updating container revision