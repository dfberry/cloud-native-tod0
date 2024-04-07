#!/bin/bash

set +e

echo "Removing .env.docker..."
rm .env.docker || echo "Error removing .env.docker"

echo "Removing mongodata directory..."
rm -rf mongodata || echo "Error removing mongodata directory"

echo "Running npm clean..."
npm run clean -ws --if-present || echo "Error running npm clean"

# Remove all Docker images
docker rmi -f $(docker images -a -q)

# Clean all unused or dangling images, containers, volumes, and networks
docker system prune -a -f