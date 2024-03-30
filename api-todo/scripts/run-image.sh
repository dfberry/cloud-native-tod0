# Source the .env.docker file
source .env

docker run --rm --publish 3000:3000 --env-file .env cloud-native-todo-api:${RESOURCE_TOKEN}