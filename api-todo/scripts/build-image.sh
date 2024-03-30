# Source the .env.docker file
source ../.env.docker

# Use the RESOURCE_TOKEN in your Docker tag
docker build -t cloud-native-todo-api:${RESOURCE_TOKEN} .