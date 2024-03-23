FROM node:lts-slim as builder

LABEL version="0.0.1"
LABEL description="Api Fastify (Node.js) Docker Image"
LABEL maintainer="Luiz Otavio <luiz0loon@gmail.com>"

RUN apt-get update && apt-get upgrade -y && apt-get autoclean -y && apt-get autoremove -y

RUN apt-get update -y && apt-get install -y openssl

# Atualiza o gerenciador de pacotes NPM
RUN npm install -g npm

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/ticketeasypro_api

# Copie os arquivos package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# COPY ./prisma prisma

# Instale as dependências do projeto
RUN npm install


# Copie o restante dos arquivos do projeto para o diretório de trabalho
COPY . .

# RUN npm run db-generate
COPY ./prisma prisma

RUN npx prisma migrate deploy

# Compile o código TypeScript
RUN npm run build



# RUN npx prisma migrate deploy

# # Atualiza as tabelas com o schema do prisma
# RUN npx prisma db push

# Exponha a porta 3210 para fora do contêiner
# EXPOSE 3210

# Comando para iniciar a aplicação quando o contêiner for iniciado
CMD ["node", "dist/server.js"]