FROM node:16.14.0-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run prepare

CMD ["npm", "run", "start"]