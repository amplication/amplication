FROM node:18.13.0-slim AS production

# create arguments of builds time variables
ARG component=amplication-plugin-api
ARG user=${component}
ARG uid=1001
ARG gid=$uid

# create directory where the application will be built
WORKDIR /app

# copy over the dependency manifests, both the package.json 
# and the package-lock.json are copied over
COPY ./dist/packages/${component}/package.json ./

# installs packages and their dependencies
RUN npm install --production

# copy over the code base
COPY ./dist/packages/${component} .

# [temporary] work around to be able to run prisma
RUN apt-get update -y \
    && apt-get install -y openssl

# change ownership of the workspace directory
RUN groupadd --gid ${gid} ${user} \
    && useradd --uid ${uid} --gid ${gid} -m ${user} \
    && chown -R ${uid}:${gid} /app

# set user to the created non-privileged user
USER ${user}

# expose a specific port on the docker container
ENV PORT=3005
EXPOSE ${PORT}

# start the server using the previously build application
CMD [ "node", "./main.js" ]
