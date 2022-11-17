FROM node:lts-alpine
WORKDIR /usr/app

COPY package.json ./
COPY tsconfig*.json ./
COPY astro* ./

RUN yarn cache clean
RUN yarn install

EXPOSE 3000

CMD ["yarn", "dev", "--host"]
