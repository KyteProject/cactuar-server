# Build/Compile Babel
FROM node:12-alpine
RUN mkdir -p /var/node/  && chown -R node:node /var/node/
WORKDIR /var/node
COPY package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
RUN npm run build

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

CMD [ "node", "./dist/app.js" ]
