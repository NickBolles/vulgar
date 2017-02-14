# Builds a Docker to deliver dist/
FROM node:boron

# Change these to correspond with config.json
ENV APP_NAME=vulgar
ENV MAIN_FILE=server/server.bundle.js
ENV APP_PORT=3000

EXPOSE 3000

COPY dist/ /usr/src/${APP_NAME}

COPY package.json /usr/src/${APP_NAME}


WORKDIR /usr/src/${APP_NAME}


RUN npm install && npm install -g nodemon


CMD nodemon ${MAIN_FILE}
