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
COPY package*.json /app/
RUN npm ci --production

FROM base AS build
WORKDIR /app
# Copy amplication-git-push-webhook-service  and the its dependent packages
COPY packages/amplication-git-push-webhook-service packages/amplication-git-push-webhook-service
COPY packages/amplication-prisma-db packages/amplication-prisma-db
COPY packages/amplication-kafka packages/amplication-kafka
# Installs all copied package node_modules ; Preparation for build
RUN npm run bootstrap -- --scope @amplication/git-push-webhook-service --include-dependencies

# Build all distributions needed for amplication-git-push-webhook-service
RUN npm run build -- --scope @amplication/git-push-webhook-service --include-dependencies

# Removes packages/*/node_modules
# https://github.com/lerna/lerna/issues/2196#issuecomment-994882795
RUN npm run clean -- --yes
# Rebuild production node_modules
RUN npm run bootstrap -- -- --production --scope @amplication/git-push-webhook-service --include-dependencies

RUN find ./packages/amplication-*/* -type d ! -path "*node_modules*" ! -path "*dist*" ! -path "*lib*" -exec rm -rf {} +
RUN find ./packages/amplication-*/* -type f ! -path "*lib*" ! -path "*node_modules*" ! -path "*dist*" ! -name package.json -exec rm -rf {} +

FROM base as server
WORKDIR /app/packages/amplication-git-push-webhook-service
# Copy all distributions and node_modules for amplication-git-push-webhook-service  and its dependencies
COPY --from=build /app/packages/ /app/packages/

EXPOSE 4567
CMD [ "node", "dist/src/main"]