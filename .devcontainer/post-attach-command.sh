#! /bin/bash

echo 'Installed Tool Versions:'
echo '------------------------'

echo 'Node ' $(node -v)
echo 'NPM version ' $(npm -v)
echo $(git -v)
echo $(docker --version)
echo 'DevContainer version ' $(dev --version)