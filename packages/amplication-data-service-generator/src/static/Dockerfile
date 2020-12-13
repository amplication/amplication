# By default, use node 12.18.3 as the base image
ARG IMAGE=node@sha256:d0738468dfc7cedb7d260369e0546fd7ee8731cfd67136f6023d070ad9679090

FROM $IMAGE

# Hide Open Collective message from install logs
ENV OPENCOLLECTIVE_HIDE=1

# Set the working direcotry
WORKDIR /app

# Copy files specifiying dependencies
COPY server/package.json server/package-lock.json server/prisma ./server/
COPY admin/package.json admin/package-lock.json ./admin/

# Install dependencies
RUN set -e; (cd server; npm ci --silent) & (cd admin; npm ci --silent)

# Update prisma
RUN cd server; npm run prisma:generate;

# Copy all the files
COPY . .

# Build code
RUN set -e; (cd server; npm run build) & (cd admin; npm run build)

# Expose the port the server listens to
EXPOSE 3000

# Make server to serve admin built files
ENV SERVE_STATIC_ROOT_PATH=admin/build

# Run server
CMD [ "node", "server/dist/main"]