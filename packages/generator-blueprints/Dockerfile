ARG GIT_REF_NAME
ARG GIT_SHA

FROM node:18-alpine AS base
ARG GIT_REF_NAME
ARG GIT_SHA

RUN apk add g++ make python3

WORKDIR /workspace/packages/generator-blueprints
# CSharpier deps - run first to keep layer in cache for faster builds
RUN apk add bash icu-libs krb5-libs libgcc libintl libssl3 libstdc++ zlib libgdiplus
RUN wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh
RUN chmod +x ./dotnet-install.sh
RUN ./dotnet-install.sh
ENV PATH="$PATH:/root/.dotnet/"
RUN dotnet tool install -g csharpier
ENV DOTNET_ROOT=/root/.dotnet
ENV PATH="$PATH:/root/.dotnet:/root/.dotnet/tools"
# copy package.json and install dependencies first to cache deps
COPY ./dist/packages/generator-blueprints/package.json .
RUN npm i --omit-dev

# copy the rest of the files
COPY ./dist/packages/generator-blueprints .


# Copy unpublished amplication libraries
COPY ./dist/libs/util/dsg-utils node_modules/@amplication/dsg-utils

ENV GIT_REF_NAME=${GIT_REF_NAME}
ENV GIT_SHA=${GIT_SHA}

RUN echo "GIT_REF_NAME: ${GIT_REF_NAME}, GIT_SHA: ${GIT_SHA}"