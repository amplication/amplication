# node:12
FROM node@sha256:d0738468dfc7cedb7d260369e0546fd7ee8731cfd67136f6023d070ad9679090 AS node

FROM node AS build

COPY package.json .
COPY package-lock.json .

RUN npm ci --silent

COPY lerna.json lerna.json

COPY packages/amplication-server/package.json packages/amplication-server/package.json
COPY packages/amplication-server/package-lock.json packages/amplication-server/package-lock.json
COPY packages/amplication-server/prisma/schema.prisma packages/amplication-server/prisma/schema.prisma

COPY packages/amplication-client/package.json packages/amplication-client/package.json
COPY packages/amplication-client/package-lock.json packages/amplication-client/package-lock.json

COPY packages/amplication-data-service-generator/package.json packages/amplication-data-service-generator/package.json
COPY packages/amplication-data-service-generator/package-lock.json packages/amplication-data-service-generator/package-lock.json

COPY packages/amplication-data/package.json packages/amplication-data/package.json
COPY packages/amplication-data/package-lock.json packages/amplication-data/package-lock.json

COPY packages/amplication-container-builder/package.json packages/amplication-container-builder/package.json
COPY packages/amplication-container-builder/package-lock.json packages/amplication-container-builder/package-lock.json

COPY packages/amplication-deployer/package.json packages/amplication-deployer/package.json
COPY packages/amplication-deployer/package-lock.json packages/amplication-deployer/package-lock.json

RUN npm run bootstrap -- --loglevel=silent

COPY codegen.yml codegen.yml
COPY packages packages

RUN npm run build -- --scope amplication-server --scope amplication-client --include-dependencies

RUN npm run clean -- --yes

FROM node

EXPOSE 3000

COPY --from=build package.json .
COPY --from=build package-lock.json .

RUN npm ci --production --silent

COPY --from=build lerna.json lerna.json
COPY --from=build packages packages

RUN npm run bootstrap -- -- --production --loglevel=silent
RUN npm run prisma:generate

# Copy entrypoint script
COPY docker-entrypoint.sh /entrypoint.sh
# Give entrypoint script access permission
RUN chmod 755 /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]

CMD [ "node", "packages/amplication-server/dist/src/main"]