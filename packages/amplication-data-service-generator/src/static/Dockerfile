FROM node

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run prisma:generate

EXPOSE 3000

CMD ["npm", "start"]