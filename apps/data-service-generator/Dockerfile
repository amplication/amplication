FROM node:16.16-alpine AS base
RUN apk add g++ make python3

WORKDIR /workspace/libs/code-gen-types
COPY ./dist/libs/code-gen-types/package.json .
RUN npm i --omit-dev
COPY ./dist/libs/code-gen-types .

WORKDIR /workspace/apps/data-service-generator
COPY ./dist/apps/data-service-generator/package.json .
RUN npm i --omit-dev
COPY ./dist/apps/data-service-generator .