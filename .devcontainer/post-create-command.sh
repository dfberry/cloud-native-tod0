#! /bin/bash
sudo apt-get clean
sudo apt update
npm i -g npm@latest
npm install
chmod -R +x ./scripts
npx playwright install --with-deps 
echo "Node version" && node -v
echo "NPM version" && npm -v
echo "Git version" && git -v
echo "Docker version" && docker --version 
