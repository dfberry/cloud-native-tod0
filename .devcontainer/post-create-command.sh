#! /bin/bash
sudo apt-get clean
sudo apt update
npm i -g npm@latest

npm install

chmod -R +x ./scripts

node -v
npm -v
git -v
docker --version