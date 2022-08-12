ARG NODE_VERSION=16.16-alpine
ARG NGINX_VERSION=1.20-alpine

FROM node:$NODE_VERSION AS build

ENV OPENCOLLECTIVE_HIDE=1

RUN npm config set fund false

WORKDIR /app
COPY lerna.json /app
COPY package*.json /app/
RUN npm ci --production

COPY packages packages
RUN npm run bootstrap -- --scope @amplication/client --include-dependencies
RUN npm run build -- --scope @amplication/client --include-dependencies

FROM nginx:$NGINX_VERSION as client

RUN apk add --update nodejs

WORKDIR /app

COPY --from=build /app/packages/amplication-client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/packages/amplication-client/build /app
COPY --from=build /app/packages/amplication-client/src/scripts/inject-variables.js .
COPY --from=build /app/packages/amplication-client/entrypoint.sh .

RUN chmod 755 entrypoint.sh

ENTRYPOINT [ "/app/entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]
