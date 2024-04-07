#!/bin/bash

# Source the .env.sp file
source .azure/.env.sp

# Call azd provision with the service principal id
azd provision --service-principal-id $AZURE_CLIENT_ID