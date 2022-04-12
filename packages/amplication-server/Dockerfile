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
# Copy amplication/server and the its dependent packages
COPY packages/amplication-server packages/amplication-server
COPY packages/amplication-container-builder packages/amplication-container-builder
COPY packages/amplication-data packages/amplication-data
COPY packages/amplication-data-service-generator packages/amplication-data-service-generator
COPY packages/amplication-deployer packages/amplication-deployer

# Installs all copied package node_modules ; Preparation for build
RUN npm run bootstrap -- --scope @amplication/server --include-dependencies
RUN npm run prisma:generate -- --scope @amplication/server --include-dependencies

# Build all distributions needed for amplicaiton/server
RUN npm run build -- --scope @amplication/server --include-dependencies

# Removes packages/*/node_modules
# https://github.com/lerna/lerna/issues/2196#issuecomment-994882795
RUN npm run clean -- --yes
# Rebuild production node_modules
RUN npm run bootstrap -- -- --production --scope @amplication/server --include-dependencies

FROM base as server
WORKDIR /app/packages/amplication-server
# Copy all distributions and node_modules for amplication/server and its dependencies
COPY --from=build /app/packages/amplication-server/package.json /app/packages/amplication-server/package.json
COPY --from=build /app/packages/amplication-server/node_modules /app/packages/amplication-server/node_modules
COPY --from=build /app/packages/amplication-server/dist /app/packages/amplication-server/dist

COPY --from=build /app/packages/amplication-server/index.html /app/packages/amplication-client/build/index.html


COPY --from=build /app/packages/amplication-container-builder/package.json /app/packages/amplication-container-builder/package.json
COPY --from=build /app/packages/amplication-container-builder/node_modules /app/packages/amplication-container-builder/node_modules
COPY --from=build /app/packages/amplication-container-builder/dist /app/packages/amplication-container-builder/dist

COPY --from=build /app/packages/amplication-data/package.json /app/packages/amplication-data/package.json
COPY --from=build /app/packages/amplication-data/node_modules /app/packages/amplication-data/node_modules
COPY --from=build /app/packages/amplication-data/dist /app/packages/amplication-data/dist

COPY --from=build /app/packages/amplication-data-service-generator/package.json /app/packages/amplication-data-service-generator/package.json
COPY --from=build /app/packages/amplication-data-service-generator/node_modules /app/packages/amplication-data-service-generator/node_modules
COPY --from=build /app/packages/amplication-data-service-generator/dist /app/packages/amplication-data-service-generator/dist

COPY --from=build /app/packages/amplication-deployer/package.json /app/packages/amplication-deployer/package.json
COPY --from=build /app/packages/amplication-deployer/node_modules /app/packages/amplication-deployer/node_modules
COPY --from=build /app/packages/amplication-deployer/dist /app/packages/amplication-deployer/dist

EXPOSE 3000
CMD [ "node", "dist/src/main"]