FROM node:18.12.1-alpine AS base

WORKDIR /app

COPY ./dist/ee/packages/amplication-git-push-webhook-service/package.json .

RUN npm i --omit=dev

COPY ./dist/ee/packages/amplication-git-push-webhook-service .

# This is required to include the Prisma client in the image
COPY ./packages/amplication-prisma-db ./packages/amplication-prisma-db

ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT ["node", "./main.js"]