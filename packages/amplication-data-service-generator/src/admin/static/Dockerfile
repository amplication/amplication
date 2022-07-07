ARG ALPINE_VERSION=alpine3.14
ARG NODE_VERSION=16.13.1
# Use node as the base image

FROM node:$NODE_VERSION-$ALPINE_VERSION AS base

# Define how verbose should npm install be
ARG NPM_LOG_LEVEL=silent
# Hide Open Collective message from install logs
ENV OPENCOLLECTIVE_HIDE=1
# Hiden NPM security message from install logs
ENV NPM_CONFIG_AUDIT=false
# Hide NPM funding message from install logs
ENV NPM_CONFIG_FUND=false

# Update npm to version 7
RUN npm i -g npm@8.1.2

# Set the working directory
WORKDIR /app/admin-ui

# Copy files specifying dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --loglevel=$NPM_LOG_LEVEL;

# Copy all the files
COPY . .

# Build code
RUN npm run build

# Expose the port the client listens to
EXPOSE 3001

# Run admin-ui

CMD [ "npm", "start"]
