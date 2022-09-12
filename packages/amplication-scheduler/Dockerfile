ARG NODE_VERSION=16.16-alpine
ARG ALPINE_VERSION=3.15

FROM node:$NODE_VERSION AS builder

WORKDIR /app

RUN npm install -g pkg

COPY package*.json ./

RUN npm ci

ADD . .

RUN npm run build
RUN pkg --targets node14-alpine-x64 --output scheduler .

CMD []

FROM alpine:${ALPINE_VERSION}
COPY --from=builder /app/scheduler ./
RUN apk update && \
  apk add --no-cache libstdc++ libgcc ca-certificates && \
  rm -rf /var/cache/apk/*
ENTRYPOINT [ "./scheduler" ]