# Avaliação do Repositório `assis-ia-backend`

## Visão geral
O repositório implementa um backend em **Node.js** com **Fastify**, **Prisma**, autenticação JWT, upload de documentos e processamento assíncrono com **BullMQ + Redis**, além de integrações com OpenAI e Stripe.

## Pontos fortes
- Estrutura base funcional para MVP SaaS multi-tenant (`Tenant`, `Company`, `User`) no schema Prisma.
- Uso de `bcrypt` para hash de senha e JWT para autenticação.
- Pipeline assíncrono de processamento de documentos (upload -> fila -> OCR -> IA).
- Separação parcial de responsabilidades em serviços (`billingService`, `analyticsService`, `aiService`, `ocrService`).

## Riscos e lacunas prioritárias

### 1) Segurança
- **Segredo JWT com fallback inseguro hardcoded** em produção potencial.
- CORS totalmente aberto (`origin: '*'`) sem whitelist.
- Endpoint de `register` aberto pode permitir criação irrestrita de tenants/admins.
- Falta de validação robusta de payload (schemas por rota) e limites de upload.

### 2) Domínio e dados
- Upload de documento cria `Document` sem `tenantId`/`companyId` obrigatório no fluxo, dificultando isolamento multi-tenant.
- Campo `type` de `Document` é usado como estado inicial (`PENDING`) e também como classificação de documento (`NF-E`, etc.), misturando conceitos.
- `metadata` extraído por IA não é persistido (comentado no worker), reduzindo valor do pipeline.

### 3) Observabilidade e operação
- Logging predominante por `console.log`/`console.error`, sem correlação por request/job.
- Ausência de healthchecks de dependências (DB, Redis, OpenAI) e de métricas de fila.
- README está desatualizado (menciona Express/Notion como foco principal) em relação ao código atual em Fastify + Prisma + IA.

### 4) Qualidade de código
- `server.js` concentra muitas responsabilidades (rotas, autenticação, upload, webhook, bootstrap), dificultando manutenção e testes.
- Não há suíte de testes automatizados (unitários/integrados/e2e) declarada em scripts.

## Plano recomendado (ordem de execução)

### Sprint 1 (alto impacto / baixo risco)
1. Exigir variáveis obrigatórias em startup (`JWT_SECRET`, `DATABASE_URL`, `REDIS_URL`, `OPENAI_API_KEY`) e falhar rápido.
2. Adicionar validação por schema nas rotas Fastify (`body`, `params`, `response`) e limites de upload.
3. Restringir CORS por ambiente e proteger/limitar endpoint de registro.
4. Atualizar README para refletir arquitetura real e comandos válidos.

### Sprint 2 (consistência de domínio)
1. Separar `Document.status` de `Document.type` no schema.
2. Persistir `companyId` (e idealmente `tenantId` derivado) em todas as operações de documento.
3. Adicionar coluna JSON para `metadata` extraído e versionamento mínimo da classificação.

### Sprint 3 (qualidade e operação)
1. Modularizar servidor por domínio (`auth`, `clients`, `documents`, `analytics`, `webhooks`).
2. Introduzir testes:
   - unitários para serviços
   - integração para rotas autenticadas
   - teste de worker com fila em ambiente isolado
3. Padronizar logging estruturado e instrumentação básica (latência, falhas de job, throughput de fila).

## Nota geral
**6/10** para estágio de MVP técnico: boa base funcional, mas ainda com riscos relevantes de segurança, governança de dados multi-tenant e maturidade operacional.
