ARG NODE_VERSION=16.16-alpine

FROM node:$NODE_VERSION AS base
ENV OPENCOLLECTIVE_HIDE=1

RUN npm config set fund false

WORKDIR /app
COPY lerna.json /app
COPY package*.json /app/
RUN npm ci --production

FROM base AS build
WORKDIR /app
# Copy amplication/server and the its dependent packages
COPY packages/amplication-server packages/amplication-server
COPY packages/amplication-code-gen-types packages/amplication-code-gen-types
COPY packages/amplication-data-service-generator packages/amplication-data-service-generator
COPY packages/amplication-git-service packages/amplication-git-service
COPY packages/amplication-prisma-db packages/amplication-prisma-db
COPY packages/amplication-kafka packages/amplication-kafka

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


COPY --from=build /app/packages/amplication-code-gen-types/package.json /app/packages/amplication-code-gen-types/package.json
COPY --from=build /app/packages/amplication-code-gen-types/node_modules /app/packages/amplication-code-gen-types/node_modules
COPY --from=build /app/packages/amplication-code-gen-types/dist /app/packages/amplication-code-gen-types/dist

COPY --from=build /app/packages/amplication-data-service-generator/package.json /app/packages/amplication-data-service-generator/package.json
COPY --from=build /app/packages/amplication-data-service-generator/node_modules /app/packages/amplication-data-service-generator/node_modules
COPY --from=build /app/packages/amplication-data-service-generator/dist /app/packages/amplication-data-service-generator/dist

COPY --from=build /app/packages/amplication-git-service/package.json /app/packages/amplication-git-service/package.json
COPY --from=build /app/packages/amplication-git-service/node_modules /app/packages/amplication-git-service/node_modules
COPY --from=build /app/packages/amplication-git-service/dist /app/packages/amplication-git-service/dist


COPY --from=build /app/packages/amplication-prisma-db/package.json /app/packages/amplication-prisma-db/package.json
COPY --from=build /app/packages/amplication-prisma-db/node_modules /app/packages/amplication-prisma-db/node_modules
COPY --from=build /app/packages/amplication-prisma-db/lib /app/packages/amplication-prisma-db/lib
COPY --from=build /app/packages/amplication-prisma-db/prisma /app/packages/amplication-prisma-db/prisma   

COPY --from=build /app/packages/amplication-kafka/package.json /app/packages/amplication-kafka/package.json
COPY --from=build /app/packages/amplication-kafka/node_modules /app/packages/amplication-kafka/node_modules
COPY --from=build /app/packages/amplication-kafka/lib /app/packages/amplication-kafka/lib

EXPOSE 3000
CMD [ "node", "dist/src/main"]