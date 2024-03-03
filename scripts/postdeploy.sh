#!/bin/bash
# Usage: <script> <path-for-env-file>
# Example: ./scripts/postdeploy.sh "./api-test" 
echo "postdeploy.sh"

set -x

echo "Getting param 1"
ENV_PATH="$1/.env" || ".env"
echo "ENV_PATH: $ENV_PATH"

echo "Remove old .env file"
rm -f $ENV_PATH

echo "Getting values from azd"
azd env get-values > $ENV_PATH

# Check if the .env exists
if [ ! -f "$ENV_PATH" ]; then
  echo "*** .env file not found at $1"
  exit 1
fi

# Run the npm test command
echo "Run test at $1"
cd "$1" && npm test

echo "Test completed"
exit 0