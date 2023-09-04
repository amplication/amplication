FROM node:18.12.1-slim AS base

# Required to run Prisma on ARM64 machines
# https://github.com/prisma/prisma/issues/861#issuecomment-881992292
RUN apt-get update
RUN apt-get install -y openssl

WORKDIR /app

COPY ./dist/packages/amplication-server/package*.json ./

RUN npm i --omit=dev

COPY ./dist/packages/amplication-server .


ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT ["node", "./main.js"]
