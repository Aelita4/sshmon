FROM node:16.17

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY data.json .

COPY out .

EXPOSE 8080

CMD ["node", "index.js"]