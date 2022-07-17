FROM node:16.13.1-alpine3.14 AS node

COPY ./ /app

WORKDIR /app

RUN npm install

RUN npm run bootstrap

RUN npm run build -- --scope @amplication/data-service-generator --include-dependencies




