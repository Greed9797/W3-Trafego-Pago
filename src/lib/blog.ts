import methodologyOne from '@/assets/metodologia-1.webp'
import methodologyTwo from '@/assets/metodologia-2.webp'
import methodologyThree from '@/assets/metodologia-3.webp'
import methodologyFour from '@/assets/metodologia-4.webp'

export const BLOG_CATEGORIES = [
  'Todos',
  'Estratégia',
  'Meta Ads',
  'Google Ads',
  'Criativos',
  'Métricas',
  'E-commerce',
] as const

export type BlogCategory = Exclude<(typeof BLOG_CATEGORIES)[number], 'Todos'>

export type BlogSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type BlogArticle = {
  slug: string
  title: string
  excerpt: string
  category: BlogCategory
  date: string
  isoDate: string
  readTime: string
  image: string
  accent: string
  sections: BlogSection[]
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: 'meta-ads-ecommerce-o-que-medir-antes-de-escalar',
    title: 'Meta Ads para e-commerce: o que medir antes de aumentar o orçamento',
    excerpt:
      'Escalar investimento sem entender margem, criativo e etapa do funil transforma uma campanha promissora em um custo difícil de explicar.',
    category: 'Meta Ads',
    date: '06 ago 2026',
    isoDate: '2026-08-06',
    readTime: '7 min de leitura',
    image: methodologyOne,
    accent: 'orange',
    sections: [
      {
        heading: 'O orçamento não é o primeiro botão a ser aumentado',
        paragraphs: [
          'Quando uma campanha começa a vender, a reação mais comum é aumentar o orçamento. O problema é que o resultado de mídia não depende apenas do valor investido: ele depende da qualidade do tráfego, da oferta, da página e da capacidade de operação do negócio.',
          'Antes de escalar, transforme a campanha em um sistema que você consegue explicar. Se você não sabe qual público, criativo e etapa do funil estão sustentando o resultado, aumentar a verba só aumenta a velocidade do aprendizado — e também do desperdício.',
        ],
        bullets: [
          'Margem de contribuição por pedido, não apenas faturamento.',
          'Taxa de conversão da página e aprovação dos pagamentos.',
          'Frequência, CPM e sinais de fadiga dos criativos.',
        ],
      },
      {
        heading: 'As quatro perguntas para decidir com segurança',
        paragraphs: [
          'A primeira pergunta é se o anúncio está trazendo pessoas com intenção real. CTR e CPC ajudam a localizar o problema, mas não substituem a leitura da qualidade da sessão e da conversão no site.',
          'Depois, compare o custo de aquisição com a margem disponível. Um ROAS bonito pode esconder um produto com margem apertada; uma campanha com ROAS menor pode ser mais saudável quando tem recompra e espaço para otimização.',
        ],
      },
      {
        heading: 'Como escalar sem perder o controle',
        paragraphs: [
          'Faça mudanças graduais, registre o que mudou e defina uma janela mínima de observação. Evite editar orçamento, criativo, público e página ao mesmo tempo: sem uma hipótese isolada, você não sabe o que causou o próximo resultado.',
          'A melhor escala é aquela em que o time continua tomando decisões com dados, não aquela em que a plataforma recebe mais dinheiro e o negócio torce para a curva continuar subindo.',
        ],
      },
    ],
  },
  {
    slug: 'google-ads-ou-meta-ads-onde-investir-primeiro',
    title: 'Google Ads ou Meta Ads: onde colocar o próximo real de mídia?',
    excerpt:
      'A resposta depende da intenção de compra, da maturidade da oferta e do tipo de demanda que seu negócio precisa construir agora.',
    category: 'Estratégia',
    date: '30 jul 2026',
    isoDate: '2026-07-30',
    readTime: '6 min de leitura',
    image: methodologyTwo,
    accent: 'blue',
    sections: [
      {
        heading: 'Duas plataformas, dois momentos de decisão',
        paragraphs: [
          'Google Ads captura uma procura que já existe. Meta Ads interrompe a rolagem com uma mensagem e cria interesse em torno de um problema, desejo ou produto. A escolha começa pela pergunta: as pessoas já estão procurando pelo que você vende?',
          'Se existe uma demanda clara e uma página capaz de responder rapidamente à busca, a rede de pesquisa pode ser um excelente primeiro passo. Se a categoria ainda precisa ser descoberta ou se o criativo é parte central da venda, Meta tende a oferecer mais espaço para testar ângulos.',
        ],
      },
      {
        heading: 'O que avaliar antes de dividir a verba',
        paragraphs: [
          'Não divida o orçamento automaticamente em 50/50. Comece com uma hipótese, uma meta de negócio e um limite de perda aceitável para cada canal. O orçamento deve comprar aprendizado útil e vendas, não apenas presença em duas plataformas.',
        ],
        bullets: [
          'Volume e intenção das buscas pela categoria.',
          'Ticket, margem e ciclo de decisão do produto.',
          'Capacidade de produzir criativos e páginas de teste.',
          'Qualidade do rastreamento e da atribuição disponível.',
        ],
      },
      {
        heading: 'A combinação que costuma amadurecer melhor',
        paragraphs: [
          'Em operações maduras, os canais se complementam: Meta amplia a demanda e testa mensagens; Google captura parte da intenção gerada e atende quem já está mais perto da compra. O importante é analisar o negócio inteiro, não declarar um vencedor olhando apenas o painel de uma plataforma.',
        ],
      },
    ],
  },
  {
    slug: 'roas-nao-e-suficiente-metricas-trafego-saudavel',
    title: 'ROAS não é o suficiente: 5 métricas para saber se o tráfego está saudável',
    excerpt:
      'ROAS responde uma parte da pergunta. Para decidir bem, você precisa enxergar custo, qualidade, margem e o que acontece depois do primeiro pedido.',
    category: 'Métricas',
    date: '23 jul 2026',
    isoDate: '2026-07-23',
    readTime: '8 min de leitura',
    image: methodologyThree,
    accent: 'green',
    sections: [
      {
        heading: 'A métrica certa depende da pergunta certa',
        paragraphs: [
          'Métricas não são troféus. Elas ajudam a localizar gargalos. CTR pode indicar se a mensagem chama atenção; taxa de conversão mostra se a promessa encontra uma página capaz de fechar a venda; margem revela se o resultado é sustentável.',
          'Quando o time olha apenas para ROAS, problemas de oferta, aprovação, recompra e custo operacional ficam invisíveis até começarem a aparecer no caixa.',
        ],
      },
      {
        heading: 'Cinco números para colocar no mesmo painel',
        paragraphs: [],
        bullets: [
          'CAC de mídia: quanto custa gerar um novo pedido ou cliente.',
          'Taxa de conversão: se o tráfego encontra uma experiência que convence.',
          'CPM e frequência: quanto custa alcançar a audiência e se ela está saturando.',
          'Margem de contribuição: o que sobra depois de mídia, produto e operação.',
          'LTV ou recompra: quanto valor pode voltar depois da primeira compra.',
        ],
      },
      {
        heading: 'O painel precisa terminar em uma decisão',
        paragraphs: [
          'Um bom painel não é uma coleção de gráficos. Para cada métrica, defina o que você fará quando ela subir ou cair. Assim o acompanhamento vira rotina de otimização, e não uma reunião para comentar números que já passaram.',
        ],
      },
    ],
  },
  {
    slug: 'criativos-de-performance-angulos-que-vendem',
    title: 'Criativos de performance: como encontrar ângulos que vendem',
    excerpt:
      'Criativo não é só estética. É a ponte entre a atenção da pessoa certa e a próxima ação que você quer que ela tome.',
    category: 'Criativos',
    date: '16 jul 2026',
    isoDate: '2026-07-16',
    readTime: '6 min de leitura',
    image: methodologyFour,
    accent: 'purple',
    sections: [
      {
        heading: 'O melhor criativo começa antes do editor',
        paragraphs: [
          'Antes de escolher formato, transição ou trilha, escreva o problema que o anúncio quer tornar concreto. Um bom ângulo nasce de uma tensão real do cliente: medo de errar, falta de tempo, desejo de status, economia ou busca por previsibilidade.',
          'A função do criativo é organizar essa tensão em poucos segundos e entregar uma razão clara para continuar. Isso não significa prometer demais; significa tornar a proposta fácil de entender.',
        ],
      },
      {
        heading: 'Um roteiro simples para testar variações',
        paragraphs: [],
        bullets: [
          'Gancho: diga para quem é e qual problema será resolvido.',
          'Prova: mostre contexto, demonstração, depoimento ou comparação.',
          'Oferta: explique o que a pessoa recebe e por que agora.',
          'Ação: deixe o próximo passo explícito e fácil de encontrar.',
        ],
      },
      {
        heading: 'Teste a hipótese, não só a cor do botão',
        paragraphs: [
          'Uma variação de criativo precisa mudar uma ideia: o benefício, a objeção, a prova ou o público. Trocar apenas a cor e manter a mesma promessa gera volume de anúncios, mas pouco aprendizado.',
          'Depois de publicar, observe a qualidade do tráfego e o comportamento no site. O anúncio que ganha o clique nem sempre é o que entrega a melhor venda.',
        ],
      },
    ],
  },
  {
    slug: 'estrutura-de-campanhas-para-decidir-com-dados',
    title: 'A estrutura de campanhas que evita decisões no escuro',
    excerpt:
      'Uma conta organizada reduz ruído, deixa os testes comparáveis e ajuda a separar problema de mídia de problema de operação.',
    category: 'Estratégia',
    date: '09 jul 2026',
    isoDate: '2026-07-09',
    readTime: '7 min de leitura',
    image: methodologyOne,
    accent: 'orange',
    sections: [
      {
        heading: 'Estrutura boa é a que facilita a próxima decisão',
        paragraphs: [
          'Não existe uma estrutura universal que substitua estratégia. O desenho da conta precisa refletir objetivo, orçamento, volume de conversões e quantidade de hipóteses que o time consegue acompanhar.',
          'Quando tudo está misturado, você não sabe se um resultado veio de um público, de uma mensagem ou de uma promoção. Quando há campanhas demais, a verba se fragmenta e o algoritmo recebe pouco sinal em cada lugar.',
        ],
      },
      {
        heading: 'O que documentar em cada campanha',
        paragraphs: [],
        bullets: [
          'Objetivo de negócio e evento de otimização.',
          'Hipótese principal e audiência que será observada.',
          'Oferta, criativos e página relacionados ao teste.',
          'Critério de sucesso e momento da revisão.',
        ],
      },
      {
        heading: 'Menos campanhas, mais clareza',
        paragraphs: [
          'A estrutura deve ser revisada quando o negócio muda de estágio. O que funciona para validar uma oferta não precisa ser igual ao que sustenta escala. Comece simples, registre o aprendizado e só adicione camadas quando elas responderem a uma pergunta real.',
        ],
      },
    ],
  },
  {
    slug: 'checklist-trafego-pago-ecommerce-antes-de-investir',
    title: 'Tráfego pago para e-commerce: checklist antes de investir mais',
    excerpt:
      'Antes de procurar uma nova campanha, confirme se oferta, rastreamento, estoque e checkout conseguem receber o próximo pico de demanda.',
    category: 'E-commerce',
    date: '02 jul 2026',
    isoDate: '2026-07-02',
    readTime: '5 min de leitura',
    image: methodologyTwo,
    accent: 'blue',
    sections: [
      {
        heading: 'Mídia não corrige uma operação que não está pronta',
        paragraphs: [
          'O anúncio pode fazer seu produto chegar a mais pessoas, mas não consegue resolver um checkout lento, uma oferta confusa ou um estoque que acaba no primeiro dia. O tráfego precisa entrar em uma operação preparada para transformar atenção em receita.',
        ],
      },
      {
        heading: 'Checklist de prontidão',
        paragraphs: [],
        bullets: [
          'Oferta e diferenciais entendidos em poucos segundos.',
          'Página rápida, responsiva e com prova suficiente.',
          'Eventos de visita, início de checkout e compra testados.',
          'Estoque, logística e atendimento alinhados com a promessa.',
          'Margem e limite de CAC definidos antes do aumento de verba.',
        ],
      },
      {
        heading: 'O próximo real deve comprar aprendizado',
        paragraphs: [
          'Se algum item do checklist falhar, corrija a base antes de abrir novas frentes. Uma campanha bem configurada acelera o que já existe: por isso, preparação é parte da estratégia de aquisição, não uma etapa burocrática antes dela.',
        ],
      },
    ],
  },
]

export function getArticleBySlug(slug: string) {
  return BLOG_ARTICLES.find((article) => article.slug === slug)
}
