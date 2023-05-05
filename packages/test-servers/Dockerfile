FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
COPY packages/test-servers/package*.json ./packages/test-servers/

RUN npm install

COPY lerna.json ./
COPY tsconfig.json ./
COPY packages/test-servers/. ./packages/test-servers/

RUN npm install @traceloop/instrument-opentelemetry
RUN npm run build

CMD ["sh", "-c", "cd packages/test-servers && npm run start"]