FROM node:lts-alpine3.16

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
COPY tsconfig.json /app/tsconfig.json

RUN yarn install

EXPOSE 3000

CMD [ "astro", "dev" ]
