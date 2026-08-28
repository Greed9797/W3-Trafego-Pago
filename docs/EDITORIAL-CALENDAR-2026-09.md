# Calendário editorial — setembro de 2026

O lote contém 90 slots para America/Sao_Paulo: 60 evergreen programados (08:00 e 12:00) e 30 slots de atualização de plataforma em `draft` (18:00). O seed importável é [`data/blog-posts-2026-09.ts`](../data/blog-posts-2026-09.ts). Ele usa os slots determinísticos de `getSeptemberEditorialCalendar()` e mantém os campos compatíveis com `blog_posts`.

## Distribuição editorial

| Categoria | Posts evergreen | Objetivo editorial |
| --- | ---: | --- |
| Google Ads | 15 | Capturar intenção de pesquisa e decisões de configuração, automação e Shopping. |
| Meta Ads | 15 | Cobrir automação, mensuração, catálogo, mensagens, leads e escala. |
| Métricas | 10 | Conectar tracking, atribuição e margem a decisões de mídia. |
| Criativos | 10 | Criar um sistema de hipóteses, produção, teste e renovação de anúncios. |
| E-commerce | 10 | Corrigir conversão e operação antes de escalar investimento. |

Cada evergreen do seed possui: título SEO, meta description, H1, introdução, índice, seções H2, passos, exemplo, checklist, FAQ, CTA W3, palavras-chave secundárias, intenção, estágio de funil, justificativa de pesquisa, risco de canibalização, fonte editorial, data de revisão e leitura estimada.

## Grade de 90 slots

| Data | 08:00 — evergreen programado | 12:00 — evergreen programado | 18:00 — atualização em draft |
| --- | --- | --- | --- |
| 01/09 | Estrutura de campanha no Google Ads | Palavras-chave de alta intenção no Google Ads | Transparência de IA em anúncios da Meta (fonte oficial; draft) |
| 02/09 | Tipos de correspondência no Google Ads | Palavras-chave negativas no Google Ads | Monitoramento de atualização de plataforma |
| 03/09 | Performance Max para e-commerce | Grupo de recursos na Performance Max | Monitoramento de atualização de plataforma |
| 04/09 | ROAS alvo no Google Ads | Orçamento inicial no Google Ads | Monitoramento de atualização de plataforma |
| 05/09 | Conversões no Google Ads | Feed do Merchant Center | Monitoramento de atualização de plataforma |
| 06/09 | Demand Gen ou Performance Max | YouTube Ads para performance | Monitoramento de atualização de plataforma |
| 07/09 | Índice de qualidade no Google Ads | Experimentos no Google Ads | Monitoramento de atualização de plataforma |
| 08/09 | Campanha de marca no Google Ads | Estrutura de campanha no Meta Ads | Monitoramento de atualização de plataforma |
| 09/09 | Advantage+ sales campaigns | Pixel da Meta e Conversions API | Monitoramento de atualização de plataforma |
| 10/09 | Eventos de compra no Meta Ads | Público Advantage+ | Monitoramento de atualização de plataforma |
| 11/09 | CPM alto no Meta Ads | Frequência no Meta Ads | Monitoramento de atualização de plataforma |
| 12/09 | Remarketing no Meta Ads | Campanhas de catálogo no Meta Ads | Monitoramento de atualização de plataforma |
| 13/09 | Advantage+ placements | Orçamento Advantage+ no Meta Ads | Monitoramento de atualização de plataforma |
| 14/09 | Anúncios para WhatsApp no Meta Ads | Criativos no Meta Ads | Monitoramento de atualização de plataforma |
| 15/09 | Leads no Meta Ads | Escala no Meta Ads | Monitoramento de atualização de plataforma |
| 16/09 | ROAS não é suficiente | CAC de mídia | Monitoramento de atualização de plataforma |
| 17/09 | CTR, CPC e taxa de conversão | GA4 para tráfego pago | Monitoramento de atualização de plataforma |
| 18/09 | Google Tag Manager para campanhas | UTM em campanhas | Monitoramento de atualização de plataforma |
| 19/09 | Atribuição de marketing | Janela de conversão | Monitoramento de atualização de plataforma |
| 20/09 | Relatório de tráfego pago | Qualidade de lead | Monitoramento de atualização de plataforma |
| 21/09 | Criativos de performance | Briefing de criativo para tráfego pago | Monitoramento de atualização de plataforma |
| 22/09 | Hooks para anúncios | UGC para anúncios | Monitoramento de atualização de plataforma |
| 23/09 | Teste A/B de anúncios | Fadiga criativa | Monitoramento de atualização de plataforma |
| 24/09 | Prova social em anúncios | Anúncio estático ou vídeo | Monitoramento de atualização de plataforma |
| 25/09 | Copy para anúncios | Biblioteca de criativos | Monitoramento de atualização de plataforma |
| 26/09 | Tráfego pago para e-commerce | Landing page para tráfego pago | Monitoramento de atualização de plataforma |
| 27/09 | CRO para e-commerce | Checkout de e-commerce | Monitoramento de atualização de plataforma |
| 28/09 | Página de produto que converte | Margem e ROAS no e-commerce | Monitoramento de atualização de plataforma |
| 29/09 | Funil de e-commerce | Google Ads ou Meta Ads para e-commerce | Monitoramento de atualização de plataforma |
| 30/09 | Campanhas promocionais no e-commerce | Escalar e-commerce com tráfego pago | Monitoramento de atualização de plataforma |

## Política dos 30 drafts de atualização

- Todos os 30 slots ficam com `kind: "platform-update"` e `status: "draft"`.
- O slot de 01/09 contém somente um rascunho baseado na [fonte oficial da Meta](https://about.fb.com/news/2025/02/gen-ai-transparency-metas-ads-products/). O texto separa fato confirmado, interpretação, revisão recomendada e itens ainda não confirmados.
- Os outros 29 slots não têm artigo, URL-fonte ou afirmação factual. Eles usam `content.sections: []` e aguardam mudança real confirmada por Google Ads & Commerce, Google Ads Help/Announcements, Meta Newsroom ou Meta for Business.
- Nenhum draft é publicado automaticamente. A aprovação humana continua sendo responsabilidade de `api/admin/autoblog/approve.ts`.

## Duplicidade e canibalização

- Slugs e títulos são validados como únicos no teste do seed.
- A pauta separa recortes próximos: por exemplo, `Performance Max para e-commerce` trata pré-requisitos da campanha, enquanto `Grupo de recursos` trata ativos; `landing page` trata a página de campanha, enquanto `checkout` trata a etapa final de compra.
- Cada evergreen registra no seed um risco de canibalização e a justificativa de seu recorte. Os riscos médios são explicitamente reservados a complementos técnicos, não a títulos duplicados.
- Intenções se repetem apenas quando o problema e o estágio de funil são diferentes; a justificativa editorial de cada pauta está no seed.

## Limites de publicação

O lote é preparado e programado, mas não é publicado nesta tarefa. Não há migration, gravação no Supabase, deploy ou chamada a APIs com credenciais.
