# Use node 14.15.1 as the base image
FROM node@sha256:6ad6deebc02ec5429c216e526ab824438b7887c07bdab1248894521ad31676a0 AS node
FROM node

# Hide Open Collective message from install logs
ENV OPENCOLLECTIVE_HIDE=1

# Set the working direcotry
WORKDIR /app

# Copy files specifiying dependencies
COPY server/package.json server/package-lock.json server/prisma ./server/
COPY admin/package.json admin/package-lock.json ./admin/

# Install dependencies
RUN set -e; (cd server; npm ci --silent) & (cd admin; npm ci --silent)