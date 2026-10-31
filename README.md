# Plataforma Base

Template para projetos de **catálogo + pedidos + CRM**, derivado de um sistema
em produção. Serve verticais diferentes (vendas, jurídico) pela configuração,
não por fork de código.

## O que vem pronto

- **Catálogo público** com busca, cards e carrinho
- **Pedido mínimo por item** — piso, não quantidade fixa
- **Envio do pedido ao WhatsApp** já formatado
- **Painel administrativo** com 11 áreas (funil, agenda, campanhas, catálogo,
  preços, analytics, usuários, mídia)
- **Campanhas com página própria** em `/c/{slug}`, com Open Graph e métricas
- **5 níveis de permissão**, aplicados por RLS no banco
- **PWA instalável** no celular para a equipe interna

## Começando um projeto novo

```bash
cp .env.example .env.local   # preencha as variáveis
npm install
npm run dev
```

Depois, aplique o schema: no painel do Supabase, SQL Editor, rode os arquivos
de `supabase/migrations/` em ordem — incluindo a `0006`, que fecha brechas de
segurança e cria os buckets. Para o primeiro acesso ao painel:

```bash
node scripts/criar-super-admin.mjs email@cliente.com.br "Nome Completo"
```

**Colocando um cliente no ar:** siga [docs/NOVO-CLIENTE.md](docs/NOVO-CLIENTE.md).
Pendências e riscos conhecidos: [docs/REVISAO-SEGURANCA.md](docs/REVISAO-SEGURANCA.md).

## Os três arquivos que você edita

| Arquivo | O que controla |
|---|---|
| `.env.local` | Credenciais, marca, cores, contato |
| `src/config/brand.ts` | Identidade e vocabulário da vertical |
| `src/config/lead-fields.ts` | Perguntas de qualificação e pontos do score |

Se precisar usar `grep` para achar o nome do cliente no código, algo escapou
desses três lugares e deve voltar para lá.

## Verticais

`NEXT_PUBLIC_VERTICAL` aceita `catalogo`, `juridico` ou `generico`. Ela troca o
vocabulário da interface (produto/serviço, pedido/caso) e o conjunto de
perguntas de qualificação, sem renomear nada no banco.

## Banco de dados

Postgres, hoje através do Supabase — que entrega banco, autenticação e
armazenamento de arquivos no mesmo provedor.

Nenhum componente conversa com o banco diretamente: tudo passa pelos
repositórios em `src/lib/db/`. Trocar para um Postgres próprio no futuro
significa reescrever essa pasta, e só ela.

### Plano gratuito: projeto não pausa

O Supabase gratuito pausa o projeto após 7 dias sem atividade. A rota
`/api/keep-alive` faz uma consulta real ao banco, e o `vercel.json` a chama
uma vez por dia — cada deploy na Vercel ganha esse cron sozinho, usando o banco
do próprio cliente. Defina `CRON_SECRET` nas variáveis do projeto.

Fora da Vercel, agende uma chamada diária a `https://<site>/api/keep-alive`
com o cabeçalho `Authorization: Bearer <CRON_SECRET>` (cron-job.org, GitHub
Actions ou o agendador da hospedagem).

## Estrutura

```
src/
  app/              rotas (site público, /admin, /c/[slug], APIs)
  components/
    home/           seções da página pública
    admin/          painel
    ui/             primitivos
  config/           brand.ts e lead-fields.ts  ← edite aqui
  lib/db/           repositórios (única camada que fala com o banco)
  types/            tipos da aplicação e do schema
supabase/migrations/  SQL do schema e das policies
```
