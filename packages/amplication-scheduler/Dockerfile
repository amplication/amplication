FROM node:alpine as builder

WORKDIR /app

RUN npm install -g pkg

COPY package*.json ./

RUN npm ci --silent

ADD . .

RUN npm run build
RUN pkg --targets node14-alpine-x64 --output scheduler .

CMD []

FROM alpine
COPY --from=builder /app/scheduler ./
RUN apk update && \
  apk add --no-cache libstdc++ libgcc ca-certificates && \
  rm -rf /var/cache/apk/*
ENTRYPOINT [ "./scheduler" ]