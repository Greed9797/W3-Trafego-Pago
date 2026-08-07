# Autoblog Tráfego Pago — Contexto

## Decisões confirmadas

- O “dale” do usuário confirma a arquitetura recomendada: Supabase/Postgres + Vercel Cron + projeto Vite atual consumindo posts públicos.
- O próximo mês é setembro de 2026, em pt-BR, com 30 dias e três slots por dia: dois evergreen programados e um update de plataforma em rascunho.
- O público principal é formado por gestores de tráfego, agências e donos/operadores de e-commerce.
- Updates de Google Ads, Meta Ads e plataformas relacionadas não podem ser publicados sem aprovação humana.
- Não existem chaves ou provedores confirmados no repositório. A feature deve ficar inerte e retornar uma resposta de configuração ausente, sem inventar conteúdo ou publicar dados, até as variáveis necessárias existirem.

## Pesquisa e limitações

- O blog de referência analisado foi o do Subido/Pedro Sobral. O padrão reaproveitado é editorial: destaques recentes, arquivo, categorias, newsletter/CTA e bloco de autoridade. A implementação mantém a identidade W3.
- A Google Trends API oficial está em alfa e com acesso limitado. A implementação usa a fonte oficial configurável quando disponível e um fallback público de sinais/RSS; sinais sem fonte verificável não viram notícia publicada.
- Fontes de plataforma devem ser preferencialmente oficiais: Google Ads & Commerce, Google Ads Help e Meta Business/Meta News. Conteúdo de blogs concorrentes serve para pesquisa de pauta, não para copiar ou republicar.

## Assumptions

- O calendário editorial é um roteiro de pauta, não a promessa de que 90 artigos completos já foram redigidos.
- A rotina diária gera um candidato de update com fonte, título, resumo e status `draft`; a geração longa por IA é opt-in via `AUTOBLOG_LLM_ENABLED=true`.
- A publicação automática de evergreen só ficará ativa quando o banco estiver configurado e cada item tiver horário/status compatível.
- A autenticação administrativa mínima para aprovar drafts será um Bearer token de ambiente. Um painel de login completo fica fora desta entrega.

## Deferred Ideas

- Dashboard editorial com login, histórico de versões e edição rica.
- Integração oficial com Google Trends API alfa e Google Ads Keyword Planner quando as credenciais forem fornecidas.
- Métricas de engajamento para reordenar automaticamente o calendário.
