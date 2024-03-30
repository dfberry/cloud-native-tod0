#!/bin/bash
set -e

# Get the latest Git commit SHA
commit_sha=$(git rev-parse HEAD)

echo "sha: $commit_sha"

# Write the commit SHA to the .env file
echo "COMMIT_SHA=$commit_sha" >> ../.env.docker

cat ../.env.docker
