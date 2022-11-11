FROM node:16.16-slim AS base

# Required to run Prisma on ARM64 machines
# https://github.com/prisma/prisma/issues/861#issuecomment-881992292
RUN apt-get update
RUN apt-get install -y openssl

WORKDIR /app

COPY ./dist/apps/server/package.json .

RUN npm i --omit=dev

COPY ./dist/apps/server .

# This is required to include the Prisma client in the image
COPY ./node_modules/@amplication/prisma-clients/prisma-db ./node_modules/@amplication/prisma-clients/prisma-db


ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT ["node", "./main.js"]