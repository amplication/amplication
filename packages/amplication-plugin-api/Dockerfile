FROM node:18.12.1-slim AS base

WORKDIR /workspace/packages/amplication-plugin-api

COPY ./dist/packages/amplication-plugin-api/package.json .
RUN npm install --omit-dev

COPY ./dist/packages/amplication-plugin-api .

RUN addgroup -g 1001 -S nodejs
RUN adduser -S amplication-plugin-api -u 1001
RUN chown -R amplication-plugin-api:nodejs /workspace/packages/amplication-plugin-api
USER amplication-plugin-api

ENV PORT=3005
EXPOSE $PORT

CMD ["node", "./main.js"]
