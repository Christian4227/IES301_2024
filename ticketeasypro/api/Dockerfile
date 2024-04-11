FROM node:lts-slim as builder

LABEL version="0.0.1"
LABEL description="Api Fastify (Node.js) Docker Image"
LABEL maintainer="Luiz Otavio <luiz0loon@gmail.com>"

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app/ticketeasypro/api

RUN apt-get update && apt-get upgrade -y && apt-get autoclean -y && apt-get autoremove -y

RUN apt-get update -y && apt-get install -y openssl

# Copia os arquivos package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Instala o Prisma CLI globalmente
RUN npm install -g prisma

# Copia o restante dos arquivos do projeto para o diretório de trabalho
COPY . .

# Define a porta que será exposta pelo contêiner
EXPOSE 3001

# Comando para iniciar o servidor de desenvolvimento do Fastify
CMD ["npm", "start"]