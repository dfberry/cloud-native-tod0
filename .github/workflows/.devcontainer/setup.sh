#! /bin/bash
set -eux

echo "Set up the devcontainer"

# Temp fix for Vite security
chmod -R +x ./scripts

# Install Azure CLI - feature isn't working correctly
curl -fsSL https://aka.ms/install-azd.sh | bash