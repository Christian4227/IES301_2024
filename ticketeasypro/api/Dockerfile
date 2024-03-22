FROM node:lts-slim as builder

LABEL version="0.0.1"
LABEL description="Api Fastify (Node.js) Docker Image"
LABEL maintainer="Luiz Otavio <luiz0loon@gmail.com>"

RUN apt-get update && apt-get upgrade -y && apt-get autoclean -y && apt-get autoremove -y

RUN apt-get update -y && apt-get install -y openssl
# Defina o diretório de trabalho dentro do contêiner

WORKDIR /usr/src/api

# Copie os arquivos package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

RUN npx prisma generate
# Copie o restante dos arquivos do projeto para o diretório de trabalho
COPY . .

# Compile o código TypeScript
RUN npm run build

# Exponha a porta 3333 para fora do contêiner
EXPOSE 3333

# Comando para iniciar a aplicação quando o contêiner for iniciado
CMD ["node", "dist/server.js"]