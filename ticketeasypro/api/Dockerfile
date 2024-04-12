# Stage 1: Build the base code. 
FROM node:lts-alpine as buildStage

LABEL version="0.0.1"
LABEL description="Api Fastify (Node.js) Docker Image"
LABEL maintainer="Luiz Otavio <luiz0loon@gmail.com>"

# Create app directory
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci

COPY prisma ./prisma/
# COPY src ./src/
# COPY ./.env.production ./.env
# Install app dependencies
COPY . .

RUN npx prisma generate

# COPY ./node_modules/.prisma/client ./node_modules/.prisma/client

RUN npm run build


# Stage 2: Production image
FROM node:lts-alpine as prodStage
RUN npm install -g npm@latest

WORKDIR /app/ticketeasypro/api
ENV NODE_ENV production


COPY --from=buildStage /app/.env.production ./.env
COPY --from=buildStage /app/package*.json ./
# COPY ./.env.production ./.env

RUN npm ci --omit=dev --quiet

COPY --from=buildStage /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=buildStage /app/prisma ./prisma


COPY --from=buildStage /app/dist ./dist
EXPOSE 3210
CMD [ "node", "dist/server.js"]