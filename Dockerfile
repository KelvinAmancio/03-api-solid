# a base stage for all future stages
# with only prod dependencies and
# no code yet
FROM node:21-slim as base
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN apt-get update -y && apt-get install -y openssl
RUN npm install -g npm
RUN npm ci && npm cache clean --force
ENV PATH /app/node_modules/.bin:$PATH

# a dev and build-only stage. we don't need to
# copy in code since we bind-mount it
FROM base as dev
ENV NODE_ENV=development
RUN npm install
CMD ["/app/node_modules/.bin/tsx", "watch", "--inspect=0.0.0.0:9229", "./src/server.ts"]

FROM dev as build
COPY . .
RUN tsup src --out-dir build
# you would also run your tests here

# this only has minimal deps and files
FROM base as prod
COPY --from=build /app/build/ .
CMD ["node", "server.js"]