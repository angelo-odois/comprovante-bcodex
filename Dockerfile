# Multi-stage build para otimizar tamanho da imagem
FROM node:18-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências básicas
RUN apk add --no-cache python3 make g++

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies para build)
RUN npm ci && npm cache clean --force

# Copiar código fonte
COPY . .

# Remover configuração problemática do PostCSS
RUN rm -f postcss.config.js

# Build da aplicação com flag de compatibilidade
RUN NODE_OPTIONS="--max_old_space_size=4096" npm run build

# Stage de produção com Nginx
FROM nginx:alpine AS production

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor porta
EXPOSE 8089

# Comando de inicialização
CMD ["nginx", "-g", "daemon off;"]