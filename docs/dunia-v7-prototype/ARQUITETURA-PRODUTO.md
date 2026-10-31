# Dúnia Experience OS — Produto proposto

## Visão
**Site de alto impacto** + **CMS de conteúdo** + **mini-sites de eventos** + **gestão de convidados e memórias**.

## Camadas previstas para produção

1. **Institucional:** páginas do salão, espaços, ocasiões, galeria, SEO, contatos e Revista Dúnia.
2. **CMS:** editor de páginas, artigos, galerias, categorias, metadados, mídia e publicação agendada.
3. **Eventos:** cadastro, templates, temas, URL curta exclusiva, convite/QR, RSVP, mapa, cronograma, mensagens e configuração de privacidade.
4. **Guest OS:** convidados, grupos/famílias, limite de acompanhantes, token individual, respostas, eventos de check-in, exportações e permissões de staff.
5. **Memories:** armazenamento autorizado, moderação, publicação temporária, compartilhamento privado, expiração e exclusão.
6. **Comercial:** catálogo de serviços extras, cobrança opcional, pagamentos e relatórios por evento.

## Fluxo operacional sugerido

1. Operador cria um evento no painel e escolhe um template.
2. Sistema gera identificador único e URL do mini-site.
3. Operador importa ou cadastra convidados (com deduplicação).
4. Cada convite recebe token aleatório, QR assinado e link de RSVP.
5. Convidados confirmam, recusam ou solicitam ajuste de acompanhantes.
6. Recepção lê o QR pela câmera; backend valida token/estado e registra entrada em transação atômica.
7. Após o evento, equipe publica galeria autorizada por um prazo.
8. Expiração automatizada retira o álbum, com política de retenção e descarte de dados.

## Modelo de dados mínimo (conceitual)

- `events`: id, slug, owner_id, title, venue, starts_at, status, theme, settings.
- `event_pages`: event_id, content, theme, published_at, version.
- `invitations`: id, event_id, group_id, guest_id, token_hash, max_party_size, status, expires_at.
- `guests`: id, event_id, display_name, contact, privacy_acknowledged_at.
- `rsvp`: invitation_id, response, party_size, message, responded_at.
- `checkins`: invitation_id, timestamp, staff_id, device_id, idempotency_key.
- `gallery_assets`: id, event_id, owner_id, storage_key, moderation_status, published_at, expires_at.
- `blog_posts`: id, slug, title, category_id, body, cover_asset, status, published_at, seo.
- `service_orders`: event_id, sku, price, status, payment_reference.

## Segurança e privacidade

- Não usar nome como credencial de acesso; usar token aleatório não previsível.
- Guardar somente hash de token no servidor; não incluir dados pessoais no QR.
- Rate limiting e logs de auditoria para check-in, RSVP e alteração de convidados.
- Separação de permissões de cliente/organizador/recepção/administrador.
- Restringir acesso à galeria por token/permissão; armazenar fotos em bucket privado.
- Política de consentimento, retenção, direito de exclusão e gestão LGPD.

## Escopo da V6

A V6 é **prova de conceito front-end**: demonstra os fluxos usando `localStorage`, QR offline para códigos fictícios e dados de exemplo. Não substitui infraestrutura de produção.
