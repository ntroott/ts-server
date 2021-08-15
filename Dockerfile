FROM node:latest
ARG NODE_ENV
ARG NODE_APP_INSTANCE

WORKDIR /tmp
COPY . .
RUN npm install -g npm@latest
RUN npm i
RUN npx gulp build-project --env=$NODE_ENV --app=$NODE_APP_INSTANCE
WORKDIR /app
RUN cp /tmp/dist/$NODE_APP_INSTANCE/* /app
RUN npm i --production
RUN rm -rf /tmp

EXPOSE 3000
ENTRYPOINT node index.js
