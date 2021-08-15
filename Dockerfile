FROM node:latest
ARG APP_ENV
ARG APP_NAME

WORKDIR /tmp
COPY . .
RUN npm install -g npm@latest
RUN npm i
RUN npx gulp build-project --env=$APP_ENV --app=$APP_NAME
WORKDIR /app
RUN cp /tmp/dist/$APP_NAME/* /app
RUN npm i --production
RUN rm -rf /tmp

EXPOSE 3000
ENTRYPOINT node index.js
