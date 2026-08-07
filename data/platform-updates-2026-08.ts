export type PlatformUpdateSeed = {
  legacySlug: string
  slug: string
  title: string
  excerpt: string
  category: 'Google Ads' | 'Meta Ads'
  keyword: string
  sourceUrl: string
  content: Record<string, unknown>
}

const collectedAt = '2026-08-07T17:15:00-03:00'

export const platformUpdatesAugust2026: PlatformUpdateSeed[] = [
  {
    legacySlug: 'monitoramento-de-atualizacao-de-plataforma-2026-09-02',
    slug: 'google-ads-mudancas-em-lances-baseados-em-metas-agosto-2026',
    title: 'Google Ads muda lances baseados em metas: o que revisar antes de 17 de agosto',
    excerpt: 'O Google anunciou mudanças nos sistemas de lances baseados em metas. Veja quem deve revisar campanhas e o que ainda não foi confirmado.',
    category: 'Google Ads',
    keyword: 'mudanças lances baseados em metas Google Ads',
    sourceUrl: 'https://support.google.com/google-ads/answer/17125145?hl=pt-BR',
    content: {
      sections: [
        { heading: 'O que o Google anunciou', paragraphs: ['O Google Ads informou que fará mudanças nos sistemas de lances baseados em metas a partir de 17 de agosto de 2026. A atualização busca tornar a performance mais consistente e previsível quando o orçamento for ajustado.', 'A orientação é revisar campanhas limitadas pelo orçamento e conferir se as metas de lance continuam alinhadas ao objetivo de negócio.'] },
        { heading: 'Quem deve revisar primeiro', paragraphs: ['A revisão faz mais sentido em campanhas que usam estratégias baseadas em metas, têm limitação de orçamento ou apresentam performance acima da meta configurada.'], bullets: ['Liste campanhas com orçamento limitado.', 'Compare a meta de lance com margem e ciclo de venda.', 'Registre o estado atual antes de alterar qualquer configuração.', 'Separe impacto da atualização de sazonalidade ou mudança de oferta.'] },
        { heading: 'O que a fonte não afirma', paragraphs: ['A documentação não promete aumento universal de conversões nem informa que o Google ajustará metas ou orçamentos automaticamente. O impacto depende da conta, do volume e da configuração de cada campanha.'] },
        { heading: 'Fonte oficial', paragraphs: ['https://support.google.com/google-ads/answer/17125145?hl=pt-BR'] },
      ],
      seo: { title: 'Google Ads muda lances baseados em metas | W3 Tráfego Pago', metaDescription: 'Entenda a mudança anunciada pelo Google Ads em lances baseados em metas e veja o checklist de revisão.', h1: 'Google Ads muda lances baseados em metas: o que revisar', introduction: 'Uma atualização oficial do Google Ads exige revisão de campanhas que usam lances baseados em metas.', index: ['O que o Google anunciou', 'Quem deve revisar primeiro', 'O que a fonte não afirma', 'Fonte oficial'], faq: [{ question: 'O Google vai mudar meu orçamento?', answer: 'A fonte informa que o Google não ajustará automaticamente metas ou orçamentos.' }, { question: 'Todas as campanhas serão afetadas?', answer: 'A relevância depende da estratégia e do tipo de campanha descritos na documentação.' }, { question: 'Devo alterar a meta agora?', answer: 'Não sem registrar o cenário atual e confirmar a meta de negócio.' }], cta: 'Revisar suas campanhas limitadas pelo orçamento', editorialSource: 'Fonte oficial do Google Ads consultada em 07/08/2026.', reviewDate: '2026-08-17', estimatedReadMinutes: 5 },
      editorial: { primaryKeyword: 'mudanças lances baseados em metas Google Ads', secondaryKeywords: ['Google Ads agosto 2026', 'estratégias de lance Google Ads', 'orçamento limitado Google Ads'], intent: 'informational', funnelStage: 'consideração', originalAngle: 'Separar o anúncio oficial de qualquer promessa de performance.', format: 'news-analysis', justification: 'Atualização oficial com data futura e ação de revisão clara.', cannibalizationRisk: 'Baixo: não havia update específico sobre esta mudança.', researchUrl: 'https://support.google.com/google-ads/answer/17125145?hl=pt-BR', collectedAt, officialReferences: ['https://support.google.com/google-ads/answer/17125145?hl=pt-BR'] },
      update: { state: 'confirmed-source', affectedAudience: 'Campanhas Search, Shopping, Performance Max, Demand Gen e Travel que usam estratégias baseadas em metas.', likelyImpact: 'A configuração de metas e a leitura de performance podem exigir revisão após 17/08/2026.', reviewActions: ['Registrar o cenário antes da data', 'Revisar campanhas limitadas pelo orçamento', 'Monitorar gasto, volume e eficiência após a mudança'] },
    },
  },
  {
    legacySlug: 'monitoramento-de-atualizacao-de-plataforma-2026-09-05',
    slug: 'google-ads-novos-rotulos-de-ia-em-anuncios-julho-2026',
    title: 'Google Ads adiciona rótulos de IA em anúncios: o que muda na transparência',
    excerpt: 'O Google anunciou novos recursos de transparência para identificar anúncios criados ou editados com inteligência artificial.',
    category: 'Google Ads',
    keyword: 'rótulos de IA em anúncios Google Ads',
    sourceUrl: 'https://blog.google/products/ads-commerce/google-ads-ai-transparency-labels/',
    content: {
      sections: [
        { heading: 'O anúncio oficial', paragraphs: ['O Google informou que está adicionando recursos de transparência para ajudar as pessoas a identificar anúncios criados ou significativamente editados com inteligência artificial.', 'A mudança trata de identificação e contexto do anúncio. Ela não deve ser interpretada como garantia de qualidade, aprovação ou performance do criativo.'] },
        { heading: 'O que anunciantes devem revisar', paragraphs: ['A operação deve manter registro de como os ativos foram produzidos e conferir como a informação aparece na experiência do usuário.'], bullets: ['Documente ferramentas e etapas usadas na criação.', 'Mantenha revisão humana de texto, imagem e promessa.', 'Confira políticas aplicáveis ao setor e ao formato.', 'Separe transparência de IA de qualquer previsão de resultado.'] },
        { heading: 'Impacto editorial e operacional', paragraphs: ['A aplicação pode variar por produto, mercado e conta. Consulte a fonte original antes de transformar o tema em procedimento obrigatório.'] },
        { heading: 'Fonte oficial', paragraphs: ['https://blog.google/products/ads-commerce/google-ads-ai-transparency-labels/'] },
      ],
      seo: { title: 'Rótulos de IA em anúncios do Google Ads | W3 Tráfego Pago', metaDescription: 'Saiba o que os novos rótulos de IA em anúncios do Google Ads informam e quais revisões os anunciantes devem fazer.', h1: 'Google Ads adiciona rótulos de IA em anúncios', introduction: 'O Google anunciou novos recursos de transparência para anúncios criados ou editados com IA.', index: ['O anúncio oficial', 'O que anunciantes devem revisar', 'Impacto editorial e operacional', 'Fonte oficial'], faq: [{ question: 'O rótulo de IA garante que o anúncio funciona?', answer: 'Não. Transparência sobre uso de IA não é uma promessa de performance.' }, { question: 'Todo anúncio terá o mesmo tratamento?', answer: 'A aplicação depende do produto, formato e implementação descritos pelo Google.' }, { question: 'O que a equipe deve fazer?', answer: 'Documente o processo criativo e revise o ativo e as políticas antes da veiculação.' }], cta: 'Criar uma rotina de revisão de criativos', editorialSource: 'Fonte oficial do Google Ads consultada em 07/08/2026.', reviewDate: '2026-08-20', estimatedReadMinutes: 5 },
      editorial: { primaryKeyword: 'rótulos de IA em anúncios Google Ads', secondaryKeywords: ['transparência de IA Google Ads', 'criativos gerados por IA', 'anúncios com inteligência artificial'], intent: 'informational', funnelStage: 'descoberta', originalAngle: 'Explicar transparência sem transformar o rótulo em promessa de performance.', format: 'news-analysis', justification: 'Atualização oficial recente com impacto em criação e revisão de anúncios.', cannibalizationRisk: 'Baixo: é diferente do conteúdo evergreen de criativos.', researchUrl: 'https://blog.google/products/ads-commerce/google-ads-ai-transparency-labels/', collectedAt, officialReferences: ['https://blog.google/products/ads-commerce/google-ads-ai-transparency-labels/'] },
      update: { state: 'confirmed-source', affectedAudience: 'Anunciantes que usam ferramentas de IA na criação ou edição de ativos.', likelyImpact: 'Mais contexto para usuários sobre a participação de IA em anúncios.', reviewActions: ['Documentar o processo de criação', 'Revisar o criativo antes da publicação', 'Acompanhar a experiência no produto'] },
    },
  },
  {
    legacySlug: 'monitoramento-de-atualizacao-de-plataforma-2026-09-06',
    slug: 'meta-atualiza-uso-de-atividade-de-outras-empresas-junho-2026',
    title: 'Meta atualiza o uso de atividade de outras empresas: o que anunciantes devem acompanhar',
    excerpt: 'A Meta anunciou mudanças na personalização baseada em atividade compartilhada por empresas e nos controles disponíveis para usuários.',
    category: 'Meta Ads',
    keyword: 'atividade de outras empresas Meta Ads',
    sourceUrl: 'https://about.fb.com/news/2026/06/better-personalization-and-changes-to-controls-for-your-activity-from-other-businesses/',
    content: {
      sections: [
        { heading: 'O que a Meta comunicou', paragraphs: ['A Meta informou que passará a usar informações que empresas já compartilham para personalizar também conteúdo do Feed e respostas de IA, além de anúncios.', 'A companhia também comunicou a reorganização de controles relacionados à atividade de outras empresas.'] },
        { heading: 'O que isso significa para a operação', paragraphs: ['O anúncio não autoriza coletar dados sem base legal nem elimina responsabilidades de privacidade. A equipe deve revisar integrações e o uso de dados próprios dentro das políticas aplicáveis.'], bullets: ['Mapeie quais eventos são enviados pelos Business Tools.', 'Confira consentimento, finalidade e retenção dos dados.', 'Separe mudança de controle do usuário de mudança de performance.', 'Registre a versão da integração antes de qualquer ajuste.'] },
        { heading: 'O que ainda precisa ser observado', paragraphs: ['A comunicação é ampla e descreve personalização da experiência. A disponibilidade e os efeitos sobre uma conta específica dependem do produto, país e configuração.'] },
        { heading: 'Fonte oficial', paragraphs: ['https://about.fb.com/news/2026/06/better-personalization-and-changes-to-controls-for-your-activity-from-other-businesses/'] },
      ],
      seo: { title: 'Meta atualiza atividade de outras empresas | W3 Tráfego Pago', metaDescription: 'Entenda o comunicado da Meta sobre atividade de outras empresas, personalização e cuidados para anunciantes.', h1: 'Meta atualiza o uso de atividade de outras empresas', introduction: 'A Meta comunicou mudanças na personalização baseada em informações que empresas já compartilham com a plataforma.', index: ['O que a Meta comunicou', 'O que isso significa para a operação', 'O que ainda precisa ser observado', 'Fonte oficial'], faq: [{ question: 'A Meta anunciou uma nova coleta de dados?', answer: 'O comunicado afirma que a mudança usa informações que empresas já compartilham; a implementação deve ser analisada com cuidado.' }, { question: 'Isso garante mais performance?', answer: 'Não. O comunicado trata de personalização e controles, não de garantia de resultado.' }, { question: 'O que revisar primeiro?', answer: 'Mapeie eventos, finalidade, consentimento e integrações usadas pela operação.' }], cta: 'Revisar a governança de dados da mídia', editorialSource: 'Fonte oficial da Meta consultada em 07/08/2026.', reviewDate: '2026-08-20', estimatedReadMinutes: 5 },
      editorial: { primaryKeyword: 'atividade de outras empresas Meta Ads', secondaryKeywords: ['Meta Ads dados próprios', 'personalização Meta', 'Business Tools Meta'], intent: 'informational', funnelStage: 'consideração', originalAngle: 'Separar o anúncio de personalização das obrigações de privacidade e da performance.', format: 'news-analysis', justification: 'Comunicado oficial recente com implicações de governança para anunciantes.', cannibalizationRisk: 'Baixo: amplia o conteúdo de atualização de IA da Meta com foco em dados e controles.', researchUrl: 'https://about.fb.com/news/2026/06/better-personalization-and-changes-to-controls-for-your-activity-from-other-businesses/', collectedAt, officialReferences: ['https://about.fb.com/news/2026/06/better-personalization-and-changes-to-controls-for-your-activity-from-other-businesses/'] },
      update: { state: 'confirmed-source', affectedAudience: 'Anunciantes e empresas que compartilham eventos com as ferramentas de negócios da Meta.', likelyImpact: 'Necessidade de acompanhar controles, políticas e a forma como dados próprios são usados na personalização.', reviewActions: ['Inventariar eventos enviados', 'Revisar base legal e finalidade', 'Monitorar comunicações oficiais da Meta'] },
    },
  },
]
