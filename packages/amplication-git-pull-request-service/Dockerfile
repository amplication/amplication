ARG NODE_VERSION=16.16-alpine

FROM node:$NODE_VERSION AS base

ARG NPM_VERSION=8.1.2
ENV OPENCOLLECTIVE_HIDE=1

RUN npm install --global npm@$NPM_VERSION
RUN npm config set fund false

WORKDIR /app
COPY lerna.json /app
COPY package*.json /app/
RUN npm ci --production

FROM base AS build

WORKDIR /app
# Copy amplication/git-pull-request-service and the its dependent packages
COPY packages/amplication-git-pull-request-service packages/amplication-git-pull-request-service
COPY packages/amplication-git-service packages/amplication-git-service
COPY packages/amplication-kafka packages/amplication-kafka
COPY packages/amplication-nest-logger-module packages/amplication-nest-logger-module

# Installs all copied package node_modules ; Preparation for build
RUN npm run bootstrap -- --scope @amplication/git-pull-request-service --include-dependencies

# Build all distributions needed for amplicaiton/server
RUN npm run build -- --scope @amplication/git-pull-request-service --include-dependencies

# Removes packages/*/node_modules
# https://github.com/lerna/lerna/issues/2196#issuecomment-994882795
RUN npm run clean -- --yes
# Rebuild production node_modules
RUN npm run bootstrap -- -- --production --scope @amplication/git-pull-request-service --include-dependencies

FROM base as service
WORKDIR /app/packages/git-pull-request-service
# Copy all distributions and node_modules for amplication/server and its dependencies
COPY --from=build /app/packages/amplication-git-pull-request-service/package.json /app/packages/git-pull-request-service/package.json
COPY --from=build /app/packages/amplication-git-pull-request-service/node_modules /app/packages/git-pull-request-service/node_modules
COPY --from=build /app/packages/amplication-git-pull-request-service/dist /app/packages/git-pull-request-service/dist

COPY --from=build /app/packages/amplication-git-service/package.json /app/packages/amplication-git-service/package.json
COPY --from=build /app/packages/amplication-git-service/node_modules /app/packages/amplication-git-service/node_modules
COPY --from=build /app/packages/amplication-git-service/dist /app/packages/amplication-git-service/dist

COPY --from=build /app/packages/amplication-nest-logger-module/package.json /app/packages/amplication-nest-logger-module/package.json
COPY --from=build /app/packages/amplication-nest-logger-module/node_modules /app/packages/amplication-nest-logger-module/node_modules
COPY --from=build /app/packages/amplication-nest-logger-module/dist /app/packages/amplication-nest-logger-module/dist

COPY --from=build /app/packages/amplication-kafka/package.json /app/packages/amplication-kafka/package.json
COPY --from=build /app/packages/amplication-kafka/node_modules /app/packages/amplication-kafka/node_modules
COPY --from=build /app/packages/amplication-kafka/lib /app/packages/amplication-kafka/lib

CMD ["node", "dist/main"]