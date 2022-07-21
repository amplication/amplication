FROM node:16.16-alpine AS builder

WORKDIR /app

RUN npm install -g pkg

COPY package*.json ./

RUN npm ci --silent

ADD . .

RUN npm run build
RUN pkg --targets node14-alpine-x64 --output scheduler .

CMD []

FROM alpine:3.15
COPY --from=builder /app/scheduler ./
RUN apk update && \
  apk add --no-cache libstdc++ libgcc ca-certificates && \
  rm -rf /var/cache/apk/*
ENTRYPOINT [ "./scheduler" ]