FROM node:12
RUN openssl version -v
RUN uname -a
RUN echo $POSTGRESQL_URL

# Create app directory
WORKDIR /usr/src/app

# Install prisma2 for the migration
RUN npm install -g prisma2 --unsafe-perm

# Copy schema and migration folder
ADD ./ ./prisma/

CMD [ "prisma2", "migrate", "up", "--experimental"]