FROM node:18.13.0-slim AS production

ARG component=server
ARG user=${component}
ARG uid=1001
ARG gid=$uid

# Required to run Prisma on ARM64 machine:
# https://github.com/prisma/prisma/issues/861#issuecomment-881992292
RUN apt-get update && apt-get install -y openssl

WORKDIR /workspace/packages/${user}

COPY ./dist/packages/amplication-${component}/package*.json .
RUN npm install --omit-dev

COPY ./dist/packages/amplication-${component} .

RUN groupadd --gid ${gid} ${user}
RUN useradd --uid ${uid} --gid ${gid} -m ${user}
RUN chown -R ${uid}:${gid} /workspace/packages/

USER ${user}

ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT ["node", "./main.js"]
