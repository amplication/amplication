ARG GIT_REF_NAME
ARG GIT_SHA

FROM node:19.1-alpine AS base
ARG GIT_REF_NAME
ARG GIT_SHA

RUN apk add g++ make python3

WORKDIR /workspace/packages/data-service-generator
COPY ./dist/packages/data-service-generator .
RUN npm i --omit-dev

# Copy unpublished logging library
COPY ./dist/libs/util/logging node_modules/@amplication/util/logging

ENV GIT_REF_NAME=${GIT_REF_NAME}
ENV GIT_SHA=${GIT_SHA}

RUN echo "GIT_REF_NAME: ${GIT_REF_NAME}, GIT_SHA: ${GIT_SHA}"