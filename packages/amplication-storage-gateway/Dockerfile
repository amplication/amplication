FROM node:18.13.0-slim AS base

ARG component=storage-gateway
ARG user=${component}}
ARG uid=1001
ARG gid=$uid

WORKDIR /workspace/packages/${user}

COPY ./dist/packages/amplication-${component}/package*.json .
RUN npm install --omit-dev

COPY ./dist/packages/amplication-${component} .

RUN groupadd --gid ${gid} ${user}
RUN useradd --uid ${uid} --gid ${gid} -m ${user}
RUN chown -R ${uid}:${gid} /workspace/packages/${user}

USER ${user}

ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT ["node", "./main.js"]