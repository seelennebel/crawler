FROM node:alpine3.20

WORKDIR /app

COPY . .

RUN npm install -g npm@latest; npm install

WORKDIR /app/server

RUN mkdir EVENTS

WORKDIR /app

CMD [ "npm", "run", "server" ]

EXPOSE 8080