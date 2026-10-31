# DÚNIA EXPERIENCE OS — ARQUITETURA DE REFERÊNCIA V1.0
**Data:** 30/10/2026 · **Status:** proposta técnica para validação · **Escopo:** plataforma white-label multi-salão

## 1. Decisão central
O produto tem **três níveis de gestão**, e não dois bancos isolados: (A) administração da plataforma SaaS (operadora), (B) painel do salão/tenant (Dúnia e futuros clientes), (C) painel dos organizadores/casal por evento. O visitante usa o mini-site público; a equipe de recepção usa acesso operacional mínimo. O Dúnia é o tenant-piloto e referência de design, não uma regra fixa do código.

## 2. Papéis e fronteiras
| Papel | Escopo | Ações permitidas |
|---|---|---|
| PLATFORM_ADMIN | Todos os tenants | planos, onboarding, templates, observabilidade e suporte auditado |
| VENUE_OWNER / VENUE_MANAGER | Um salão | eventos, produtos, operadores, cobranças e configuração de marca |
| EVENT_OWNER / EVENT_EDITOR | Um evento | mini-site, conteúdo, convidados, RSVP, álbum e convites |
| CHECKIN_STAFF | Um evento | consultar convites e registrar check-in, sem exportar dados gerais |
| GUEST | Convite individual | responder RSVP e consultar apenas seus dados e conteúdo autorizado |
O backend deve validar `tenant_id` e `event_id` em todas as consultas, independentemente do que o frontend enviar. Um casal não vê dados comerciais do salão; o salão não precisa editar mensagens pessoais sem autorização contratual.

## 3. Arquitetura recomendada: monólito modular + workers
**Não iniciar com múltiplos microserviços implantados separadamente.** Em KVM 2/4, o custo de operação, observabilidade e comunicação entre serviços superaria o benefício no MVP. Criar módulos de domínio com fronteiras estáveis e eventos assíncronos, extraíveis no futuro:
- `identity` (login, convites de acesso, MFA para administradores, RBAC);
- `tenancy` (salões, marca, domínios, assinaturas e limites);
- `cms` (institucional, blog, mídia, SEO e publicação);
- `events` (ciclo de vida, templates, páginas, slugs e publicação);
- `guests` (grupos, convites, RSVP, acompanhantes, importação);
- `checkin` (validação atômica, idempotência e histórico);
- `memories` (mídia, moderação, privacidade e expiração);
- `billing` (catálogo, contratação, cobrança e reconciliação);
- `notifications` (fila de e-mail/WhatsApp via fornecedores aprovados);
- `audit` (trilha imutável de operações sensíveis).
Uma aplicação web (Next.js/React ou equivalente), API de domínio, PostgreSQL, Redis + worker, armazenamento S3 compatível e proxy TLS. Monorepo sugerido: `apps/web`, `apps/worker`, `packages/domain`, `packages/db`, `packages/ui`, `infra/`.

## 4. Fluxo de provisionamento de mini-site
1. Gestor do salão cria `event` em `DRAFT`, seleciona plano, template e responsáveis.
2. API valida limites do tenant e gera slug exclusivo por tenant; transação cria evento, página versionada, configurações e `event_memberships`.
3. Outbox registra `EventProvisioned`; worker prepara thumbnails, capa e recursos assíncronos; falhas são retentáveis.
4. Convite de acesso ao casal usa token de uso único e expiração; nunca senha compartilhada.
5. Casal preenche o conteúdo; editor salva rascunhos e publica uma versão imutável.
6. Rota pública resolve `tenant + slug` ou domínio personalizado, com cache invalidado por publicação.
7. Após o evento, política de retenção muda a página para álbum, arquiva ou expira conforme contrato.
**Importante:** criar um evento não exige criar novo repositório, container, banco ou deployment. O mini-site é uma instância de dados de template renderizada por uma aplicação compartilhada.

## 5. Fluxos operacionais
**RSVP:** convite possui token aleatório de alta entropia; armazenar somente hash; convite pertence a grupo/família, com máximo de acompanhantes e regras de edição. Transação grava resposta e `rsvp_history`, atualiza projeção de contagens; reenvio é idempotente.
**QR e check-in:** QR aponta a URL de validação com token opaco, não nome/telefone; leitor envia a credencial ao servidor, que verifica evento, validade, revogação e estado, faz `INSERT` com chave única por convite/entrada e retorna sucesso ou duplicidade. Definir regras de reentrada e contingência offline com sincronização segura antes da produção.
**Galeria:** upload direto para storage privado via URL assinada, verificação de tipo/tamanho, antivírus/varredura quando aplicável, processamento assíncrono de variantes, moderação e publicação por prazo. Exclusão/expiração deve ser auditável.
**Blog:** fluxo rascunho → revisão → agendamento → publicação, com metadados SEO, sitemap e redirecionamentos; artigos são do tenant.

## 6. Dados principais (PostgreSQL)
`tenants(id, slug, brand, status)`; `tenant_memberships(tenant_id, user_id, role)`; `venues(tenant_id, ...)`; `events(id, tenant_id, slug, starts_at, status, plan_id)`; `event_memberships(event_id,user_id,role)`; `event_pages(event_id, version, draft_json, published_json, published_at)`; `templates(id, version, schema_json)`; `guest_groups(id,event_id,max_seats)`; `guests(id,event_id,group_id,...)`; `invitations(id,event_id,group_id,token_hash,expires_at,revoked_at)`; `rsvps(id,invitation_id,status,seats,responded_at)`; `checkins(id,event_id,invitation_id,idempotency_key,staff_id,at)`; `media_assets(id,tenant_id,event_id,storage_key,visibility,expires_at)`; `posts(id,tenant_id,slug,status,...)`; `orders(id,tenant_id,event_id,sku,amount,status)`; `audit_logs(id,actor_id,tenant_id,event_id,action,at,metadata)`; `outbox_events(...)`.
Chaves únicas: `(tenant_id, slug)` para eventos e posts; `(event_id, idempotency_key)` para check-in; FKs compostas ou validação rigorosa contra referências cruzadas. Índices por `tenant_id`, `event_id`, data e status. Testes automatizados de isolamento entre tenants são bloqueadores de release.

## 7. Hospedagem Hostinger
Consulta à página oficial em 30/10/2026:
| Plano | vCPU | RAM | NVMe | Transferência |
| KVM 2 | 2 | 8 GB | 100 GB | 8 TB |
| KVM 4 | 4 | 16 GB | 200 GB | 16 TB |
**Não é apenas RAM:** CPU, disco e transferência também dobram. Fonte: https://www.hostinger.com/br/servidor-vps
**Recomendação:** KVM 2 para piloto controlado e monitorado; KVM 4 para maior folga em produção com vários salões, workers e picos de RSVP. Capacidade real depende de testes de carga e uso de mídia, não de um número arbitrário de eventos.
Topologia inicial: Docker Compose/Coolify, proxy Caddy/Traefik, app web, worker, Redis e PostgreSQL com volume persistente. Preferir mídia em object storage externo e CDN, não guardar álbuns em disco local. Backups **externos e restaurados em teste**; snapshots da VPS não substituem backup de banco. HTTPS, firewall, atualizações, monitoramento de CPU/RAM/disco, alertas e logs centralizados.
Evolução: banco gerenciado ou VPS dedicada de dados, workers separados, filas gerenciadas e CDN conforme métricas. Evitar Kubernetes prematuro.

## 8. Performance e experiência visual
A sensação de travamento da V6 pode vir de múltiplas operações por frame, imagens pesadas e área de película com largura recalculada. V7 usa amortecimento via `requestAnimationFrame`, mas isso é apenas melhoria de protótipo, não prova de desempenho.
Na produção: usar `IntersectionObserver` para ativar cenas; calcular dimensões no resize (não a cada scroll); animações restritas a `transform` e `opacity`; imagens AVIF/WebP responsivas, `srcset`, preload da imagem LCP, lazy-load abaixo da dobra; limitar efeitos em mobile; `prefers-reduced-motion`; fallback sem JS. Metas iniciais: LCP <= 2,5 s, INP <= 200 ms, CLS <= 0,1 no p75 de usuários reais. Validar em dispositivos modestos.

## 9. Segurança, LGPD e governança
Dados de convidados são pessoais. Definir bases legais e papéis controlador/operador por contrato, aviso de privacidade, minimização, retenção por tipo de dado, direitos do titular e processo de incidentes. Autenticação robusta, cookies seguros, CSRF, rate limit, logs de auditoria, criptografia em trânsito e em repouso, MFA para gestores e isolamento por tenant. Não usar localStorage para credenciais ou dados reais de produção. Acesso ao álbum por autorização; não tornar links previsíveis.

## 10. Fases e critérios de aceite
**Fase 0 — descoberta:** mapear o projeto semelhante já existente, contratos, fluxo real do salão e requisitos LGPD; medir dispositivos-alvo e definir MVP.
**Fase 1 — núcleo:** login e RBAC, tenants, painel salão, evento, template, mini-site, painel casal, publicação e blog.
**Fase 2 — convidados:** convites, grupos, RSVP, CSV, QR, check-in idempotente, testes de concorrência e auditoria.
**Fase 3 — monetização:** catálogo, pedidos, pagamentos, expiração de plano e métricas.
**Fase 4 — memórias:** upload privado, moderação, galeria temporária e descarte automatizado.
**Fase 5 — white-label:** onboarding self-service de outros salões, marca, domínios, limites, cobrança recorrente e métricas por tenant.
Gate para produção: isolamento de tenant validado, backup restaurável, fluxo de QR seguro, testes de carga, observabilidade e revisão jurídica/LGPD.

## 11. O que a V7 realmente demonstra
`admin.html`: painel Dúnia com inventário, criação de evento, catálogo e simulação financeira. `index.html#/painel`: painel do casal com convidados, editor, RSVP, check-in e álbum. `index.html#/evento`: mini-site público demonstrativo. O armazenamento local permite alternar eventos no **mesmo navegador**; não há autenticação, backend, domínio real por evento, isolamento de segurança, cobrança ou sincronização entre dispositivos. Não inserir dados pessoais reais na demo.
