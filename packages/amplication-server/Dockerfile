FROM node:16.16 AS base

WORKDIR /app

COPY ./dist/packages/amplication-server/package.json .
COPY ./packages/amplication-server/.env* .
COPY ./packages/amplication-prisma-db/prisma/schema.prisma .
COPY ./packages/amplication-prisma-db/prisma/generated/prisma-client/libquery_engine-darwin-arm64.dylib.node .

RUN npm i --omit=dev

COPY ./dist/packages/amplication-server .

ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT ["node", "./main.js"]