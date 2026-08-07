export const EDITORIAL_TIMEZONE = 'America/Sao_Paulo'

export type EditorialKind = 'evergreen' | 'platform-update'
export type EditorialStatus = 'scheduled' | 'draft'
export type EditorialIntent = 'informational' | 'commercial'
export type EditorialFormat = 'guide' | 'checklist' | 'comparison' | 'case-framework' | 'news-analysis'

export type EditorialSlot = {
  date: string
  time: string
  kind: EditorialKind
  status: EditorialStatus
  title: string
  keyword: string
  intent: EditorialIntent
  angle: string
  format: EditorialFormat
  cta: string
  keywordSource: 'editorial-seed' | 'daily-signal'
}

type EditorialTopic = Omit<EditorialSlot, 'date' | 'time' | 'kind' | 'status' | 'title' | 'keywordSource'> & {
  title: string
}

const EVERGREEN_TOPICS: EditorialTopic[] = [
  {
    title: 'Tráfego pago para e-commerce: por onde começar sem desperdiçar verba',
    keyword: 'tráfego pago para e-commerce',
    intent: 'informational',
    angle: 'Checklist da base que precisa estar pronta antes do primeiro investimento.',
    format: 'checklist',
    cta: 'Baixar o checklist de diagnóstico da W3',
  },
  {
    title: 'Google Ads ou Meta Ads: qual canal testar primeiro?',
    keyword: 'Google Ads ou Meta Ads',
    intent: 'commercial',
    angle: 'Comparar intenção de compra, criativo, ticket e maturidade da oferta.',
    format: 'comparison',
    cta: 'Pedir um diagnóstico de canal',
  },
  {
    title: 'Como definir o orçamento inicial de uma campanha de tráfego pago',
    keyword: 'orçamento tráfego pago',
    intent: 'commercial',
    angle: 'Trocar o chute por uma conta simples de meta, CAC aceitável e aprendizado.',
    format: 'guide',
    cta: 'Calcular uma meta de mídia com a W3',
  },
  {
    title: 'Palavras-chave de alta intenção para campanhas de Google Ads',
    keyword: 'palavras-chave Google Ads',
    intent: 'informational',
    angle: 'Separar pesquisa, consideração e compra para evitar tráfego curioso.',
    format: 'guide',
    cta: 'Falar com um especialista em Google Ads',
  },
  {
    title: 'Estrutura de campanha: como organizar a conta para decidir com dados',
    keyword: 'estrutura de campanha Google Ads',
    intent: 'informational',
    angle: 'Criar uma estrutura que responda hipóteses sem fragmentar demais o orçamento.',
    format: 'case-framework',
    cta: 'Receber o framework de estrutura W3',
  },
  {
    title: 'Performance Max: quando usar e quais sinais acompanhar',
    keyword: 'Performance Max',
    intent: 'informational',
    angle: 'Explicar o papel da automação sem tratar a campanha como caixa-preta.',
    format: 'guide',
    cta: 'Revisar uma campanha Performance Max',
  },
  {
    title: 'Meta Ads para e-commerce: o que medir antes de escalar',
    keyword: 'Meta Ads para e-commerce',
    intent: 'commercial',
    angle: 'Conectar criativo, qualidade de sessão, margem e capacidade operacional.',
    format: 'checklist',
    cta: 'Pedir uma leitura da operação',
  },
  {
    title: 'Pixel da Meta e Conversions API: o mapa mínimo de mensuração',
    keyword: 'Pixel da Meta e Conversions API',
    intent: 'informational',
    angle: 'Mostrar eventos, deduplicação e limites sem prometer atribuição perfeita.',
    format: 'guide',
    cta: 'Validar o rastreamento da sua conta',
  },
  {
    title: 'Criativos de performance: como encontrar ângulos que vendem',
    keyword: 'criativos para anúncios',
    intent: 'informational',
    angle: 'Transformar dores, provas e objeções em hipóteses de criativo.',
    format: 'case-framework',
    cta: 'Montar uma matriz de criativos',
  },
  {
    title: 'Teste A/B de anúncios: o que mudar para aprender de verdade',
    keyword: 'teste A/B anúncios',
    intent: 'informational',
    angle: 'Isolar uma variável por vez e definir janela e critério antes do resultado.',
    format: 'guide',
    cta: 'Receber o roteiro de testes W3',
  },
  {
    title: 'Landing page para tráfego pago: elementos que reduzem dúvida',
    keyword: 'landing page para tráfego pago',
    intent: 'commercial',
    angle: 'Alinhar promessa, prova, oferta e ação para não perder o clique comprado.',
    format: 'checklist',
    cta: 'Avaliar uma landing page',
  },
  {
    title: 'CRO para campanhas: como melhorar conversão antes de comprar mais tráfego',
    keyword: 'CRO tráfego pago',
    intent: 'commercial',
    angle: 'Encontrar gargalos de página e checkout antes de aumentar o orçamento.',
    format: 'case-framework',
    cta: 'Solicitar uma análise de conversão',
  },
  {
    title: 'ROAS não é suficiente: métricas para saber se a mídia é saudável',
    keyword: 'métricas de tráfego pago',
    intent: 'informational',
    angle: 'Ler ROAS junto com CAC, margem, conversão, frequência e recompra.',
    format: 'guide',
    cta: 'Montar um painel de decisão',
  },
  {
    title: 'CAC de mídia: como definir um limite que protege a margem',
    keyword: 'CAC tráfego pago',
    intent: 'commercial',
    angle: 'Sair do custo por clique e conectar aquisição ao resultado financeiro.',
    format: 'guide',
    cta: 'Calcular o CAC-alvo da operação',
  },
  {
    title: 'CTR, CPC e taxa de conversão: qual métrica investigar primeiro?',
    keyword: 'CTR CPC taxa de conversão',
    intent: 'informational',
    angle: 'Usar a ordem do funil para localizar se o problema está na mensagem ou na página.',
    format: 'comparison',
    cta: 'Receber o mapa de diagnóstico W3',
  },
  {
    title: 'CPM alto em Meta Ads: causas e próximos testes',
    keyword: 'CPM Meta Ads',
    intent: 'informational',
    angle: 'Diferenciar leilão, público, criativo e frequência antes de fazer mudanças aleatórias.',
    format: 'guide',
    cta: 'Revisar a eficiência da sua campanha',
  },
  {
    title: 'Funil de vendas e tráfego pago: o papel de cada campanha',
    keyword: 'funil de vendas tráfego pago',
    intent: 'informational',
    angle: 'Organizar descoberta, consideração e conversão sem criar campanhas demais.',
    format: 'case-framework',
    cta: 'Desenhar o funil da operação',
  },
  {
    title: 'Remarketing que não cansa: frequência, janela e mensagem',
    keyword: 'remarketing Meta Ads',
    intent: 'commercial',
    angle: 'Usar contexto e janela de intenção para não perseguir o usuário com a mesma oferta.',
    format: 'guide',
    cta: 'Planejar uma régua de remarketing',
  },
  {
    title: 'UTM em campanhas: padrão simples para não perder a origem da venda',
    keyword: 'UTM campanhas',
    intent: 'informational',
    angle: 'Definir nomenclatura consistente para mídia, criativo, campanha e canal.',
    format: 'checklist',
    cta: 'Baixar o padrão UTM da W3',
  },
  {
    title: 'GA4 para tráfego pago: eventos que ajudam a tomar decisão',
    keyword: 'GA4 tráfego pago',
    intent: 'informational',
    angle: 'Priorizar eventos que explicam o caminho até a conversão.',
    format: 'guide',
    cta: 'Validar a medição do GA4',
  },
  {
    title: 'Google Tag Manager: checklist de implementação para campanhas',
    keyword: 'Google Tag Manager tráfego pago',
    intent: 'informational',
    angle: 'Evitar eventos quebrados e alterações sem documentação.',
    format: 'checklist',
    cta: 'Receber o checklist de tracking',
  },
  {
    title: 'Lead qualificado: como alinhar campanha, formulário e atendimento',
    keyword: 'lead qualificado tráfego pago',
    intent: 'commercial',
    angle: 'Otimizar para a qualidade do lead e não apenas para o menor CPL.',
    format: 'case-framework',
    cta: 'Revisar o funil de leads',
  },
  {
    title: 'Anúncios para WhatsApp: como evitar conversas que não viram venda',
    keyword: 'anúncios para WhatsApp',
    intent: 'commercial',
    angle: 'Alinhar promessa, triagem, tempo de resposta e próximo passo comercial.',
    format: 'guide',
    cta: 'Estruturar uma campanha para WhatsApp',
  },
  {
    title: 'YouTube Ads para performance: quando vídeo entra no plano de mídia',
    keyword: 'YouTube Ads',
    intent: 'informational',
    angle: 'Definir objetivo, criativo e sinal de sucesso para além das visualizações.',
    format: 'comparison',
    cta: 'Planejar uma frente de vídeo',
  },
  {
    title: 'Demand Gen: como avaliar descoberta e conversão no mesmo plano',
    keyword: 'Demand Gen Google Ads',
    intent: 'informational',
    angle: 'Separar alcance, intenção e resultado sem usar uma métrica única.',
    format: 'guide',
    cta: 'Revisar a estratégia de Demand Gen',
  },
  {
    title: 'Como escalar campanhas sem perder margem e previsibilidade',
    keyword: 'escalar campanhas de tráfego pago',
    intent: 'commercial',
    angle: 'Aumentar investimento por hipótese, capacidade e limite de eficiência.',
    format: 'case-framework',
    cta: 'Planejar a próxima etapa de escala',
  },
  {
    title: 'Como escolher uma agência de tráfego pago para e-commerce',
    keyword: 'agência de tráfego pago',
    intent: 'commercial',
    angle: 'Avaliar processo, transparência, atribuição e responsabilidade por negócio.',
    format: 'checklist',
    cta: 'Conhecer o método da W3',
  },
  {
    title: 'O que faz um gestor de tráfego em uma operação madura',
    keyword: 'gestor de tráfego pago',
    intent: 'informational',
    angle: 'Mostrar rotina de hipótese, análise, documentação e alinhamento comercial.',
    format: 'guide',
    cta: 'Conversar sobre a operação da sua conta',
  },
  {
    title: 'Relatório de tráfego pago: os números que merecem uma decisão',
    keyword: 'relatório de tráfego pago',
    intent: 'informational',
    angle: 'Trocar dashboards extensos por leitura executiva de causa, efeito e próximo teste.',
    format: 'checklist',
    cta: 'Receber o modelo de relatório W3',
  },
  {
    title: 'Checklist semanal de tráfego pago para não otimizar no escuro',
    keyword: 'checklist tráfego pago',
    intent: 'informational',
    angle: 'Criar uma cadência simples para mídia, criativos, tracking e negócio.',
    format: 'checklist',
    cta: 'Baixar o checklist semanal',
  },
]

const PLATFORM_UPDATE_SLOT: Omit<EditorialSlot, 'date'> = {
  time: '18:00',
  kind: 'platform-update',
  status: 'draft',
  title: 'Atualização de Google Ads ou Meta Ads: o que mudou hoje?',
  keyword: 'atualização Google Ads Meta Ads',
  intent: 'informational',
  angle: 'A pauta será substituída pelo sinal mais relevante encontrado em fonte verificável.',
  format: 'news-analysis',
  cta: 'Assinar os alertas de mudanças em plataformas',
  keywordSource: 'daily-signal',
}

function formatDate(year: number, monthIndex: number, day: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function withVariant(topic: EditorialTopic, slotIndex: number) {
  const cycle = Math.floor(slotIndex / EVERGREEN_TOPICS.length)
  return cycle === 0 ? topic.title : `${topic.title} — checklist e decisões práticas`
}

export function getEditorialCalendar(year: number, monthIndex: number): EditorialSlot[] {
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    throw new RangeError('year must be an integer between 2000 and 2100')
  }
  if (!Number.isInteger(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    throw new RangeError('monthIndex must be an integer between 0 and 11')
  }

  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate()
  const slots: EditorialSlot[] = []

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = formatDate(year, monthIndex, day)
    const firstTopicIndex = (day - 1) * 2

    for (let position = 0; position < 2; position += 1) {
      const slotIndex = firstTopicIndex + position
      const topic = EVERGREEN_TOPICS[slotIndex % EVERGREEN_TOPICS.length]
      slots.push({
        ...topic,
        date,
        time: position === 0 ? '08:00' : '12:00',
        kind: 'evergreen',
        status: 'scheduled',
        title: withVariant(topic, slotIndex),
        keywordSource: 'editorial-seed',
      })
    }

    slots.push({ ...PLATFORM_UPDATE_SLOT, date })
  }

  return slots
}

export function getSeptemberEditorialCalendar() {
  return getEditorialCalendar(2026, 8)
}
