FROM node:16.16-alpine AS base

WORKDIR /app

COPY ./dist/apps/build-manager/package.json .

RUN npm i --omit=dev

COPY ./dist/apps/build-manager .

ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT ["node", "./main.js"]