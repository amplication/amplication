# By default, use node 14.15.1 as the base image
ARG IMAGE=node@sha256:e4f5095aeca472b3c10dc27bb40e33a3d4ec2c12162f1ad390d894b1a53ffdee

FROM $IMAGE

# Hide Open Collective message from install logs
ENV OPENCOLLECTIVE_HIDE=1

# Set the working direcotry
WORKDIR /app

# Copy files specifiying dependencies
COPY server/package.json server/package-lock.json server/prisma ./server/
COPY admin/package.json admin/package-lock.json ./admin/

# Install dependencies
RUN set -e; cd server; npm ci --silent; npm run prisma:generate;
RUN cd admin; npm ci --silent;

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