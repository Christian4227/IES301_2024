# Stage 1: Build the base code. 
FROM node:lts-alpine as buildStage

# Define um valor padrão para ENV, que será utilizado caso nenhum outro seja fornecido
ARG ENV=

LABEL version="0.0.1"
LABEL description="Api Fastify (Node.js) Docker Image"
LABEL maintainer="Luiz Otavio <luiz0loon@gmail.com>"

# Create app directory
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci

COPY prisma ./prisma/
COPY src ./src/

# A sintaxe abaixo escolhe o arquivo .env apropriado ou o padrão .env caso ENV não seja especificado
COPY ./.env${ENV:+.$ENV} ./.env

RUN npx prisma generate
RUN npm run build

# Stage 2: Production image
FROM node:lts-alpine as prodStage
RUN npm install -g npm@latest

WORKDIR /app/ticketeasypro/api
# ENV NODE_ENV=production

# Copia o arquivo .env da stage de build
COPY --from=buildStage /app/.env ./.env

COPY --from=buildStage /app/package*.json ./
RUN npm ci --omit=dev --quiet

COPY --from=buildStage /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=buildStage /app/prisma ./prisma
COPY --from=buildStage /app/dist ./dist

RUN npx prisma db push

EXPOSE 3210
CMD [ "node", "dist/server.js"]
