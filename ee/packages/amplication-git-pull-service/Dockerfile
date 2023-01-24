FROM node:18.13.0-slim AS base

ARG user=git-pull-service
ARG uid=1001
ARG gid=$uid

WORKDIR /workspace/packages/${user}

COPY ./dist/ee/packages/amplication-${user}/package*.json .
RUN npm install --omit-dev

COPY ./dist/ee/packages/amplication-${user} .

RUN groupadd --gid ${gid} ${user}
RUN useradd --uid ${uid} --gid ${gid} -m ${user}
RUN chown -R ${uid}:${gid} /workspace/packages/${user}

USER ${user}

ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT ["node", "./main.js"]