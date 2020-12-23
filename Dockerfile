# node:12
FROM node@sha256:d0738468dfc7cedb7d260369e0546fd7ee8731cfd67136f6023d070ad9679090 AS node

FROM node as base
RUN npm i -g npm@7.3.0

FROM base as package-sources
RUN mkdir /app
COPY lerna.json /app/
COPY package*.json /app/
COPY packages packages
RUN cp --parents packages/*/package*.json /app/
WORKDIR /app
RUN npm ci --silent --production

FROM package-sources AS build

ENV OPENCOLLECTIVE_HIDE=1

RUN npm run bootstrap -- --loglevel=silent --scope @amplication/server --scope @amplication/client --include-dependencies

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