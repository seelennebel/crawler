FROM node:alpine3.20

WORKDIR /app

COPY . .

RUN npm install

RUN npm install -g npm@latest         

CMD [ "npm", "run", "server" ]

EXPOSE 8080