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
# Copy amplication/storage-gateway and the its dependent packages
COPY packages/amplication-storage-gateway packages/amplication-storage-gateway
COPY packages/amplication-kafka packages/amplication-kafka

# Installs all copied package node_modules ; Preparation for build
RUN npm run bootstrap -- --scope @amplication/storage-gateway --include-dependencies

# Build all distributions needed for amplication/storage-gateway
RUN npm run build -- --scope @amplication/storage-gateway --include-dependencies

# Removes packages/*/node_modules
# https://github.com/lerna/lerna/issues/2196#issuecomment-994882795
RUN npm run clean -- --yes
# Rebuild production node_modules
RUN npm run bootstrap -- -- --production --scope @amplication/storage-gateway --include-dependencies

FROM base as service
WORKDIR /app/packages/amplication-storage-gateway
# Copy all distributions and node_modules for amplication/server and its dependencies
COPY --from=build /app/packages/amplication-storage-gateway/package.json /app/packages/amplication-storage-gateway/package.json
COPY --from=build /app/packages/amplication-storage-gateway/node_modules /app/packages/amplication-storage-gateway/node_modules
COPY --from=build /app/packages/amplication-storage-gateway/dist /app/packages/amplication-storage-gateway/dist

COPY --from=build /app/packages/amplication-kafka/package.json /app/packages/amplication-kafka/package.json
COPY --from=build /app/packages/amplication-kafka/node_modules /app/packages/amplication-kafka/node_modules
COPY --from=build /app/packages/amplication-kafka/lib /app/packages/amplication-kafka/lib

CMD ["node", "dist/main"]