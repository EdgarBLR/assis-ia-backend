# assis-ia-backend

Backend em Node.js com Fastify, Prisma, BullMQ/Redis, OCR (Tesseract) e integrações com OpenAI/Stripe.

## O que preciso fazer para rodar?

### 1) Instalar pré-requisitos
- **Node.js 20+** e npm
- **PostgreSQL** ativo
- **Redis** ativo

> Se quiser subir rápido com Docker (opcional):

```bash
docker run --name assis-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=assis_ia -p 5432:5432 -d postgres:16
docker run --name assis-redis -p 6379:6379 -d redis:7
```

### 2) Configurar variáveis de ambiente

```bash
cp .env.example .env
```

No `.env`, confira principalmente:
- `DATABASE_URL`
- `JWT_SECRET`
- `REDIS_URL`
- `OPENAI_API_KEY`

Também são usadas:
- `STRIPE_SECRET_KEY`
- `FRONTEND_URL`
- `WHATSAPP_VERIFY_TOKEN`
- `PORT`

### 3) Instalar dependências

```bash
npm install
```

### 4) Preparar Prisma

```bash
npx prisma generate
npx prisma migrate dev
```

### 5) Subir a API

```bash
npm run dev
```

API disponível em `http://localhost:3001` (ou valor de `PORT`).

## Checklist de validação rápida

```bash
curl http://localhost:3001/
```

Resposta esperada: JSON com status online.

## Endpoints principais

- `GET /` health básico.
- `POST /register` cria tenant + admin inicial.
- `POST /login` autenticação.
- `GET /api/me` usuário autenticado.
- `POST /api/documents/upload` upload e enfileiramento de processamento.

## Observações importantes

- O endpoint `/api/analytics` hoje depende de consulta Prisma que usa relacionamento de `Document -> Company` não declarado no schema atual; isso pode falhar em runtime até o schema ser ajustado.
- O projeto usa fallback de segredos para desenvolvimento, mas em ambiente real é recomendado definir todas as variáveis sensíveis explicitamente.
