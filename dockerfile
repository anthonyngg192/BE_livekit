FROM node:16-alpine as node-server

ENV NODE_ENV build

COPY package*.json ./
RUN npm ci

COPY . .
COPY .env ./
RUN npm run build
EXPOSE 30001

CMD ["npm","run", "start:prod"]