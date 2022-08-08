ARG NODE_VERSION=16.16-alpine

FROM node:$NODE_VERSION

# Hide Open Collective message from install logs
ENV OPENCOLLECTIVE_HIDE=1
# Hiden NPM security message from install logs
ENV NPM_CONFIG_AUDIT=false
# Hide NPM funding message from install logs
ENV NPM_CONFIG_FUND=false

# Update npm to version 7
RUN npm i -g npm@7.3.0

# Set the working directory
WORKDIR /app

# Copy files specifying dependencies
COPY packages/amplication-data-service-generator/src/server/static/package.json packages/amplication-data-service-generator/src/server/static/package-lock.json ./server/
COPY packages/amplication-data-service-generator/src/admin/static/package.json packages/amplication-data-service-generator/src/admin/static/package-lock.json ./admin/

# Install dependencies
RUN cd server; npm ci --silent;
RUN cd admin; npm ci --silent;
