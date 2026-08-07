# Roteiro editorial — setembro de 2026

O calendário tem 90 slots: dois conteúdos evergreen por dia, às 08:00 e 12:00, e um espaço de atualização de plataforma às 18:00. O terceiro slot é sempre `draft` até a análise diária confirmar uma mudança relevante em fonte verificável.

## Pilares de pauta

| Pilar | Exemplos de palavras-chave |
| --- | --- |
| Estratégia | tráfego pago para e-commerce, orçamento, funil, escala |
| Google Ads | Google Ads, Performance Max, Demand Gen, palavras-chave |
| Meta Ads | Meta Ads, Pixel da Meta, Conversions API, remarketing |
| Criativos e conversão | criativos para anúncios, landing page, CRO, teste A/B |
| Métricas e operação | ROAS, CAC, CTR, CPC, CPM, GA4, UTM, relatório |
| Aquisição comercial | lead qualificado, anúncios para WhatsApp, agência de tráfego pago |

## Distribuição diária

| Data | 08:00 | 12:00 | 18:00 |
| --- | --- | --- | --- |
| 01–30/09 | Evergreen 1 do gerador | Evergreen 2 do gerador | Update de Google Ads/Meta Ads em draft |

O catálogo completo é gerado por `getEditorialCalendar(2026, 8)` em `src/lib/editorial-calendar.ts`. Isso evita manter 90 linhas duplicadas e permite gerar o mesmo roteiro no backend, na documentação e em testes. As keywords são sementes editoriais; o cron diário pode associar sinais reais e alterar `keywordSource` para `daily-signal` somente quando houver fonte e coleta registradas.

## Regras para os 30 updates

1. Consultar Google Trends/sinais configurados e fontes oficiais.
2. Priorizar mudanças efetivas em Google Ads, Meta Ads, Instagram Ads, YouTube Ads ou medição.
3. Guardar título original, URL, domínio e data da coleta.
4. Criar rascunho com “o que mudou”, “quem é afetado”, “o que fazer agora” e fontes.
5. Não publicar se a fonte estiver indisponível, sem URL ou sem confirmação humana.
