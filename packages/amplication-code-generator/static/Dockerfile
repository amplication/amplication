FROM node

# schema.prisma is required for generating the prisma module
COPY package.json package-lock.json schema.prisma ./

RUN npm install

# TODO: replace with integration to external DB and external migrate process
RUN npm run db-migrate-save -- --name "initial version" --create-db
RUN npm run db-migrate-up

COPY . .

EXPOSE 3000

CMD ["npm", "start"]