FROM node:18 AS build

# make the 'app' folder the current working directory
WORKDIR /app
# Fix up entrypoint line endings and make exec
#RUN apk update

# .env file, generated from hook in azure.yml, is copied over to the container
COPY . .

# DEBUG: Make sure the .env is in the directory listing
#RUN ls -la

# install project dependencies
RUN npm install
RUN npm run build

# DEBUG: Make sure the .env is in the directory listing
#RUN ls -la

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy over generated assets
COPY --from=build /app/dist .
#COPY --from=build /app/ls*.txt ./archive
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["/bin/sh", "-c", "nginx -g \"daemon off;\""]