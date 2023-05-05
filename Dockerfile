FROM node:lts-alpine

WORKDIR /app

ENV NODE_ENV production

COPY package*.json ./

# `set -x` prints out the command before running it, enabling easier tracing
RUN set -x && npm ci

COPY . .

RUN set -x && yarn run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
