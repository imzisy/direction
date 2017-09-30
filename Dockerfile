FROM node:6.10.3

WORKDIR /usr/app

COPY package.json .
RUN npm install

COPY . .