FROM node@sha256:d0738468dfc7cedb7d260369e0546fd7ee8731cfd67136f6023d070ad9679090 AS node
FROM node

COPY src/static/package.json src/static/package-lock.json ./

RUN npm ci --silent