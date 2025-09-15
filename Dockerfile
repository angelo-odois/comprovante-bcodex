# Multi-stage build para otimizar tamanho da imagem
FROM node:18-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências básicas
RUN apk add --no-cache python3 make g++

# Copiar arquivos de dependências
COPY package*.json ./

# Limpar cache e instalar dependências
RUN npm cache clean --force
RUN npm install

# Copiar código fonte
COPY . .

# Remover dependências problemáticas
RUN npm uninstall lovable-tagger
RUN rm -f postcss.config.js postcss.config.mjs

# Criar um build simples
RUN mkdir -p dist
RUN cp index.html dist/
RUN cp -r public/* dist/ 2>/dev/null || true
RUN echo "Build simples criado"

# Stage de produção com Nginx
FROM nginx:alpine AS production

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor porta
EXPOSE 80

# Comando de inicialização
CMD ["nginx", "-g", "daemon off;"]