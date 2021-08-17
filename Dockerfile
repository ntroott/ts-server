FROM node:current-alpine3.14
ENV TZ="Europe/Moscow"
ARG NODE_ENV
ARG NODE_APP_INSTANCE
ARG DIST

WORKDIR /tmp
COPY . .
RUN apk update && apk add --no-cache tzdata
RUN yarn
RUN npx gulp build-project --env=$NODE_ENV --app=$NODE_APP_INSTANCE --color
WORKDIR /app
RUN cp /tmp/$DIST/$NODE_APP_INSTANCE/* /app
RUN yarn
RUN rm -rf /tmp

EXPOSE 3000
ENTRYPOINT node index.js
