FROM node:18.12.1-alpine AS base

WORKDIR /app

RUN apk update \
    && apk add --no-cache git \
    && rm /var/cache/apk/*

COPY ./dist/ee/packages/git-sync-manager/package.json .

RUN npm i --omit=dev

COPY ./dist/ee/packages/git-sync-manager .

ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT ["node", "./main.js"]