# Source the .env.docker file
source .env

docker run --rm --publish 80:80 --env-file .env cloud-native-todo-api:${RESOURCE_TOKEN}