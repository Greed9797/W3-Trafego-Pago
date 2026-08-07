# Validação — Autoblog de Tráfego Pago

**Data**: 2026-08-07
**Spec**: `spec.md`
**Implementação validada**: `130932d..HEAD`
**Verificador**: host fallback; subagente/verificador independente não está exposto neste ambiente.

## Resultado

**Gate feature-level: PASS, com uma dívida de lint global preexistente explicitamente isolada.**

As oito tarefas do plano estão concluídas. A feature passou nos testes de domínio, compilação das funções server-side, build de produção, lint dos arquivos alterados, verificação visual desktop/mobile e mutation sensor. O lint global continua retornando dois erros antigos nos dois `button.tsx` duplicados, fora do escopo da feature.

## Critérios de aceitação

| Critério | Evidência | Resultado |
| --- | --- | --- |
| AC-01 | `tests/editorial-calendar.test.ts:5-13` valida 90 slots, 30 datas, primeiro/último dia e cobertura completa de setembro. | ✅ PASS |
| AC-02 | `tests/editorial-calendar.test.ts:16-25` valida três horários e a distribuição `2 evergreen/scheduled + 1 platform-update/draft` por dia. | ✅ PASS |
| AC-03 | `tests/autoblog-cron.test.ts:33-50` valida `401`, corpo de erro e ausência de chamada ao banco sem Bearer. | ✅ PASS |
| AC-04 | `tests/autoblog-cron.test.ts:52-58` valida `503` e `autoblog_not_configured` sem configuração de Supabase. | ✅ PASS |
| AC-05 | `tests/autoblog-domain.test.ts:12-35` valida normalização HTML/XML, descarte de item incompleto e limite de 20 itens. | ✅ PASS |
| AC-06 | `tests/autoblog-cron.test.ts:60-115` valida run único por data e segunda resposta `already_processed`. | ✅ PASS |
| AC-07 | `tests/autoblog-cron.test.ts:97-106` e `117-132` validam `draft`, `platform-update` e URL permitida; `api/cron/autoblog.ts:204-219` persiste `source_url` e `source_collected_at`. | ✅ PASS |
| AC-08 | `tests/autoblog-approval.test.ts:34-59`, `61-97` e `99-121` validam autenticação, `422` e transição controlada para `published`. | ✅ PASS |
| AC-09 | `supabase/migrations/001_autoblog.sql:3-81` contém posts, sinais, runs, keywords, índices, unicidade de `run_date` e RLS público somente para publicados. | ✅ PASS por inspeção de schema; sem teste SQL automatizado |
| AC-10 | `tests/blog-public.test.ts:27-44` valida fallback sem Supabase; `npm run build` passou; `/blog` e artigo foram verificados visualmente em desktop/mobile. | ✅ PASS |
| AC-11 | `src/lib/seo.ts:10-13`, `src/lib/seo.ts:69-138` e `public/sitemap.xml:8-49` mantêm domínio, metadata, `Blog`/`Article` JSON-LD e URLs do blog. | ✅ PASS |

## Comandos executados

| Verificação | Resultado |
| --- | --- |
| `npm run test:autoblog` | ✅ 20 testes, 20 pass, 0 fail |
| `npm run build` | ✅ Passou; apenas warning preexistente de `%VITE_META_PIXEL_ID%` não definido |
| `tsc --ignoreConfig ... api/_lib/autoblog.ts api/cron/autoblog.ts api/admin/autoblog/approve.ts api/blog.ts` | ✅ Passou |
| `eslint` nos arquivos da feature | ✅ Passou |
| `npm run lint` | ⚠️ Falha somente nos erros preexistentes `react-refresh/only-export-components` em `button.tsx:58` e `button.tsx:55` |
| Playwright `/blog` desktop/mobile e `/blog/<slug>` | ✅ Renderização, hierarquia editorial, navegação e artigo verificados |

## Mutation sensor

| Mutação temporária | Teste | Resultado |
| --- | --- | --- |
| Remover o slot diário `platform-update` do calendário | `tests/editorial-calendar.test.ts` | ✅ Mutação morta; teste falhou |
| Alterar o draft do cron para `published` | `tests/autoblog-cron.test.ts` | ✅ Mutação morta; teste falhou |

As mutações foram executadas em cópias temporárias fora do repositório e não alteraram o working tree.

## Segurança e limites conhecidos

- Chaves, tokens e service role não foram adicionados ao repositório.
- Cron e aprovação usam Bearer tokens distintos; posts externos permanecem em `draft`.
- O parser limita itens, aplica timeout e allowlist HTTPS; falhas individuais de feed não interrompem as demais fontes.
- A Google Trends API oficial segue como integração opcional até existir acesso alfa; as pautas fixas são identificadas como `editorial-seed`, não como volume real.
- A migração Supabase foi criada, mas não foi aplicada a um projeto externo nesta validação.
- O LLM é opcional e não foi ativado sem endpoint/chave; o fallback determinístico preserva a fonte.
- A hidratação de artigos remotos e o metadata dinâmico são client-side nesta SPA; SSR/sitemap dinâmico ficam como evolução arquitetural.
- O `404 /api/track` observado no Vite local é o endpoint de tracking existente sem proxy local; não afeta a renderização do blog nem o build.

## Próximos passos operacionais

1. Aplicar `supabase/migrations/001_autoblog.sql` no projeto Supabase escolhido.
2. Configurar na Vercel `SUPABASE_URL`, chaves, `CRON_SECRET` e `AUTOBLOG_ADMIN_TOKEN`.
3. Fazer deploy de produção e executar uma chamada autenticada de smoke test do cron.
4. Revisar e aprovar manualmente os drafts antes de publicar.
5. Se houver acesso à Trends API, conectar o provider real e registrar os sinais em `autoblog_keywords`.
