ARG NODE_VERSION=16.16

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
# Copy amplication-git-push-webhook-service  and the its dependent packages
COPY ee/packages/amplication-git-push-webhook-service ee/packages/amplication-git-push-webhook-service
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

FROM node:$NODE_VERSION-alpine as server
WORKDIR /app/ee/packages/amplication-git-push-webhook-service
# Copy all distributions and node_modules for amplication-git-push-webhook-service  and its dependencies
COPY --from=build /app/ee/packages/amplication-git-push-webhook-service/package.json /app/ee/packages/amplication-git-push-webhook-service/package.json
COPY --from=build /app/ee/packages/amplication-git-push-webhook-service/node_modules /app/ee/packages/amplication-git-push-webhook-service/node_modules
COPY --from=build /app/ee/packages/amplication-git-push-webhook-service/dist /app/ee/packages/amplication-git-push-webhook-service/dist


COPY --from=build /app/packages/amplication-prisma-db/package.json /app/packages/amplication-prisma-db/package.json
COPY --from=build /app/packages/amplication-prisma-db/node_modules /app/packages/amplication-prisma-db/node_modules
COPY --from=build /app/packages/amplication-prisma-db/lib /app/packages/amplication-prisma-db/lib
COPY --from=build /app/packages/amplication-prisma-db/prisma /app/packages/amplication-prisma-db/prisma

COPY --from=build /app/packages/amplication-kafka/package.json /app/packages/amplication-kafka/package.json
COPY --from=build /app/packages/amplication-kafka/node_modules /app/packages/amplication-kafka/node_modules
COPY --from=build /app/packages/amplication-kafka/lib /app/packages/amplication-kafka/lib

EXPOSE 4567
CMD [ "node", "dist/main"]