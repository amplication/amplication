# By default, use node 14.15.1 as the base image
ARG IMAGE=node@sha256:ba8661b07004a0aedfbba12b08ac78e3f02c5ee3b7a68871b41d0e7ea5711c00

FROM $IMAGE

# Hide Open Collective message from install logs
ENV OPENCOLLECTIVE_HIDE=1
# Hiden NPM security message from install logs
ENV NPM_CONFIG_AUDIT=false
# Hide NPM funding message from install logs
ENV NPM_CONFIG_FUND=false

# Update npm to version 7
RUN npm i -g npm@7

# Set the working direcotry
WORKDIR /app

# Copy files specifiying dependencies
COPY server/package.json server/package-lock.json ./server/
COPY admin/package.json admin/package-lock.json ./admin/

# Install dependencies
RUN cd server; npm install --silent;
RUN cd admin; npm install --silent;

# Copy Prisma schema
COPY server/prisma/schema.prisma ./server/prisma/

# Generate Prisma client
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