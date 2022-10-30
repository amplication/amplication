FROM node:16.16-alpine AS base
RUN apk add g++ make python3

WORKDIR /workspace/packages/amplication-code-gen-types
COPY ./dist/packages/amplication-code-gen-types/package.json .
RUN npm i --omit-dev
COPY ./dist/packages/amplication-code-gen-types .

WORKDIR /workspace/packages/amplication-data-service-generator
COPY ./dist/packages/amplication-data-service-generator/package.json .
RUN npm i --omit-dev
COPY ./dist/packages/amplication-data-service-generator .

COPY ./packages/amplication-data-service-generator/build-spec.json .
RUN npm run generate-code:prod ./build-spec.json ./temp