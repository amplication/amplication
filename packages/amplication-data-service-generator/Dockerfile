ARG NODE_VERSION=16.16-alpine

FROM node:$NODE_VERSION AS builder

COPY ./ /app

WORKDIR /app

RUN npm ci

RUN npm run bootstrap -- --scope @amplication/data-service-generator --include-dependencies

RUN npm run build -- --scope @amplication/data-service-generator --include-dependencies

RUN npm run clean -- --yes
# Rebuild production node_modules
RUN npm run bootstrap -- -- --production --scope @amplication/data-service-generator --include-dependencies

FROM node:$NODE_VERSION as runner
WORKDIR /app

COPY --from=builder /app/packages/amplication-data-service-generator/package.json /app/packages/amplication-data-service-generator/package.json
COPY --from=builder /app/packages/amplication-data-service-generator/node_modules /app/packages/amplication-data-service-generator/node_modules
COPY --from=builder /app/packages/amplication-data-service-generator/dist /app/packages/amplication-data-service-generator/dist


COPY --from=builder /app/packages/amplication-code-gen-types/package.json /app/packages/amplication-code-gen-types/package.json
COPY --from=builder /app/packages/amplication-code-gen-types/node_modules /app/packages/amplication-code-gen-types/node_modules
COPY --from=builder /app/packages/amplication-code-gen-types/dist /app/packages/amplication-code-gen-types/dist

