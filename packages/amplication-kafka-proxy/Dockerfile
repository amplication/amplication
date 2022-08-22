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
# Copy amplication/kafka-proxy and the its dependent packages
COPY packages/amplication-kafka-proxy packages/amplication-kafka-proxy
COPY packages/amplication-nest-logger-module packages/amplication-nest-logger-module

# Installs all copied package node_modules ; Preparation for build
RUN npm run bootstrap -- --scope @amplication/kafka-proxy --include-dependencies

# Build all distributions needed for amplicaiton/server
RUN npm run build -- --scope @amplication/kafka-proxy --include-dependencies

# Removes packages/*/node_modules
# https://github.com/lerna/lerna/issues/2196#issuecomment-994882795
RUN npm run clean -- --yes
# Rebuild production node_modules
RUN npm run bootstrap -- -- --production --scope @amplication/kafka-proxy --include-dependencies

FROM base as service
WORKDIR /app/packages/kafka-proxy
# Copy all distributions and node_modules for amplication/server and its dependencies
COPY --from=build /app/packages/amplication-kafka-proxy/package.json /app/packages/kafka-proxy/package.json
COPY --from=build /app/packages/amplication-kafka-proxy/node_modules /app/packages/kafka-proxy/node_modules
COPY --from=build /app/packages/amplication-kafka-proxy/dist /app/packages/kafka-proxy/dist

COPY --from=build /app/packages/amplication-nest-logger-module/package.json /app/packages/amplication-nest-logger-module/package.json
COPY --from=build /app/packages/amplication-nest-logger-module/node_modules /app/packages/amplication-nest-logger-module/node_modules
COPY --from=build /app/packages/amplication-nest-logger-module/dist /app/packages/amplication-nest-logger-module/dist

CMD ["node", "dist/main"]