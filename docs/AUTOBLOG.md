# Autoblog W3 Tráfego Pago

## O que foi instalado

- `src/lib/editorial-calendar.ts`: roteiro determinístico de setembro de 2026 com 90 slots.
- `supabase/migrations/001_autoblog.sql`: posts, sinais, runs, keywords, índices e RLS.
- `GET /api/cron/autoblog`: coleta diária protegida e idempotente.
- Apify opcional: pesquisa tendências e palavras-chave no Brasil, com rotação de tokens e fallback sem interromper os feeds oficiais.
- `POST /api/admin/autoblog/approve`: aprovação humana protegida de drafts.
- `/admin`: central administrativa protegida com resumo e navegação por módulos.
- `/admin/content`: gestão editorial geral do conteúdo do blog.
- `/admin/autoblog`: módulo AutoBlog para acompanhar programados, drafts e publicados.
- `GET /api/blog`: posts publicados para hidratação do blog, com fallback estático.
- `vercel.json`: cron de produção às 12:00 UTC, equivalente a 09:00 no horário de São Paulo.

## Ativação

1. Crie um projeto Supabase e aplique `supabase/migrations/001_autoblog.sql` no SQL Editor ou pelo fluxo de migrations do projeto.
2. Configure na Vercel, sem colocar valores no Git:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_PUBLIC_KEY`
   - `CRON_SECRET`
   - `AUTOBLOG_ADMIN_TOKEN`
   - `APIFY_API_TOKENS` (opcional; tokens separados por vírgula, somente server-side)
   - `APIFY_ACTOR_ID` (opcional; padrão `apify/google-trends-scraper`)
   - `APIFY_KEYWORDS` (opcional; termos separados por vírgula)
   - `APIFY_RUN_TIMEOUT_SECONDS` (opcional; entre 10 e 50, padrão 40)
3. Faça um deploy de produção. Cron Jobs da Vercel só executam no deployment de produção.
4. Para enriquecer drafts com IA, defina `AUTOBLOG_LLM_ENABLED=true`, endpoint, modelo e chave. Com a opção desligada, o sistema cria um draft determinístico com fonte e checklist de revisão.

Não envie chaves neste chat e não use a service role no frontend.

O painel usa uma sessão HttpOnly, com expiração de oito horas. O token administrativo é enviado apenas no login e não é salvo em `localStorage`. A rota de aprovação continua aceitando Bearer para automações internas, mas a interface usa cookie protegido.

## Fluxo diário

```text
Vercel Cron
  → autoriza CRON_SECRET
  → verifica run_date único em São Paulo
  → consulta Apify Google Trends quando configurado
  → lê feeds oficiais como fonte de confirmação
  → grava keywords em `autoblog_keywords`
  → filtra URL HTTPS/allowlist
  → grava sinal
  → cria 1 platform-update em draft
  → marca run completed
```

Uma execução repetida no mesmo dia retorna `already_processed`. Falhas de feed são registradas por fonte; sem sinal de plataforma verificável, nenhum draft é criado.

O Apify é uma camada de descoberta, não uma fonte de verdade. O Actor `apify/google-trends-scraper` retorna termos e sinais de tendência; somente URLs HTTPS de domínios oficiais permitidos podem gerar um draft de atualização. Se a API estiver indisponível, o cron continua com RSS. Tokens em `APIFY_API_TOKENS` são tentados em rotação apenas para respostas 401, 403 ou 429; os valores nunca aparecem em logs, respostas ou no bundle do navegador.

## Fontes padrão

- [Google Trends — Brasil](https://trends.google.com/trending/rss?geo=BR)
- [Google Ads & Commerce RSS](https://blog.google/products/ads-commerce/rss/)
- [Meta Newsroom RSS](https://about.fb.com/news/feed/)

`AUTOBLOG_FEEDS` pode receber um array JSON com objetos `{ "name": string, "url": string, "kind": "trend" | "platform" }`. Mesmo fontes customizadas passam pela allowlist HTTPS antes de virar update.

A Google Trends API oficial ainda é alfa e de acesso limitado; por isso o calendário identifica seeds como `editorial-seed` e não inventa volume de busca. A fonte oficial deve ser conectada quando houver acesso.

## Aprovar um draft

Depois de consultar o registro no Supabase, aprove somente drafts revisados:

```bash
curl -X POST "https://w3trafegopago.com.br/api/admin/autoblog/approve" \
  -H "Authorization: Bearer $AUTOBLOG_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id":"UUID_DO_DRAFT"}'
```

A rota revalida título, resumo, seções, URL da fonte e status antes de marcar `published`.

## Testes e operação local

```bash
npm run test:autoblog
npm run build
npm run lint
```

O lint global ainda aponta dois erros preexistentes em `button.tsx` relacionados a Fast Refresh. Eles não vêm do autoblog; a checagem TypeScript das funções em `api/` deve ser feita com o comando documentado no histórico da implementação.

## Política editorial

- Dois conteúdos evergreen por dia são pautas programadas.
- O terceiro slot diário é uma análise de mudança em plataforma e permanece em draft.
- O artigo precisa manter a URL da fonte original e separar fato confirmado de interpretação.
- Posts de concorrentes servem para observar temas e formatos, nunca para copiar texto, estrutura proprietária ou imagem.
