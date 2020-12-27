# Use node 14.15.3 as the base image
FROM node@sha256:bef791f512bb4c3051a1210d7fbd58206538f41eea9b966031abc8a7453308fe AS node
FROM node

# Hide Open Collective message from install logs
ENV OPENCOLLECTIVE_HIDE=1
# Hiden NPM security message from install logs
ENV NPM_CONFIG_AUDIT=false
# Hide NPM funding message from install logs
ENV NPM_CONFIG_FUND=false

# Update npm to version 7
RUN npm i -g npm@7.3.0

# Set the working direcotry
WORKDIR /app

# Copy files specifiying dependencies
COPY src/server/static/package.json src/server/static/package-lock.json ./server/
COPY src/admin/static/package.json src/admin/static/package-lock.json ./admin/

# Install dependencies
RUN cd server; npm ci --silent;
RUN cd admin; npm ci --silent;