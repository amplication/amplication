ARG GIT_REF_NAME
ARG GIT_SHA

FROM node:19.1-alpine AS base
ARG GIT_REF_NAME
ARG GIT_SHA

RUN apk add g++ make python3

WORKDIR /workspace/packages/data-service-generator
COPY ./dist/packages/data-service-generator .
RUN npm i --omit-dev

ENV DSG_VERSION="${GIT_REF_NAME}, ${GIT_SHA}"
RUN echo "branch: ${GIT_REF_NAME}, sha: ${GIT_SHA}"