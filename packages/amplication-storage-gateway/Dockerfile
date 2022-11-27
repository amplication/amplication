FROM node:19.1-alpine AS base

WORKDIR /app

COPY ./dist/packages/amplication-storage-gateway/package.json .

RUN npm i --omit=dev

COPY ./dist/packages/amplication-storage-gateway .

ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT ["node", "./main.js"]