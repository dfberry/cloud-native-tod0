#!/bin/bash
# Usage: <script> <path-for-docker-file>
# Example: ./scripts/preprovision.sh "./api-todo" 

# Combine the context path with the Dockerfile path
DOCKERFILE_CONTEXT_PATH=$1 || "Dockerfile"
echo "*** DOCKERFILE_CONTEXT_PATH: $DOCKERFILE_CONTEXT_PATH"

# Check if the Dockerfile exists
if [ ! -f "$DOCKERFILE_CONTEXT_PATH" ]; then
  echo "*** Dockerfile not found at $DOCKERFILE_CONTEXT_PATH"
  exit 1
fi

# Extract the version label from the Dockerfile
VERSION=$(grep 'LABEL version=' "$DOCKERFILE_CONTEXT_PATH" | cut -d'"' -f2)

# Write the version to an environment file to the root of the repo
echo "DOCKER_IMAGE_VERSION=$VERSION" > .env

# Return success so AZD continues to the next step
exit 0
