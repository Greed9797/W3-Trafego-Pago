import { buildSlug } from '../api/_lib/autoblog.ts'
import type { BlogPostSeed } from './blog-posts-2026-09.ts'

type Plan = {
  scheduledFor: string
  title: string
  keyword: string
  secondaryKeywords: string[]
  category: 'Google Ads' | 'Meta Ads' | 'Métricas' | 'Criativos' | 'E-commerce'
  intent: 'informational' | 'commercial'
  funnelStage: 'descoberta' | 'consideração' | 'decisão' | 'retenção'
  angle: string
  format: 'guia' | 'checklist' | 'comparativo' | 'framework' | 'diagnóstico'
  cta: string
  justification: string
  cannibalizationRisk: string
  officialReferences: string[]
  sourceUrl: string
}

const COLLECTED_AT = '2026-08-07T17:15:00-03:00'
const REVIEW_DATE = '2027-03-01'

const GOOGLE_CAMPAIGN_SETTINGS = 'https://support.google.com/google-ads/answer/1704395?hl=pt-BR'
const GOOGLE_LOCATION_ASSETS = 'https://support.google.com/google-ads/answer/2404182?hl=pt-br'
const GOOGLE_LEAD_BEST_PRACTICES = 'https://support.google.com/google-ads/answer/13489421?hl=pt-BR'
const GOOGLE_ENHANCED_LEADS = 'https://support.google.com/google-ads/answer/15713840?hl=pt-br'
const GOOGLE_CONVERSION_GOALS = 'https://support.google.com/google-ads/answer/10995103?hl=pt-br'
const GOOGLE_LOCAL_CONVERSIONS = 'https://support.google.com/google-ads/answer/9013908?hl=pt'
const GOOGLE_CONVERSION_DATA = 'https://support.google.com/google-ads/answer/6270625?hl=pt-br'
const META_LEAD_GENERATION = 'https://www.facebook.com/business/ads/ad-objectives/lead-generation?locale=en_GB'
const META_RETARGETING = 'https://www.facebook.com/business/goals/retargeting'

const plans: Plan[] = [
  {
    scheduledFor: '2026-10-01T11:00:00-03:00',
    title: 'Tráfego pago para negócios locais: Google Ads ou Meta Ads?',
    keyword: 'tráfego pago para negócios locais',
    secondaryKeywords: ['Google Ads para negócios locais', 'Meta Ads para negócios locais', 'anúncios para empresa local'],
    category: 'Google Ads',
    intent: 'commercial',
    funnelStage: 'decisão',
    angle: 'Comparar intenção, raio de atendimento, oferta e capacidade comercial antes de escolher o primeiro canal.',
    format: 'comparativo',
    cta: 'Pedir um diagnóstico de canal para a sua região',
    justification: 'Tema de alta intenção comercial e alinhado à categoria de negócios locais observada na pesquisa competitiva.',
    cannibalizationRisk: 'Médio: recorte local diferencia o comparativo já existente para e-commerce.',
    officialReferences: [GOOGLE_CAMPAIGN_SETTINGS, GOOGLE_LOCATION_ASSETS, META_LEAD_GENERATION],
    sourceUrl: GOOGLE_CAMPAIGN_SETTINGS,
  },
  {
    scheduledFor: '2026-10-02T11:00:00-03:00',
    title: 'Google Ads para negócios locais: como usar recursos de local com controle',
    keyword: 'Google Ads para negócios locais',
    secondaryKeywords: ['recursos de local Google Ads', 'anúncio local Google', 'Perfil da Empresa Google Ads'],
    category: 'Google Ads',
    intent: 'informational',
    funnelStage: 'consideração',
    angle: 'Explicar a relação entre presença física, área atendida, recurso de local e conversões que realmente importam.',
    format: 'checklist',
    cta: 'Validar a estrutura local das suas campanhas',
    justification: 'A documentação oficial detalha recursos de local e ações como chamadas e rotas, abrindo uma pauta prática para empresas regionais.',
    cannibalizationRisk: 'Baixo: não existe guia dedicado a recursos de local no catálogo atual.',
    officialReferences: [GOOGLE_LOCATION_ASSETS, GOOGLE_LOCAL_CONVERSIONS],
    sourceUrl: GOOGLE_LOCATION_ASSETS,
  },
  {
    scheduledFor: '2026-10-03T11:00:00-03:00',
    title: 'Google Ads para geração de leads: do formulário ao lead qualificado',
    keyword: 'Google Ads para geração de leads',
    secondaryKeywords: ['gerar leads no Google Ads', 'lead qualificado Google Ads', 'campanha de leads'],
    category: 'Google Ads',
    intent: 'commercial',
    funnelStage: 'decisão',
    angle: 'Trocar a meta de volume de formulários por uma jornada que conecte conversão, qualificação e venda.',
    format: 'guia',
    cta: 'Desenhar o funil de leads da sua operação',
    justification: 'A orientação oficial recomenda mapear a jornada até a qualificação e a venda, um tema com intenção de contratação.',
    cannibalizationRisk: 'Médio: diferencia-se do conteúdo de qualidade de lead pelo foco na arquitetura completa da campanha.',
    officialReferences: [GOOGLE_LEAD_BEST_PRACTICES, GOOGLE_CONVERSION_GOALS],
    sourceUrl: GOOGLE_LEAD_BEST_PRACTICES,
  },
  {
    scheduledFor: '2026-10-04T11:00:00-03:00',
    title: 'Conversões otimizadas para leads: o que muda na mensuração do Google Ads',
    keyword: 'conversões otimizadas para leads',
    secondaryKeywords: ['conversão offline Google Ads', 'Data Manager API Google Ads', 'mensuração de leads'],
    category: 'Métricas',
    intent: 'informational',
    funnelStage: 'consideração',
    angle: 'Mostrar como conectar dados fornecidos pelo usuário, CRM e conversões de negócio sem prometer atribuição perfeita.',
    format: 'diagnóstico',
    cta: 'Revisar o caminho do lead até a venda',
    justification: 'A página oficial foi atualizada para orientar a migração de importações offline e é uma fonte atual para pauta de mensuração.',
    cannibalizationRisk: 'Baixo: o catálogo fala de qualidade de lead, mas não explica o novo fluxo de conversões otimizadas.',
    officialReferences: [GOOGLE_ENHANCED_LEADS, GOOGLE_CONVERSION_DATA],
    sourceUrl: GOOGLE_ENHANCED_LEADS,
  },
  {
    scheduledFor: '2026-10-05T11:00:00-03:00',
    title: 'Metas de conversão no Google Ads: como escolher a ação principal',
    keyword: 'metas de conversão Google Ads',
    secondaryKeywords: ['ação de conversão principal', 'otimização de conversões', 'meta de campanha Google Ads'],
    category: 'Métricas',
    intent: 'informational',
    funnelStage: 'consideração',
    angle: 'Organizar ações de compra, contato e formulário para que o algoritmo receba um sinal coerente com o negócio.',
    format: 'checklist',
    cta: 'Auditar as ações de conversão da conta',
    justification: 'Metas de conversão são um tema perene com fonte oficial e forte conexão entre configuração e performance.',
    cannibalizationRisk: 'Baixo: amplia o conteúdo de conversões Google Ads para a decisão de governança da conta.',
    officialReferences: [GOOGLE_CONVERSION_GOALS, GOOGLE_CONVERSION_DATA],
    sourceUrl: GOOGLE_CONVERSION_GOALS,
  },
  {
    scheduledFor: '2026-10-06T11:00:00-03:00',
    title: 'Lead Ads: formulário, mensagem ou chamada — qual formato escolher?',
    keyword: 'Lead Ads formulário mensagem chamada',
    secondaryKeywords: ['anúncio de lead Meta Ads', 'gerar leads no Instagram', 'campanha de mensagem Meta Ads'],
    category: 'Meta Ads',
    intent: 'commercial',
    funnelStage: 'decisão',
    angle: 'Comparar fricção, velocidade de atendimento e qualidade esperada em formulários, conversas e ligações.',
    format: 'comparativo',
    cta: 'Escolher o formato de lead mais adequado',
    justification: 'A própria Meta apresenta os três formatos como caminhos diferentes para geração de leads; o recorte ajuda a decisão.',
    cannibalizationRisk: 'Médio: o post existente sobre leads Meta Ads cobre otimização; este cobre escolha de formato.',
    officialReferences: [META_LEAD_GENERATION],
    sourceUrl: META_LEAD_GENERATION,
  },
  {
    scheduledFor: '2026-10-07T11:00:00-03:00',
    title: 'Meta Ads para negócios locais: do alcance regional à visita',
    keyword: 'Meta Ads para negócios locais',
    secondaryKeywords: ['anúncios para loja local', 'Instagram para negócios locais', 'campanha regional Meta Ads'],
    category: 'Meta Ads',
    intent: 'commercial',
    funnelStage: 'consideração',
    angle: 'Montar uma sequência que combine descoberta, prova, conversa e ação local sem confundir alcance com venda.',
    format: 'framework',
    cta: 'Montar um plano de mídia para a sua região',
    justification: 'Negócios locais aparecem como categoria ativa no mercado; a pauta complementa o novo comparativo de canais.',
    cannibalizationRisk: 'Baixo: o catálogo atual não possui um guia de Meta Ads para operação local.',
    officialReferences: [META_LEAD_GENERATION, META_RETARGETING],
    sourceUrl: META_LEAD_GENERATION,
  },
  {
    scheduledFor: '2026-10-08T11:00:00-03:00',
    title: 'Retargeting de leads: como criar uma sequência sem perseguir o mesmo público',
    keyword: 'retargeting de leads',
    secondaryKeywords: ['remarketing para leads', 'sequência de anúncios', 'público de engajamento Meta Ads'],
    category: 'Meta Ads',
    intent: 'informational',
    funnelStage: 'consideração',
    angle: 'Separar descoberta, consideração e decisão com janelas, exclusões e mensagens compatíveis com o comportamento do lead.',
    format: 'framework',
    cta: 'Revisar a sequência de remarketing',
    justification: 'A documentação da Meta descreve públicos de visitantes, listas e engajamento; o novo ângulo é a sequência pós-lead.',
    cannibalizationRisk: 'Médio: o post de remarketing existente é amplo; este foca a jornada de leads.',
    officialReferences: [META_RETARGETING, META_LEAD_GENERATION],
    sourceUrl: META_RETARGETING,
  },
  {
    scheduledFor: '2026-10-09T11:00:00-03:00',
    title: 'CPL x CAC: qual métrica deve guiar a mídia de serviços?',
    keyword: 'CPL e CAC em tráfego pago',
    secondaryKeywords: ['custo por lead', 'custo de aquisição de cliente', 'margem em serviços'],
    category: 'Métricas',
    intent: 'commercial',
    funnelStage: 'decisão',
    angle: 'Explicar por que o menor custo por lead pode esconder baixa qualificação e como ligar mídia ao fechamento.',
    format: 'comparativo',
    cta: 'Calcular o limite de aquisição da operação',
    justification: 'O catálogo já trata CAC e qualidade de lead separadamente; o cruzamento cria uma pauta de decisão para serviços.',
    cannibalizationRisk: 'Médio: exige links internos para CAC e qualidade de lead, com diferença clara de comparação.',
    officialReferences: [GOOGLE_LEAD_BEST_PRACTICES, GOOGLE_CONVERSION_DATA],
    sourceUrl: GOOGLE_LEAD_BEST_PRACTICES,
  },
  {
    scheduledFor: '2026-10-10T11:00:00-03:00',
    title: 'Tráfego pago para prestadores de serviço: um método para começar',
    keyword: 'tráfego pago para prestadores de serviço',
    secondaryKeywords: ['anúncios para serviços', 'marketing para prestadores', 'campanha local para serviços'],
    category: 'Google Ads',
    intent: 'commercial',
    funnelStage: 'descoberta',
    angle: 'Organizar oferta, área de atendimento, prova e processo comercial antes de comprar cliques.',
    format: 'guia',
    cta: 'Estruturar o primeiro teste de mídia',
    justification: 'A pauta traduz a busca ampla por tráfego pago em um caso de uso comercial e recorrente para a W3.',
    cannibalizationRisk: 'Baixo: não existe conteúdo dedicado a prestadores de serviço no catálogo atual.',
    officialReferences: [GOOGLE_CAMPAIGN_SETTINGS, GOOGLE_LEAD_BEST_PRACTICES],
    sourceUrl: GOOGLE_CAMPAIGN_SETTINGS,
  },
  {
    scheduledFor: '2026-10-11T11:00:00-03:00',
    title: 'Orçamento de tráfego pago para serviços: como ligar meta, capacidade e CAC',
    keyword: 'orçamento de tráfego pago para serviços',
    secondaryKeywords: ['verba para anúncios', 'CAC aceitável', 'capacidade comercial'],
    category: 'Métricas',
    intent: 'commercial',
    funnelStage: 'decisão',
    angle: 'Definir investimento inicial a partir de capacidade de atendimento e economia do negócio, não de um valor universal.',
    format: 'framework',
    cta: 'Montar uma meta de mídia compatível com sua operação',
    justification: 'Complementa o orçamento inicial de Google Ads com foco no ciclo de venda de serviços.',
    cannibalizationRisk: 'Médio: recorte de serviço e capacidade comercial separa a pauta do orçamento de campanha.',
    officialReferences: [GOOGLE_LEAD_BEST_PRACTICES, GOOGLE_CAMPAIGN_SETTINGS],
    sourceUrl: GOOGLE_LEAD_BEST_PRACTICES,
  },
  {
    scheduledFor: '2026-10-12T11:00:00-03:00',
    title: 'Como medir chamadas e rotas geradas por anúncios locais no Google Ads',
    keyword: 'medir chamadas e rotas no Google Ads',
    secondaryKeywords: ['conversões locais Google Ads', 'ligações de anúncios', 'visitas à loja'],
    category: 'Google Ads',
    intent: 'informational',
    funnelStage: 'consideração',
    angle: 'Criar uma leitura de ações locais para não avaliar a campanha apenas por formulário ou compra online.',
    format: 'diagnóstico',
    cta: 'Auditar as conversões locais da conta',
    justification: 'A central oficial descreve chamadas, rotas e visitas como ações locais mensuráveis para negócios elegíveis.',
    cannibalizationRisk: 'Baixo: assunto específico ainda ausente do catálogo.',
    officialReferences: [GOOGLE_LOCAL_CONVERSIONS, GOOGLE_LOCATION_ASSETS],
    sourceUrl: GOOGLE_LOCAL_CONVERSIONS,
  },
  {
    scheduledFor: '2026-10-13T11:00:00-03:00',
    title: 'Google Ads e SEO para negócios locais: como combinar demanda e aquisição',
    keyword: 'Google Ads e SEO para negócios locais',
    secondaryKeywords: ['SEO local e tráfego pago', 'busca orgânica e anúncios', 'marketing local'],
    category: 'Google Ads',
    intent: 'informational',
    funnelStage: 'descoberta',
    angle: 'Separar o papel de mídia paga e busca orgânica sem criar uma disputa artificial entre canais.',
    format: 'comparativo',
    cta: 'Mapear oportunidades de aquisição local',
    justification: 'Pauta de entrada para SEO que conecta o blog de tráfego pago ao contexto real de busca do cliente.',
    cannibalizationRisk: 'Baixo: não há conteúdo de integração SEO e mídia no catálogo atual.',
    officialReferences: [GOOGLE_CAMPAIGN_SETTINGS, GOOGLE_LOCATION_ASSETS],
    sourceUrl: GOOGLE_CAMPAIGN_SETTINGS,
  },
]

function faqFor(plan: Plan) {
  return [
    {
      question: `Por onde começar com ${plan.keyword}?`,
      answer: `Comece definindo a oferta, a ação de conversão e o critério de qualidade. Depois escolha um teste que possa ser medido sem alterar várias variáveis ao mesmo tempo.`,
    },
    {
      question: 'Quanto investir no primeiro teste?',
      answer: 'O valor depende do ciclo de venda, do CAC aceitável, da capacidade de atendimento e do volume necessário para aprender. Não existe uma verba universal que garanta resultado.',
    },
    {
      question: 'Quando revisar a estratégia?',
      answer: 'Revise quando o dado acumulado permitir uma comparação justa e quando a operação conseguir separar problema de mídia, oferta, página, atendimento ou mensuração.',
    },
  ]
}

function makeContent(plan: Plan) {
  const faq = faqFor(plan)
  const headings = [
    `Por que ${plan.keyword} merece um método`,
    'O contexto que precisa estar definido',
    'Roteiro de aplicação',
    'Exemplo de decisão',
    'Erros que distorcem a leitura',
    'Checklist antes do próximo teste',
    'Perguntas frequentes',
  ]

  return {
    sections: [
      {
        heading: headings[0],
        paragraphs: [
          `${plan.title} não deve ser tratado como uma configuração isolada. O resultado depende de oferta, mensagem, público, página, atendimento e mensuração.`,
          `O recorte da W3 é ${plan.angle}`,
        ],
      },
      {
        heading: headings[1],
        paragraphs: [
          `Antes de escolher uma campanha, descreva quem precisa ser alcançado, qual problema a oferta resolve e qual ação indica avanço real. Em ${plan.keyword}, essa clareza evita otimizar cliques que não chegam ao resultado de negócio.`,
          'As referências oficiais orientam configurações e possibilidades da plataforma; elas não substituem a análise da conta, da margem ou do processo comercial.',
        ],
      },
      {
        heading: headings[2],
        paragraphs: ['Use um processo curto e reversível para transformar a pauta em decisão.'],
        bullets: [
          'Defina o objetivo de negócio e a ação de conversão principal.',
          'Escreva a hipótese em uma frase e escolha o indicador que pode confirmá-la.',
          'Confira oferta, página, rastreamento e capacidade de atendimento.',
          'Altere uma variável por vez e combine uma janela de leitura.',
          'Registre o aprendizado antes de escalar, pausar ou abrir um novo teste.',
        ],
      },
      {
        heading: headings[3],
        paragraphs: [
          `Imagine uma operação que busca ${plan.keyword} e recebe muitos sinais superficiais, mas poucas oportunidades reais. Em vez de aumentar orçamento imediatamente, ela separa intenção, qualidade da conversão e capacidade de resposta.`,
          'Esse recorte mostra se o próximo passo é ajustar a campanha, a oferta, a página, a mensuração ou o processo comercial.',
        ],
      },
      {
        heading: headings[4],
        paragraphs: ['A pressa por uma resposta única costuma esconder o ponto exato do gargalo.'],
        bullets: [
          'Usar alcance, cliques ou leads como sinônimo de resultado final.',
          'Comparar períodos com ofertas, estoque ou capacidade comercial diferentes.',
          'Mudar público, criativo, orçamento e página na mesma intervenção.',
          'Ignorar ações de conversão secundárias e eventos sem valor de negócio.',
          'Prometer retorno ou volume com base em uma tendência sem dados da conta.',
        ],
      },
      {
        heading: headings[5],
        paragraphs: ['Antes de publicar uma alteração, confirme se a decisão pode ser revisada depois.'],
        bullets: [
          'Objetivo e público descritos.',
          'Oferta e mensagem alinhadas.',
          'Ação de conversão conferida.',
          'Janela e critério de leitura definidos.',
          'Responsável pelo próximo passo combinado.',
        ],
      },
      {
        heading: headings[6],
        paragraphs: faq.map((item) => `${item.question} ${item.answer}`),
      },
      {
        heading: 'Próximo passo',
        paragraphs: [`${plan.cta}. A W3 conecta mídia, criativos, mensuração e conversão para que o próximo investimento tenha uma hipótese clara.`],
      },
    ],
    seo: {
      title: `${plan.title} | W3 Tráfego Pago`,
      metaDescription: `Veja como trabalhar ${plan.keyword} com um roteiro prático de mídia, mensuração e conversão.`,
      h1: plan.title,
      introduction: `Entenda ${plan.keyword} e organize uma decisão de tráfego pago com contexto, hipótese e critério de leitura.`,
      index: headings,
      faq,
      cta: plan.cta,
      editorialSource: 'Pesquisa editorial W3 em 07/08/2026: Google Trends público, pesquisa de intenção e referências oficiais de Google Ads e Meta Ads. Nenhum volume absoluto foi inferido.',
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
      researchUrl: `https://trends.google.com/trends/explore?geo=BR&date=today%205-y&q=${encodeURIComponent(plan.keyword)}`,
      collectedAt: COLLECTED_AT,
      officialReferences: plan.officialReferences,
    },
  }
}

export const blogPostsOctober2026: BlogPostSeed[] = plans.map((plan) => ({
  slug: buildSlug(plan.title),
  title: plan.title,
  excerpt: `Um guia W3 para ${plan.keyword}, com foco em decisão, mensuração e resultado de negócio.`,
  content: makeContent(plan),
  category: plan.category,
  kind: 'evergreen',
  status: 'scheduled',
  keyword: plan.keyword,
  source_url: plan.sourceUrl,
  source_collected_at: COLLECTED_AT,
  scheduled_for: plan.scheduledFor,
  published_at: null,
}))

export const blogPostsOctober2026Summary = {
  total: blogPostsOctober2026.length,
  evergreen: blogPostsOctober2026.length,
  categories: Object.fromEntries(
    ['Google Ads', 'Meta Ads', 'Métricas', 'Criativos', 'E-commerce'].map((category) => [
      category,
      blogPostsOctober2026.filter((post) => post.category === category).length,
    ]),
  ),
}
