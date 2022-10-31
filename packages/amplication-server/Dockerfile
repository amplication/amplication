FROM node:16.16-alpine AS base

WORKDIR /app

COPY ./dist/packages/amplication-server/package.json .
COPY ./packages/amplication-server/.env* .
COPY ./packages/amplication-prisma-db/prisma/schema.prisma .

RUN npm i --omit=dev

COPY ./dist/packages/amplication-server .

ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT ["node", "./main.js"]