FROM node:12
RUN openssl version -v
RUN uname -a

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY lerna.json lerna.json
COPY packages/amplication-server/package.json packages/amplication-server/package.json
COPY packages/amplication-server/package-lock.json packages/amplication-server/package-lock.json
COPY packages/amplication-server/prisma/schema.prisma packages/amplication-server/prisma/schema.prisma
COPY packages/amplication-data-service-generator/package.json packages/amplication-data-service-generator/package.json
COPY packages/amplication-data-service-generator/package-lock.json packages/amplication-data-service-generator/package-lock.json

RUN npm run bootstrap

ADD codegen.yml codegen.yml
ADD packages packages

RUN npm run build -- --scope=amplication-data-service-generator --scope=amplication-server

EXPOSE 3000

CMD [ "npm", "run", "start:prod", "--", "--scope=amplication-server"]