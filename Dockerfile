FROM node:lts-slim AS BASE

RUN apt-get update && apt-get install -y python3 build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY yarn.lock package.json ./

RUN npm_config_build_from_source=true yarn install --prod
RUN yarn add @tensorflow/tfjs-node --build-from-source

FROM BASE as BUILD

COPY src ./src
COPY tsconfig.json ./

ARG modelType=default

COPY ./models/$modelType ./model

RUN yarn build

EXPOSE 3001

ENTRYPOINT ["yarn", "start"]
