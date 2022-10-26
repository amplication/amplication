FROM node:16.16-alpine AS base

WORKDIR /app

COPY ./dist/ee/packages/amplication-git-pull-service/package-lock.json .
COPY ./dist/ee/packages/amplication-git-pull-service/package.json .

COPY packages/amplication-nest-logger-module packages/amplication-nest-logger-module

RUN npm ci --omit=dev

COPY --from=build /app/packages/amplication-nest-logger-module/package.json /app/packages/amplication-nest-logger-module/package.json
COPY --from=build /app/packages/amplication-nest-logger-module/node_modules /app/packages/amplication-nest-logger-module/node_modules
COPY --from=build /app/packages/amplication-nest-logger-module/dist /app/packages/amplication-nest-logger-module/dist

COPY ./dist/ee/packages/amplication-git-pull-service .

ENV PORT=3333
EXPOSE $PORT

ENTRYPOINT ["node", "./main.js"]