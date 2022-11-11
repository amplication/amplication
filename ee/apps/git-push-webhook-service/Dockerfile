FROM node:16.16-alpine AS base

WORKDIR /app

COPY ./dist/ee/apps/git-push-webhook-service/package.json .

RUN npm i --omit=dev

COPY ./dist/ee/apps/git-push-webhook-service .

# This is required to include the Prisma client in the image
COPY ./libs/prisma-db ./libs/prisma-db
COPY ./node_modules/@amplication/prisma-clients/prisma-db ./node_modules/@amplication/prisma-clients/prisma-db

ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT ["node", "./main.js"]