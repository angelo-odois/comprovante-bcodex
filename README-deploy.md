# Deploy no Coolify - Comprovante M-53

## 🚀 Configuração Rápida

### 1. Variáveis de Ambiente no Coolify

Configure estas variáveis no painel do Coolify:

```env
NODE_ENV=production
DATABASE_URL=postgres://postgres:vcClbZixT5W8M6wiBf6oocvrnsGrEPG0EGlvcSnKZ7sGhIQMkrGNxWAsgoH87cfC@212.85.13.91:5432/bcodex
```

### 2. Configurações de Deploy

- **Porta**: 80 (padrão Docker - Coolify gerencia proxy)
- **Health Check**: `/health`
- **Dockerfile**: `Dockerfile` (raiz do projeto)
- **Contexto**: `.` (raiz do projeto)

### 3. Como Configurar no Coolify

1. **Criar Novo Projeto**
   - Nome: `comprovante-m53`
   - Tipo: Docker

2. **Configurar Source**
   - Conectar ao repositório Git
   - Branch: `main`

3. **Build Settings**
   - Build Pack: Docker
   - Dockerfile: `Dockerfile`
   - Port: `80`

4. **Environment Variables**
   ```
   NODE_ENV=production
   DATABASE_URL=<sua-connection-string>
   ```

5. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build completar

## 🔧 Scripts Úteis

```bash
# Build local para teste
npm run build:prod

# Testar Docker localmente
npm run docker:build
npm run docker:run

# Desenvolvimento com Docker
npm run docker:dev

# Gerenciar banco de dados
npm run db:setup
npm run db:test
```

## 📁 Estrutura de Arquivos Criados

```
├── Dockerfile              # Build otimizado multi-stage
├── nginx.conf              # Configuração Nginx
├── docker-compose.yml      # Para desenvolvimento
├── coolify.json            # Configuração Coolify
├── .dockerignore           # Ignorar arquivos no build
├── .env.example            # Exemplo de variáveis
└── README-deploy.md        # Este arquivo
```

## 🔍 Health Check

A aplicação expõe um endpoint de health check em `/health` que retorna:
- Status: `200 OK`
- Response: `healthy`

## 🐳 Docker

### Build Multi-Stage
1. **Builder**: Instala dependências e faz build
2. **Production**: Nginx Alpine com arquivos buildados

### Otimizações Incluídas
- Compressão Gzip
- Cache de assets estáticos
- Security headers
- SPA routing support

## 🔒 Segurança

Headers de segurança configurados:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Content-Security-Policy
- Referrer-Policy

## 📊 Performance

- Chunk splitting automático
- Assets com cache de 1 ano
- Compressão Gzip habilitada
- Nginx otimizado para SPA