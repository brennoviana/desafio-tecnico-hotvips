ARG NODE_IMAGE=node:22.19-alpine

FROM $NODE_IMAGE AS base
RUN apk --no-cache add dumb-init postgresql-client
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node
RUN mkdir tmp

FROM base AS dependencies
COPY --chown=node:node ./package*.json ./
RUN npm ci --include=dev
COPY --chown=node:node . .

FROM dependencies AS build
RUN node ace build

FROM base AS production
ENV NODE_ENV=production
ENV PORT=$PORT
ENV HOST=0.0.0.0
COPY --chown=node:node ./package*.json ./
RUN npm ci --production
COPY --chown=node:node --from=build /home/node/app/build .
COPY --chown=node:node ./docker-entrypoint.sh /home/node/app/
USER root
RUN chmod +x /home/node/app/docker-entrypoint.sh
USER node
EXPOSE $PORT
ENTRYPOINT ["/home/node/app/docker-entrypoint.sh"]
CMD [ "dumb-init", "node", "bin/server.js" ]
