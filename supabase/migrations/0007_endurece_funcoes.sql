-- ============================================================================
-- 0007_endurece_funcoes.sql
--
-- Ajustes apontados pelo verificador de segurança do Supabase (Advisors):
--
--   • tocar_updated_at sem search_path fixo: uma função com search_path
--     mutável pode resolver nomes num schema plantado por outro papel.
--   • Funções de gatilho (saneia_*) expostas em /rest/v1/rpc: a 0004 dá
--     EXECUTE em toda função para anon e authenticated. Gatilho não precisa
--     desse privilégio para disparar, então ele é retirado.
--
-- Ficam executáveis de propósito: e_admin, e_super_admin e meu_papel (as
-- policies de RLS as chamam em nome de quem consulta, e elas só respondem
-- sobre o próprio usuário) e registrar_metrica_campanha (contador público).
--
-- Idempotente.
-- ============================================================================

alter function public.tocar_updated_at() set search_path = public;

revoke execute on function public.saneia_depoimento_publico() from public, anon, authenticated;
revoke execute on function public.saneia_lead_publico() from public, anon, authenticated;
