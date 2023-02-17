FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
COPY packages/test-servers/package*.json ./packages/test-servers/

RUN npm install

COPY lerna.json ./
COPY tsconfig.json ./
COPY packages/test-servers/. ./packages/test-servers/

RUN npm run build

CMD node -r ./packages/test-servers/dist/index.js