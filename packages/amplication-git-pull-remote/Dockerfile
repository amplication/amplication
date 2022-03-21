ARG ALPINE_VERSION=alpine3.14
ARG NODE_VERSION=16.13.1

FROM node:$NODE_VERSION-$ALPINE_VERSION AS base
ARG NPM_VERSION=8.1.2
ENV NPM_CONFIG_LOGLEVEL=silent
ENV OPENCOLLECTIVE_HIDE=1

RUN npm install --global npm@$NPM_VERSION
RUN npm config set fund false

WORKDIR /app
COPY lerna.json /app
COPY package*.json /app
RUN npm ci --production

FROM base AS build
WORKDIR /app
# Copy amplication/server and the its dependent packages
COPY packages/amplication-server packages/amplication-git-pull-remote
COPY packages/amplication-container-builder packages/amplication-container-builder
COPY packages/amplication-deployer packages/amplication-deployer

# Installs all copied package node_modules ; Preparation for build
RUN npm run bootstrap -- --scope @amplication/amplication-git-pull-remote --include-dependencies
RUN npm run prisma:generate
# Build all distributions needed for amplicaiton/server
RUN npm run build -- --scope @amplication/amplication-git-pull-remote --include-dependencies

# Removes packages/*/node_modules
# https://github.com/lerna/lerna/issues/2196#issuecomment-994882795
RUN npm run clean -- --yes
# Rebuild production node_modules
RUN npm run bootstrap -- -- --production --scope @amplication/amplication-git-pull-remote --include-dependencies

FROM base as server
WORKDIR /app/packages/amplication-git-pull-remote
# Copy all distributions and node_modules for amplication/server and its dependencies
COPY --from=build /app/packages/amplication-server/package.json /app/packages/amplication-git-pull-remote/package.json
COPY --from=build /app/packages/amplication-server/node_modules /app/packages/amplication-git-pull-remote/node_modules
COPY --from=build /app/packages/amplication-server/dist /app/packages/amplication-git-pull-remote/dist

COPY --from=build /app/packages/amplication-container-builder/package.json /app/packages/amplication-container-builder/package.json
COPY --from=build /app/packages/amplication-container-builder/node_modules /app/packages/amplication-container-builder/node_modules
COPY --from=build /app/packages/amplication-container-builder/dist /app/packages/amplication-container-builder/dist

COPY --from=build /app/packages/amplication-deployer/package.json /app/packages/amplication-deployer/package.json
COPY --from=build /app/packages/amplication-deployer/node_modules /app/packages/amplication-deployer/node_modules
COPY --from=build /app/packages/amplication-deployer/dist /app/packages/amplication-deployer/dist

EXPOSE 3000
CMD [ "node", "dist/src/main"]


## Use node as the base image
#FROM node:16.13.1-alpine3.14 as builder
#
## Define how verbose should npm install be
#ARG NPM_LOG_LEVEL=silent
## Hide Open Collective message from install logs
#ENV OPENCOLLECTIVE_HIDE=1
## Hiden NPM security message from install logs
#ENV NPM_CONFIG_AUDIT=false
## Hide NPM funding message from install logs
#ENV NPM_CONFIG_FUND=false
#
## Update npm to version 7
#RUN npm i -g npm@8.1.2
#
## Set the working directory
#WORKDIR /app
#
## Copy files specifying dependencies
#COPY server/package.json server/package-lock.json ./server/
#COPY admin-ui/package.json admin-ui/package-lock.json ./admin-ui/
#
## Install dependencies
#RUN cd server; npm ci --loglevel=$NPM_LOG_LEVEL;
#RUN cd admin-ui; npm ci --loglevel=$NPM_LOG_LEVEL;
#
## Copy Prisma schema
#COPY server/prisma/schema.prisma ./server/prisma/
#
## Generate Prisma client
#RUN cd server; npm run prisma:generate;
#
## Copy all the files
#COPY . .
#
## Build code
#RUN set -e; (cd server; npm run build) & (cd admin-ui; npm run build)
#
## Expose the port the server listens to
#EXPOSE 3000
#
## Make server to serve admin built files
#ENV SERVE_STATIC_ROOT_PATH=admin-ui/build
#
## Run server
#CMD [ "node", "server/dist/main"]


