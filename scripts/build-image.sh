# Source the .env.docker file
source .env

IMAGE_NAME="cloud-native-todo-api"
IMAGE_TAG="${RESOURCE_TOKEN}"

# Use the RESOURCE_TOKEN in your Docker tag
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .