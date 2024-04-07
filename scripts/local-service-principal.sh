#!/bin/bash

# Create a local service principal and output the result as JSON
sp=$(az ad sp create-for-rbac --name local-sp)

echo "Service principal created: $sp"

# Create the .azure directory if it doesn't exist
mkdir -p .azure

# Create env vars from json
# Make the following changes: 
# appId -> AZURE_CLIENT_ID
# password -> AZURE_CLIENT_SECRET
# tenant -> AZURE_TENANT_ID
spvars=$(echo $sp | jq -r '
  to_entries |
  map(
    if .key == "appId" then
      .key = "AZURE_CLIENT_ID"
    elif .key == "password" then
      .key = "AZURE_CLIENT_SECRET"
    elif .key == "tenant" then
      .key = "AZURE_TENANT_ID"
    else
      .
    end
  ) |
  .[] |
  .key + "=" + (.value | tostring)
')
echo "Service principal env vars: $spvars"

# Save the service principal to a .env file in the .azure directory
echo "$spvars" > .azure/.env.sp

echo "Service principal created and saved to .azure/.env.sp"