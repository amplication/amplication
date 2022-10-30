FROM node:16.16-alpine AS base

WORKDIR /app

COPY ./dist/ee/packages/amplication-git-pull-service/package-lock.json .
COPY ./dist/ee/packages/amplication-git-pull-service/package.json .

RUN npm ci --omit=dev

COPY ./dist/ee/packages/amplication-git-pull-service .

ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT ["node", "./main.js"]