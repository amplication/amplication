# Use node as the base image
FROM node:16.13.1-alpine3.14 AS node
FROM node

FROM node as base
RUN npm i -g npm@8.1.2

# This stage creates a skeleton with package*.json to /app/
FROM base as package-sources
ARG NPM_LOG_LEVEL=silent
RUN mkdir /app
COPY lerna.json /app/
COPY package*.json /app/
COPY packages packages
RUN cp --parents packages/*/package*.json /app/
WORKDIR /app
RUN npm ci --loglevel=${NPM_LOG_LEVEL} --production

FROM package-sources AS build
ARG NPM_LOG_LEVEL=silent

ENV OPENCOLLECTIVE_HIDE=1

#install all node_nodules in '/app/packages'
RUN npm run bootstrap -- --loglevel=${NPM_LOG_LEVEL} --scope @amplication/server --scope @amplication/client --include-dependencies

#copy the content (code) from packages to /app/packages (mode_modules folders stay in place )
COPY packages packages

RUN npm run prisma:generate
# prepare all the build/dist folders unders /app/packages
RUN npm run build -- --scope @amplication/server --scope @amplication/client --include-dependencies
#remove all node_modules (with dev dependencies) from /app/packages
RUN npm run clean -- --yes

FROM package-sources

ENV OPENCOLLECTIVE_HIDE=1

EXPOSE 3000

##is this duplicate?
RUN npm ci --production --silent 

#copy the content of /app/packages from the 'build' stage (without node_modules)
COPY --from=build /app/packages /app/packages

#install node_modules for all packages (for production)
RUN npm run bootstrap -- -- --production --loglevel=silent --scope @amplication/server --scope @amplication/client --include-dependencies

RUN npm run prisma:generate

# Copy entrypoint script
COPY docker-entrypoint.sh /entrypoint.sh
# Give entrypoint script access permission
RUN chmod 755 /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]

CMD [ "node", "packages/amplication-server/dist/src/main"]
