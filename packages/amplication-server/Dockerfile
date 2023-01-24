FROM node:18.13.0-slim AS base

ARG user=server
ARG uid=1001
ARG gid=$uid

# Required to run Prisma on ARM64 machine: https://github.com/prisma/prisma/issues/861#issuecomment-881992292
RUN apt-get update && apt-get install -y openssl

WORKDIR /workspace/packages/${user}

COPY ./dist/packages/amplication-${user}/package*.json .
RUN npm install --omit-dev

COPY ./dist/packages/amplication-${user} .

RUN groupadd --gid ${gid} ${user}
RUN useradd --uid ${uid} --gid ${gid} -m ${user}
RUN chown -R ${uid}:${gid} /workspace/packages/${user}

USER ${user}

ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT ["node", "./main.js"]
