FROM node:20.7.0-alpine

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install
COPY . .

EXPOSE 5000

CMD npm run devstart