# assis-ia-backend

Backend em Node.js com Fastify, Prisma, BullMQ/Redis, OCR (Tesseract) e integrações com OpenAI/Stripe.

## O que falta para rodar

Para subir o projeto localmente, você precisa garantir estes pré-requisitos:

1. **Node.js 20+** e npm.
2. **PostgreSQL** rodando e com um banco criado.
3. **Redis** rodando (usado pela fila BullMQ).
4. Arquivo **`.env`** configurado (veja `.env.example`).
5. Dependências instaladas e client Prisma gerado.

## Variáveis de ambiente

Copie o exemplo e ajuste os valores:

```bash
cp .env.example .env
```

Principais variáveis obrigatórias:

- `DATABASE_URL`
- `JWT_SECRET`
- `REDIS_URL`
- `OPENAI_API_KEY`

Variáveis recomendadas para integrações:

- `STRIPE_SECRET_KEY`
- `FRONTEND_URL`
- `WHATSAPP_VERIFY_TOKEN`
- `PORT`

## Setup rápido

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Servidor sobe em `http://localhost:3001` (ou valor de `PORT`).

## Endpoints principais

- `GET /` health básico.
- `POST /register` cria tenant + admin inicial.
- `POST /login` autenticação.
- `GET /api/me` usuário autenticado.
- `POST /api/documents/upload` upload e enfileiramento de processamento.

## Observações importantes

- O endpoint `/api/analytics` hoje depende de consulta Prisma que usa relacionamento de `Document -> Company` não declarado no schema atual; isso pode falhar em runtime até o schema ser ajustado.
- O projeto usa fallback de segredos para desenvolvimento, mas em ambiente real é recomendado definir todas as variáveis sensíveis explicitamente.
