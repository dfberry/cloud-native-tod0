# Add infra and code for cloud database

1. Add Cosmos DB to infra
2. Add Cosmos DB connection string to infra KeyVault secrets
3. Add Cosmos DB resource name and endpoint to API environment variables

## Update API to read secret from KeyVault

1. Read secret from KeyVault as part of API startup
2. Fix mongoose code to use collection name as singular `todo`

## Update Client to use new routes and returned objects

1. New routes break out singular from plural: 

    ```
    /todos - multiple items
    /todo - singular item
    ```

2. Object returned contains nested objects:

    ```typescript
        {
        "data": [
            {
                "title": "help",
                "description": null,
                "createdAt": "2024-01-27T16:06:11.291Z",
                "updatedAt": null,
                "id": "65b529f3402f282e6ca5c378"
            }
        ],
        "error": null
    }
    ```

## Client deployment hangs

* Add `/status` route for env in server
* Add infrastructure to support random password for route
* Add infrastructure for debugging
    
    * ENV / output vars: 

        ```
        DEPLOYMENT_DATETIME_UTC="20240127T201222Z"
        DEPLOYMENT_NAME="dfberry-sat-27-7-1706386338"
        INFRA_APP_VERSION="3.0.0"
        RESOURCE_GROUP_NAME="rg-dfberry-sat-27-7"
        API_IMAGE_NAME=""
        CLIENT_IMAGE_NAME=""
        ```

    * Changelog.md

    * Vars for API and Client ports in main.bicep

        ```bicep
        param infraAppVersion string = '3.0.0' // Infrastructure app version
        param portClient string = '3005'
        param portApi string = '3000'
        ```

