FROM node:18.12.1-slim AS base

WORKDIR /workspace/packages/amplication-plugin-api

COPY ./dist/packages/amplication-plugin-api/package.json .
RUN npm install --omit-dev

COPY ./dist/packages/amplication-plugin-api .

ENV PORT=3000
EXPOSE $PORT

CMD ["node", "./main.js"]
