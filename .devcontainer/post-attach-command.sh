#! /bin/bash

echo 'Installed Tool Versions:'
echo '------------------------'

echo 'Node ' $(node -v)
echo 'NPM version ' $(npm -v)
echo $(git -v)
echo $(docker --version)
echo 'AZ version ' $(az --version)
echo 'AZD version ' $(azd version)
echo 'GitHub CLI version ' $(gh --version)
echo 'DevContainer version ' $(devcontainer --version)