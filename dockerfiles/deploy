FROM node:current-alpine3.14
ENV TZ="Europe/Moscow"
ENV PYTHONUNBUFFERED=1
ARG NODE_ENV
ARG NODE_APP_INSTANCE
ARG DIST

RUN apk update && \
    apk add --update --no-cache python3 make g++
RUN ln -sf python3 /usr/bin/python
WORKDIR /app
COPY ./$DIST/$NODE_APP_INSTANCE/ .
RUN yarn

EXPOSE 3000
ENTRYPOINT yarn node index.js
