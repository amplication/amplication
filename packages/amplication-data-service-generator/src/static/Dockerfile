ARG IMAGE=node

FROM $IMAGE

COPY package.json package-lock.json ./

RUN npm ci --silent

COPY . .

RUN npm run prisma:generate

RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/main"]