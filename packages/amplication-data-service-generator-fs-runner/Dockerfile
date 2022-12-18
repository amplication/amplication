FROM node:19.1-alpine AS base
RUN apk add g++ make python3

WORKDIR /workspace/packages/amplication-code-gen-types
COPY ./dist/packages/amplication-code-gen-types/package.json .
RUN npm i --omit-dev
COPY ./dist/packages/amplication-code-gen-types .

WORKDIR /workspace/libs/data-service-generator
COPY ./dist/libs/data-service-generator/package.json .
RUN npm i --omit-dev
COPY ./dist/libs/data-service-generator .

WORKDIR /workspace/packages/amplication-data-service-generator-fs-runner
COPY ./dist/packages/amplication-data-service-generator-fs-runner .