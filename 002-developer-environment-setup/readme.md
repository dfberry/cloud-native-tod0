# Developer Environment setup

Date: Nov 2023

Dev containers are the first thing I usually set up in my developer environment. Its also new enough I'm not sure if Copilot will have accurate information. Let's see...

## Prompt: What do you suggest I do to setup up my local developer environment for my cloud native repository?  

Copilot: GitHub Copilot: To set up your local developer environment for a cloud native repository, you can follow these steps:

1. **Install Docker**: Docker is a platform that allows you to develop, ship, and run applications in containers. Containers are lightweight and contain everything needed to run an application, so you don't need to rely on what's currently installed on your host.

2. **Install Kubernetes**: Kubernetes is a container orchestration platform that can manage and scale your applications across multiple Docker containers and hosts.

3. **Install a code editor**: A code editor like Visual Studio Code is essential for writing and managing your code.

4. **Clone the repository**: Use Git to clone the cloud native repository to your local machine.

5. **Install the required dependencies**: The repository should include a file (like a `package.json` for Node.js projects or `requirements.txt` for Python projects) that lists the dependencies of the project. You can install these with your package manager.

6. **Run the application locally**: Use Docker to build a container for your application and then run it.

7. **Test the application**: Make sure the application runs as expected. You can do this by running any included test scripts, and by using the application and checking the results.

Here's a general example of how you might do this:

```bash
# Install Docker
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

# Install Kubernetes
sudo apt-get update
sudo apt-get install -y apt-transport-https
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl

# Clone the repository
git clone https://github.com/your-repo.git

# Navigate into the repository
cd your-repo

# Install dependencies
npm install # or pip install -r requirements.txt

# Build and run the Docker container
docker build -t your-app .
docker run -p 8080:8080 your-app

# Test the application
npm test # or python -m unittest discover
```

Please replace the placeholders with your actual data. Also, the commands might vary depending on the OS and the programming language you are using.

**My perspective**: this isn't bad but assumes the repository has everything already. Notice that docker must be installed on the local computer or you need to use GitHub Codespaces. There are times when my local mac m1 fails with a docker image or setting, so Codespaces is my backup. While I do have many hours of free Codespaces time, I use a lot so anytime I can run a dev container locally is better.

## Prompt: What do you suggest I do to setup up my local developer environment for my new cloud native repository?

Copilot: Setting up a local development environment for a new cloud native repository involves several steps. Here's a general guide:

1. **Install a code editor**: If you haven't already, install a code editor such as Visual Studio Code.

2. **Install Docker**: Docker allows you to build, ship, and run applications inside containers. This is essential for cloud native development.

3. **Install Kubernetes**: Kubernetes is a container orchestration platform that's often used in cloud native development.

4. **Create a new repository**: You can do this on GitHub, GitLab, Bitbucket, or another version control platform.

5. **Clone the repository**: Clone the repository to your local machine using Git.

6. **Create a Dockerfile**: This file will contain instructions for Docker to build your application's container.

7. **Create a Kubernetes configuration file**: This file (often named `k8s.yaml` or `k8s.yml`) will tell Kubernetes how to deploy and manage your application.

8. **Write your application**: Write the code for your application, making sure to follow cloud native principles.

9. **Build and run your application locally**: Use Docker to build a container for your application and run it locally to make sure everything works.

10. **Push your changes**: Push your code, Dockerfile, and Kubernetes configuration file to the remote repository.

Here's an example of how you might do this:

```bash
# Navigate to the directory where you want to create your project
cd ~/my-projects

# Clone your repository
git clone https://github.com/your-username/your-repo.git

# Navigate into your new repository
cd your-repo

# Create a Dockerfile
echo "FROM node:14\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD [\"node\", \"index.js\"]" > Dockerfile

# Create a Kubernetes configuration file
echo "apiVersion: v1\nkind: Pod\nmetadata:\n  name: your-app\nspec:\n  containers:\n  - name: your-app\n    image: your-username/your-app:latest" > k8s.yaml

# Write your application
echo "console.log('Hello, world!');" > index.js

# Build your Docker image
docker build -t your-username/your-app .

# Run your Docker container
docker run -p 8080:8080 your-username/your-app

# Add your changes to Git
git add .

# Commit your changes
git commit -m "Initial commit"

# Push your changes
git push origin main
```

Please replace the placeholders with your actual data. Also, the commands might vary depending on the OS and the programming language you are using.

## Prompt: Can you alter those steps to use a dev container with visual studio code?

Copilot: GitHub Copilot: Absolutely, you can use Visual Studio Code's Dev Containers feature to create a consistent development environment. Here's how you can modify the steps:

1. **Install Visual Studio Code and Docker**: Make sure you have both installed on your machine.

2. **Install the Remote - Containers extension**: This extension is needed to use Dev Containers in Visual Studio Code.

3. **Clone the repository**: Clone the repository to your local machine using Git.

4. **Open the repository in a Dev Container**: In Visual Studio Code, use the Command Palette (F1) to run the "Remote-Containers: Open Folder in Container..." command. Select the cloned repository.

5. **Create a Dockerfile and .devcontainer/devcontainer.json**: These files will define your Dev Container. The Dockerfile specifies the base Docker image and any software that needs to be installed. The devcontainer.json file configures how Visual Studio Code should start the container and what to do after it connects.

6. **Write your application**: Write the code for your application, making sure to follow cloud native principles.

7. **Build and run your application locally**: Use the integrated terminal in Visual Studio Code to build and run your application inside the Dev Container.

8. **Push your changes**: Push your code, Dockerfile, and devcontainer.json to the remote repository.

Here's an example of how you might do this:

```bash
# Clone your repository
git clone https://github.com/your-username/your-repo.git

# Navigate into your new repository
cd your-repo

# Create a Dockerfile
echo "FROM node:14\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD [\"node\", \"index.js\"]" > Dockerfile

# Create a .devcontainer directory
mkdir .devcontainer

# Create a devcontainer.json file
echo "{\n  \"name\": \"Your App\",\n  \"dockerFile\": \"Dockerfile\",\n  \"appPort\": [8080],\n  \"extensions\": []\n}" > .devcontainer/devcontainer.json

# Write your application
echo "console.log('Hello, world!');" > index.js

# Add your changes to Git
git add .

# Commit your changes
git commit -m "Initial commit"

# Push your changes
git push origin main
```

Then, in Visual Studio Code, use the Command Palette to run the "Remote-Containers: Reopen in Container" command. This will start the Dev Container and open a new Visual Studio Code window connected to it. You can then use the integrated terminal to run your application.

Please replace the placeholders with your actual data. Also, the commands might vary depending on the OS and the programming language you are using.

**My perspective**: better but more steps than I need at this point. If you compare with my [Dev container](../.devcontainer/devcontainer.json):

* My `devcontainer.json` is sparse as I want to build it up as I go. 
* My image is `typescript-node` which means I don't need to deal with installing Node.js or TypeScript and as an added bonus, the container has git installed too. I probably has other CLIs I need. I also added a script after the container is created to display the versions of these 3 programs. 
* The Copilot extension for Visual Studio Code is installed in the `customizations` section. This is part of my pair programming philosophy so having it from the very beginning will be helpful. 

If you know you need other docker images stacked on top, add an image or **feature** in the `devcontainer.json` one at a time. Depending on what you are adding, you may find installing that functionality into the current image is better than adding features. 

## Prompt: If I'm going to use the Azure cloud and want to be cloud-native, can you suggest any other software or features to add to the dev container?

GitHub Copilot: If you're planning to use Azure and want to be cloud-native, there are several tools and extensions you could consider adding to your dev container:

1. **Azure CLI**: The Azure Command Line Interface is a set of commands used to create and manage Azure resources. It's a crucial tool for anyone working with Azure.

2. **Azure Functions Core Tools**: If you're planning to use Azure Functions, this tool allows you to develop and test your functions on your local machine.

3. **Azure Storage Emulator**: This tool emulates Azure Blob, Queue, and Table services for local development purposes.

4. **Azure Extensions for Visual Studio Code**: There are several Azure-related extensions for Visual Studio Code that can help with your development. These include the Azure Functions extension, Azure Storage extension, Azure Databases extension, and more.

5. **Docker Extension for Visual Studio Code**: If you're working with Docker, this extension makes it easier to build, manage, and deploy containerized applications.

6. **Kubernetes Extension for Visual Studio Code**: If you're using Kubernetes, this extension provides an explorer view to manage clusters and the nodes inside them. It also provides syntax highlighting, IntelliSense for Kubernetes resources, and more.

You can add these tools and extensions to your `devcontainer.json` file. Here's an example of how you might do this:

```json
{
  "name": "Your App",
  "dockerFile": "Dockerfile",
  "appPort": [8080],
  "extensions": [
    "ms-azuretools.vscode-docker",
    "ms-kubernetes-tools.vscode-kubernetes-tools",
    "ms-azuretools.vscode-azurefunctions",
    "ms-azuretools.vscode-azurestorage",
    "ms-azuretools.vscode-cosmosdb"
  ],
  "postCreateCommand": "az --version && func --version && echo Azure tools installed",
  "settings": {
    "terminal.integrated.shell.linux": "/bin/bash"
  }
}
```

This configuration installs the Azure CLI, Azure Functions Core Tools, and Azure Storage Emulator in the dev container, and also installs several Azure-related extensions in Visual Studio Code. The `postCreateCommand` runs after the dev container is created, and checks the versions of the installed Azure tools.

Please replace the placeholders with your actual data. Also, the commands might vary depending on the OS and the programming language you are using.

**My perspective** I do want to add Azure CLI and other Visual Studio Code extensions but I want to add them when I need them. I haven't need the linux shell yet. I wonder when Copilot thinks I will need it. 

## Prompt: Why do I need the configure the integrated shell?

GitHub Copilot: The `"terminal.integrated.shell.linux": "/bin/bash"` setting in the `devcontainer.json` file specifies the default shell for the integrated terminal in Visual Studio Code when running in the dev container.

This setting is particularly useful when you're working in a Linux-based dev container, as it ensures that the integrated terminal uses the Bash shell, which is a common choice for development due to its powerful scripting capabilities and wide usage in the Linux world.

If your development work doesn't involve using the terminal or if you're comfortable with the default shell provided by the container's base image, you might not need this setting. However, if you do need to use the terminal for tasks like running scripts, installing packages, or interacting with version control, having a familiar and powerful shell like Bash can be very helpful.

**My perspective** Bash is already my default shell. I'm not sure if that is something I configured already or came with the default dev container. 