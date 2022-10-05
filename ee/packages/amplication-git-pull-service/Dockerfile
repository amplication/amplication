FROM node:16.16-alpine AS base

WORKDIR /app

COPY ./dist/ee/packages/amplication-git-pull-service .

ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT ["node", "./main.js"]