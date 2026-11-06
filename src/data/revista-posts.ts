export interface RevistaArticle {
  id: number
  slug: string
  category: "casamento" | "inspiracao" | "eventos" | "gastronomia"
  categoryLabel: string
  label: string
  title: string
  subtitle: string
  resumo: string
  coverImage: string
  publishedAt: string
  readingTime: string
  author: {
    name: string
    role: string
  }
  content: {
    lead: string
    paragraphs: string[]
    quote?: {
      text: string
      author?: string
    }
    subheadings?: {
      title: string
      text: string
      bullets?: string[]
    }[]
    highlightCard?: {
      title: string
      description: string
    }
  }
  tags: string[]
}

export const REVISTA_ARTICLES: RevistaArticle[] = [
  {
    id: 1,
    slug: "antes-do-sim-os-detalhes-que-fazem-uma-historia-unica",
    category: "casamento",
    categoryLabel: "Casamentos",
    label: "CASAMENTOS • PLANEJAMENTO",
    title: "Antes do sim: os detalhes que fazem uma história única",
    subtitle: "Da escolha do cenário à última dança, tudo começa pelas emoções que vocês querem viver.",
    resumo:
      "Um grande casamento não se mede apenas pela decoração ou pelo número de convidados. Ele se revela nas escolhas que traduzem a identidade do casal: uma acústica impecável para os votos, cenografia monumental e um Espaço da Noiva sereno para os preparativos.",
    coverImage: "/assets/casal.jpg",
    publishedAt: "28 de Outubro de 2026",
    readingTime: "4 min de leitura",
    author: {
      name: "Curadoria Dúnia",
      role: "Especialistas em Cenografia & Celebrações",
    },
    content: {
      lead:
        "O casamento não começa quando as portas do salão se abrem, mas no instante em que o casal decide que aquela celebração deve carregar sua própria verdade. Em tempos de cerimônias padronizadas, o verdadeiro luxo reside na autenticidade e no cuidado minucioso com a experiência de cada convidado.",
      paragraphs: [
        "No Dúnia City Hall, compreendemos que 2.500 m² de arquitetura clássica no Lago Sul servem a um propósito maior: ser a tela em branco sobre a qual uma história de amor inesquecível é desenhada. Cada pé-direito monumental, cada lustre de cristal Baccarat e cada arco clássico foram concebidos para proporcionar uma acústica calorosa, onde os votos são ouvidos com clareza cristalina sem ruídos indesejados.",
        "A jornada da noiva ganha um capítulo à parte em nossa Suíte Presidencial da Noiva: um refúgio de serenidade com iluminação calibrada para maquiagem em alta definição, hidromassagem, espaço amplo para madrinhas e fotógrafos, e total isolamento acústico para que as horas que antecedem o 'sim' sejam repletas de tranquilidade e celebração íntima.",
        "Quando o assunto é a recepção, a alta gastronomia autoral do Dúnia assina ilhas gastronômicas quentes e frias que dialogam com o perfil do casal. Das entradas harmonizadas com champanhe às sobremesas escultóricas, a comida deixa de ser apenas serviço e passa a ser uma lembrança afetiva que os convidados comentarão por anos.",
      ],
      quote: {
        text: "“Há lugares que recebem eventos. Outros guardam histórias. O Dúnia é onde elas acontecem com a grandeza que a sua vida merece.”",
        author: "Direção Criativa Dúnia City Hall",
      },
      subheadings: [
        {
          title: "Os pilares fundamentais do planejamento impecável",
          text:
            "Para que os noivos desfrutem de cada segundo do seu dia sem qualquer preocupação logística, destacamos três pontos indispensáveis:",
          bullets: [
            "Cronograma fluído de cerimônia e festa com zonas integradas no mesmo espaço nobre.",
            "Acústica autoral calculada para permitir conversas agradáveis nas mesas enquanto a pista pulsa com energia.",
            "Tecnologia invisível: climatização silenciosa de alta capacidade e gerador próprio de energia ininterrupta.",
          ],
        },
      ],
      highlightCard: {
        title: "Dica Exclusiva do Concierge Dúnia",
        description:
          "Agende sua visita técnica no horário do crepúsculo. A transição da luz natural do Lago Sul banhando a fachada neoclássica para o acendimento gradual dos lustres de cristal permite visualizar exatamente como seus convidados serão impactados no grande dia.",
      },
    },
    tags: ["Casamento de Luxo", "Lago Sul", "Espaço da Noiva", "Gastronomia Autoral", "Arquitetura Neoclássica"],
  },
  {
    id: 2,
    slug: "a-luz-certa-transforma-um-espaco-em-memoria",
    category: "inspiracao",
    categoryLabel: "Inspiração",
    label: "INSPIRAÇÃO • DECORAÇÃO",
    title: "A luz certa transforma um espaço em memória",
    subtitle: "Velas, flores e atmosferas que fazem cada convidado sentir que chegou a um lugar especial.",
    resumo:
      "Iluminação não serve apenas para deixar o ambiente bonito: ela define ritmo, intimidade e profundidade cinematográfica em cada fotografia.",
    coverImage: "/assets/mesa.jpg",
    publishedAt: "24 de Outubro de 2026",
    readingTime: "3 min de leitura",
    author: {
      name: "Equipe de Iluminação Cênica",
      role: "Designers de Atmosfera Dúnia",
    },
    content: {
      lead:
        "Existe uma razão pela qual as grandes memórias da nossa vida parecem banhadas em tons dourados e acolhedores. A luz é a linguagem silenciosa que dita a pulsação de uma festa, orienta o olhar dos convidados e imprime beleza poética em cada ângulo capturado pelas câmeras.",
      paragraphs: [
        "No Dúnia City Hall, a iluminação cênica foi projetada em harmonia direta com os lustres clássicos de cristal. A temperatura de cor de 2.700K (âmbar suave) envolve as mesas postas, valorizando as composições florais e a lapidação das taças de cristal sem ofuscar os rostos.",
        "À medida que a noite avança, a iluminação realiza transições sutis e programadas: o tom solene do jantar cede espaço gradualmente a contrastes mais dramáticos na pista de dança, criando uma aura de mistério e sofisticação.",
      ],
      quote: {
        text: "“A boa luz não chama atenção para si mesma; ela faz as pessoas parecerem radiantes e os momentos parecerem eternos.”",
      },
      subheadings: [
        {
          title: "Como planejar a luz perfeita para o seu evento",
          text:
            "A combinação de três camadas luminosas garante o efeito cinematográfico perfeito:",
          bullets: [
            "Luz de Base: lustres de cristal reguláveis via dimmer para o brilho suntuoso.",
            "Luz Pontual: focos direcionados para arranjos florais e mesa de doces.",
            "Luz Viva: velas naturais em candelabros e castiçais de cristal para o calor orgânico.",
          ],
        },
      ],
    },
    tags: ["Iluminação Cênica", "Lustres de Cristal", "Decoração", "Fotografia 35mm"],
  },
  {
    id: 3,
    slug: "receber-bem-comeca-muito-antes-das-portas-se-abrirem",
    category: "eventos",
    categoryLabel: "Eventos",
    label: "EVENTOS • EXPERIÊNCIA",
    title: "Receber bem começa muito antes das portas se abrirem",
    subtitle: "Convites digitais, informações claras e uma jornada de convidados pensada com carinho.",
    resumo:
      "O evento começa quando o convidado recebe o primeiro convite. Com o Dúnia Experience OS, entregamos mini-sites sob medida e recepção VIP com QR Code na portaria.",
    coverImage: "/assets/salao.jpg",
    publishedAt: "19 de Outubro de 2026",
    readingTime: "4 min de leitura",
    author: {
      name: "Tecnologia & Experiência",
      role: "Dúnia Digital Lab",
    },
    content: {
      lead:
        "A verdadeira hospitalidade contemporânea elimina a ansiedade e o atrito. Antes mesmo de escolherem o traje ou cruzarem o pórtico do salão, seus convidados já devem sentir que estão prestes a vivenciar algo extraordinário.",
      paragraphs: [
        "Com a plataforma Dúnia Experience OS, cada anfitrião recebe um mini-site exclusivo, contendo mapa interativo com rotas no Lago Sul, sugestões de dress code, lista de presentes integrada e confirmação instantânea de presença com código individual.",
        "Na chegada ao salão, o valet com manobristas treinados e o check-in ágil por QR Code garantem que nenhum convidado enfrente filas, sendo recebido imediatamente com uma taça de boas-vindas.",
      ],
      subheadings: [
        {
          title: "Diferenciais da Jornada do Convidado Dúnia",
          text: "Elementos pensados para encantar do início ao fim:",
          bullets: [
            "Acesso VIP rápido com leitura instantânea e sem burocracia.",
            "Estacionamento privativo com segurança ostensiva e monitoramento 24h.",
            "Acessibilidade integral em todos os ambientes e sanitários de padrão hoteleiro internacional.",
          ],
        },
      ],
    },
    tags: ["Hospitalidade", "Mini-site", "Check-in VIP", "Dúnia OS"],
  },
  {
    id: 4,
    slug: "uma-festa-de-quinze-anos-que-tem-a-sua-assinatura",
    category: "inspiracao",
    categoryLabel: "Inspiração",
    label: "INSPIRAÇÃO • 15 ANOS",
    title: "Uma festa de quinze anos que tem a sua assinatura",
    subtitle: "O que faz uma celebração parecer única é a personalidade de quem está no centro dela.",
    resumo:
      "A celebração dos 15 anos une a nobreza do protocolo clássico à energia de uma balada inesquecível com tecnologia de iluminação de última geração.",
    coverImage: "/assets/debutante.jpg",
    publishedAt: "14 de Outubro de 2026",
    readingTime: "3 min de leitura",
    author: {
      name: "Curadoria Jovem Dúnia",
      role: "Produtores de Debutantes",
    },
    content: {
      lead:
        "Completar 15 anos em Brasília é viver um rito de passagem inigualável. O desafio é equilibrar a elegância que a família valoriza com a vibração que a debutante e seus amigos esperam.",
      paragraphs: [
        "No Dúnia City Hall, a flexibilidade cenográfica permite desenhar momentos distintos sob o mesmo teto: a valsa monumental no salão clássico sob lustres de cristal e, momentos depois, a abertura de uma pista de dança de última geração com efeitos cênicos e telões de alta resolução.",
        "Para os amigos, ilhas de mocktails autorais sem álcool e estações de gastronomia jovem (como sushi bar e mini burgers artesanais) garantem energia durante toda a madrugada.",
      ],
      highlightCard: {
        title: "Espaço Debutante",
        description:
          "Camarim exclusivo para troca de vestidos, retoque de make com sua equipe e camarim com espelho camarim para selfies antes da grande entrada.",
      },
    },
    tags: ["15 Anos", "Debutantes Brasília", "Balada", "Valsa dos Sonhos"],
  },
  {
    id: 5,
    slug: "conexoes-que-continuam-depois-do-evento",
    category: "eventos",
    categoryLabel: "Eventos",
    label: "EVENTOS • CORPORATIVO",
    title: "Conexões que continuam depois do evento",
    subtitle: "Quando um encontro corporativo é pensado para aproximar líderes e gerar impacto duradouro.",
    resumo:
      "Galas, premiações e encontros diplomáticos exigem distinção, acústica refinada e protocolos de segurança internacional no Lago Sul.",
    coverImage: "/assets/corporativo.jpg",
    publishedAt: "08 de Outubro de 2026",
    readingTime: "4 min de leitura",
    author: {
      name: "Relações Institucionais",
      role: "Dúnia Corporate Affairs",
    },
    content: {
      lead:
        "Em Brasília, os eventos corporativos e de gala diplomática demandam um padrão de excelência que pouquíssimos endereços conseguem entregar. Credibilidade, discrição e imponência são pré-requisitos absolutos.",
      paragraphs: [
        "O Dúnia City Hall já foi palco de recepções para embaixadas de todos os continentes, posses de grandes entidades de classe e convenções de líderes nacionais. Nossa estrutura modular acomoda confortavelmente jantares empratados para até 1.200 convidados.",
        "A logística inclui entradas privativas para autoridades com escolta, geradores de alta potência, internet dedicada redundante em fibra óptica e acústica calibrada para discursos com clareza impecável.",
      ],
      subheadings: [
        {
          title: "Infraestrutura Corporativa & Diplomática",
          text: "Padrão de conferência internacional no coração do Lago Sul:",
          bullets: [
            "Isolamento acústico total e sistema de som de precisão cirúrgica.",
            "Salas VIP de apoio para reuniões bilaterais reservadas.",
            "Buffet autoral capaz de atender restrições religiosas e culturais (Kosher, Halal, Vegano).",
          ],
        },
      ],
    },
    tags: ["Corporativo", "Embaixadas", "Galas", "Brasília Diplomatica"],
  },
  {
    id: 6,
    slug: "como-organizar-a-confirmacao-de-presenca-sem-complicacao",
    category: "casamento",
    categoryLabel: "Casamentos",
    label: "CASAMENTOS • CONVIDADOS",
    title: "Como organizar a confirmação de presença sem complicação",
    subtitle: "Um RSVP simples e moderno é um gesto de cuidado com os convidados e com a organização.",
    resumo:
      "Elimine a dor de cabeça da lista de convidados: dashboard em tempo real, validação por QR Code e assertividade no cálculo do buffet.",
    coverImage: "/assets/festa.jpg",
    publishedAt: "02 de Outubro de 2026",
    readingTime: "3 min de leitura",
    author: {
      name: "Gestão de Eventos",
      role: "Consultoria Operacional Dúnia",
    },
    content: {
      lead:
        "O cálculo exato de convidados confirmados é o segredo para um evento sustentável, sem desperdício de investimento e sem surpresas na recepção. O método tradicional de telefonemas deu lugar à tecnologia fluida.",
      paragraphs: [
        "Com o sistema integrado do Dúnia, o casal acompanha em tempo real quantos convidados já confirmaram presença, quais trazem acompanhantes e eventuais restrições alimentares declaradas.",
        "No dia da festa, a conferência na entrada leva menos de dois segundos por convidado com leitura via tablet ou smartphone, impedindo penetras e duplicidades com discrição e elegância.",
      ],
      subheadings: [
        {
          title: "Cronograma Recomendado de RSVP",
          text: "Prazos ideais para garantir precisão máxima:",
          bullets: [
            "Envio do Save the Date: de 6 a 8 meses de antecedência.",
            "Abertura do RSVP Digital: 60 dias antes da celebração.",
            "Fechamento final do número de buffet: 15 a 10 dias antes do evento.",
          ],
        },
      ],
    },
    tags: ["RSVP Digital", "Lista de Convidados", "Planejamento", "Check-in"],
  },
]

export function getRevistaArticleBySlug(slug: string): RevistaArticle | undefined {
  return REVISTA_ARTICLES.find((a) => a.slug === slug)
}

export function getRelatedRevistaArticles(currentSlug: string, limit = 3): RevistaArticle[] {
  return REVISTA_ARTICLES.filter((a) => a.slug !== currentSlug).slice(0, limit)
}

