## Following instructions found in:
## https://github.com/open-telemetry/opentelemetry-operator/blob/main/autoinstrumentation/nodejs/Dockerfile

FROM node:16 AS build

WORKDIR /operator-build

COPY package*.json ./
COPY packages/instrument-opentelemetry/package*.json ./packages/instrument-opentelemetry/

RUN npm install

COPY lerna.json ./
COPY tsconfig.json ./
COPY packages/instrument-opentelemetry/. ./packages/instrument-opentelemetry/

RUN npm run build

FROM busybox AS prod

COPY --from=build /operator-build/node_modules /autoinstrumentation/node_modules
COPY --from=build /operator-build/packages/instrument-opentelemetry/dist/tracing.js /autoinstrumentation/autoinstrumentation.js

RUN chmod -R go+r /autoinstrumentation