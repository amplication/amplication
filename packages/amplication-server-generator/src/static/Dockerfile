FROM node

# schema.prisma is required for generating the prisma module
COPY package.json package-lock.json schema.prisma ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]