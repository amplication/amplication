### BUILDER ###
FROM node:14-alpine as builder

# Define how verbose should npm install be
ARG NPM_LOG_LEVEL=silent
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
COPY server/package.json server/package-lock.json ./server/
COPY admin-ui/package.json admin-ui/package-lock.json ./admin-ui/

# Install production dependencies
RUN cd admin-ui; npm ci --loglevel=$NPM_LOG_LEVEL;
RUN cd server; npm ci --production --loglevel=$NPM_LOG_LEVEL

# Copy production dependencies (-a to preserve symlinks)
RUN mkdir /tmp/server
RUN cp -a server/node_modules/ /tmp/server/node_modules/

# Copy Prisma schema
COPY server/prisma/schema.prisma ./server/prisma/

# Install dev-dependencies 
RUN cd server; npm install --only=dev --loglevel=$NPM_LOG_LEVEL;

# Generate Prisma client
RUN cd server; npm run prisma:generate;

# Copy and build all the files
COPY admin-ui ./admin-ui
RUN set -e; cd admin-ui; npm run build
COPY server ./server
RUN set -e; cd server; npm run build


### RUNNER ###
FROM node:14-alpine

# Set the working direcotry
WORKDIR /app

# Copy the production dependencies from the temp folder
COPY --from=builder /tmp/server/node_modules/ /app/server/node_modules/

# Copy prisma client
COPY --from=builder /app/server/node_modules/@prisma/client/ /app/server/node_modules/@prisma/client/ 
COPY --from=builder /app/server/node_modules/.prisma/client/ /app/server/node_modules/.prisma/client/

# Copy the dist folder
COPY --from=builder /app/server/dist/ /app/server/dist/

# Include the Script folder with the seed and migration scripts
COPY --from=builder /app/server/scripts/ /app/server/scripts/

# Include the Prisma schema
COPY --from=builder /app/server/prisma/ /app/server/prisma/

# Include the entire src folder (used from script/seed.ts)
COPY --from=builder /app/server/src/ /app/server/src/
COPY --from=builder /app/server/tsconfig.json /app/server/tsconfig.json

COPY --from=builder /app/server/package.json /app/server/package-lock.json /app/server/
COPY --from=builder /app/admin-ui/package.json /app/admin-ui/package-lock.json /app/admin-ui/

COPY --from=builder /app/admin-ui/build/ /app/admin-ui/build/

# Expose the port the server listens to
EXPOSE 3000

# Make server to serve admin built files
ENV SERVE_STATIC_ROOT_PATH=admin-ui/build

# Run server
CMD [ "node", "server/dist/main"]