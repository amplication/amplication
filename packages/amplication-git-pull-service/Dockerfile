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
# Copy amplication/git-pull-service and the its dependent packages
COPY packages/amplication-git-pull-service packages/amplication-git-pull-service

# Installs all copied package node_modules ; Preparation for build
RUN npm run bootstrap -- --scope @amplication/git-pull-service --include-dependencies
RUN npm run prisma:generate
# Build all distributions needed for amplicaiton/git-pull-service
RUN npm run build -- --scope @amplication/git-pull-service --include-dependencies

# Removes packages/*/node_modules
# https://github.com/lerna/lerna/issues/2196#issuecomment-994882795
RUN npm run clean -- --yes
# Rebuild production node_modules
RUN npm run bootstrap -- -- --production --scope @amplication/git-pull-service --include-dependencies

FROM base as git-pull-service
WORKDIR /app/packages/amplication-git-pull-service
COPY --from=build /app/packages/amplication-git-pull-service/package.json /app/packages/amplication-git-pull-service/package.json
COPY --from=build /app/packages/amplication-git-pull-service/node_modules /app/packages/amplication-git-pull-service/node_modules
COPY --from=build /app/packages/amplication-git-pull-service/dist /app/packages/amplication-git-pull-service/dist

EXPOSE 3000
CMD [ "node", "dist/src/main"]