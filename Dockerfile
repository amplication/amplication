FROM node:14.18.1-alpine3.12 AS node
FROM node


FROM node as base
RUN npm i -g npm@7.3.0

FROM base as package-sources
ARG NPM_LOG_LEVEL=silent
RUN mkdir /app
COPY lerna.json /app/
COPY package*.json /app/
COPY packages packages
RUN cp --parents packages/*/package*.json /app/
WORKDIR /app
RUN npm ci --loglevel=${NPM_LOG_LEVEL} --production

# build the packages folders to production for moving them to the stage
FROM package-sources AS build
ARG NPM_LOG_LEVEL=silent

ENV OPENCOLLECTIVE_HIDE=1

RUN npm run bootstrap -- --scope @amplication/server --scope @amplication/client --include-dependencies -- --loglevel=${NPM_LOG_LEVEL}

COPY packages packages

# RUN npm run prisma:generate
# RUN npm run build -- --scope @amplication/server --scope @amplication/client --include-dependencies
# RUN npm run clean -- --yes

# starting of the stage phase
FROM package-sources

ENV OPENCOLLECTIVE_HIDE=1

EXPOSE 3000
RUN npm ci --production --silent

# WORKDIR /app/packages/amplication-server
# RUN npm install --production
# WORKDIR /app/packages/amplication-client
# RUN npm install --production
# WORKDIR /app/packages/amplication-data-service-generator
# RUN npm install --production
# WORKDIR /app/packages/amplication-data-service-cli
# RUN npm install --production
# WORKDIR /app/packages/amplication-scheduler
# RUN npm install --production
# WORKDIR /app/packages/amplication-deployer
# RUN npm install --production


# WORKDIR /app/packages/amplication-container-builder
# RUN npm install --production
# WORKDIR /app/packages/amplication-container-data
# RUN npm install --production


WORKDIR /app
RUN npm run bootstrap -- --scope @amplication/server --scope @amplication/client --include-dependencies -- --loglevel=silent

COPY --from=build /app/packages /app/packages
RUN npm run prisma:generate

# Copy entrypoint script
COPY docker-entrypoint.sh /entrypoint.sh
# Give entrypoint script access permission
RUN chmod 755 /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]

CMD [ "node", "packages/amplication-server/dist/src/main"]