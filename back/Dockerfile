FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install 

RUN npm uninstall bcrypt
RUN npm install bcryptjs

COPY . .

RUN apk add bash
RUN npm install -g nodemon




