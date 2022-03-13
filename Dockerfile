FROM node:16.14.0-alpine
WORKDIR /app
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
COPY . .
RUN yarn && yarn add https://github.com/Folks-Finance/folks-finance-js-sdk && \
    yarn add @types/node && yarn auto-prepare

CMD ["yarn", "start"]