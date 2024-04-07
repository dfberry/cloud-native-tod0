#!/bin/bash
# create-env-docker.sh
# Description: This script gets environment values and copies them into .env files

# Exit on error
set -e

# Get environment values
echo "Getting environment values..."
if ! azd env get-values --no-prompt > .env.docker; then
  echo "Error getting environment values"
  exit 1
fi

# Add service principal from .azure/.env.sp
echo "Adding service principal from .azure/.env.sp..."
if [ -f ~/.azure/.env.sp ]; then
  cat ~/.azure/.env.sp >> .env.docker
else
  echo "Service principal file not found"
fi

# Add MongoDB settings
# Cloud/mongo env vars
echo 'DATABASE_NAME=todo' >> .env.docker
echo 'DATABASE_RESET=false' >> .env.docker
echo 'DATABASE_USE_MONGODB=true' >> .env.docker
echo 'DATABASE_IN_CLOUD=true' >> .env.docker

# Copy .env.docker to client-todo/.env
echo "Copying .env.docker to client-todo/.env..."
if ! cp .env.docker client-todo/.env; then
  echo "Error copying .env.docker to client-todo/.env"
  exit 1
fi

# Copy .env.docker to api-todo/.env
echo "Copying .env.docker to api-todo/.env..."
if ! cp .env.docker api-todo/.env; then
  echo "Error copying .env.docker to api-todo/.env"
  exit 1
fi

echo "Script completed successfully"