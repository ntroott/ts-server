FROM node:latest
ARG NODE_ENV
ARG NODE_APP_INSTANCE
ARG DIST

WORKDIR /tmp
COPY . .

RUN npm i --include=dev
RUN npx gulp build-project --env=$NODE_ENV --app=$NODE_APP_INSTANCE --color
WORKDIR /app
RUN cp /tmp/$DIST/$NODE_APP_INSTANCE/* /app
RUN npm i --production
RUN rm -rf /tmp

EXPOSE 3000
ENTRYPOINT node index.js
