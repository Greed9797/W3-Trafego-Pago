# Autoblog de Tráfego Pago — Especificação

**Status**: Implementado; validação feature-level registrada em `validation.md`.

## Objetivo

Transformar o `/blog` da W3 em um produto editorial de tráfego pago com identidade visual de blog padrão, roteiro de setembro de 2026 e uma rotina diária segura para pesquisar sinais, identificar atualizações de plataformas e preparar drafts para aprovação.

## Fora de escopo

- Copiar o design, textos ou imagens do blog do Pedro Sobral.
- Publicar automaticamente notícias de terceiros sem fonte e aprovação.
- Criar um painel completo de autenticação ou um editor WYSIWYG.
- Prometer acesso à Google Trends API sem credencial de acesso alfa.

## Requisitos funcionais

### BLOG-01 — Identidade editorial

O blog deve apresentar uma hierarquia reconhecível de publicação: cabeçalho editorial, hero de posicionamento, destaque principal, cards de artigos recentes, arquivo filtrável por categoria, CTA/newsletter e artigo com metadados/índice.

### CAL-01 — Roteiro mensal

Para setembro de 2026, o calendário deve gerar exatamente 90 slots: três por dia durante 30 dias. Cada data deve conter dois slots `evergreen` com status `scheduled` e um slot `platform-update` com status `draft`.

### CAL-02 — Pauta orientada a busca

Cada slot evergreen deve ter palavra-chave, intenção, ângulo, formato e CTA. A fonte do campo deve identificar a pauta como `editorial-seed` até que um sinal diário real seja associado; o sistema não deve apresentar sementes como volume confirmado do Google Trends.

### AUTO-01 — Cron diário protegido

Quando receber uma requisição GET com `Authorization: Bearer <CRON_SECRET>` e o banco estiver configurado, o endpoint diário deve coletar sinais, registrar uma execução por data local de São Paulo e retornar JSON com a execução, fontes consultadas e quantidade de drafts criados.

### AUTO-02 — Idempotência

Duas execuções para a mesma data local não podem criar duas execuções ou dois drafts de update. A segunda deve retornar `already_processed` sem publicar nada.

### AUTO-03 — Fontes verificáveis

O sistema deve limitar candidatos de update a itens com URL válida e domínio de fonte permitido/configurado. O draft deve guardar a URL original e a data de coleta.

### AUTO-04 — Rascunho de plataforma

Um sinal de Google Ads/Meta Ads deve virar `platform-update` com status `draft`, nunca `published`, até a aprovação administrativa.

### AUTO-05 — Aprovação protegida

O endpoint administrativo deve exigir `Authorization: Bearer <AUTOBLOG_ADMIN_TOKEN>`, aceitar apenas um draft existente e mudar seu status para `published` somente após validação de título, slug, resumo, conteúdo e fonte.

### DATA-01 — Persistência compatível com Supabase

O schema deve separar posts, sinais de pesquisa, execuções e palavras-chave, com índices para status/data e regra que impeça duas execuções do mesmo dia.

### DATA-02 — Fallback seguro

Sem variáveis de banco, cron ou token, nenhum endpoint deve publicar ou gravar; deve responder com status explícito de configuração ausente. O frontend continua exibindo o catálogo editorial estático.

### SEO-01 — Blog indexável

O `/blog` e os artigos devem continuar com canonical, título, descrição, `Blog`/`Article` JSON-LD e sitemap compatíveis com a identidade de tráfego pago.

## Critérios de aceitação

| ID | Critério verificável |
| --- | --- |
| AC-01 | `getEditorialCalendar(2026, 8)` retorna `90`; cada data entre `2026-09-01` e `2026-09-30` aparece uma vez e tem três slots. |
| AC-02 | Em cada data, a distribuição de `kind/status` é exatamente dois `evergreen/scheduled` e um `platform-update/draft`. |
| AC-03 | Um GET do cron sem Bearer válido retorna HTTP `401` e não chama o banco. |
| AC-04 | Um GET do cron sem configuração retorna HTTP `503` com `{ error: 'autoblog_not_configured' }` e não tenta publicar. |
| AC-05 | `parseFeedItems` descarta item sem título/link, limita o resultado a 20 itens e remove marcação HTML do título/resumo. |
| AC-06 | Dois registros de execução para a mesma data são tratados como um único run; a segunda resposta contém `status: 'already_processed'`. |
| AC-07 | O candidato criado pelo cron contém `status: 'draft'`, `kind: 'platform-update'`, URL de fonte permitida e `sourceCollectedAt`. |
| AC-08 | A aprovação sem token retorna `401`; com token e payload válido, o registro muda de `draft` para `published`; payload inválido retorna `422`. |
| AC-09 | O schema contém tabelas de posts, sinais, runs e keywords, chave única de data no run e política pública apenas para posts publicados. |
| AC-10 | O build do frontend passa e a rota `/blog` continua renderizando com o fallback quando `/api/blog` não está configurada. |
| AC-11 | O sitemap e metadata mantêm o domínio `w3trafegopago.com.br` e descrições específicas de blog de tráfego pago. |

## Edge cases

- Feed indisponível, lento ou malformado: registrar erro da fonte e continuar com as demais; sem fonte válida, não criar draft.
- Cron duplicado/concorrrente: a restrição única de data e resposta idempotente impedem duplicidade.
- Título/link com HTML, entidade XML ou URL externa não permitida: normalizar e rejeitar conforme o contrato.
- Supabase/IA ausente: não usar conteúdo falso como publicado e informar configuração ausente.
- Artigo publicado pelo banco com slug igual ao fallback: o catálogo remoto deve prevalecer apenas para o mesmo slug, sem duplicar cards.

## Segurança e conformidade

- Segredos somente em variáveis de ambiente da Vercel; nunca em `src`, `public`, commits ou exemplos com valor real.
- Service role do Supabase somente em funções server-side.
- Cron e aprovação exigem Bearer token independente.
- Conteúdo gerado precisa manter source URL e atribuição; nenhum texto de concorrente é copiado.
- Requisições externas têm timeout e limites de tamanho; entradas administrativas são validadas antes de persistir.

## Verificação

- Unit tests nativos para calendário, parser, allowlist, auth e idempotência.
- `npm run build` e `npm run lint` como gate de build; o lint global já possui falha preexistente em dois `button.tsx` fora da feature e deve ser reportado separadamente se persistir.
- `npm run test:autoblog` para o domínio puro.
- Verificação visual manual/Playwright em `/blog` e `/blog/<slug>` desktop/mobile após a última tarefa.
