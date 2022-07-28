ARG ALPINE_VERSION=alpine3.14
ARG NODE_VERSION=16.13.1


FROM node:$NODE_VERSION-$ALPINE_VERSION AS builder

COPY ./ /app

WORKDIR /app

RUN npm ci

RUN npm run bootstrap -- --scope @amplication/build-manager-service --include-dependencies

RUN npm run build -- --scope @amplication/build-manager-service --include-dependencies

FROM node:$NODE_VERSION-$ALPINE_VERSION as runner
WORKDIR /app

COPY --from=builder /app/packages/amplication-build-manager-service/package.json /app/packages/amplication-build-manager-service/package.json
COPY --from=builder /app/packages/amplication-build-manager-service/node_modules /app/packages/amplication-build-manager-service/node_modules
COPY --from=builder /app/packages/amplication-build-manager-service/dist /app/packages/amplication-build-manager-service/dist

COPY --from=builder /app/packages/amplication-kafka/package.json /app/packages/amplication-kafka/package.json
COPY --from=builder /app/packages/amplication-kafka/node_modules /app/packages/amplication-kafka/node_modules
COPY --from=builder /app/packages/amplication-kafka/lib /app/packages/amplication-kafka/lib

COPY --from=builder /app/packages/amplication-build-types/package.json /app/packages/amplication-build-types/package.json
COPY --from=builder /app/packages/amplication-build-types/node_modules /app/packages/amplication-build-types/node_modules
COPY --from=builder /app/packages/amplication-build-types/dist /app/packages/amplication-build-types/dist

CMD [ "node", "/app/packages/amplication-build-manager-service/dist/main.js" ]

