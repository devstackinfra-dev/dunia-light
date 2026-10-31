# Passo a passo — novo cliente

Roteiro para colocar no ar o site de um novo cliente (ex.: escritório de
advocacia) com segurança. Siga na ordem e marque cada item. Um item pulado na
seção de segurança pode expor dados de clientes do cliente — que é exatamente o
que a LGPD e o sigilo profissional proíbem.

> **Antes de tudo:** teste qualquer mudança no projeto **modelo-base** (Supabase
> de desenvolvimento) antes de enviar para a branch que os clientes usam. Um
> push na `master` publica em **todos** os clientes de uma vez.

---

## 0. Quem é responsável pelo quê

| Item | Responsável | Observação |
|---|---|---|
| Conta e projeto no Supabase | **Cliente** (conta no nome dele) | Você entra como membro convidado da organização |
| Plano do Supabase (gratuito ou pago) | **Cliente** | Pausa, limites e custo do plano pago constam do contrato |
| Conta na Vercel e domínio | Definir em contrato | Uso comercial exige Vercel **Pro** |
| Código, deploy, migrations | Você | |
| Conteúdo do site e conformidade com a OAB | **Cliente** | Você implementa; o cliente aprova os textos |
| Política de privacidade (LGPD) | **Cliente** (texto) | O site precisa publicar uma antes de captar contatos |

Ative **verificação em duas etapas** em todas as contas envolvidas: GitHub,
Supabase, Vercel e registrador do domínio — as suas e as do cliente.

---

## 1. Coletar com o cliente

- [ ] Nome do escritório, razão social, número da OAB (aparece no rodapé, se desejado)
- [ ] WhatsApp (com DDI), telefone, e-mail e endereço públicos
- [ ] Logo (PNG com fundo transparente, ~400 px de largura) e cores da marca
- [ ] Domínio (ex.: `silvaadvocacia.com.br`) e acesso ao DNS
- [ ] Áreas de atuação e textos que ele quer na home (ver seção 7)
- [ ] Texto da política de privacidade (ou modelo aprovado por ele)
- [ ] E-mail de quem será o **super admin** do painel

---

## 2. Supabase (na conta do cliente)

### 2.1 Criar o projeto
- [ ] Organização na conta do cliente; convide você como **Developer** (não Owner)
- [ ] Nome do projeto: `<cliente>-producao` (ex.: `silva-advocacia-producao`)
- [ ] Região: **South America (São Paulo)** — em *Need a specific region?*
- [ ] Senha do banco: gerada, guardada no gerenciador de senhas do cliente
- [ ] *Security*: deixe **Enable Data API** e **Enable automatic RLS** marcados

### 2.2 Aplicar o schema
No **SQL Editor**, rode **cada arquivo** de `supabase/migrations/`, **em ordem**,
um por vez, conferindo que terminou sem erro:

- [ ] `0001_schema_inicial.sql`
- [ ] `0002_campos_complementares_lead.sql`
- [ ] `0003_grants.sql`
- [ ] `0004_grants_completos.sql`
- [ ] `0005_campaign_sections.sql`
- [ ] `0006_seguranca_inserts_publicos_e_storage.sql` ← **obrigatória** (fecha brechas e cria os buckets)
- [ ] `0007_endurece_funcoes.sql`
- [ ] `0008_leads_juridicos_e_areas.sql` ← áreas de atuação, funil jurídico e LGPD no lead
- [ ] `0009_trilha_de_auditoria.sql` ← registro imutável de quem alterou o quê
- [ ] `0010_blog.sql` ← publicações (blog)

Anote em uma planilha de clientes **qual a última migration aplicada** em cada
projeto. Migration nova no repositório precisa ser rodada à mão em cada cliente.

### 2.3 Conferir a segurança do banco
Rode no SQL Editor e confira o resultado:

```sql
-- Toda tabela do schema public precisa ter RLS ligado (rls = true)
select tablename, rowsecurity as rls
from pg_tables where schemaname = 'public' order by 1;

-- Buckets: só lead-docs é privado (public = false)
select id, public from storage.buckets order by 1;
```

- [ ] Todas as tabelas com `rls = true`
- [ ] `lead-docs` com `public = false`; `products`, `banners`, `logos` com `true`
- [ ] **Advisors → Security Advisor:** os únicos avisos aceitos são "SECURITY DEFINER
      Function executable" para `e_admin`, `e_super_admin`, `meu_papel` (usadas
      pelas policies de RLS), `registrar_metrica_campanha` (contador público) e
      `rls_auto_enable` (do próprio Supabase). Qualquer outro aviso: investigar
      antes de seguir.

### 2.4 Autenticação (Authentication)
- [ ] **Sign In / Providers → Email:** desligue **Allow new users to sign up**.
      Contas são criadas só pelo painel (super admin) — cadastro aberto deixaria
      qualquer pessoa criar login no projeto.
- [ ] **Confirm email** ligado
- [ ] **URL Configuration → Site URL:** `https://dominio-do-cliente.com.br`
- [ ] **Redirect URLs:** adicione `https://dominio-do-cliente.com.br/definir-senha`
      (e a URL `*.vercel.app` do projeto, para testes)
- [ ] **Senhas:** mínimo de 8 caracteres, exigindo letras e números
- [ ] **Leaked password protection** ligado (recusa senhas que já vazaram na internet)
- [ ] **SMTP próprio (Emails → SMTP Settings):** o envio padrão do Supabase tem
      limite baixíssimo de e-mails por hora e não é para produção — sem SMTP, o
      "Esqueci minha senha" falha. Use um provedor transacional (Resend, Brevo,
      Amazon SES) com remetente do domínio do cliente.
- [ ] **Emails → Templates:** traduza "Reset password" e "Invite user" para português

### 2.5 Chaves
Em **Project Settings → API**, copie para o gerenciador de senhas:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` / `publishable` → `NEXT_PUBLIC_SUPABASE_ANON_KEY` (pública por natureza)
- `service_role` / `secret` → `SUPABASE_SERVICE_ROLE_KEY` (**segredo máximo**:
  ignora todo o RLS; nunca em código, print, e-mail ou chat)

### 2.6 Backup
O plano gratuito **não inclui backup restaurável**. Até o cliente migrar para o
pago, faça exportação periódica (ex.: mensal) com `pg_dump` usando a string de
conexão do projeto e guarde em local do cliente. Registre isso no contrato.

---

## 3. Primeiro acesso ao painel (super admin)

Com o `.env.local` apontando **para o projeto do cliente**:

```bash
node scripts/criar-super-admin.mjs email@cliente.com.br "Nome do Responsável"
```

- [ ] O script mostra o host do projeto — confira que é o do cliente
- [ ] Entregue a senha temporária por canal seguro (não por e-mail aberto)
- [ ] Peça ao cliente para trocar a senha no primeiro acesso ("Esqueci minha senha")
- [ ] Depois de usar, **volte o `.env.local` para o projeto modelo-base** ou apague-o

Demais usuários são criados pelo próprio painel, aba **Usuários**.
Gerente só cria vendedor e marketing; papéis acima só o super admin.

---

## 4. Vercel

- [ ] **Add New → Project →** importe `devstackinfra-dev/plataforma-base`
- [ ] Nome do projeto: o do cliente (ex.: `silva-advocacia`)
- [ ] **Production Branch:** `master`
- [ ] Plano **Pro** na conta que vai hospedar (Hobby não permite uso comercial)
- [ ] **Environment Variables** (Production e Preview):

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto do cliente |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | chave anon do cliente |
| `SUPABASE_SERVICE_ROLE_KEY` | chave service_role — marque como **Sensitive** |
| `CRON_SECRET` | aleatório: `openssl rand -hex 32` — **Sensitive** |
| `NEXT_PUBLIC_VERTICAL` | `juridico` |
| `NEXT_PUBLIC_COMPLIANCE_BLOQUEIO` | `false` (avisa e pede confirmação) ou `true` (vedação grave impede salvar). Decisão do cliente; registre qual foi |
| `NEXT_PUBLIC_BRAND_NAME` | nome curto do escritório |
| `NEXT_PUBLIC_BRAND_LEGAL_NAME` | razão social |
| `NEXT_PUBLIC_BRAND_TAGLINE` | frase curta (opcional) |
| `NEXT_PUBLIC_BRAND_DESCRIPTION` | descrição para Google e compartilhamento |
| `NEXT_PUBLIC_SITE_URL` | `https://dominio-do-cliente.com.br` (sem barra no fim) |
| `NEXT_PUBLIC_CONTACT_WHATSAPP` | só dígitos com DDI: `5511999999999` |
| `NEXT_PUBLIC_CONTACT_EMAIL` / `_PHONE` / `_ADDRESS` | contatos públicos |
| `NEXT_PUBLIC_BRAND_LOGO` | URL do logo no bucket `logos` do Supabase do cliente |
| `NEXT_PUBLIC_THEME_*` | cores, se diferentes do padrão |
| `NEXT_PUBLIC_SOCIAL_*` | redes sociais (vazio oculta o ícone) |

- [ ] **Nunca** crie variável com `SERVICE_ROLE` ou `SECRET` começando por `NEXT_PUBLIC_`
      — o Next.js embute essas no código que vai para o navegador.
- [ ] Deploy. Depois, em **Settings → Cron Jobs**, confira o `/api/keep-alive` diário.

---

## 5. Domínio

- [ ] **Vercel → Settings → Domains:** adicione o domínio e o `www`
- [ ] Configure o DNS conforme a Vercel indicar; HTTPS é automático
- [ ] Redirecione `www` → domínio principal (ou o inverso), nunca os dois servindo
- [ ] Volte ao Supabase e confirme a Site URL e as Redirect URLs com o domínio final

---

## 6. Logo e imagens

- [ ] Faça login no painel → **Configurações** → central de mídia → envie o logo em **Logos**
- [ ] Copie a URL pública e coloque em `NEXT_PUBLIC_BRAND_LOGO` na Vercel → redeploy
- [ ] Banners do hero: painel → **Landing Page** → slides (opcional; sem slide,
      vale o texto padrão da vertical)

---

## 7. Conteúdo da home

- [ ] **Áreas de atuação:** painel → **Áreas de atuação** → **Carregar áreas
      padrão** e edite com o cliente: nome, resumo, situações comuns, serviços
      e contexto. Desative as que o escritório não atende. São elas que
      aparecem no site e no seletor do formulário de contato.

- [ ] **Textos do site:** painel → **Página Inicial → Textos do site**. Hero,
      Sobre, diferenciais, chamada, FAQ, contato, rodapé e quais seções aparecem
      ficam no banco do cliente (`app_settings` → `conteudo_site`). O que ficar
      em branco usa o padrão da vertical (`src/config/home-content.ts`).
- [ ] **Página do profissional:** no mesmo editor, bloco **Profissional**. Ativo,
      ela ganha o endereço do próprio nome (ex.: `/samantha-louzeiro`) e um item
      no menu, com biografia, formação, atuação, links e as publicações que ela
      assina no blog. Desativado, o endereço devolve 404.

Para levar o conteúdo de um site antigo de uma vez, monte
`clientes/<cliente>/conteudo.json` (pasta fora do Git: conteúdo do cliente vai
para o banco dele, nunca para o repositório) e rode:

```bash
node scripts/importar-conteudo.mjs clientes/<cliente>/conteudo.json
```

Sem `--aplicar` ele só confere os textos contra o Provimento e lista as
vedações. Com `--aplicar` (usa a `SUPABASE_SERVICE_ROLE_KEY` do `.env.local`,
apontado para o banco **do cliente**) grava os textos e as áreas e imprime as
variáveis da Vercel a cadastrar.

Editar `home-content.ts` muda o padrão de **todos** os clientes da vertical —
use para melhorar o modelo, nunca para personalizar um cliente.

> **Cores no `.env.local`:** sempre entre aspas (`NEXT_PUBLIC_THEME_INK="#1F2E4C"`).
> Sem aspas o `#` vira comentário e a cor some sem erro. Na Vercel, sem aspas.

Revise com o cliente, à luz do **Provimento 205/2021 da OAB**: sem promessa de
resultado, sem preço, sem depoimento de cliente, sem captação ostensiva.

O painel ajuda nisso: áreas, textos do site, perfil, publicações, banner e
landing pages de campanha passam por um verificador automático das vedações antes de salvar.
Ele não substitui a leitura da norma pelo advogado — é uma rede de proteção.

Se você mudou textos padrão em `home-content.ts` ou nos componentes da home,
rode antes de enviar:

```bash
npm run test:compliance
```

---

## 8. Testes antes de entregar

Faça em aba anônima, no domínio final:

**Site público**
- [ ] Home carrega com nome, logo, contatos e áreas corretos — nada de outro cliente
- [ ] Botões de WhatsApp abrem a conversa com o número certo
- [ ] Formulário de contato: envio aparece como lead novo no painel, com a área
      escolhida, o relato e o consentimento registrado (aba **Atendimento**)
- [ ] Sem marcar a caixa da política de privacidade, o formulário não envia
- [ ] `/cadastro` leva ao formulário de contato
- [ ] `/areas-de-atuacao` lista as áreas, e cada uma abre a própria página com
      situações, serviços e formulário já com a área escolhida. Áreas editadas
      no painel aparecem nas páginas em até 5 minutos
- [ ] Blog: painel → **Blog / Publicações** → publique um artigo; ele aparece em
      `/blog`, na seção "Publicações" da home e na página da área escolhida.
      Rascunho e data futura (agendado) não aparecem no site. Sem nenhuma
      publicação, a seção some da home
- [ ] `/sitemap.xml` traz as páginas de área e as publicações; envie-o no Google Search Console
      do domínio do cliente
- [ ] No celular: menu, hero e formulário sem cortes nem rolagem lateral

**Painel**
- [ ] `/admin` sem login redireciona para `/login`
- [ ] Login, logout e "Esqueci minha senha" (o e-mail chega e o link funciona)
- [ ] Anexo em ficha de lead abre; copiar o link e abrir em aba anônima **não** mostra o arquivo
- [ ] Usuário gerente não consegue criar super admin

**Segurança (5 minutos, em qualquer terminal)**
Troque `URL` e `ANON` pelos valores do cliente:

```bash
curl -s "URL/rest/v1/leads?select=*" -H "apikey: ANON" -H "Authorization: Bearer ANON"
```
- [ ] Resposta `[]` — visitante anônimo **não** lê leads

```bash
curl -s -X POST "URL/rest/v1/testimonials" -H "apikey: ANON" -H "Authorization: Bearer ANON" -H "Content-Type: application/json" -d '{"name":"teste","testimony":"teste","approved":true}'
```
- [ ] O depoimento entra com `approved = false` (confira na fila do painel e apague)

```bash
curl -s "https://dominio-do-cliente.com.br/api/keep-alive" -H "Authorization: Bearer CRON_SECRET"
```
- [ ] Resposta `{"ok":true,...}`

---

## 9. Depois de entregar

- [ ] Registre na planilha de clientes: projeto Supabase, última migration, projeto Vercel, domínio, data de entrega
- [ ] Combine com o cliente quem recebe alertas da Vercel e do Supabase
- [ ] Revogue acessos temporários que você não precisa manter
- [ ] Agende a exportação de backup (seção 2.6)

### Se uma chave vazar
1. Supabase → **Project Settings → API → JWT Keys / API Keys** → gere novas chaves
   (a `service_role` antiga para de funcionar)
2. Atualize as variáveis na Vercel e faça redeploy
3. Troque o `CRON_SECRET`
4. Verifique em **Authentication → Users** e na tabela `admin_users` se surgiu
   algum usuário que ninguém criou
