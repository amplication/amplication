FROM node:12
RUN openssl version -v
RUN uname -a
ARG POSTGRESQL_URL
ENV POSTGRESQL_URL "$POSTGRESQL_URL"

# Create app directory
WORKDIR /usr/src/app

RUN npm install -g prisma2 --unsafe-perm

ADD ./prisma/schema.prisma ./

# A wildcard is used to ensure both package.json AND package-lock.json are copied
ADD package*.json ./

# Install necessary tools for bcrypt to run in docker before npm install
RUN apt-get update && apt-get install -y build-essential && apt-get install -y python

# Install app dependencies
RUN npm install --unsafe-perm

ADD . .

RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]