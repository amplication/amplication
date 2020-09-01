# node:12
FROM node@sha256:d0738468dfc7cedb7d260369e0546fd7ee8731cfd67136f6023d070ad9679090 AS build

ARG REACT_APP_GITHUB_CLIENT_ID
ARG REACT_APP_GITHUB_SCOPE
ARG REACT_APP_GITHUB_REDIRECT_URI

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY lerna.json lerna.json

COPY packages/amplication-server/package.json packages/amplication-server/package.json
COPY packages/amplication-server/package-lock.json packages/amplication-server/package-lock.json
COPY packages/amplication-server/prisma/schema.prisma packages/amplication-server/prisma/schema.prisma

COPY packages/amplication-client/package.json packages/amplication-client/package.json
COPY packages/amplication-client/package-lock.json packages/amplication-client/package-lock.json

COPY packages/amplication-data-service-generator/package.json packages/amplication-data-service-generator/package.json
COPY packages/amplication-data-service-generator/package-lock.json packages/amplication-data-service-generator/package-lock.json

RUN npm run bootstrap

ADD codegen.yml codegen.yml
ADD packages packages

RUN npm run build

# node:12
FROM node@sha256:d0738468dfc7cedb7d260369e0546fd7ee8731cfd67136f6023d070ad9679090

EXPOSE 3000

COPY --from=build package.json .
COPY --from=build package-lock.json .

RUN npm ci --production

COPY --from=build lerna.json lerna.json
COPY --from=build packages packages

RUN npm run bootstrap -- -- --production
RUN npm run prisma:generate

CMD [ "node", "packages/amplication-server/dist/src/main"]