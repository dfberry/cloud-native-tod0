# Source the .env.docker file
source .env

# Login to Azure
docker run -it --rm -v "$HOME/.azure:/root/.azure" mcr.microsoft.com/azure-cli az login

# Run the Docker image
docker run --rm --publish 3000:3000 --env-file .env --volume "$HOME/.azure:/root/.azure" cloud-native-todo-api:${RESOURCE_TOKEN}