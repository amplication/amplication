# Use node 14.15.1 as the base image
FROM node@sha256:89acb508f15b80b63bbb1f287feebe955c94b6ebb85c89e4167e35258af596f0 AS node
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

FROM package-sources AS build
ARG NPM_LOG_LEVEL=silent

ENV OPENCOLLECTIVE_HIDE=1

RUN npm run bootstrap -- --loglevel=${NPM_LOG_LEVEL} --scope @amplication/server --scope @amplication/client --include-dependencies

COPY packages packages

RUN npm run prisma:generate
RUN npm run build -- --scope @amplication/server --scope @amplication/client --include-dependencies
RUN npm run clean -- --yes

FROM package-sources

ENV OPENCOLLECTIVE_HIDE=1

EXPOSE 3000

RUN npm ci --production --silent
RUN npm run bootstrap -- -- --production --loglevel=silent --scope @amplication/server --scope @amplication/client --include-dependencies

COPY --from=build /app/packages /app/packages
RUN npm run prisma:generate

# Copy entrypoint script
COPY docker-entrypoint.sh /entrypoint.sh
# Give entrypoint script access permission
RUN chmod 755 /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]

CMD [ "node", "packages/amplication-server/dist/src/main"]