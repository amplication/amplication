FROM node:18.13.0-slim AS production

ARG component=data-service-generator-runner
ARG user=${component}
ARG uid=1001
ARG gid=$uid

RUN apt-get update && apt-get install -y g++ make python3

WORKDIR /workspace/packages/${user}

COPY ./dist/packages/amplication-${component} .
RUN npm install --omit-dev

RUN groupadd --gid ${gid} ${user}
RUN useradd --uid ${uid} --gid ${gid} -m ${user}
RUN chown -R ${uid}:${gid} /workspace/packages/

USER ${user}