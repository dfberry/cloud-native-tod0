param name string
param location string = resourceGroup().location
param tags object = {}

param identityName string
param containerRegistryName string
param containerAppsEnvironmentName string
param serviceName string = 'api-todo'
param exists bool
param corsAcaUrl string
param applicationInsightsName string

param fullBuild bool = false

// if fullBuild is false, set utcNow() as the build number
param currentDeploymentDateTimeUtc string = utcNow()
// build up tags 
var updatedTags = fullBuild ? union(tags, { 'azd-service-name': 'api-todo' }) : union(tags, { 'azd-service-name': 'api-todo', 'azd-deployment-id': deployment().name, 'azd-deployment-utc': currentDeploymentDateTimeUtc })

var secrets = []
var env = []

resource webIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: identityName
  location: location
}

module api '../infra/shared/host/container-app-upsert.bicep' = {
  name: '${serviceName}-container-app'
  params: {
    name: name
    location: location
    tags: updatedTags
    identityType: 'UserAssigned'
    identityName: identityName
    exists: exists
    containerAppsEnvironmentName: containerAppsEnvironmentName
    containerRegistryName: containerRegistryName
    targetPort: 3000
    env: union([
      {
        name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
        value: applicationInsights.properties.ConnectionString
      }
      {
        name: 'PORT'
        value: '3000'
      }
      {
        name: 'API_ALLOW_ORIGINS'
        value: corsAcaUrl
      }
    ],
    env,
    map(secrets, secret => {
      name: secret.name
      secretRef: secret.secretRef
    }))
  }
}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' existing = if (!empty(applicationInsightsName)) {
  name: applicationInsightsName
}

// resource app 'Microsoft.App/containerApps@2023-04-01-preview' = {
//   name: name
//   location: location
//   tags: updatedTags
//   dependsOn: [ acrPullRole ]
//   identity: {
//     type: 'UserAssigned'
//     userAssignedIdentities: { '${identity.id}': {} }
//   }
//   properties: {
//     managedEnvironmentId: containerAppsEnvironment.id
//     configuration: {
//       ingress:  {
//         external: true
//         targetPort: 3000
//         transport: 'auto'
//       }
//       registries: [
//         {
//           server: '${containerRegistryName}.azurecr.io'
//           identity: identity.id
//         }
//       ]
//       secrets: union([
//       ],
//       map(secrets, secret => {
//         name: secret.secretRef
//         value: secret.value
//       }))
//     }
//     template: {
//       containers: [
//         {
//           image: fetchLatestImage.outputs.?containers[?0].?image ?? 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'
//           name: 'main'
//           env: union([
//             {
//               name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
//               value: applicationInsights.properties.ConnectionString
//             }
//             {
//               name: 'PORT'
//               value: '3000'
//             }
//             {
//               name: 'API_ALLOW_ORIGINS'
//               value: corsAcaUrl
//             }
//           ],
//           env,
//           map(secrets, secret => {
//             name: secret.name
//             secretRef: secret.secretRef
//           }))
//           resources: {
//             cpu: json('1.0')
//             memory: '2.0Gi'
//           }
//         }
//       ]
//       scale: {
//         minReplicas: 1
//         maxReplicas: 10
//       }
//     }
//   }
// }

//output defaultDomain string = containerAppsEnvironment.properties.defaultDomain
// output name string = app.name
// output API_TODO_ENDPOINT string = 'https://${app.properties.configuration.ingress.fqdn}'
// output id string = app.id

output API_WEB_IDENTITY_PRINCIPAL_ID string = webIdentity.properties.principalId
output API_WEB_NAME string = api.outputs.name
output API_WEB_URI string = api.outputs.uri
output API_WEB_IMAGE_NAME string = api.outputs.imageName
//output API_TODO_ENDPOINT string = 'https://${api.properties.configuration.ingress.fqdn}'

