ARG ALPINE_VERSION=alpine3.14
ARG NODE_VERSION=16.13.1

FROM node:$NODE_VERSION AS base
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
# Copy amplication/notifications-service and the its dependent packages
COPY packages/amplication-notifications-service packages/amplication-notifications-service
COPY packages/amplication-kafka packages/amplication-kafka

# Installs all copied package node_modules ; Preparation for build
RUN npm run bootstrap -- --scope=@amplication/notifications-service --include-dependencies
# Build all distributions needed for amplicaiton/notifications-service
RUN npm run build -- --scope @amplication/notifications-service --include-dependencies

# Removes packages/*/node_modules
# https://github.com/lerna/lerna/issues/2196#issuecomment-994882795
RUN npm run clean -- --yes
# Rebuild production node_modules
RUN npm run bootstrap -- -- --production --scope @amplication/notifications-service --include-dependencies

FROM base as notifications-service
WORKDIR /app/packages/amplication-notifications-service
COPY --from=build /app/packages/amplication-notifications-service/package.json /app/packages/amplication-notifications-service/package.json
COPY --from=build /app/packages/amplication-notifications-service/node_modules /app/packages/amplication-notifications-service/node_modules
COPY --from=build /app/packages/amplication-notifications-service/dist /app/packages/amplication-notifications-service/dist

COPY --from=build /app/packages/amplication-kafka/package.json /app/packages/amplication-kafka/package.json
COPY --from=build /app/packages/amplication-kafka/node_modules /app/packages/amplication-kafka/node_modules
COPY --from=build /app/packages/amplication-kafka/lib /app/packages/amplication-kafka/lib

EXPOSE 3000
CMD [ "node", "dist/src/main"]
