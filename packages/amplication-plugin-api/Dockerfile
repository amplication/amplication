FROM node:18.12.1-slim AS base

ARG user=amplication-plugin-api
ARG group=nodejs
ARG uid=1001
ARG gid=1001

WORKDIR /workspace/packages/${user}

COPY ./dist/packages/${user}/package.json .
RUN npm install --omit-dev

COPY ./dist/packages/${user} .

RUN groupadd -g ${gid} ${group}
RUN useradd -u ${uid} -g ${group} -s /bin/sh -m ${user}
RUN chown -R ${uid}:${group}  /workspace/packages/${user}

USER ${uid}:${gid}

ENV PORT=3005
EXPOSE $PORT

CMD ["node", "./main.js"]
