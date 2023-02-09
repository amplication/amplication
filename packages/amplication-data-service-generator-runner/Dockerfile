ARG GIT_REF

FROM node:19.1-alpine AS base
ARG GIT_REF

RUN apk add g++ make python3

WORKDIR /workspace/packages/amplication-data-service-generator-runner
COPY ./dist/packages/amplication-data-service-generator-runner .
RUN npm i --omit-dev

ENV DSG_VERSION=${GIT_REF}
RUN echo ${GIT_REF}