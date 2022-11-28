FROM node:16.16-alpine AS base

WORKDIR /app

COPY ./dist/ee/packages/amplication-git-push-webhook-service/package.json .

RUN npm i --omit=dev

COPY ./dist/ee/packages/amplication-git-push-webhook-service .

# This is required to include the Prisma client in the image
COPY ./packages/amplication-prisma-db ./packages/amplication-prisma-db
COPY ./node_modules/@amplication/prisma-clients/amplication-prisma-db ./node_modules/@amplication/prisma-clients/amplication-prisma-db

ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT ["node", "./main.js"]