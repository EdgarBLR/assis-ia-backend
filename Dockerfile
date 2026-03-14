FROM node:18-alpine

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Gera o cliente Prisma
RUN npx prisma generate

# Expõe a porta definida no .env ou a padrão 3001
EXPOSE 3001

CMD ["npm", "start"]
