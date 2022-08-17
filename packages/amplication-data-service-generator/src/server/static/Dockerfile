FROM node:16-alpine AS base

# Hide Open Collective message from install logs
ENV OPENCOLLECTIVE_HIDE=1
# Hiden NPM security message from install logs
ENV NPM_CONFIG_AUDIT=false
# Hide NPM funding message from install logs
ENV NPM_CONFIG_FUND=false

# Update npm to version 7
RUN npm i -g npm@8.1.2

# Set the working directory
WORKDIR /app/server

# Copy files specifying dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --loglevel=$NPM_LOG_LEVEL;

# Copy Prisma schema
COPY prisma/schema.prisma ./prisma/

# Generate Prisma client
RUN npm run prisma:generate;

# Copy all the files
 COPY . .

# Build code
RUN npm run build

# Expose the port the server listens to
EXPOSE 3000

# Run server
CMD [ "node", "dist/main"]
