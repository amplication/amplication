# multi-stage: base (build)
FROM node:18.13.0-slim AS base

# instantiate environment variable
ARG REACT_APP_SERVER_URL=http://localhost:3000

# set the environment variable that points to the server
ENV REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL

# create directory where the application will be built
WORKDIR /app

# copy over the dependency manifests, both the package.json 
# and the package-lock.json are copied over
COPY package*.json ./

# installs packages and their dependencies
RUN npm install

# copy over the code base
COPY . .

# create the bundle of the application
RUN npm run build

# multi-stage: production (runtime)
FROM nginx:1.22-alpine AS production

# copy over the bundled code from the build stage
COPY --from=base /app/build /usr/share/nginx/html
COPY --from=base /app/configuration/nginx.conf /etc/nginx/conf.d/default.conf

# create a new process indication file
RUN touch /var/run/nginx.pid

# change ownership of nginx related directories and files
RUN chown -R nginx:nginx /var/run/nginx.pid \
        /usr/share/nginx/html \
        /var/cache/nginx \
        /var/log/nginx \
        /etc/nginx/conf.d

# set user to the created non-privileged user
USER nginx

# expose a specific port on the docker container
ENV PORT=3001
EXPOSE ${PORT}

# start the server using the previously build application
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
