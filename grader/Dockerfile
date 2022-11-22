FROM node:lts-alpine
RUN apk add --update docker openrc
WORKDIR /usr/app
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 4000
RUN npm install -g nodemon
CMD ["yarn", "dev"]
