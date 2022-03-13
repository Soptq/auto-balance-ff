FROM node:16.14.0-alpine
WORKDIR /app
COPY . .
RUN yarn && yarn add https://github.com/Folks-Finance/folks-finance-js-sdk && yarn prepare

CMD ["yarn", "start"]