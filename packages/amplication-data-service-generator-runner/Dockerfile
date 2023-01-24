FROM node:18.13.0-slim AS base

ARG user=data-service-generator-runner
ARG uid=1001
ARG gid=$uid

RUN apk add g++ make python3

WORKDIR /workspace/packages/${user}

COPY ./dist/packages/amplication-${user} .
RUN npm install --omit-dev

RUN groupadd --gid ${gid} ${user}
RUN useradd --uid ${uid} --gid ${gid} -m ${user}
RUN chown -R ${uid}:${gid} /workspace/packages/${user}

USER ${user}