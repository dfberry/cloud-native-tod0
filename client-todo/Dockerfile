FROM node:18-alpine AS build

# make the 'app' folder the current working directory
WORKDIR /app

# Copy everything into container
COPY . .

# Fix up entrypoint line endings and make exec
RUN apk update && apk add --no-cache dos2unix \
    && dos2unix /app/scripts/*.* && chmod +x /app/scripts/*.* \
    && apk del dos2unix

# install project dependencies
RUN npm install
RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# put the entrypoint script into the container's bin folder
COPY --from=build /app/scripts /bin

# copy the generated assets to the conainer at the root
COPY --from=build /app/dist .

# copy the nginx config file to the container in the nginx folder
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# expose the client port listed in the vite.config.ts
EXPOSE 80

# when the container starts, it reads the config file and replaces the environment variables
#CMD ["/bin/sh", "-c", "/bin/entrypoint2.sh -o /usr/share/nginx/html/env-config.js && nginx -g \"daemon off;\""]
CMD ["/bin/sh", "-c", "/bin/client-todo-start.sh -o /usr/share/nginx/html/env-config.js && nginx -g \"daemon off;\""]