FROM node:18.12.1-slim AS base

ARG user=amplication-plugin-api
ARG uid=1001
ARG gid=$uid

WORKDIR /workspace/packages/${user}

COPY ./dist/packages/${user}/package.json .
RUN npm install --omit-dev

COPY ./dist/packages/${user} .

RUN groupadd --gid ${gid} ${user}
RUN useradd --uid ${uid} --gid ${gid} -m ${user}
RUN chown -R ${uid}:${gid} /workspace/packages/${user}

USER ${user}

ENV PORT=3005
EXPOSE $PORT

CMD ["node", "./main.js"]
