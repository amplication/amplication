FROM node:16.16 AS base

WORKDIR /app

COPY ./dist/ee/packages/amplication-git-pull-service/package.json .

RUN npm i --omit=dev

COPY ./dist/ee/packages/amplication-git-pull-service .

# This is required to include the Prisma client in the image
COPY ./node_modules/@amplication/prisma-clients/amplication-git-pull-service ./node_modules/@amplication/prisma-clients/amplication-git-pull-service

ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT ["node", "./main.js"]