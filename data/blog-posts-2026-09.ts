import { getSeptemberEditorialCalendar } from '../src/lib/editorial-calendar.ts'
import { buildSlug } from '../api/_lib/autoblog.ts'

type EditorialCategory = 'Google Ads' | 'Meta Ads' | 'Métricas' | 'Criativos' | 'E-commerce'
type FunnelStage = 'descoberta' | 'consideração' | 'decisão' | 'retenção'
type Intent = 'informational' | 'commercial'

type Section = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type BlogPostSeed = {
  slug: string
  title: string
  excerpt: string
  content: {
    sections: Section[]
    seo: {
      title: string
      metaDescription: string
      h1: string
      introduction: string
      index: string[]
      faq: Array<{ question: string; answer: string }>
      cta: string
      editorialSource: string
      reviewDate: string
      estimatedReadMinutes: number
    }
    editorial: {
      primaryKeyword: string
      secondaryKeywords: string[]
      intent: Intent
      funnelStage: FunnelStage
      originalAngle: string
      format: string
      justification: string
      cannibalizationRisk: string
      researchUrl: string
      collectedAt: string
      officialReferences: string[]
    }
    update?: {
      state: 'confirmed-source' | 'awaiting-official-source'
      announcedAt?: string
      affectedAudience?: string
      likelyImpact?: string
      reviewActions?: string[]
      unconfirmed?: string[]
    }
  }
  category: EditorialCategory
  kind: 'evergreen' | 'platform-update'
  status: 'scheduled' | 'draft'
  keyword: string
  source_url: string | null
  source_collected_at: string | null
  scheduled_for: string
  published_at: null
}

type EvergreenPlan = {
  title: string
  keyword: string
  secondaryKeywords: string[]
  category: EditorialCategory
  intent: Intent
  funnelStage: FunnelStage
  angle: string
  format: 'guia' | 'checklist' | 'comparativo' | 'framework' | 'diagnóstico'
  cta: string
  justification: string
  cannibalizationRisk: string
  trendGroup: 'fundamentos' | 'performance'
  officialReferences: string[]
}

const COLLECTED_AT = '2026-08-07T14:40:00-03:00'
const REVIEW_DATE = '2027-03-01'
const TRENDS_FUNDAMENTALS_URL = 'https://trends.google.com/trends/explore?geo=BR&date=today%205-y&q=Google%20Ads,Meta%20Ads,tr%C3%A1fego%20pago,e-commerce,ROAS'
const TRENDS_PERFORMANCE_URL = 'https://trends.google.com/trends/explore?geo=BR&date=today%205-y&q=convers%C3%A3o,criativos,remarketing,Performance%20Max,campanhas%20Advantage%2B'
const GOOGLE_PMAX_URL = 'https://support.google.com/google-ads/answer/10724817?hl=pt-BR'
const GOOGLE_PMAX_EVALUATION_URL = 'https://support.google.com/google-ads/answer/16279166?hl=pt-BR'
const GOOGLE_NEWS_URL = 'https://blog.google/products/ads-commerce/'
const META_ADVANTAGE_URL = 'https://www.facebook.com/business/ads/meta-advantage-plus'
const META_CAPI_URL = 'https://www.facebook.com/business/help/AboutConversionsAPI'
const META_NEWS_URL = 'https://about.fb.com/news/'

const evergreenPlans: EvergreenPlan[] = [
  // Google Ads (15)
  { title: 'Estrutura de campanha no Google Ads: como organizar sem fragmentar o orçamento', keyword: 'estrutura de campanha Google Ads', secondaryKeywords: ['organização de conta Google Ads', 'campanha de pesquisa'], category: 'Google Ads', intent: 'informational', funnelStage: 'descoberta', angle: 'Organizar por hipótese de negócio e não por excesso de campanhas.', format: 'framework', cta: 'Receber o framework de estrutura W3', justification: 'A pauta transforma a busca ampla por Google Ads em um primeiro diagnóstico acionável.', cannibalizationRisk: 'Baixo: recorte de arquitetura, distinto de orçamento e palavras-chave.', trendGroup: 'fundamentos', officialReferences: [GOOGLE_NEWS_URL] },
  { title: 'Palavras-chave de alta intenção no Google Ads: como montar uma lista que prioriza compra', keyword: 'palavras-chave Google Ads', secondaryKeywords: ['palavras-chave de fundo de funil', 'intenção de busca'], category: 'Google Ads', intent: 'informational', funnelStage: 'consideração', angle: 'Separar intenção, oferta e página de destino antes de ampliar a lista.', format: 'guia', cta: 'Pedir uma revisão de palavras-chave', justification: 'Google Ads liderou o interesse relativo na comparação e sustenta uma trilha de busca de alta intenção.', cannibalizationRisk: 'Baixo: foco exclusivo em pesquisa e intenção.', trendGroup: 'fundamentos', officialReferences: [GOOGLE_NEWS_URL] },
  { title: 'Tipos de correspondência no Google Ads: como usar ampla, frase e exata com controle', keyword: 'tipos de correspondência Google Ads', secondaryKeywords: ['correspondência ampla', 'palavra-chave exata'], category: 'Google Ads', intent: 'informational', funnelStage: 'consideração', angle: 'Escolher a abertura de alcance pelo grau de evidência da conta.', format: 'comparativo', cta: 'Revisar a cobertura de pesquisa com a W3', justification: 'Desdobra a intenção de Google Ads em uma decisão operacional de configuração.', cannibalizationRisk: 'Baixo: complementar à pauta de lista de palavras-chave.', trendGroup: 'fundamentos', officialReferences: [GOOGLE_NEWS_URL] },
  { title: 'Palavras-chave negativas: o checklist para reduzir desperdício no Google Ads', keyword: 'palavras-chave negativas Google Ads', secondaryKeywords: ['termos de pesquisa', 'negativas Google Ads'], category: 'Google Ads', intent: 'informational', funnelStage: 'consideração', angle: 'Tratar negativas como rotina de qualidade, e não lista interminável.', format: 'checklist', cta: 'Baixar o checklist de termos de pesquisa', justification: 'Completa o cluster de intenção com uma proteção prática de orçamento.', cannibalizationRisk: 'Baixo: trata exclusão, não descoberta de termos.', trendGroup: 'fundamentos', officialReferences: [GOOGLE_NEWS_URL] },
  { title: 'Performance Max para e-commerce: quando usar e quais pré-requisitos revisar', keyword: 'Performance Max para e-commerce', secondaryKeywords: ['PMax e-commerce', 'campanha Performance Max'], category: 'Google Ads', intent: 'commercial', funnelStage: 'decisão', angle: 'Começar por conversões, feed e ativos antes de discutir escala.', format: 'checklist', cta: 'Solicitar uma revisão de Performance Max', justification: 'Performance Max apareceu como termo de nicho; a pauta responde à necessidade de aplicação qualificada.', cannibalizationRisk: 'Médio: diferenciado por e-commerce e pré-requisitos.', trendGroup: 'performance', officialReferences: [GOOGLE_PMAX_URL, GOOGLE_PMAX_EVALUATION_URL] },
  { title: 'Grupo de recursos na Performance Max: como criar ativos com papéis claros', keyword: 'grupo de recursos Performance Max', secondaryKeywords: ['asset group PMax', 'ativos Performance Max'], category: 'Google Ads', intent: 'informational', funnelStage: 'consideração', angle: 'Vincular cada grupo a um conjunto coerente de produtos, mensagem e página.', format: 'guia', cta: 'Montar uma matriz de ativos com a W3', justification: 'A documentação oficial destaca a qualidade e a variedade de ativos como insumo da automação.', cannibalizationRisk: 'Baixo: recorte de ativos, não de estratégia de campanha.', trendGroup: 'performance', officialReferences: [GOOGLE_PMAX_URL, GOOGLE_PMAX_EVALUATION_URL] },
  { title: 'ROAS alvo no Google Ads: como definir uma meta sem travar o aprendizado', keyword: 'ROAS alvo Google Ads', secondaryKeywords: ['tROAS', 'maximizar valor de conversão'], category: 'Google Ads', intent: 'commercial', funnelStage: 'decisão', angle: 'Conectar meta de leilão à margem e ao estágio de maturidade da campanha.', format: 'framework', cta: 'Calcular uma meta de ROAS com a W3', justification: 'ROAS foi incluído na consulta pública e pede uma leitura aplicada a Google Ads.', cannibalizationRisk: 'Médio: diferenciado por configuração de lance.', trendGroup: 'fundamentos', officialReferences: [GOOGLE_PMAX_URL] },
  { title: 'Orçamento inicial no Google Ads: um método para comprar aprendizado com controle', keyword: 'orçamento inicial Google Ads', secondaryKeywords: ['orçamento de campanha', 'investimento Google Ads'], category: 'Google Ads', intent: 'commercial', funnelStage: 'decisão', angle: 'Estimar verba a partir de conversões observáveis, janela de teste e teto de CAC.', format: 'guia', cta: 'Planejar o investimento inicial com a W3', justification: 'A intenção comercial aparece antes da contratação e reduz decisões por chute.', cannibalizationRisk: 'Baixo: foco em Google Ads, separado de escala.', trendGroup: 'fundamentos', officialReferences: [GOOGLE_NEWS_URL] },
  { title: 'Conversões no Google Ads: quais ações marcar como primárias e secundárias', keyword: 'conversões Google Ads', secondaryKeywords: ['ação de conversão', 'metas de conversão'], category: 'Google Ads', intent: 'informational', funnelStage: 'consideração', angle: 'Evitar que o algoritmo otimize para sinais fáceis que não representam valor.', format: 'diagnóstico', cta: 'Validar as conversões da sua conta', justification: 'O interesse por conversão sustenta conteúdo de configuração que afeta todas as campanhas.', cannibalizationRisk: 'Médio: técnico, mas distinto de GA4 e GTM.', trendGroup: 'performance', officialReferences: [GOOGLE_PMAX_URL] },
  { title: 'Feed do Merchant Center: checklist de produto para campanhas de Shopping', keyword: 'feed Merchant Center', secondaryKeywords: ['feed de produtos', 'Google Shopping'], category: 'Google Ads', intent: 'informational', funnelStage: 'consideração', angle: 'Tratar título, preço, disponibilidade e atributos como parte da mídia.', format: 'checklist', cta: 'Auditar o feed de produtos', justification: 'Relaciona Google Ads e e-commerce por uma dependência concreta de execução.', cannibalizationRisk: 'Baixo: foco em dados de produto.', trendGroup: 'fundamentos', officialReferences: [GOOGLE_PMAX_URL] },
  { title: 'Demand Gen ou Performance Max: qual papel cada campanha cumpre no plano de mídia', keyword: 'Demand Gen ou Performance Max', secondaryKeywords: ['Demand Gen Google Ads', 'PMax'], category: 'Google Ads', intent: 'commercial', funnelStage: 'decisão', angle: 'Comparar objetivo, superfície, criativo e critério de sucesso antes de escolher.', format: 'comparativo', cta: 'Desenhar o mix de campanhas com a W3', justification: 'Usa a atualização oficial de Ads & Commerce como base para uma decisão de mix.', cannibalizationRisk: 'Baixo: comparação explícita entre dois formatos.', trendGroup: 'performance', officialReferences: [GOOGLE_NEWS_URL, GOOGLE_PMAX_URL] },
  { title: 'YouTube Ads para performance: como definir objetivo, criativo e mensuração', keyword: 'YouTube Ads para performance', secondaryKeywords: ['campanha de vídeo Google Ads', 'anúncios no YouTube'], category: 'Google Ads', intent: 'informational', funnelStage: 'descoberta', angle: 'Sair da métrica de visualização isolada e planejar o próximo passo do usuário.', format: 'guia', cta: 'Planejar uma frente de vídeo com a W3', justification: 'Amplia o cluster Google Ads para inventário visual e aquisição de demanda.', cannibalizationRisk: 'Baixo: foco em vídeo, não em Search.', trendGroup: 'fundamentos', officialReferences: [GOOGLE_NEWS_URL] },
  { title: 'Índice de qualidade no Google Ads: o que ele sinaliza e o que não resolve sozinho', keyword: 'índice de qualidade Google Ads', secondaryKeywords: ['quality score', 'relevância do anúncio'], category: 'Google Ads', intent: 'informational', funnelStage: 'descoberta', angle: 'Ler relevância, expectativa de CTR e experiência da página como diagnóstico, não como meta vaidosa.', format: 'diagnóstico', cta: 'Diagnosticar relevância de anúncios', justification: 'Responde a uma dúvida recorrente de quem já opera campanhas de pesquisa.', cannibalizationRisk: 'Baixo: métrica específica de Search.', trendGroup: 'fundamentos', officialReferences: [GOOGLE_NEWS_URL] },
  { title: 'Experimentos no Google Ads: como comparar mudanças sem confundir causa e efeito', keyword: 'experimentos Google Ads', secondaryKeywords: ['teste de campanha', 'experimento Performance Max'], category: 'Google Ads', intent: 'informational', funnelStage: 'consideração', angle: 'Definir hipótese, variável, indicador e prazo antes de alterar a conta.', format: 'framework', cta: 'Receber um roteiro de experimento', justification: 'A documentação oficial de Performance Max recomenda experimentos para medir incrementabilidade.', cannibalizationRisk: 'Baixo: método de decisão, não tutorial de uma campanha.', trendGroup: 'performance', officialReferences: [GOOGLE_PMAX_EVALUATION_URL] },
  { title: 'Campanha de marca no Google Ads: quando proteger termos e como medir incrementalidade', keyword: 'campanha de marca Google Ads', secondaryKeywords: ['palavras-chave de marca', 'incrementalidade'], category: 'Google Ads', intent: 'commercial', funnelStage: 'decisão', angle: 'Separar defesa de demanda existente de aquisição incremental.', format: 'diagnóstico', cta: 'Avaliar a cobertura de marca', justification: 'Cria um recorte avançado para contas com tráfego de pesquisa já consolidado.', cannibalizationRisk: 'Baixo: intenção de marca é diferente de pesquisa genérica.', trendGroup: 'fundamentos', officialReferences: [GOOGLE_NEWS_URL] },

  // Meta Ads (15)
  { title: 'Estrutura de campanha no Meta Ads: como separar aquisição, remarketing e testes', keyword: 'estrutura de campanha Meta Ads', secondaryKeywords: ['organização Meta Ads', 'funil Meta Ads'], category: 'Meta Ads', intent: 'informational', funnelStage: 'descoberta', angle: 'Organizar pela função da campanha e pela leitura de resultado, não por nomes decorativos.', format: 'framework', cta: 'Receber o mapa de estrutura Meta', justification: 'Meta Ads teve sinal recente acima da média relativa da própria consulta comparativa.', cannibalizationRisk: 'Baixo: arquitetura de conta, distinta de público e criativo.', trendGroup: 'fundamentos', officialReferences: [META_ADVANTAGE_URL] },
  { title: 'Advantage+ sales campaigns: quando a automação faz sentido para e-commerce', keyword: 'Advantage+ sales campaigns', secondaryKeywords: ['Advantage+ shopping', 'campanha de vendas Meta'], category: 'Meta Ads', intent: 'commercial', funnelStage: 'decisão', angle: 'Revisar catálogo, sinal de compra e capacidade de avaliar resultado antes de automatizar.', format: 'checklist', cta: 'Avaliar a elegibilidade da sua campanha', justification: 'A fonte oficial confirma a evolução do produto e orienta conteúdo de adoção responsável.', cannibalizationRisk: 'Baixo: recorte de campanha de vendas.', trendGroup: 'performance', officialReferences: [META_ADVANTAGE_URL] },
  { title: 'Pixel da Meta e Conversions API: como combinar os eventos sem duplicar dados', keyword: 'Pixel da Meta e Conversions API', secondaryKeywords: ['CAPI Meta', 'deduplicação de eventos'], category: 'Meta Ads', intent: 'informational', funnelStage: 'consideração', angle: 'Explicar o papel complementar dos sinais de navegador e servidor sem prometer mensuração perfeita.', format: 'guia', cta: 'Validar a implementação de tracking', justification: 'A Meta recomenda avaliar CAPI junto do pixel para eventos de site.', cannibalizationRisk: 'Médio: técnico, mas distinto de governança de eventos.', trendGroup: 'fundamentos', officialReferences: [META_CAPI_URL] },
  { title: 'Eventos de compra no Meta Ads: um diagnóstico de qualidade antes de otimizar campanhas', keyword: 'eventos de compra Meta Ads', secondaryKeywords: ['Event Match Quality', 'evento Purchase'], category: 'Meta Ads', intent: 'informational', funnelStage: 'consideração', angle: 'Validar disparo, valor, moeda e deduplicação antes de interpretar o CPA.', format: 'diagnóstico', cta: 'Revisar eventos de compra', justification: 'Detalha o pilar de mensuração exigido para automação de Meta.', cannibalizationRisk: 'Baixo: foco em QA de evento.', trendGroup: 'performance', officialReferences: [META_CAPI_URL] },
  { title: 'Público Advantage+: como definir sugestões sem confundir orientação com restrição', keyword: 'público Advantage+ Meta Ads', secondaryKeywords: ['Advantage+ audience', 'público Meta Ads'], category: 'Meta Ads', intent: 'informational', funnelStage: 'consideração', angle: 'Distinguir critérios rígidos, exclusões e sugestões para o sistema de entrega.', format: 'guia', cta: 'Revisar a estratégia de audiência', justification: 'O tema conecta automação e controle operacional na plataforma.', cannibalizationRisk: 'Baixo: recorte de audiência, não de campanha.', trendGroup: 'performance', officialReferences: [META_ADVANTAGE_URL] },
  { title: 'CPM alto no Meta Ads: um roteiro para investigar leilão, público e criativo', keyword: 'CPM alto Meta Ads', secondaryKeywords: ['custo por mil Meta', 'leilão Meta Ads'], category: 'Meta Ads', intent: 'informational', funnelStage: 'consideração', angle: 'Organizar causas possíveis antes de trocar orçamento, público e anúncio ao mesmo tempo.', format: 'diagnóstico', cta: 'Solicitar um diagnóstico de eficiência', justification: 'Ataca uma dor de otimização recorrente em contas de Meta Ads.', cannibalizationRisk: 'Baixo: métrica de leilão, não de conversão.', trendGroup: 'fundamentos', officialReferences: [META_ADVANTAGE_URL] },
  { title: 'Frequência no Meta Ads: como identificar saturação sem pausar um anúncio vencedor cedo demais', keyword: 'frequência Meta Ads', secondaryKeywords: ['fadiga de anúncio', 'frequência de campanha'], category: 'Meta Ads', intent: 'informational', funnelStage: 'consideração', angle: 'Ler frequência junto com alcance, CTR, conversão e renovação de criativo.', format: 'guia', cta: 'Montar uma rotina de fadiga criativa', justification: 'Complementa o diagnóstico de CPM com uma variável de exposição.', cannibalizationRisk: 'Baixo: foco em repetição e desgaste.', trendGroup: 'fundamentos', officialReferences: [META_ADVANTAGE_URL] },
  { title: 'Remarketing no Meta Ads: janelas, exclusões e mensagens para cada sinal de intenção', keyword: 'remarketing Meta Ads', secondaryKeywords: ['janela de remarketing', 'público de visitantes'], category: 'Meta Ads', intent: 'commercial', funnelStage: 'decisão', angle: 'Usar contexto do visitante para reduzir repetição e aproximar a oferta da objeção.', format: 'framework', cta: 'Planejar uma régua de remarketing', justification: 'Remarketing mostrou baixa escala relativa na consulta, o que reforça uma pauta específica e prática.', cannibalizationRisk: 'Baixo: recorte de fundo de funil.', trendGroup: 'performance', officialReferences: [META_ADVANTAGE_URL] },
  { title: 'Campanhas de catálogo no Meta Ads: como preparar produto, feed e criativo para vender', keyword: 'campanha de catálogo Meta Ads', secondaryKeywords: ['anúncios dinâmicos Meta', 'catálogo de produtos'], category: 'Meta Ads', intent: 'commercial', funnelStage: 'decisão', angle: 'Tratar o catálogo como ativo de mídia, não como integração esquecida.', format: 'checklist', cta: 'Auditar o catálogo de produtos', justification: 'Conecta Meta Ads à operação de e-commerce com um insumo verificável.', cannibalizationRisk: 'Baixo: foco em catálogo.', trendGroup: 'fundamentos', officialReferences: [META_ADVANTAGE_URL] },
  { title: 'Advantage+ placements: quando ampliar posicionamentos e como avaliar a qualidade do tráfego', keyword: 'Advantage+ placements', secondaryKeywords: ['posicionamentos Meta Ads', 'placements automáticos'], category: 'Meta Ads', intent: 'informational', funnelStage: 'consideração', angle: 'Avaliar alcance e resultado por etapa do funil em vez de excluir posições por hábito.', format: 'guia', cta: 'Revisar os posicionamentos da conta', justification: 'A fonte oficial descreve a distribuição automatizada de anúncios em múltiplas superfícies.', cannibalizationRisk: 'Baixo: recorte de posicionamento.', trendGroup: 'performance', officialReferences: [META_ADVANTAGE_URL] },
  { title: 'Orçamento Advantage+ no Meta Ads: como dar liberdade ao algoritmo sem perder governança', keyword: 'orçamento Advantage+ Meta Ads', secondaryKeywords: ['Advantage+ campaign budget', 'CBO Meta Ads'], category: 'Meta Ads', intent: 'commercial', funnelStage: 'decisão', angle: 'Definir limites, metas e cadência de revisão antes de centralizar o orçamento.', format: 'framework', cta: 'Planejar a governança de orçamento', justification: 'A automação de orçamento é uma decisão frequente em operações de escala.', cannibalizationRisk: 'Baixo: recorte financeiro, não de audiência.', trendGroup: 'performance', officialReferences: [META_ADVANTAGE_URL] },
  { title: 'Anúncios para WhatsApp no Meta Ads: como conectar promessa, triagem e atendimento', keyword: 'anúncios para WhatsApp', secondaryKeywords: ['campanha para WhatsApp', 'leads no WhatsApp'], category: 'Meta Ads', intent: 'commercial', funnelStage: 'decisão', angle: 'Medir qualidade da conversa e tempo de resposta, não apenas custo por início de chat.', format: 'guia', cta: 'Estruturar a jornada de WhatsApp', justification: 'Traz a operação comercial para dentro da avaliação de mídia.', cannibalizationRisk: 'Baixo: objetivo de mensagem, distinto de formulário e site.', trendGroup: 'fundamentos', officialReferences: [META_ADVANTAGE_URL] },
  { title: 'Criativos no Meta Ads: como organizar variações sem confundir teste com escala', keyword: 'criativos Meta Ads', secondaryKeywords: ['teste criativo Meta', 'anúncios para Instagram'], category: 'Meta Ads', intent: 'informational', funnelStage: 'consideração', angle: 'Separar exploração de ângulos, validação e reaproveitamento de vencedores.', format: 'framework', cta: 'Montar um backlog de criativos', justification: 'Criativos aparecem como termo forte na segunda comparação e merecem aplicação por plataforma.', cannibalizationRisk: 'Médio: complementar ao cluster Criativos por foco em gestão no Meta.', trendGroup: 'performance', officialReferences: [META_ADVANTAGE_URL] },
  { title: 'Leads no Meta Ads: como alinhar formulário, qualificação e otimização para venda', keyword: 'leads Meta Ads', secondaryKeywords: ['formulário instantâneo', 'qualidade de lead'], category: 'Meta Ads', intent: 'commercial', funnelStage: 'decisão', angle: 'Fazer a plataforma receber um sinal de valor posterior, não só um envio de formulário.', format: 'diagnóstico', cta: 'Revisar o funil de leads', justification: 'Amplia Meta Ads para B2B e serviços sem depender de métricas superficiais.', cannibalizationRisk: 'Baixo: foco em lead e atendimento.', trendGroup: 'fundamentos', officialReferences: [META_CAPI_URL] },
  { title: 'Escala no Meta Ads: quais sinais revisar antes de aumentar orçamento', keyword: 'escalar Meta Ads', secondaryKeywords: ['escala de campanhas', 'aumentar orçamento Meta'], category: 'Meta Ads', intent: 'commercial', funnelStage: 'decisão', angle: 'Tratar aumento de verba como hipótese condicionada por criativo, margem e capacidade de entrega.', format: 'checklist', cta: 'Planejar uma escala sustentável', justification: 'Pauta comercial para operações que já têm dados de aquisição.', cannibalizationRisk: 'Baixo: foco em decisão de investimento.', trendGroup: 'fundamentos', officialReferences: [META_ADVANTAGE_URL] },

  // Métricas, tracking e atribuição (10)
  { title: 'ROAS não é suficiente: o painel de métricas que protege a margem da operação', keyword: 'métricas de tráfego pago', secondaryKeywords: ['ROAS', 'CAC', 'margem de contribuição'], category: 'Métricas', intent: 'informational', funnelStage: 'descoberta', angle: 'Ler mídia, margem, recompra e operação na mesma conversa de decisão.', format: 'framework', cta: 'Montar um painel de decisão W3', justification: 'ROAS tem interesse relativo mensurável, mas pede interpretação de negócio.', cannibalizationRisk: 'Baixo: visão executiva, distinta de cálculo de CAC.', trendGroup: 'fundamentos', officialReferences: [GOOGLE_PMAX_EVALUATION_URL, META_CAPI_URL] },
  { title: 'CAC de mídia: como calcular um limite que respeita margem e ciclo de venda', keyword: 'CAC tráfego pago', secondaryKeywords: ['custo de aquisição', 'CAC alvo'], category: 'Métricas', intent: 'commercial', funnelStage: 'decisão', angle: 'Transformar uma meta financeira em uma faixa de teste para mídia.', format: 'guia', cta: 'Calcular o CAC-alvo com a W3', justification: 'Responde a uma intenção de decisão antes de contratar ou escalar mídia.', cannibalizationRisk: 'Baixo: cálculo financeiro específico.', trendGroup: 'fundamentos', officialReferences: [GOOGLE_PMAX_URL] },
  { title: 'CTR, CPC e taxa de conversão: qual métrica investigar primeiro em uma campanha', keyword: 'CTR CPC taxa de conversão', secondaryKeywords: ['diagnóstico de campanha', 'métricas de anúncio'], category: 'Métricas', intent: 'informational', funnelStage: 'consideração', angle: 'Usar a ordem do funil para localizar se o problema está na mensagem, no leilão ou na página.', format: 'diagnóstico', cta: 'Receber o mapa de diagnóstico', justification: 'Cria uma trilha de leitura prática para quem acompanha resultados diariamente.', cannibalizationRisk: 'Baixo: comparação de métricas de funil.', trendGroup: 'performance', officialReferences: [GOOGLE_PMAX_EVALUATION_URL] },
  { title: 'GA4 para tráfego pago: eventos que ajudam a explicar a jornada até a conversão', keyword: 'GA4 tráfego pago', secondaryKeywords: ['eventos GA4', 'análise de campanha'], category: 'Métricas', intent: 'informational', funnelStage: 'consideração', angle: 'Priorizar eventos que alteram uma decisão de mídia e dispensar coleta decorativa.', format: 'guia', cta: 'Validar eventos no GA4', justification: 'A busca por conversão suporta uma pauta de leitura de comportamento pós-clique.', cannibalizationRisk: 'Médio: diferente de GTM por foco na análise.', trendGroup: 'performance', officialReferences: [GOOGLE_PMAX_EVALUATION_URL] },
  { title: 'Google Tag Manager para campanhas: checklist de implementação antes de investir', keyword: 'Google Tag Manager tráfego pago', secondaryKeywords: ['GTM', 'tag de conversão'], category: 'Métricas', intent: 'informational', funnelStage: 'consideração', angle: 'Documentar eventos, gatilhos e testes para não depender de suposições.', format: 'checklist', cta: 'Baixar o checklist de tracking', justification: 'Tracking é pré-requisito recorrente para as plataformas de automação.', cannibalizationRisk: 'Baixo: foco em implementação.', trendGroup: 'performance', officialReferences: [GOOGLE_PMAX_URL, META_CAPI_URL] },
  { title: 'UTM em campanhas: um padrão simples para preservar a origem de cada venda', keyword: 'UTM campanhas', secondaryKeywords: ['nomenclatura UTM', 'rastreamento de mídia'], category: 'Métricas', intent: 'informational', funnelStage: 'descoberta', angle: 'Padronizar canal, campanha, conjunto e criativo sem criar nomes impraticáveis.', format: 'checklist', cta: 'Baixar o padrão UTM da W3', justification: 'Ajuda a relacionar fontes de tráfego com análise em ferramentas próprias.', cannibalizationRisk: 'Baixo: taxonomia, não tagueamento técnico.', trendGroup: 'fundamentos', officialReferences: [GOOGLE_NEWS_URL] },
  { title: 'Atribuição de marketing: como comparar plataforma, analytics e dado de negócio sem escolher um vencedor', keyword: 'atribuição de marketing', secondaryKeywords: ['modelo de atribuição', 'mensuração de mídia'], category: 'Métricas', intent: 'informational', funnelStage: 'descoberta', angle: 'Usar fontes diferentes para perguntas diferentes e registrar as limitações de cada uma.', format: 'guia', cta: 'Revisar o modelo de atribuição', justification: 'As plataformas informam resultados por critérios próprios; a pauta explica a leitura responsável.', cannibalizationRisk: 'Baixo: tema metodológico, não tutorial de ferramenta.', trendGroup: 'performance', officialReferences: [GOOGLE_PMAX_URL, META_CAPI_URL] },
  { title: 'Janela de conversão: como escolher uma leitura compatível com o ciclo de venda', keyword: 'janela de conversão', secondaryKeywords: ['attribution window', 'ciclo de compra'], category: 'Métricas', intent: 'informational', funnelStage: 'consideração', angle: 'Relacionar o prazo de decisão do cliente à data usada no relatório.', format: 'diagnóstico', cta: 'Ajustar a leitura de conversão', justification: 'Desdobra atribuição em uma configuração de relatório facilmente negligenciada.', cannibalizationRisk: 'Baixo: recorte temporal específico.', trendGroup: 'performance', officialReferences: [GOOGLE_PMAX_EVALUATION_URL] },
  { title: 'Relatório de tráfego pago: os números que exigem uma decisão e os que são contexto', keyword: 'relatório de tráfego pago', secondaryKeywords: ['dashboard de mídia', 'indicadores de performance'], category: 'Métricas', intent: 'commercial', funnelStage: 'decisão', angle: 'Trocar relatório de status por hipóteses, evidências e próximo teste.', format: 'checklist', cta: 'Receber o modelo de relatório W3', justification: 'Converte conceitos de métricas em rotina de gestão.', cannibalizationRisk: 'Baixo: formato executivo, não cálculo de indicador.', trendGroup: 'fundamentos', officialReferences: [GOOGLE_PMAX_EVALUATION_URL] },
  { title: 'Qualidade de lead: como devolver dados de vendas para melhorar a otimização de mídia', keyword: 'qualidade de lead tráfego pago', secondaryKeywords: ['lead qualificado', 'CRM e mídia paga'], category: 'Métricas', intent: 'commercial', funnelStage: 'decisão', angle: 'Criar feedback entre campanha, CRM e atendimento para otimizar por resultado comercial.', format: 'framework', cta: 'Conectar CRM e mídia com a W3', justification: 'A CAPI oficial contempla eventos de CRM e conversões offline, o que sustenta o tema.', cannibalizationRisk: 'Baixo: ponte entre mídia e vendas.', trendGroup: 'performance', officialReferences: [META_CAPI_URL] },

  // Criativos e performance (10)
  { title: 'Criativos de performance: como transformar dor, prova e objeção em anúncios testáveis', keyword: 'criativos para anúncios', secondaryKeywords: ['ângulos de criativo', 'anúncios de performance'], category: 'Criativos', intent: 'informational', funnelStage: 'descoberta', angle: 'Criar uma matriz de mensagens antes de abrir o editor de anúncios.', format: 'framework', cta: 'Montar uma matriz de criativos', justification: 'Criativos teve o segundo maior interesse relativo no segundo grupo de Trends.', cannibalizationRisk: 'Baixo: abordagem estratégica de mensagem.', trendGroup: 'performance', officialReferences: [META_ADVANTAGE_URL, GOOGLE_PMAX_EVALUATION_URL] },
  { title: 'Briefing de criativo para tráfego pago: o que a mídia precisa entregar à criação', keyword: 'briefing de criativo', secondaryKeywords: ['briefing de anúncio', 'criativo de performance'], category: 'Criativos', intent: 'informational', funnelStage: 'consideração', angle: 'Substituir pedidos vagos por hipótese, público, oferta, prova e formato.', format: 'checklist', cta: 'Baixar o modelo de briefing W3', justification: 'A pauta operacionaliza a produção contínua de novos ângulos.', cannibalizationRisk: 'Baixo: foco no processo de briefing.', trendGroup: 'performance', officialReferences: [META_ADVANTAGE_URL] },
  { title: 'Hooks para anúncios: como abrir um criativo com contexto sem apelar para promessa vazia', keyword: 'hook para anúncio', secondaryKeywords: ['gancho de anúncio', 'primeiros segundos do vídeo'], category: 'Criativos', intent: 'informational', funnelStage: 'descoberta', angle: 'Relacionar a abertura ao problema real e ao estágio de consciência do público.', format: 'guia', cta: 'Criar uma biblioteca de hooks', justification: 'Desdobra a busca por criativos em um componente que pode ser testado isoladamente.', cannibalizationRisk: 'Baixo: recorte de abertura.', trendGroup: 'performance', officialReferences: [META_ADVANTAGE_URL] },
  { title: 'UGC para anúncios: como planejar prova e demonstração sem parecer roteiro publicitário', keyword: 'UGC para anúncios', secondaryKeywords: ['conteúdo gerado pelo usuário', 'vídeo de depoimento'], category: 'Criativos', intent: 'commercial', funnelStage: 'consideração', angle: 'Usar contexto de uso, objeção e demonstração em vez de imitar depoimentos genéricos.', format: 'guia', cta: 'Planejar uma pauta UGC', justification: 'Amplia o cluster de criativos para formato visual de alta aplicabilidade.', cannibalizationRisk: 'Baixo: formato específico, não estratégia geral.', trendGroup: 'performance', officialReferences: [META_ADVANTAGE_URL] },
  { title: 'Teste A/B de anúncios: como mudar uma variável por vez para aprender mais rápido', keyword: 'teste A/B anúncios', secondaryKeywords: ['teste de criativo', 'experimento de anúncio'], category: 'Criativos', intent: 'informational', funnelStage: 'consideração', angle: 'Definir hipótese, controle, variável, critério e janela antes de ler o resultado.', format: 'framework', cta: 'Receber o roteiro de testes W3', justification: 'Conecta produção criativa à disciplina de experimentação.', cannibalizationRisk: 'Baixo: teste de anúncio, distinto de experimento de campanha.', trendGroup: 'performance', officialReferences: [GOOGLE_PMAX_EVALUATION_URL] },
  { title: 'Fadiga criativa: sinais para renovar anúncios sem desperdiçar um vencedor', keyword: 'fadiga criativa', secondaryKeywords: ['saturação de criativos', 'renovação de anúncios'], category: 'Criativos', intent: 'informational', funnelStage: 'consideração', angle: 'Cruzar frequência, CTR, custo e conversão antes de declarar que o criativo morreu.', format: 'diagnóstico', cta: 'Criar uma rotina de renovação', justification: 'Complementa a análise de frequência por uma decisão concreta de criação.', cannibalizationRisk: 'Baixo: desgaste de material, não métrica de leilão.', trendGroup: 'performance', officialReferences: [META_ADVANTAGE_URL] },
  { title: 'Prova social em anúncios: quais evidências reduzem risco sem exagerar resultados', keyword: 'prova social em anúncios', secondaryKeywords: ['depoimento em anúncio', 'credibilidade de marca'], category: 'Criativos', intent: 'commercial', funnelStage: 'decisão', angle: 'Escolher evidências verificáveis e alinhadas ao produto, evitando promessas absolutas.', format: 'checklist', cta: 'Revisar a prova dos seus anúncios', justification: 'Apoia mensagens de decisão para ofertas que precisam reduzir objeção.', cannibalizationRisk: 'Baixo: elemento de persuasão específico.', trendGroup: 'performance', officialReferences: [META_ADVANTAGE_URL] },
  { title: 'Anúncio estático ou vídeo: como escolher formato pela mensagem e não pela moda', keyword: 'anúncio estático ou vídeo', secondaryKeywords: ['formatos de anúncio', 'criativo para Meta Ads'], category: 'Criativos', intent: 'informational', funnelStage: 'descoberta', angle: 'Partir da demonstração que a oferta exige e só então escolher produção.', format: 'comparativo', cta: 'Priorizar formatos de criativo', justification: 'Ajuda a transformar diversidade de ativos em decisão de produção.', cannibalizationRisk: 'Baixo: comparação de formatos.', trendGroup: 'performance', officialReferences: [GOOGLE_PMAX_EVALUATION_URL, META_ADVANTAGE_URL] },
  { title: 'Copy para anúncios: como alinhar promessa, mecanismo e próximo passo', keyword: 'copy para anúncios', secondaryKeywords: ['texto de anúncio', 'copywriting de performance'], category: 'Criativos', intent: 'informational', funnelStage: 'consideração', angle: 'Usar clareza e especificidade para conectar o clique à página de destino.', format: 'guia', cta: 'Revisar a mensagem dos anúncios', justification: 'Completa o ciclo criativo com texto que sustenta a proposta visual.', cannibalizationRisk: 'Baixo: foco em texto, não em ângulo.', trendGroup: 'performance', officialReferences: [GOOGLE_NEWS_URL] },
  { title: 'Biblioteca de criativos: como documentar aprendizados para produzir com mais consistência', keyword: 'biblioteca de criativos', secondaryKeywords: ['gestão de criativos', 'aprendizados de anúncios'], category: 'Criativos', intent: 'commercial', funnelStage: 'decisão', angle: 'Registrar hipótese, formato, público, resultado e observação sem transformar a planilha em cemitério.', format: 'checklist', cta: 'Implantar uma biblioteca de criativos', justification: 'Cria continuidade editorial entre testes, produção e escala.', cannibalizationRisk: 'Baixo: foco em operação e documentação.', trendGroup: 'performance', officialReferences: [META_ADVANTAGE_URL] },

  // E-commerce, landing pages e conversão (10)
  { title: 'Tráfego pago para e-commerce: por onde começar sem desperdiçar verba', keyword: 'tráfego pago para e-commerce', secondaryKeywords: ['anúncios para loja virtual', 'mídia paga e-commerce'], category: 'E-commerce', intent: 'commercial', funnelStage: 'decisão', angle: 'Começar por margem, oferta, mensuração e página antes do primeiro aumento de investimento.', format: 'checklist', cta: 'Solicitar um diagnóstico de e-commerce', justification: 'Tráfego pago e e-commerce foram termos consultados diretamente no Trends público.', cannibalizationRisk: 'Baixo: visão inicial de operação.', trendGroup: 'fundamentos', officialReferences: [GOOGLE_PMAX_URL, META_ADVANTAGE_URL] },
  { title: 'Landing page para tráfego pago: os elementos que reduzem dúvida depois do clique', keyword: 'landing page para tráfego pago', secondaryKeywords: ['página de conversão', 'landing page e-commerce'], category: 'E-commerce', intent: 'commercial', funnelStage: 'decisão', angle: 'Alinhar promessa, demonstração, prova, oferta e ação para não perder intenção comprada.', format: 'checklist', cta: 'Avaliar uma landing page', justification: 'Conversão foi o termo de maior interesse relativo no segundo grupo da consulta.', cannibalizationRisk: 'Baixo: foco em página de campanha.', trendGroup: 'performance', officialReferences: [GOOGLE_PMAX_EVALUATION_URL] },
  { title: 'CRO para e-commerce: como priorizar testes antes de comprar mais tráfego', keyword: 'CRO para e-commerce', secondaryKeywords: ['otimização de conversão', 'taxa de conversão loja virtual'], category: 'E-commerce', intent: 'commercial', funnelStage: 'decisão', angle: 'Priorizar problemas de clareza, confiança e checkout pela perda de receita potencial.', format: 'framework', cta: 'Solicitar uma análise de conversão', justification: 'A pauta transforma o interesse por conversão em uma agenda de melhoria de site.', cannibalizationRisk: 'Médio: complementar à landing page por foco no processo de priorização.', trendGroup: 'performance', officialReferences: [GOOGLE_PMAX_EVALUATION_URL] },
  { title: 'Checkout de e-commerce: um checklist para remover atrito de compra', keyword: 'checkout e-commerce', secondaryKeywords: ['abandono de carrinho', 'conversão no checkout'], category: 'E-commerce', intent: 'commercial', funnelStage: 'decisão', angle: 'Encontrar dúvidas de frete, prazo, pagamento e confiança que a mídia não consegue compensar.', format: 'checklist', cta: 'Auditar o checkout da loja', justification: 'Aprofunda o cluster de conversão no ponto mais próximo da receita.', cannibalizationRisk: 'Baixo: recorte de checkout.', trendGroup: 'performance', officialReferences: [GOOGLE_PMAX_EVALUATION_URL] },
  { title: 'Página de produto que converte: o que revisar antes de aumentar o orçamento', keyword: 'página de produto que converte', secondaryKeywords: ['PDP e-commerce', 'página de produto'], category: 'E-commerce', intent: 'commercial', funnelStage: 'decisão', angle: 'Conectar informação de produto, prova, entrega e decisão de compra.', format: 'diagnóstico', cta: 'Revisar as páginas de produto', justification: 'Relaciona a qualidade da sessão pós-clique com eficiência de mídia.', cannibalizationRisk: 'Baixo: foco em PDP, distinto de landing page genérica.', trendGroup: 'performance', officialReferences: [GOOGLE_PMAX_EVALUATION_URL] },
  { title: 'Margem e ROAS no e-commerce: como transformar resultado de mídia em lucro possível', keyword: 'ROAS e-commerce', secondaryKeywords: ['margem de contribuição', 'ROAS mínimo'], category: 'E-commerce', intent: 'commercial', funnelStage: 'decisão', angle: 'Incluir custo de produto, frete, taxas e recompra antes de chamar uma campanha de lucrativa.', format: 'guia', cta: 'Calcular o ROAS de equilíbrio', justification: 'ROAS integra a pesquisa de palavras-chave e uma decisão financeira essencial de loja virtual.', cannibalizationRisk: 'Baixo: recorte financeiro de e-commerce.', trendGroup: 'fundamentos', officialReferences: [GOOGLE_PMAX_URL] },
  { title: 'Funil de e-commerce: como conectar descoberta, consideração e recompra na mídia paga', keyword: 'funil de e-commerce', secondaryKeywords: ['jornada de compra', 'campanhas de e-commerce'], category: 'E-commerce', intent: 'informational', funnelStage: 'descoberta', angle: 'Definir função de cada campanha sem exigir que todo anúncio feche a venda sozinho.', format: 'framework', cta: 'Desenhar o funil da operação', justification: 'Integra os termos de tráfego pago, e-commerce e conversão em uma arquitetura de jornada.', cannibalizationRisk: 'Baixo: foco em desenho de jornada.', trendGroup: 'fundamentos', officialReferences: [GOOGLE_PMAX_URL, META_ADVANTAGE_URL] },
  { title: 'Google Ads ou Meta Ads para e-commerce: como escolher o primeiro teste de canal', keyword: 'Google Ads ou Meta Ads para e-commerce', secondaryKeywords: ['canal de mídia para loja virtual', 'comparar Google e Meta'], category: 'E-commerce', intent: 'commercial', funnelStage: 'decisão', angle: 'Comparar intenção, ticket, maturidade de criativo e dados disponíveis para definir uma primeira hipótese.', format: 'comparativo', cta: 'Pedir um diagnóstico de canal', justification: 'A consulta colocou Google Ads e Meta Ads no mesmo conjunto comparativo para orientar essa decisão.', cannibalizationRisk: 'Baixo: recorte específico de e-commerce.', trendGroup: 'fundamentos', officialReferences: [GOOGLE_NEWS_URL, META_ADVANTAGE_URL] },
  { title: 'Campanhas promocionais no e-commerce: como planejar oferta, estoque e mensuração', keyword: 'campanha promocional e-commerce', secondaryKeywords: ['promoção loja virtual', 'planejamento de campanha'], category: 'E-commerce', intent: 'commercial', funnelStage: 'decisão', angle: 'Evitar que a urgência de venda crie ruptura de estoque ou ilusão de rentabilidade.', format: 'checklist', cta: 'Planejar a próxima campanha promocional', justification: 'Cria uma pauta sazonal reutilizável sem depender de volume inventado.', cannibalizationRisk: 'Baixo: foco em ação promocional.', trendGroup: 'fundamentos', officialReferences: [GOOGLE_NEWS_URL] },
  { title: 'Como escalar e-commerce com tráfego pago sem perder previsibilidade', keyword: 'escalar e-commerce com tráfego pago', secondaryKeywords: ['escala de loja virtual', 'crescer investimento em mídia'], category: 'E-commerce', intent: 'commercial', funnelStage: 'decisão', angle: 'Só aumentar investimento quando aquisição, conversão, margem e operação têm um limite claro.', format: 'framework', cta: 'Planejar a escala da operação', justification: 'Fecha o cluster com uma decisão de crescimento sustentada por dados de negócio.', cannibalizationRisk: 'Baixo: foco em escala integrada, distinto de orçamento inicial.', trendGroup: 'fundamentos', officialReferences: [GOOGLE_PMAX_URL, META_ADVANTAGE_URL] },
]

function researchUrlFor(plan: EvergreenPlan) {
  return plan.trendGroup === 'fundamentos' ? TRENDS_FUNDAMENTALS_URL : TRENDS_PERFORMANCE_URL
}

function excerptFor(plan: EvergreenPlan) {
  return `${plan.keyword}: um guia prático para ${plan.angle.charAt(0).toLowerCase()}${plan.angle.slice(1)}`
}

function makeEvergreenContent(plan: EvergreenPlan) {
  const faq = [
    { question: `Por onde começar com ${plan.keyword}?`, answer: `Comece definindo uma hipótese, o indicador que a confirma e o limite financeiro aceitável. ${plan.angle}` },
    { question: 'Quanto tempo devo esperar para avaliar?', answer: 'Use uma janela compatível com o volume, o ciclo de venda e a conversão escolhida. Evite concluir por poucos dias ou por uma métrica isolada.' },
    { question: 'Quando vale pedir ajuda especializada?', answer: 'Quando tracking, margem, criativo e operação comercial precisam ser lidos em conjunto para transformar dados em próximos testes.' },
  ]

  return {
    sections: [
      { heading: 'O problema que esta pauta resolve', paragraphs: [`${plan.title} não é uma decisão isolada. Antes de alterar uma campanha, a operação precisa saber qual hipótese está sendo testada, qual dado a sustenta e qual resultado de negócio seria aceitável.`, `O recorte da W3 é direto: ${plan.angle}`] },
      { heading: `Como abordar ${plan.keyword} com contexto`, paragraphs: [`A palavra-chave principal aponta uma necessidade de ${plan.intent === 'commercial' ? 'decisão e execução' : 'entendimento e método'}. Por isso, a análise deve combinar o estágio ${plan.funnelStage}, a oferta, a página de destino e a capacidade operacional.`, 'O interesse relativo observado no Google Trends orienta a prioridade editorial, mas não representa volume de busca, demanda absoluta ou previsão de resultado.'] },
      { heading: 'Passo a passo de aplicação', paragraphs: ['Use um processo curto, documentado e reversível. A meta não é fazer muitas alterações; é aprender qual alavanca merece o próximo investimento.'], bullets: ['Defina o resultado de negócio e a métrica de apoio.', 'Registre a hipótese e a variável que poderá mudar.', 'Confirme se tracking, página e oferta conseguem medir a decisão.', 'Aplique uma mudança por vez e defina a janela de leitura.', 'Documente o aprendizado antes de escalar ou descartar a hipótese.'] },
      { heading: 'Exemplo prático', paragraphs: [`Uma operação pode perceber piora de eficiência e assumir que o problema é apenas mídia. Em vez disso, ela separa o funil: mensagem e clique, qualidade da sessão, avanço na página e conversão final. Esse recorte revela onde ${plan.keyword} realmente pede intervenção.`, 'Se a evidência apontar para uma etapa fora da plataforma, a próxima ação pode ser corrigir oferta, página, catálogo, atendimento ou mensuração — e não aumentar orçamento.'] },
      { heading: 'Erros que atrapalham a decisão', paragraphs: ['O erro mais comum é otimizar uma métrica antes de definir o que ela explica. Outro é alterar público, criativo, orçamento e página ao mesmo tempo, eliminando a possibilidade de aprender.'], bullets: ['Usar um dado isolado como sentença final.', 'Comparar períodos com contextos comerciais diferentes.', 'Ignorar margem, estoque ou qualidade de venda.', 'Confundir automação com ausência de governança.', 'Repetir uma pauta próxima sem um recorte novo.'] },
      { heading: 'Checklist antes do próximo teste', paragraphs: ['Use esta lista para transformar leitura em uma ação que possa ser revisada depois.'], bullets: ['Objetivo e indicador definidos.', 'Hipótese registrada em linguagem simples.', 'Dados de conversão conferidos.', 'Página e oferta coerentes com o anúncio.', 'Responsável e data de revisão combinados.'] },
      { heading: 'Perguntas frequentes', paragraphs: faq.map((item) => `${item.question} ${item.answer}`) },
      { heading: 'Próximo passo', paragraphs: [`${plan.cta}. A W3 conecta estratégia, mídia, criativos, mensuração e conversão para que a próxima decisão tenha uma justificativa clara.`] },
    ],
    seo: {
      title: `${plan.title} | W3 Tráfego Pago`,
      metaDescription: `Entenda ${plan.keyword} com um método prático para decidir, testar e melhorar a performance da operação.`,
      h1: plan.title,
      introduction: `Neste guia, você vai entender como usar ${plan.keyword} com uma rotina de decisão que considera mídia, conversão e resultado de negócio.`,
      index: ['O problema que esta pauta resolve', `Como abordar ${plan.keyword} com contexto`, 'Passo a passo de aplicação', 'Exemplo prático', 'Erros que atrapalham a decisão', 'Checklist antes do próximo teste', 'Perguntas frequentes'],
      faq,
      cta: plan.cta,
      editorialSource: `Pesquisa editorial W3: Google Trends público e referências oficiais de plataforma, coletadas em 07/08/2026.`,
      reviewDate: REVIEW_DATE,
      estimatedReadMinutes: 7,
    },
    editorial: {
      primaryKeyword: plan.keyword,
      secondaryKeywords: plan.secondaryKeywords,
      intent: plan.intent,
      funnelStage: plan.funnelStage,
      originalAngle: plan.angle,
      format: plan.format,
      justification: plan.justification,
      cannibalizationRisk: plan.cannibalizationRisk,
      researchUrl: researchUrlFor(plan),
      collectedAt: COLLECTED_AT,
      officialReferences: plan.officialReferences,
    },
  }
}

const evergreenSlots = getSeptemberEditorialCalendar().filter((slot) => slot.kind === 'evergreen')

if (evergreenSlots.length !== evergreenPlans.length) {
  throw new Error(`expected ${evergreenSlots.length} evergreen plans, received ${evergreenPlans.length}`)
}

const evergreenPosts: BlogPostSeed[] = evergreenPlans.map((plan, index) => {
  const slot = evergreenSlots[index]
  return {
    slug: buildSlug(plan.title),
    title: plan.title,
    excerpt: excerptFor(plan),
    content: makeEvergreenContent(plan),
    category: plan.category,
    kind: 'evergreen',
    status: 'scheduled',
    keyword: plan.keyword,
    source_url: researchUrlFor(plan),
    source_collected_at: COLLECTED_AT,
    scheduled_for: `${slot.date}T${slot.time}:00-03:00`,
    published_at: null,
  }
})

const CONFIRMED_META_UPDATE_URL = 'https://about.fb.com/news/2025/02/gen-ai-transparency-metas-ads-products/'
const updateSlots = getSeptemberEditorialCalendar().filter((slot) => slot.kind === 'platform-update')

const platformUpdatePosts: BlogPostSeed[] = updateSlots.map((slot, index) => {
  const confirmed = index === 0
  const title = confirmed
    ? 'Transparência de IA em anúncios da Meta: o que a atualização oficial informa'
    : `Monitoramento de atualização de plataforma — ${slot.date}`
  const sourceUrl = confirmed ? CONFIRMED_META_UPDATE_URL : null
  const category: EditorialCategory = confirmed || index % 2 === 0 ? 'Meta Ads' : 'Google Ads'
  const updateContent = confirmed
    ? {
        sections: [
          { heading: 'Fato confirmado', paragraphs: ['A Meta atualizou, em 1º de junho de 2026, seu comunicado sobre transparência de IA em anúncios. A fonte informa o início da disponibilização de um destino unificado “About this ad” com informações adicionais, acessível pelo menu de três pontos do anúncio.'] },
          { heading: 'Quem pode ser afetado', paragraphs: ['Anunciantes que usam ferramentas de IA para criar ou editar materiais de anúncio e equipes responsáveis por revisão de criativos, marca e conformidade.'] },
          { heading: 'Impacto provável — interpretação editorial', paragraphs: ['A atualização pode exigir que equipes acompanhem os detalhes de transparência exibidos nos anúncios e alinhem seus processos de criação, aprovação e documentação. Isso é uma interpretação; a fonte não promete impacto de performance.'] },
          { heading: 'O que o anunciante deve revisar', bullets: ['Onde as informações de transparência aparecem no anúncio.', 'Quais ferramentas de IA participam do fluxo criativo.', 'Como a equipe registra origem e aprovação de ativos.', 'Se existem orientações internas de marca ou compliance a atualizar.'], paragraphs: ['A revisão deve ser feita no ambiente da própria conta quando o recurso estiver disponível.'] },
          { heading: 'O que ainda não está confirmado', paragraphs: ['A fonte não afirma uma mudança de entrega, leilão, segmentação, custo ou resultado de campanha. Ela também não permite inferir cronograma idêntico para todas as contas ou regiões.'] },
          { heading: 'Fonte original e coleta', paragraphs: [`Fonte: ${CONFIRMED_META_UPDATE_URL}`, `Coleta editorial: ${COLLECTED_AT}. O slot permanece em draft para revisão humana antes de qualquer publicação.`] },
        ],
        seo: {
          title: 'Transparência de IA em anúncios da Meta | W3 Tráfego Pago',
          metaDescription: 'O que a atualização oficial da Meta informa sobre transparência de IA em anúncios e o que revisar na operação.',
          h1: title,
          introduction: 'Este draft separa o anúncio oficial da Meta das interpretações operacionais que uma equipe de mídia pode testar.',
          index: ['Fato confirmado', 'Quem pode ser afetado', 'Impacto provável', 'O que o anunciante deve revisar', 'O que ainda não está confirmado'],
          faq: [],
          cta: 'Pedir uma revisão de governança de criativos',
          editorialSource: 'Meta Newsroom, fonte oficial coletada em 07/08/2026.',
          reviewDate: REVIEW_DATE,
          estimatedReadMinutes: 4,
        },
        editorial: {
          primaryKeyword: 'atualização Meta Ads',
          secondaryKeywords: ['transparência de IA em anúncios', 'About this ad'],
          intent: 'informational' as Intent,
          funnelStage: 'descoberta' as FunnelStage,
          originalAngle: 'Separar anúncio oficial, impacto provável e pontos ainda não confirmados.',
          format: 'análise de atualização',
          justification: 'Mudança confirmada por fonte oficial da Meta; preservada como draft para revisão humana.',
          cannibalizationRisk: 'Baixo: notícia de plataforma, datada e vinculada à fonte original.',
          researchUrl: CONFIRMED_META_UPDATE_URL,
          collectedAt: COLLECTED_AT,
          officialReferences: [CONFIRMED_META_UPDATE_URL],
        },
        update: {
          state: 'confirmed-source' as const,
          announcedAt: '2026-06-01T09:00:00-07:00',
          affectedAudience: 'Anunciantes e equipes que usam recursos de IA no fluxo criativo de anúncios Meta.',
          likelyImpact: 'Possível ajuste de governança e revisão de transparência; nenhum efeito de performance é afirmado pela fonte.',
          reviewActions: ['Verificar a disponibilidade na conta.', 'Revisar o fluxo de aprovação de criativos.', 'Registrar a origem de ativos criados ou editados com IA.'],
          unconfirmed: ['Mudança de entrega ou leilão.', 'Impacto em CPM, CPA ou ROAS.', 'Cronograma igual para todas as contas e regiões.'],
        },
      }
    : {
        sections: [],
        seo: {
          title: `${title} | W3 Tráfego Pago`,
          metaDescription: 'Slot reservado para atualização oficial de Google Ads ou Meta Ads.',
          h1: title,
          introduction: 'Nenhuma atualização foi redigida: este slot aguarda uma mudança real confirmada por fonte oficial.',
          index: [],
          faq: [],
          cta: 'Assinar os alertas de mudanças de plataforma',
          editorialSource: 'Aguardando fonte oficial verificável.',
          reviewDate: REVIEW_DATE,
          estimatedReadMinutes: 0,
        },
        editorial: {
          primaryKeyword: 'atualização Google Ads Meta Ads',
          secondaryKeywords: [],
          intent: 'informational' as Intent,
          funnelStage: 'descoberta' as FunnelStage,
          originalAngle: 'Reserva editorial; não transforma rumor, previsão ou comentário de terceiros em notícia.',
          format: 'slot de monitoramento',
          justification: 'O calendário preserva a capacidade de reagir a uma fonte oficial sem pré-publicar conteúdo não confirmado.',
          cannibalizationRisk: 'Não aplicável: não é uma pauta indexável enquanto estiver sem fonte oficial.',
          researchUrl: META_NEWS_URL,
          collectedAt: COLLECTED_AT,
          officialReferences: [],
        },
        update: {
          state: 'awaiting-official-source' as const,
          unconfirmed: ['Não há fato, impacto, público afetado ou recomendação redacional enquanto não houver fonte oficial.'],
        },
      }

  return {
    slug: buildSlug(title),
    title,
    excerpt: confirmed ? 'Draft baseado em atualização oficial da Meta, separado de interpretações e pronto para revisão humana.' : 'Slot reservado: a publicação só será produzida após confirmação oficial.',
    content: updateContent,
    category,
    kind: 'platform-update',
    status: 'draft',
    keyword: confirmed ? 'atualização Meta Ads' : 'atualização Google Ads Meta Ads',
    source_url: sourceUrl,
    source_collected_at: sourceUrl ? COLLECTED_AT : null,
    scheduled_for: `${slot.date}T${slot.time}:00-03:00`,
    published_at: null,
  }
})

export const blogPostsSeptember2026: BlogPostSeed[] = [...evergreenPosts, ...platformUpdatePosts]

export const blogPostsSeptember2026Summary = {
  total: blogPostsSeptember2026.length,
  evergreen: evergreenPosts.length,
  platformUpdates: platformUpdatePosts.length,
  categories: Object.fromEntries(
    ['Google Ads', 'Meta Ads', 'Métricas', 'Criativos', 'E-commerce'].map((category) => [
      category,
      evergreenPosts.filter((post) => post.category === category).length,
    ]),
  ) as Record<EditorialCategory, number>,
}
