# node:12
FROM node@sha256:d0738468dfc7cedb7d260369e0546fd7ee8731cfd67136f6023d070ad9679090 AS node

FROM node as package-sources

COPY lerna.json package-sources/
COPY package*.json package-sources/
COPY packages packages
RUN cp --parents packages/*/package*.json package-sources

FROM node AS build

COPY --from=package-sources package-sources /app
WORKDIR /app

RUN npm ci --silent
RUN npm run bootstrap -- --loglevel=silent

COPY codegen.yml codegen.yml
COPY packages packages

RUN npm run prisma:generate
RUN npm run build -- --scope amplication-server --scope amplication-client --include-dependencies

RUN npm run clean -- --yes

FROM node

EXPOSE 3000

COPY --from=package-sources package-sources /app
WORKDIR /app

RUN npm ci --production --silent
RUN npm run bootstrap -- -- --production --loglevel=silent

COPY --from=build /app/packages /app/packages
RUN npm run prisma:generate

# Copy entrypoint script
COPY docker-entrypoint.sh /entrypoint.sh
# Give entrypoint script access permission
RUN chmod 755 /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]

CMD [ "node", "packages/amplication-server/dist/src/main"]