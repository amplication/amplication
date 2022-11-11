FROM node:16.16-alpine AS base

WORKDIR /app

COPY ./dist/apps/storage-gateway/package.json .

RUN npm i --omit=dev

COPY ./dist/apps/storage-gateway .

ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT ["node", "./main.js"]