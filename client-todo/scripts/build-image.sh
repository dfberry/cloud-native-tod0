# Source the .env.docker file
source .env

# Use the RESOURCE_TOKEN in your Docker tag
docker build -t cloud-native-todo-client:${RESOURCE_TOKEN} .