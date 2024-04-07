# API-TODO Dockerfile

# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Bundle the application source inside the Docker image
COPY . .

# Stop the build if the .env isn't in the root of the project
RUN test -f .env

# Install the application dependencies
RUN npm install

# If you are building your code for production
RUN npm run build

RUN ls -la
RUN ls -la dist

# Install PM2 globally
RUN npm install pm2 -g

# Expose the application on port 3000
EXPOSE 3000

# Define the command to run the application using PM2
CMD [ "pm2-runtime", "start", "dist/start.js" ]