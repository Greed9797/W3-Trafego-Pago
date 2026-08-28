# Relatório de validação — lote editorial de setembro de 2026

Data da validação: 07/08/2026.

## Resultado

| Regra | Resultado | Evidência |
| --- | --- | --- |
| 90 slots | PASS | Teste do seed confirma 90 registros e 90 horários de agendamento únicos. |
| 60 evergreen e 30 updates | PASS | 60 `evergreen/scheduled`; 30 `platform-update/draft`. |
| Distribuição 15/15/10/10/10 | PASS | Google Ads 15, Meta Ads 15, Métricas 10, Criativos 10 e E-commerce 10. |
| Slugs e títulos únicos | PASS | Teste usa `Set` para os 90 slugs e 90 títulos. |
| Colisão com catálogo estático | PASS | Nenhum slug do seed colide com os slugs de `src/lib/blog.ts`. |
| Conteúdo evergreen completo | PASS | Todos têm palavra-chave, SEO, CTA, FAQ, no mínimo sete seções, palavras secundárias, justificativa e risco de canibalização. |
| Atualizações com fonte | PASS com escopo controlado | Um draft factual tem fonte oficial da Meta. Os outros 29 são slots sem artigo, URL ou alegação; aguardam fonte oficial. |
| URLs externas na allowlist | PASS | Teste valida Trends, Google Help/Blog, Meta for Business e Meta Newsroom. |
| Sem volume inventado | PASS | O relatório de pesquisa identifica dados do Trends apenas como interesse relativo. |
| Sem cópia de concorrente | PASS | A referência Subido foi limitada à observação de hierarquia editorial; nenhum conteúdo ou título foi reutilizado. |
| Compatibilidade com `blog_posts` | PASS | O teste exige somente as 12 colunas de armazenamento no nível superior; metadados ficam no JSON `content`. |

## Comandos executados

```text
npm run test:autoblog
PASS 26; Failures: 0

npx eslint data/blog-posts-2026-09.ts tests/editorial-seed.test.ts
PASS

git diff --check
PASS

git diff --no-index --check /dev/null data/blog-posts-2026-09.ts
PASS (verificação de whitespace do arquivo ainda não rastreado)
```

O primeiro `npm run build` sem variáveis de ambiente parou por `VITE_META_PIXEL_ID` ausente em `index.html`. A mesma build passou com `VITE_META_PIXEL_ID=disabled` fornecido apenas ao processo, sem gravar `.env`, segredo ou configuração de produção.

## Publicação e banco

Nenhum post foi publicado. Nenhuma migration foi aplicada, nenhuma variável de Supabase foi usada, nenhum registro foi gravado no banco e nenhum deploy foi executado. Todos os platform updates continuam em `draft` e exigem revisão humana antes de qualquer aprovação.
