FROM node:18-alpine


WORKDIR /app

COPY public/ /app/public
COPY src/  /app/src
COPY package.json /app/

RUN npm config delete proxy
RUN npm config delete https-proxy

RUN npm install

CMD [ "npm", "start" ]