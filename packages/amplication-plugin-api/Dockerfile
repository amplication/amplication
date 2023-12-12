# multi-stage: base (build)
FROM node:18.13.0 AS base

# create directory where the application will be built
WORKDIR /app

# copy over the dependency manifests, both the package.json 
# and the package-lock.json are copied over
COPY package*.json ./

# installs packages and their dependencies
RUN npm install

# copy over the prisma schema
COPY prisma/schema.prisma ./prisma/

# generate the prisma client based on the schema
RUN npm run prisma:generate

# copy over the code base
COPY . .

# create the bundle of the application
RUN npm run build

# multi-stage: production (runtime)
FROM node:18.13.0-slim AS production

# create arguments of builds time variables
ARG user=amplication
ARG group=${user}
ARG uid=1001
ARG gid=$uid

# [temporary] work around to be able to run prisma
RUN apt-get update -y && apt-get install -y openssl

# create directory where the application will be executed from
WORKDIR /app

# add the user and group
RUN groupadd --gid ${gid} ${user}
RUN useradd --uid ${uid} --gid ${gid} -m ${user}

# copy over the bundled code from the build stage
COPY --from=base /app/node_modules/ ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/scripts ./scripts
COPY --from=base /app/src ./src
COPY --from=base /app/tsconfig* ./

# change ownership of the workspace directory
RUN chown -R ${uid}:${gid} /app/

# get rid of the development dependencies
RUN npm install --production

# set user to the created non-privileged user
USER ${user}

# expose a specific port on the docker container
ENV PORT=3000
EXPOSE ${PORT}

# start the server using the previously build application
CMD [ "node", "./dist/main.js" ]
