FROM node:16.16-alpine AS base

WORKDIR /app

COPY ./dist/ee/packages/amplication-git-push-webhook-service/package.json .

RUN npm i --omit=dev

COPY ./dist/ee/packages/amplication-git-push-webhook-service .

ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT ["node", "./main.js"]