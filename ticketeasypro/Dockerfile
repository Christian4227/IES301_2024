FROM node:lts-slim as builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app/ticketeasypro/src

# Copia os arquivos package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos do projeto para o diretório de trabalho
COPY . .

# Define a porta que será exposta pelo contêiner
EXPOSE 3000

# Comando para iniciar o servidor de desenvolvimento do Next.js
CMD ["npm", "run", "dev"]