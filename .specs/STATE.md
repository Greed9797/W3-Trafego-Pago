# TLC State

## Decisions

| ID | Status | Decision |
| --- | --- | --- |
| AD-001 | active | O conteúdo editorial deve ser em pt-BR e orientado a gestores de tráfego, agências e operações de e-commerce. |
| AD-002 | active | Notícias sobre mudanças de plataformas entram como rascunho até aprovação humana; conteúdo evergreen pode ser programado. |
| AD-003 | active | O backend de conteúdo usa Supabase/Postgres e a rotina diária usa Vercel Cron, sempre protegida por segredo e idempotência. |
| AD-004 | active | A identidade do blog pode seguir padrões editoriais observados no mercado, mas não deve copiar textos, layout proprietário ou ativos de concorrentes. |

## Handoff

Feature concluída: `autoblog-trafego-pago`.

T1–T8 foram executadas em commits atômicos na branch `main`. Build, testes do autoblog e lint direcionado passam. O lint global conserva dois erros preexistentes nos `button.tsx`. Migration e variáveis externas ainda precisam ser aplicadas pelo operador na Vercel/Supabase; nenhum segredo foi commitado.
