# Build/Compile Babel
FROM node AS build
RUN mkdir -p /var/node/
ADD . /var/node/
WORKDIR /var/node
RUN npm install
RUN npm run build

# Multi-stage Container
FROM keymetrics/pm2:latest-alpine
ARG VERSION=V3.1.0
LABEL org.label-schema.version=$VERSION

# Env 
ENV NODE_ENV="dev"

# Bot Token
ENV TOKEN=""
ENV DEV_TOKEN=""

# Production DB
ENV DB_USER="cactuar"
ENV DB_NAME="cactuar_prod"
ENV DB_PASS=""
ENV DB_HOST=""
ENV DB_PORT=5432

# Dev DB
ENV DEV_USER="cactuar"
ENV DEV_NAME="cactuar_dev"
ENV DEV_PASS=""
ENV DEV_HOST=""
ENV DEV_PORT=5432

# API Keys
ENV LASTFM=""
ENV YOUTUBE=""
ENV FREESOUND=""

# Copy build files
WORKDIR /var/node
COPY --from=build /var/node/dist .
COPY --from=build /var/node/package.json .
COPY --from=build /var/node/pm2.json .

# Install git
RUN apk update && \
  apk add --update git

# Install app dependencies
RUN npm install --production

# Show current folder structure in logs
RUN ls -al -R

CMD [ "pm2-runtime", "start", "pm2.json" ]
