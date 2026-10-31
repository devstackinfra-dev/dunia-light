# Revisão de segurança e operação — outubro de 2026

Revisão do template antes do primeiro cliente jurídico. Cobre banco (RLS,
grants, storage), rotas de API, sessão, cache (navegador, PWA, CDN),
dependências e riscos operacionais.

**Legenda de severidade**
- **Crítica:** expõe dados ou dá controle a terceiros
- **Alta:** risco real de incidente ou de quebra em produção
- **Média:** abuso possível ou risco operacional relevante
- **Baixa:** higiene

---

## Corrigido nesta revisão

| # | Sev. | Problema | Correção |
|---|---|---|---|
| C1 | Crítica | **Documentos de leads em bucket público.** Comprovantes de consulta de CPF e outros anexos iam para o bucket `products`, com URL pública e permanente. Vazamento de dado pessoal sensível (LGPD). | Bucket privado `lead-docs` (migration 0006). O upload retorna `/api/lead-docs?path=…`, que exige sessão de admin e redireciona para URL assinada de 60 s. |
| C2 | Crítica | **Visitante publicava depoimento sem moderação** enviando `approved: true` direto na API do Supabase. | Policy e trigger forçam `approved = false` para quem não é admin, com limite de tamanho. |
| C3 | Crítica | **Gerente criava super_admin** pela rota `/api/usuarios/criar` (escalada de privilégio). | Papel validado contra a lista; gerente só cria `vendedor` e `marketing`. |
| C4 | Crítica | **Script com super_admin de senha fixa** (`Admin123456!`) no repositório; rodado no banco de um cliente, vira porta dos fundos com senha pública. | Substituído por `scripts/criar-super-admin.mjs`: exige e-mail, gera senha aleatória e nunca redefine senha existente. |
| C5 | Crítica | **Next.js 14.2.3** com falhas conhecidas, incluindo desvio de autorização no middleware que protege o `/admin`. | Atualizado para **14.2.35**, última da linha 14. |
| A1 | Alta | **Insert público em leads gravava qualquer coluna:** etapa do funil, responsável, score, aprovação de crédito, e textos sem limite. | Trigger zera os campos internos para quem não é admin e limita os tamanhos. |
| A2 | Alta | **Domínio do Supabase do cliente original fixo** no `next.config.mjs`: imagens do hero de um cliente novo quebrariam. | Host lido de `NEXT_PUBLIC_SUPABASE_URL`, restrito a `/storage/v1/object/public/**`. |
| A3 | Alta | **`/cadastro` publicava o formulário de taxista do projeto original** (CNH etc.) no site de qualquer cliente. | Vira redirecionamento ao formulário de contato, preservando só os parâmetros de campanha. |
| A4 | Alta | **Buckets não eram criados por migration;** a configuração dependia de memória. | Migration 0006 cria os quatro buckets com limite de tamanho e tipos permitidos. |
| A5 | Alta | **Sessão em localStorage, três checagens de login e await dentro do `onAuthStateChange`** (travamento). | Feito antes desta revisão: cookies com `@supabase/ssr`, middleware e `AuthContext` único. |
| M1 | Média | **Chave mestra aceita também como `NEXT_PUBLIC_SUPABASE_service_role_key`**, incentivando configuração que expõe a chave. | Só `SUPABASE_SERVICE_ROLE_KEY` é lida. |
| M2 | Média | **Senha temporária gerada com `Math.random`** (previsível). | `crypto.randomBytes`. |
| M3 | Média | **Upload aceitava SVG** (pode carregar script) **e arquivo sem tipo** passava sem checagem. | SVG fora da rota; tipo vazio recusado; documento de lead nunca sobrescreve outro. |
| M4 | Média | **Tabela `drivers` (legado) aceitava insert anônimo.** | Insert anônimo revogado. |
| M5 | Média | **Site sem cabeçalhos de segurança.** | `nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS, `frame-ancestors 'none'` e sem `X-Powered-By`; `/admin` com `Cache-Control: private, no-store`. |
| M6 | Média | **Formulário de contato sem barreira a robôs.** | Campo-isca invisível, mais os limites de tamanho do banco (A1). |
| B1 | Baixa | **Cache do service worker:** regra de cache do Firebase obsoleta; dados do Supabase sem regra explícita. | Supabase REST, auth e URLs assinadas como `NetworkOnly`: dado de lead nunca fica no aparelho. |
| B2 | Baixa | **Dependências sem uso:** `firebase-admin` e `undici`. | Removidas. |
| B3 | Baixa | **Chave de cache do painel diferente da do site** (`landing_settings`). | Alinhada para `landing_settings_v2`. |
| B4 | Baixa | **Avisos do Security Advisor:** `tocar_updated_at` sem `search_path` fixo e funções de gatilho expostas em `/rest/v1/rpc`. | Migration 0007. |
| P1 | Alta | **Conteúdo da home igual para todos os clientes da vertical.** | Resolvido: textos e perfil do profissional em `app_settings.conteudo_site`, editáveis no painel (com verificador da OAB) ou pelo `scripts/importar-conteudo.mjs`; o padrão da vertical só preenche o que faltar. |
| P1b | Média | **Afirmações fixas na home de todo cliente:** fotos de banco de imagens na seção Sobre como se fossem o escritório, plaqueta "atendimento exclusivo com hora marcada" e selo "Advocacia de Referência" no retrato (autoelogio, art. 3º IV do Provimento). | Removidos: a seção Sobre só mostra foto real do cliente; o retrato não tem selo. |
| P1c | Baixa | **Cores fixas em hexadecimal** em componentes da home ignoravam o tema do cliente. | Trocadas pelos tokens `marca-*`. |

### Validado no banco modelo-base (`plataforma-juridica-dev`, 26/10/2026)
Migrations de 0001 a 0007 aplicadas. Os testes foram feitos com o papel `anon`, o mesmo da chave pública:
- **Depoimento** enviado com `approved: true` foi gravado como `false`, e o visitante não consegue aprová-lo por update.
- **Lead** enviado com id, status, aprovação, crédito e score forjados foi gravado com id novo, `status = new` e tudo `pending`.
- **Lead com texto acima do limite** e **insert em `drivers`** foram recusados.
- **Visitante** enxerga 0 leads, 0 admins e 0 depoimentos não aprovados.
- **Função de gatilho** chamada direto pela API foi recusada.

### Verificados e sem problema
- **RLS:** ligado nas 14 tabelas. Leitura de leads, interações, documentos e agenda só para admin ativo.
- **Realtime:** respeita o RLS; visitante anônimo não recebe eventos de leads.
- **Rotas de API:** `/api/media`, `/api/usuarios/*` e `/api/lead-docs` validam o token no Supabase Auth e o perfil ativo a cada chamada.
- **Vazamento de memória:** os `setInterval` e as assinaturas realtime do painel e da home são desfeitos na desmontagem; nenhum listener órfão encontrado.
- **localStorage:** guarda só conteúdo público (slides, textos da landing) e a origem de campanha; nenhum dado de lead ou de sessão.
- **XSS:** nenhum `dangerouslySetInnerHTML`; o conteúdo do banco é renderizado como texto pelo React.

---

### Atendimento jurídico (migration 0008, portado do mvp_guilhermeHoluboski)
| # | Sev. | Problema | Correção |
|---|---|---|---|
| A6 | Alta | **Histórico do lead não era salvo.** Mudanças de etapa, decisões e notas iam para `updateLead`, que ignorava `interactions`; tudo sumia ao recarregar. | `updateLead` grava as entradas novas em `lead_interactions`. |
| A7 | Alta | **Lead gravado direto do navegador**, sem consentimento nem limite de envio. | Rota `/api/leads`: validação, consentimento obrigatório (data, versão da política, origem), limite por telefone e por IP, insert pelo servidor. O insert anônimo foi revogado. |
| M7 | Média | **Coluna `custom_fields` e categorias `documento` e `identidade` usadas pelo código, mas inexistentes no banco.** | Criadas na 0008. |
| — | — | Relato original e consentimento podiam ser alterados. | Trigger no banco os torna imutáveis. |

### Trilha de auditoria (migration 0009)
Gatilhos no banco registram em `audit_log` cada criação, alteração e exclusão em leads, documentos, agenda, usuários do painel, áreas, campanhas, slides, configurações, depoimentos e catálogo. Cada registro diz **quem, quando, onde e quais campos mudaram**, mas **nunca os valores**, para não duplicar dados de clientes. Mudanças só de data ou de contadores públicos não geram registro. Ninguém edita nem apaga o log; só o super admin o lê, em Configurações. Validado no modelo-base: os registros saem com autor e campos, nenhum valor é copiado, e um usuário comum não lê nem apaga.

### Compliance publicitário (Provimento 205/2021)
Verificador de vedações portado do mvp (`src/lib/compliance.ts`): percentual de êxito, promessa de resultado, gratuidade e desconto, "especialista", superlativos, urgência, caso concreto, prova social, estrutura, ostentação e métricas comerciais. Ele roda no painel ao salvar **áreas, textos do hero, banner e landing pages de campanha**. O padrão é avisar e pedir confirmação; com `NEXT_PUBLIC_COMPLIANCE_BLOQUEIO=true`, uma vedação grave impede salvar. `npm run test:compliance` confere a calibragem das regras e os textos padrão do site; na primeira execução, ele achou e levou à correção de dois "garantido" no template.

Validado no modelo-base: o visitante não grava lead direto; a rota não consegue forjar etapa ou tags; relato e consentimento não aceitam edição; área oculta não aparece para o visitante.

## Pendências (não corrigidas)

| # | Sev. | Pendência | Recomendação |
|---|---|---|---|
| P2 | **Alta** | **Next.js 14 fora de suporte.** Avisos restantes do `npm audit` (DoS, smuggling em rewrites, cache de imagem) só se resolvem no Next 15+. Na Vercel o risco é menor, porque a otimização de imagem e a borda são dela. | Planejar a migração para o Next 15. Mudança grande: `cookies()` assíncrono, cache padrão alterado, `next-pwa` 10.2.6. |
| P3 | **Alta** | **Painel ainda com a cara do projeto de táxi:** aba Frota, tabela `drivers`, campos de CNH/Condutax na ficha do lead, análise de crédito, categorias `cnh`/`condutax` nos documentos. Confunde o cliente e coleta dado sem finalidade (LGPD). | Esconder por vertical (aba Frota, crédito) e limpar o formulário da ficha para o jurídico. |
| P4 | **Alta** | **Sem página de política de privacidade.** O site capta nome, telefone e relato do caso. | Criar a página institucional `/privacidade` com o texto do cliente e linkar no formulário e no rodapé antes do go-live. |
| P5 | Média | **Leads já passam por rota de servidor com limite (0008), mas sem captcha;** depoimentos ainda entram direto do navegador. O limite por IP vale por instância do servidor. | Cloudflare Turnstile no formulário de contato e rota de servidor também para depoimentos. |
| P6 | Média | **`app_settings` tem leitura pública,** e o painel grava ali `role_permissions` e `calendar_events` (campanhas). Hoje sem dado sensível. | Regra: nada sensível em `app_settings`. Se precisar, criar uma tabela com RLS de admin. |
| P7 | Média | **Migrations aplicadas à mão em cada cliente:** risco de um cliente ficar para trás. | Planilha de controle (ver passo a passo) e, mais adiante, Supabase CLI com `db push` por projeto. |
| P8 | Média | **Supabase gratuito sem backup restaurável.** | Exportação periódica com `pg_dump`; recomendar o plano pago ao cliente. |
| P9 | Média | **SMTP padrão do Supabase com limite muito baixo:** o "Esqueci minha senha" falha. | SMTP próprio por cliente (passo a passo, seção 2.4). |
| P10 | Baixa | **Métricas públicas infláveis** (visualizações e cliques de slides e campanhas por função pública). O contador do banner tenta gravar em `app_settings` como visitante e falha. | Aceitável para métrica de marketing; corrigir o contador do banner com uma função como a de campanhas. |
| P11 | Baixa | **Senha temporária de novos usuários exibida na tela** do criador. | Trocar por convite por e-mail (`inviteUserByEmail`) quando o SMTP estiver configurado. |
| P12 | Baixa | **Bucket `logos` aceita SVG** por upload direto do painel (somente admin). Servido pelo domínio do Supabase, não pelo do site. | Remover SVG do bucket se não for usado. |
