ARG GIT_REF_NAME
ARG GIT_SHA

FROM node:18.13.0-slim AS production

ARG GIT_REF_NAME
ARG GIT_SHA

ENV GIT_REF_NAME=${GIT_REF_NAME}
ENV GIT_SHA=${GIT_SHA}

RUN echo "GIT_REF_NAME: ${GIT_REF_NAME}, GIT_SHA: ${GIT_SHA}"

ARG component=server
ARG user=${component}
ARG uid=1001
ARG gid=$uid

# Required to run Prisma on ARM64 machine:
# https://github.com/prisma/prisma/issues/861#issuecomment-881992292
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        openssl=1.1.1n-0+deb11u4 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace/packages/${user}

COPY ./dist/packages/amplication-${component}/package*.json .

RUN npm install --omit-dev

COPY ./dist/packages/amplication-${component} .

RUN groupadd --gid ${gid} ${user} \
    && useradd --uid ${uid} --gid ${gid} -m ${user} \
    && chown -R ${uid}:${gid} /workspace/packages/

USER ${user}

ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT [ "node", "./main.js" ]
