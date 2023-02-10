ARG GIT_REF_NAME
ARG GIT_SHA

FROM node:18.13.0-slim AS production

ARG GIT_REF_NAME
ARG GIT_SHA

ENV GIT_REF_NAME=${GIT_REF_NAME}
ENV GIT_SHA=${GIT_SHA}

RUN echo "GIT_REF_NAME: ${GIT_REF_NAME}, GIT_SHA: ${GIT_SHA}"

ARG component=build-manager
ARG user=${component}
ARG uid=1001
ARG gid=$uid

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

ENTRYPOINT ["node", "./main.js"]