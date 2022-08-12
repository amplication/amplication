ARG NODE_VERSION=16.16-alpine

FROM node:$NODE_VERSION AS base
RUN apk --no-cache add git
RUN git config --global --add safe.directory '*'

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
# Copy amplication/git-pull-service and the its dependent packages
COPY ee/packages/amplication-git-pull-service ee/packages/amplication-git-pull-service
COPY packages/amplication-kafka packages/amplication-kafka

# Installs all copied package node_modules ; Preparation for build
RUN npm run bootstrap -- --scope=@amplication/git-pull-service --include-dependencies
RUN npm run prisma:generate -- --scope=@amplication/git-pull-service
# Build all distributions needed for amplicaiton/git-pull-service
RUN npm run build -- --scope @amplication/git-pull-service --include-dependencies

# Removes packages/*/node_modules
# https://github.com/lerna/lerna/issues/2196#issuecomment-994882795
RUN npm run clean -- --yes
# Rebuild production node_modules
RUN npm run bootstrap -- -- --production --scope @amplication/git-pull-service --include-dependencies

FROM base as git-pull-service
WORKDIR /app/ee/packages/amplication-git-pull-service
COPY --from=build /app/ee/packages/amplication-git-pull-service/package.json /app/ee/packages/amplication-git-pull-service/package.json
COPY --from=build /app/ee/packages/amplication-git-pull-service/node_modules /app/ee/packages/amplication-git-pull-service/node_modules
COPY --from=build /app/ee/packages/amplication-git-pull-service/dist /app/ee/packages/amplication-git-pull-service/dist
COPY --from=build /app/ee/packages/amplication-git-pull-service/prisma /app/ee/packages/amplication-git-pull-service/prisma

COPY --from=build /app/packages/amplication-kafka/package.json /app/packages/amplication-kafka/package.json
COPY --from=build /app/packages/amplication-kafka/node_modules /app/packages/amplication-kafka/node_modules
COPY --from=build /app/packages/amplication-kafka/lib /app/packages/amplication-kafka/lib

EXPOSE 3000
CMD [ "node", "dist/main"]