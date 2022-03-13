FROM node:16.14.0-alpine
WORKDIR /app
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
COPY . .
RUN yarn && yarn auto-prepare

CMD ["yarn", "start"]