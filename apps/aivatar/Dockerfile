FROM node:20.13.1-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy source code
# Needed for wagmi package
RUN apk add python3 make g++

# Install required environment tools
RUN npm i -g nx@20.4.0 npm@10.8.2

# Copy source code
COPY --chown=node:node . .

# Install project dependencies
RUN npm i

# Build projects
RUN nx build aivatar

FROM node:22.5.1-alpine AS runtime

WORKDIR /usr/src/app

RUN apk update
RUN apk upgrade


ENV DATABASE_HOST=
ENV DATABASE_USERNAME=
ENV DATABASE_DATABASE=
ENV DATABASE_PASSWORD=
ENV DATABASE_SCHEMA=
ENV DATABASE_PORT=
ENV DATABASE_SSL=
ENV NETWORK_ID=
ENV WALLET_DATA_FILE=
ENV NEYNAR_API_KEY=
ENV NEYNAR_CLIENT_ID=
ENV FARCASTER_DEVELOPER_MNEMONIC=
ENV CDP_API_KEY_NAME=
ENV CDP_API_KEY_PRIVATE_KEY=
ENV OPENAI_API_KEY=

COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/apps/aivatar/build ./build
COPY --chown=node:node --from=builder /usr/src/app/apps/aivatar/package.json ./package.json

USER node

# Start the server using the production build
CMD [ "npm", "start"]
