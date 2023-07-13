# multi-stage: base (build)
FROM node:18.13.0 AS base

# create arguments of builds time variables
ARG package=amplication-plugin-api

# create directory where the application will be built
WORKDIR /app

# copy over the dependency manifests, both the package.json 
# and the package-lock.json are copied over
COPY ./dist/packages/${package}/package.json ./

# installs packages and their dependencies
RUN npm install --production

# copy over the code base
COPY ./dist/packages/${package} .

# multi-stage: production (runtime)
FROM node:18.13.0-slim AS production

# create arguments of builds time variables
ARG user=amplication
ARG group=${user}
ARG uid=1001
ARG gid=$uid

# [temporary] work around to be able to run prisma
RUN apt-get update -y && apt-get install -y openssl

# create directory where the application will be executed from
WORKDIR /app

# add the user and group
RUN groupadd --gid ${gid} ${user}
RUN useradd --uid ${uid} --gid ${gid} -m ${user}

# copy over the bundled code from the build stage
COPY --from=base /app .

# change ownership of the workspace directory
RUN chown -R ${uid}:${gid} /app/

# set user to the created non-privileged user
USER ${user}

# expose a specific port on the docker container
ENV PORT=3000
EXPOSE ${PORT}

# start the server using the previously build application
CMD [ "node", "./main.js" ]
