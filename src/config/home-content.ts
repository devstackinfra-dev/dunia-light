import { BRAND, type VerticalPreset } from "@/config/brand"

/**
 * Conteúdo padrão da página inicial, por vertical.
 *
 * Configurado com todos os textos e imagens oficiais do DÚNIA CITY HALL.
 */

export type HomeSectionId =
  | "hero"
  | "campanha"
  | "diferenciais"
  | "como-funciona"
  | "areas"
  | "film"
  | "sobre"
  | "chamada"
  | "publicacoes"
  | "catalogo"
  | "depoimentos"
  | "faq"
  | "contato"

export type IconName =
  | "shield"
  | "clock"
  | "message"
  | "award"
  | "users"
  | "file"
  | "scale"
  | "handshake"
  | "search"
  | "calendar"
  | "package"
  | "truck"
  | "star"
  | "check"

export interface HomeCard {
  icon: IconName
  title: string
  text: string
  situacoes?: string[]
  image?: string
  slug?: string
}

export interface HomeContent {
  sections: HomeSectionId[]
  hero: {
    badge: string
    title: string
    glowTitle: string
    subtitle: string
    ctaText: string
    secondaryText: string
    confianca: string[]
  }
  sobre: {
    badge: string
    title: string
    paragraphs: string[]
    valores: { title: string; text: string }[]
  }
  chamada: { title: string; text: string; ctaText: string }
  publicacoes: { badge: string; title: string; subtitle: string }
  stats: { icon: IconName; label: string; value: string; detail: string }[]
  diferenciais: { badge: string; title: string; subtitle: string; cards: HomeCard[] }
  comoFunciona: { badge: string; title: string; subtitle: string; steps: { title: string; text: string }[] }
  areas: { badge: string; title: string; subtitle: string; ctaText: string; whatsappMessage: string; cards: HomeCard[] }
  catalogo: {
    badge: string
    title: string
    subtitle: string
    showPrice: boolean
    ctaText: string
    whatsappMessage: string
  }
  depoimentos: { badge: string; title: string; subtitle: string }
  faq: { badge: string; title: string; subtitle: string; items: { q: string; a: string }[] }
  contato: {
    badge: string
    title: string
    subtitle: string
    messageLabel: string
    messagePlaceholder: string
    submitText: string
    successText: string
  }
  footer: { about: string }
  navCta: string
}

const nome = BRAND.name

const EVENTOS: HomeContent = {
  sections: ["hero", "areas", "film", "sobre", "diferenciais", "como-funciona", "chamada", "faq", "contato"],
  hero: {
    badge: "Lago Sul • Brasília / DF",
    title: "O salão de festas mais elegante de Brasília,",
    glowTitle: "perfeito para todos os tipos de eventos.",
    subtitle: "Desde 2008 eternizando momentos inesquecíveis com arquitetura monumental de 2.500 m², capacidade para até 1.200 convidados e gastronomia de padrão internacional.",
    ctaText: "Agendar Visita VIP",
    secondaryText: "Conhecer as Celebrações",
    confianca: ["2.500 m² de Área Nobre", "Até 1.200 Convidados", "Espaço da Noiva & Camarim Exclusivo"],
  },
  stats: [
    { icon: "award", label: "Tradição", value: "Desde 2008", detail: "Mais de 15 anos de história no Lago Sul" },
    { icon: "users", label: "Capacidade", value: "Até 1.200", detail: "Dois salões luxuosos e versáteis" },
    { icon: "shield", label: "Área Nobre", value: "2.500 m²", detail: "Conforto, segurança e acessibilidade" },
    { icon: "star", label: "Gastronomia", value: "Buffet Dúnia", detail: "Alta gastronomia e afeto em cada prato" },
  ],
  areas: {
    badge: "Celebrações & Espaços",
    title: "Cenários Inesquecíveis para Momentos Únicos",
    subtitle: "Estrutura clássica e versátil, desenhada para acolher sua celebração com o mais alto nível de requinte e distinção.",
    ctaText: "Solicitar Orçamento",
    whatsappMessage: "Olá! Gostaria de informações e disponibilidade para {item} no Dúnia City Hall.",
    cards: [
      {
        icon: "award",
        title: "Casamentos dos Sonhos",
        text: "Nosso conceito clássico e romântico transforma cada detalhe, tornando seu casamento um conto de fadas mágico com Espaço da Noiva exclusivo.",
        image: "/images/dunia/casamento-hero.jpg",
        slug: "casamento",
        situacoes: [
          "Espaço da Noiva projetado para conforto e tranquilidade",
          "Decoração elegante com paleta de cores delicadas",
          "Cerimônias integradas com o jardim e o salão principal"
        ],
      },
      {
        icon: "star",
        title: "Debutantes e 15 Anos",
        text: "A noite mágica dos seus 15 anos com pista de dança de última geração, som e iluminação cênica de alta tecnologia e momentos inesquecíveis.",
        image: "/images/dunia/debutante-hero.jpg",
        slug: "debutante",
        situacoes: [
          "Pista de dança monumental com tecnologia de luz",
          "Camarim exclusivo para trocas de figurino",
          "Cenografia instagramável e moderna para fotos"
        ],
      },
      {
        icon: "shield",
        title: "Corporativo & Convenções",
        text: "Infraestrutura de ponta para congressos, simpósios, premiações e jantares de gala empresariais no centro das grandes decisões de Brasília.",
        image: "/images/dunia/corporativo-hero.jpg",
        slug: "corporativo",
        situacoes: [
          "Infraestrutura de som e projeção para palestras",
          "Configurações modulares para auditório e banquete",
          "Estacionamento amplo e localização privilegiada"
        ],
      },
      {
        icon: "users",
        title: "Embaixadas & Recepções Diplomáticas",
        text: "Acolhendo o mundo com distinção e diplomacia. Ambientes personalizados que respeitam e homenageiam as tradições e protocolos de cada país.",
        image: "/images/dunia/embaixadas-galeria.jpg",
        slug: "embaixadas",
        situacoes: [
          "Tradição no atendimento a embaixadas e consulados",
          "Gastronomia personalizada com menus de várias culturas",
          "Privacidade e segurança rigorosa para autoridades"
        ],
      },
      {
        icon: "calendar",
        title: "Festas Sociais & Bodas",
        text: "Sua festa merece ser mais do que especial — merece ser inesquecível. Espaços elegantes que se adaptam perfeitamente a aniversários e celebrações familiares.",
        image: "/images/dunia/festas-hero.jpg",
        slug: "festas",
        situacoes: [
          "Ambientes encantadores para comemorações íntimas ou grandiosas",
          "Mesa de doces e bolo em destaque cinematográfico",
          "Equipe dedicada para garantir que tudo saia perfeito"
        ],
      },
      {
        icon: "award",
        title: "Buffet Dúnia & Gastronomia",
        text: "Acreditamos que a gastronomia é a linguagem do afeto. Uma viagem de sabores dos pratos tradicionais aos internacionais, além de doces que são verdadeiros pedacinhos de felicidade.",
        image: "/images/dunia/buffet-hero.jpg",
        slug: "buffet",
        situacoes: [
          "Menus personalizados para cada tipo de celebração",
          "Ingredientes selecionados e apresentação impecável",
          "Ilhas gastronômicas atrativas e atendimento cortês"
        ],
      },
    ],
  },
  sobre: {
    badge: "Nossa História & Tradição",
    title: "Dúnia City Hall",
    paragraphs: [
      "Com aproximadamente 2.500 m², o Dúnia possui duas luxuosas opções de salões e capacidade para receber até 1.200 convidados deslumbrados com cada detalhe da sua festa.",
      "Desde 2008, o nosso espaço já recebeu a visita de grandes autoridades internacionais e brasileiras: autoridades dos Três Poderes, representantes diplomáticos e personalidades consagradas como o Rei Pelé.",
      "Temos a beleza em forma arquitetônica, o luxo em sua ambientação e a qualidade inegociável no atendimento. Tudo pensado para eternizar a realização do seu sonho no coração do Lago Sul, Brasília.",
    ],
    valores: [
      { title: "Arquitetura Monumental", text: "2.500 m² de área nobre com pé-direito grandioso e lustres clássicos de cristal." },
      { title: "Localização Nobre", text: "Situado na SHIS QI 15 do Lago Sul, com facilidade de acesso, discrição e segurança." },
      { title: "Gastronomia Própria", text: "Buffet autoral com seleção rigorosa de ingredientes e afeto em cada preparação." },
      { title: "Espaço da Noiva Exclusivo", text: "Camarim completo para descanso, maquiagem e preparação com conforto e privacidade." },
    ],
  },
  diferenciais: {
    badge: "Por Que Escolher o Dúnia",
    title: "Estrutura Completa para Momentos Inesquecíveis",
    subtitle: "Cada detalhe da nossa casa foi concebido para entregar tranquilidade aos anfitriões e encantamento aos convidados.",
    cards: [
      {
        icon: "award",
        title: "Espaço da Noiva Exclusivo",
        text: "Projetado com conforto térmico, iluminação profissional e tranquilidade para que a noiva viva momentos mágicos antes da cerimônia.",
      },
      {
        icon: "users",
        title: "Versatilidade para até 1.200 Pessoas",
        text: "Dois salões integrados com divisórias acústicas retráteis, atendendo desde jantares intimistas até celebrações monumentais.",
      },
      {
        icon: "star",
        title: "Jardim Integrado",
        text: "Área verde encantadora integrada aos salões para cerimônias ao ar livre, coquetéis ao pôr do sol e fotos inesquecíveis.",
      },
      {
        icon: "shield",
        title: "Segurança e Estacionamento",
        text: "Localização privilegiada na QI 15 do Lago Sul com estrutura completa de recepção, vallet e segurança para seus convidados.",
      },
    ],
  },
  comoFunciona: {
    badge: "Processo de Atendimento",
    title: "Do Primeiro Contato ao Grande Dia",
    subtitle: "Acompanhamento atencioso com nossa equipe para garantir que sua celebração seja perfeita em cada segundo.",
    steps: [
      { title: "1. Agendamento de Visita VIP", text: "Venha conhecer nossos salões e o jardim pessoalmente com nossa equipe de concierge." },
      { title: "2. Projeto Personalizado", text: "Definimos o salão ideal, layout de mesas, iluminação e cronograma da sua festa." },
      { title: "3. Degustação do Buffet Dúnia", text: "Você experimenta as opções do nosso menu e escolhe as ilhas gastronômicas do seu evento." },
      { title: "4. A Grande Celebração", text: "Nossa equipe cuida de toda a operação e infraestrutura para você apenas comemorar e se emocionar." },
    ],
  },
  chamada: {
    title: "Pronto para eternizar seu grande momento?",
    text: "O Dúnia City Hall tem as datas mais cobiçadas de Brasília. Agende agora uma visita VIP e reserve o cenário dos seus sonhos.",
    ctaText: "Agendar Visita com Concierge",
  },
  publicacoes: {
    badge: "Inspirações",
    title: "Dicas & Tendências de Eventos",
    subtitle: "Ideias e orientações para casamentos, debutantes e celebrações memoráveis.",
  },
  catalogo: {
    badge: "Espaços",
    title: "Nossos Salões",
    subtitle: "Conheça as opções disponíveis para o seu evento.",
    showPrice: false,
    ctaText: "Ver Detalhes",
    whatsappMessage: "Olá! Gostaria de mais detalhes sobre o espaço {item} no Dúnia City Hall.",
  },
  depoimentos: {
    badge: "Depoimentos",
    title: "Momentos que Marcaram Vidas",
    subtitle: "O carinho e a emoção de quem já celebrou seus maiores sonhos no Dúnia City Hall.",
  },
  faq: {
    badge: "Dúvidas Frequentes",
    title: "Perguntas sobre o Dúnia City Hall",
    subtitle: "Tudo o que você precisa saber para planejar sua celebração conosco.",
    items: [
      {
        q: "Qual a capacidade total de convidados do Dúnia City Hall?",
        a: "Com 2.500 m² de área e dois salões luxuosos, o Dúnia pode receber confortavelmente de 100 até 1.200 convidados em formato banquete ou coquetel.",
      },
      {
        q: "O Dúnia possui buffet próprio?",
        a: "Sim! Nosso Buffet Dúnia oferece menus de alta gastronomia, com opções tradicionais, internacionais, ilhas temáticas e uma espetacular mesa de doces finos.",
      },
      {
        q: "O espaço conta com área para o Dia da Noiva?",
        a: "Sim, oferecemos um Espaço da Noiva exclusivo, climatizado e com iluminação planejada para cabelo e maquiagem, garantindo total conforto e privacidade antes da entrada.",
      },
      {
        q: "É possível realizar cerimônias ao ar livre?",
        a: "Sim. Temos um belíssimo jardim integrado aos salões, perfeito para cerimônias ao ar livre ou coquetéis de boas-vindas com o pôr do sol de Brasília.",
      },
      {
        q: "Como faço para agendar uma visita e solicitar orçamento?",
        a: "Basta clicar no botão de WhatsApp ou preencher o formulário abaixo. Nosso concierge retornará prontamente para agendar seu horário.",
      },
    ],
  },
  contato: {
    badge: "Agende sua Visita",
    title: "Fale com Nosso Concierge",
    subtitle: "Estamos na SHIS QI 15 Lote J/K, Lago Sul, Brasília – DF. Venha tomar um café conosco e conhecer de perto o Dúnia.",
    messageLabel: "Detalhes do seu Evento",
    messagePlaceholder: "Conte-nos o tipo de evento (Casamento, 15 anos, Corporativo), data prevista e número estimado de convidados.",
    submitText: "Solicitar Atendimento VIP",
    successText: "Recebemos sua solicitação! Nossa equipe entrará em contato em breve para confirmar seu horário.",
  },
  footer: {
    about: "Dúnia City Hall: o salão de festas mais elegante de Brasília. Desde 2008 eternizando momentos inesquecíveis no Lago Sul.",
  },
  navCta: "Agendar Visita",
}

const JURIDICO: HomeContent = {
  ...EVENTOS,
}

const CATALOGO: HomeContent = {
  ...EVENTOS,
}

const GENERICO: HomeContent = {
  ...EVENTOS,
}

const CONTEUDO: Record<VerticalPreset, HomeContent> = {
  eventos: EVENTOS,
  juridico: JURIDICO,
  catalogo: CATALOGO,
  generico: GENERICO,
}

export const HOME = CONTEUDO[BRAND.vertical] ?? EVENTOS

export function sectionLabel(id: HomeSectionId, home: HomeContent = HOME): string | null {
  switch (id) {
    case "areas": return "Celebrações"
    case "film": return "Galeria 35mm"
    case "sobre": return "O Salão"
    case "diferenciais": return "Diferenciais"
    case "como-funciona": return "Como Funciona"
    case "publicacoes": return "Blog"
    case "faq": return "Dúvidas"
    case "contato": return "Agendar Visita"
    default: return null
  }
}

export function navegacao(home: HomeContent, perfil?: { rotulo: string; href: string } | null) {
  const itens = home.sections
    .map((id) => ({ id, label: sectionLabel(id, home) }))
    .filter((item): item is { id: HomeSectionId; label: string } => item.label !== null)
    .map((item) => ({ label: item.label, href: `/#${item.id}` }))
  return itens
}

export const HOME_NAV = navegacao(HOME)
