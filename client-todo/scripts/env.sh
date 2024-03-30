#!/bin/bash

# Get the default configuration
defaultConfig=$(jq -r '.defaultEnvironment' ../.azure/config.json)

# Write the configuration to a .env file
azd env get-values --no-prompt > .env

# add TIMESTAMP with UTC to .env
echo "TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> .env