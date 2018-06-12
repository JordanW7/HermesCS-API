FROM node:8.11.1

# Create app directory
RUN mkdir -p /usr/src/hermes-cs-api
WORKDIR /usr/src/hermes-cs-api

# Install app dependencies
COPY package.json /usr/src/hermes-cs-api
RUN npm install

# Bundle app source
COPY . /usr/src/hermes-cs-api

# Build arguments
ARG NODE_VERSION=8.11.1

# Environment
ENV NODE_VERSION $NODE_VERSION