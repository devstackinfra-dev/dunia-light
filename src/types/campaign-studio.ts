/**
 * Tipos e Interfaces do Estúdio de Landing Pages 4V (Bíblia Criativa 4V).
 *
 * Cada seção de uma página de campanha possui um ID único, tipo de bloco,
 * status de visibilidade (enabled), ordem e payload customizável de conteúdo.
 */

export type SectionType =
  | "hero"
  | "context_empathy"
  | "diferenciais_4v"
  | "product_spotlight"
  | "how_it_works"
  | "testimonials"
  | "earnings_calculator"
  | "faq_accordion"
  | "lead_form"
  | "whatsapp_cta_banner"

export interface BaseSectionConfig {
  id: string
  type: SectionType
  enabled: boolean
  order: number
}

// 1. Hero
export interface HeroSectionConfig extends BaseSectionConfig {
  type: "hero"
  title: string
  subtitle?: string
  badgeText?: string
  imageUrl?: string
  primaryCtaText?: string
  primaryCtaUrl?: string
  showWhatsappBtn?: boolean
  whatsappPhone?: string
  whatsappText?: string
}

// 2. Contexto & Empatia (V2 - Vínculo)
export interface ContextEmpathySectionConfig extends BaseSectionConfig {
  type: "context_empathy"
  title: string
  subtitle?: string
  cards: Array<{
    title: string
    description: string
    iconName?: string
  }>
}

// 3. Os 4Vs Sua Empresa (V1/V2)
export interface Diferenciais4VSectionConfig extends BaseSectionConfig {
  type: "diferenciais_4v"
  title: string
  subtitle?: string
  items: Array<{
    vKey: "vantagem" | "valor" | "velocidade" | "variedade"
    title: string
    description: string
    highlight: string
  }>
}

// 4. Veículo / Oferta em Destaque (V1/V3)
export interface ProductSpotlightSectionConfig extends BaseSectionConfig {
  type: "product_spotlight"
  title: string
  subtitle?: string
  productName: string
  productCategory?: string
  dailyRate?: number
  weeklyRate?: number
  monthlyRate?: number
  imageUrl?: string
  features: string[]
  ctaText?: string
  ctaUrl?: string
}

// 5. Como Funciona / Passo a Passo (V3 - Validação)
export interface HowItWorksSectionConfig extends BaseSectionConfig {
  type: "how_it_works"
  title: string
  subtitle?: string
  steps: Array<{
    number: number
    title: string
    description: string
  }>
}

// 6. Depoimentos & Prova Social (V3)
export interface TestimonialsSectionConfig extends BaseSectionConfig {
  type: "testimonials"
  title: string
  subtitle?: string
  items: Array<{
    name: string
    role: string
    testimony: string
    rating: number
    avatarUrl?: string
  }>
}

// 7. Calculadora de Ganhos / Economia (V1 - Valor)
export interface EarningsCalculatorSectionConfig extends BaseSectionConfig {
  type: "earnings_calculator"
  title: string
  subtitle?: string
  defaultKmPerDay?: number
  fuelPricePerLiter?: number
  hybridAvgKmPerLiter?: number
  flexAvgKmPerLiter?: number
  ctaText?: string
}

// 8. FAQ Accordion / Perguntas Frequentes (V3/V4)
export interface FaqAccordionSectionConfig extends BaseSectionConfig {
  type: "faq_accordion"
  title: string
  subtitle?: string
  items: Array<{
    question: string
    answer: string
  }>
}

// 9. Formulário de Captura Direta (V4 - Venda/Conversão)
export interface LeadFormSectionConfig extends BaseSectionConfig {
  type: "lead_form"
  title: string
  subtitle?: string
  buttonText?: string
  successMessage?: string
}

// 10. Banner WhatsApp (V4 - Venda/Conversão)
export interface WhatsAppCtaSectionConfig extends BaseSectionConfig {
  type: "whatsapp_cta_banner"
  title: string
  subtitle?: string
  phone?: string
  customMessage?: string
  buttonText?: string
}

export type CampaignSection =
  | HeroSectionConfig
  | ContextEmpathySectionConfig
  | Diferenciais4VSectionConfig
  | ProductSpotlightSectionConfig
  | HowItWorksSectionConfig
  | TestimonialsSectionConfig
  | EarningsCalculatorSectionConfig
  | FaqAccordionSectionConfig
  | LeadFormSectionConfig
  | WhatsAppCtaSectionConfig

import { BRAND } from "@/config/brand"

export const DEFAULT_JURIDICO_4V_SECTIONS: CampaignSection[] = [
  {
    id: "sec_hero",
    type: "hero",
    enabled: true,
    order: 0,
    title: "Assessoria Jurídica Estratégica & Defesa de Direitos",
    subtitle: `Atuação de alta complexidade em ${BRAND.professional.city || "São Paulo"}. Sigilo absoluto, rigor técnico e excelência em resultados.`,
    badgeText: `${BRAND.name} • Advocacia Especializada`,
    primaryCtaText: "Agendar Atendimento Jurídico",
    primaryCtaUrl: "#cadastro",
    showWhatsappBtn: true,
    whatsappPhone: BRAND.contact.whatsapp || "5511999999999",
    whatsappText: "Olá! Gostaria de agendar uma consulta jurídica confidencial.",
  },
  {
    id: "sec_context",
    type: "context_empathy",
    enabled: true,
    order: 1,
    title: "Segurança jurídica nos momentos que mais importam",
    subtitle: "Protegemos seus interesses e seu patrimônio com agilidade e estratégia sob medida.",
    cards: [
      {
        title: "Prevenção ativa de riscos e litígios",
        description: "Diagnósticos precisos para evitar processos desgastantes e prejuízos operacionais.",
      },
      {
        title: "Atuação contenciosa resolutiva e combativa",
        description: "Defesa firme e minuciosa dos seus direitos em todas as instâncias judiciais e administrativas.",
      },
      {
        title: "Atendimento humanizado e confidencial",
        description: "Acompanhamento próximo e transparente em cada etapa do seu processo ou negócio.",
      },
    ],
  },
  {
    id: "sec_4v",
    type: "diferenciais_4v",
    enabled: true,
    order: 2,
    title: "Os 4 Pilares da Nossa Atuação Jurídica",
    subtitle: "Nossa metodologia combina rigor analítico e dedicação exclusiva a cada demanda.",
    items: [
      {
        vKey: "vantagem",
        title: "V1 · Vantagem (Estratégia Sob Medida)",
        description: "Soluções jurídicas personalizadas para a realidade específica de cada cliente ou negócio.",
        highlight: "Foco em resultados resolutivos",
      },
      {
        vKey: "valor",
        title: "V2 · Valor (Rigor Técnico & Ética)",
        description: "Conformidade estrita às diretrizes da OAB e transparência total de honorários.",
        highlight: "Sigilo profissional absoluto",
      },
      {
        vKey: "velocidade",
        title: "V3 · Velocidade (Agilidade e Plantão)",
        description: "Resposta rápida e atuação prioritária para liminares e medidas urgentes.",
        highlight: "Plantão consultivo disponível",
      },
      {
        vKey: "variedade",
        title: "V4 · Variedade (Cobertura Multidisciplinar)",
        description: "Direito Tributário, Trabalhista, Contratos, Civil e Societário com visão integrada.",
        highlight: "Assessoria completa e contínua",
      },
    ],
  },
  {
    id: "sec_product",
    type: "product_spotlight",
    enabled: true,
    order: 3,
    title: "Especialidade Jurídica em Destaque",
    subtitle: "Atuação consultiva e contenciosa especializada para proteção patrimonial e empresarial.",
    productName: "Direito Tributário & Planejamento Fiscal",
    productCategory: "Consultoria & Contencioso Estratégico",
    dailyRate: 0,
    weeklyRate: 0,
    monthlyRate: 0,
    imageUrl: BRAND.professional.photoAbout || BRAND.professional.photo || "/images/sobre/escritorio.jpg",
    features: [
      "Recuperação de créditos tributários",
      "Defesas contra autos de infração fiscal",
      "Planejamento societário e sucessório",
      "Atendimento presencial e videoconferência",
    ],
    ctaText: "Consultar Especialista",
    ctaUrl: "#cadastro",
  },
  {
    id: "sec_how_it_works",
    type: "how_it_works",
    enabled: true,
    order: 4,
    title: "Como funciona nosso atendimento em 4 passos",
    subtitle: "Do primeiro contato à condução estratégica do seu caso.",
    steps: [
      {
        number: 1,
        title: "Contato Inicial",
        description: "Envie uma mensagem descrevendo sua necessidade com total confidencialidade.",
      },
      {
        number: 2,
        title: "Diagnóstico Preliminar",
        description: "Analisamos os fatos e documentos para avaliar a viabilidade jurídica da demanda.",
      },
      {
        number: 3,
        title: "Proposta & Estratégia",
        description: "Apresentamos o plano de ação detalhado, honorários claros e prazos previstos.",
      },
      {
        number: 4,
        title: "Condução & Acompanhamento",
        description: "Execução diligente com relatórios periódicos de andamento processual.",
      },
    ],
  },
  {
    id: "sec_testimonials",
    type: "testimonials",
    enabled: true,
    order: 5,
    title: "A confiança de quem já foi representado por nós",
    subtitle: "Relações sólidas construídas com base em resultados e ética profissional.",
    items: [
      {
        name: "Mariana Albuquerque",
        role: "Diretora Financeira",
        testimony: "Excelente condução no contencioso tributário da nossa empresa. Profissionalismo e clareza impecáveis.",
        rating: 5,
      },
      {
        name: "Dr. Renato Ferreira",
        role: "Empresário",
        testimony: "A assessoria contratual nos deu a segurança necessária para expandir nossos negócios com tranquilidade.",
        rating: 5,
      },
      {
        name: "Juliana Costa",
        role: "Cliente Consultivo",
        testimony: "Atendimento ágil, atencioso e de altíssimo nível técnico. Recomendo com total tranquilidade.",
        rating: 5,
      },
    ],
  },
  {
    id: "sec_calc",
    type: "earnings_calculator",
    enabled: false,
    order: 6,
    title: "Simulador",
    subtitle: "Simule os valores.",
    defaultKmPerDay: 0,
    fuelPricePerLiter: 0,
    hybridAvgKmPerLiter: 0,
    flexAvgKmPerLiter: 0,
    ctaText: "Consultar",
  },
  {
    id: "sec_faq",
    type: "faq_accordion",
    enabled: true,
    order: 7,
    title: "Perguntas Frequentes",
    subtitle: "Respostas claras para as dúvidas mais comuns sobre nosso atendimento.",
    items: [
      {
        question: "Como é garantido o sigilo das informações?",
        answer: "Todas as comunicações e documentos estão protegidos pelo sigilo profissional inerente à advocacia e às normas éticas da OAB.",
      },
      {
        question: "O escritório realiza atendimento fora de São Paulo?",
        answer: "Sim, realizamos atendimentos e condução processual em todo o território nacional por meio de processos eletrônicos e reuniões por videoconferência.",
      },
      {
        question: "Como são definidos os honorários advocatícios?",
        answer: "Os honorários são apresentados de forma transparente em proposta formal antes de qualquer contratação, respeitando a complexidade da demanda.",
      },
      {
        question: "Qual o tempo médio de resposta para consultas urgentes?",
        answer: "Consultas urgentes e medidas liminares são analisadas com prioridade imediata pela nossa equipe de plantão.",
      },
    ],
  },
  {
    id: "sec_form",
    type: "lead_form",
    enabled: true,
    order: 8,
    title: "Agende seu Atendimento Jurídico",
    subtitle: "Preencha o formulário abaixo. Nossa equipe entrará em contato com a brevidade necessária.",
    buttonText: "Solicitar Atendimento",
    successMessage: "Solicitação enviada com sucesso! Entraremos em contato em breve.",
  },
  {
    id: "sec_whatsapp_cta",
    type: "whatsapp_cta_banner",
    enabled: true,
    order: 9,
    title: "Prefere tirar suas dúvidas via WhatsApp?",
    subtitle: "Nosso canal de atendimento está disponível para orientar sua demanda de forma ágil e segura.",
    buttonText: "Falar pelo WhatsApp Agora",
    customMessage: "Olá! Gostaria de agendar uma consulta jurídica.",
  },
]

export const DEFAULT_CATALOGO_4V_SECTIONS: CampaignSection[] = [
  {
    id: "sec_hero",
    type: "hero",
    enabled: true,
    order: 0,
    title: "Alugue seu Táxi ou Híbrido com 45 anos de tradição em SP",
    subtitle: "Carros revisados, sem análise de score e liberação ágil para você rodar e faturar no mesmo dia.",
    badgeText: "Garantia Sua Empresa",
    primaryCtaText: "Quero Alugar Agora",
    primaryCtaUrl: "#cadastro",
    showWhatsappBtn: true,
    whatsappPhone: "511999999999",
    whatsappText: "Olá! Vi a campanha e gostaria de informações sobre a locação de veículos.",
  },
  {
    id: "sec_context",
    type: "context_empathy",
    enabled: true,
    order: 1,
    title: "Sabemos exatamente os desafios da sua rotina",
    subtitle: "Eliminamos a incerteza para que você foque no que importa: faturar com tranquilidade.",
    cards: [
      {
        title: "Chega de gastar todo o lucro no posto",
        description: "Veículos híbridos e GNV homologados rodam até o dobro gastando a metade de combustível.",
      },
      {
        title: "Sem travar na consulta de score",
        description: "Processo de locação sem burocracia bancária, focado na sua capacidade de trabalho.",
      },
      {
        title: "Suporte operacional quando você precisa",
        description: "Manutenção preventiva, seguro total e veículo reserva para você não ficar parado.",
      },
    ],
  },
  {
    id: "sec_4v",
    type: "diferenciais_4v",
    enabled: true,
    order: 2,
    title: "Os 4Vs da Experiência Sua Empresa",
    subtitle: "Conheça os pilares que fazem do Sua Empresa a escolha de milhares de motoristas em São Paulo.",
    items: [
      {
        vKey: "vantagem",
        title: "V1 · Vantagem (Economia Real)",
        description: "Menor custo operacional por km rodado e tabela de diárias altamente competitiva.",
        highlight: "Economia de até 50% em combustível",
      },
      {
        vKey: "valor",
        title: "V2 · Valor (Transparência Total)",
        description: "Sem taxas ocultas, regras claras de caução e contratos simples e transparentes.",
        highlight: "Sem surpresas na fatura",
      },
      {
        vKey: "velocidade",
        title: "V3 · Velocidade (Retirada em 24h)",
        description: "Análise ágil de cadastro e entrega do veículo pronto para rodar em tempo recorde.",
        highlight: "Aprovação em até 1 dia útil",
      },
      {
        vKey: "variedade",
        title: "V4 · Variedade (Frota Diversificada)",
        description: "Sedans executivos, modelos D-Taxi Congonhas, veículos acessíveis adaptados e elétricos.",
        highlight: "Modelos 2024/2026 homologados",
      },
    ],
  },
  {
    id: "sec_product",
    type: "product_spotlight",
    enabled: true,
    order: 3,
    title: "Veículo em Destaque da Campanha",
    subtitle: "Conforto supremo, faturamento elevado e aceito nas principais categorias de apps e táxi.",
    productName: "Toyota Corolla Cross Hybrid 2026",
    productCategory: "Híbrido Executivo & D-Taxi",
    dailyRate: 157,
    weeklyRate: 980,
    monthlyRate: 3900,
    imageUrl: "/images/hero/slide-corolla.png",
    features: [
      "Consumo de até 20 km/l na cidade",
      "Homologado D-Taxi Congonhas",
      "Manutenção e seguro inclusos",
      "Câmbio Automático CVT & Direção Elétrica",
    ],
    ctaText: "Garantir Este Veículo",
    ctaUrl: "#cadastro",
  },
  {
    id: "sec_how_it_works",
    type: "how_it_works",
    enabled: true,
    order: 4,
    title: "Como funciona para alugar seu carro em 4 passos",
    subtitle: "Processo descomplica para você começar a rodar sem perder tempo.",
    steps: [
      {
        number: 1,
        title: "Preencha o Cadastro",
        description: "Informe seus dados básicos e CNH com EAR em menos de 2 minutos no site.",
      },
      {
        number: 2,
        title: "Análise Rápida",
        description: "Nossa equipe valida sua documentação em até 24 horas sem consulta de score.",
      },
      {
        number: 3,
        title: "Escolha o Veículo",
        description: "Selecione o modelo perfeito para a sua categoria e rotina de trabalho.",
      },
      {
        number: 4,
        title: "Retire e Fature",
        description: "Pegue a chave na nossa sede em SP e comece a faturar imediatamente.",
      },
    ],
  },
  {
    id: "sec_testimonials",
    type: "testimonials",
    enabled: true,
    order: 5,
    title: "Quem aluga com o Sua Empresa recomenda",
    subtitle: "Depoimentos reais de motoristas que transformaram seu faturamento com nossa frota.",
    items: [
      {
        name: "Carlos Eduardo Silva",
        role: "Motorista D-Taxi Congonhas",
        testimony: "Mudei para o Corolla Híbrido da Sua Empresa e economizo mais de R$ 1.200 por mês em combustível. A fila em Congonhas anda rápido demais!",
        rating: 5,
      },
      {
        name: "Marcos Antonio Pereira",
        role: "Motorista de App (3 anos de frota)",
        testimony: "O suporte é sensacional. Quando precisei de manutenção preventiva, o carro reserva ficou pronto no mesmo dia. Não troco por nada.",
        rating: 5,
      },
      {
        name: "Fernanda Ribeiro",
        role: "Motorista de Táxi Acessível",
        testimony: "Atendimento humano de verdade. Me ajudaram com toda a orientação para rodar com tranquilidade e faturar alto.",
        rating: 5,
      },
    ],
  },
  {
    id: "sec_calc",
    type: "earnings_calculator",
    enabled: true,
    order: 6,
    title: "Simule sua Economia de Combustível",
    subtitle: "Descubra quanto dinheiro volta para o seu bolso rodando com nossos modelos Híbridos.",
    defaultKmPerDay: 200,
    fuelPricePerLiter: 5.89,
    hybridAvgKmPerLiter: 19.5,
    flexAvgKmPerLiter: 9.8,
    ctaText: "Quero Economizar Agora",
  },
  {
    id: "sec_faq",
    type: "faq_accordion",
    enabled: true,
    order: 7,
    title: "Perguntas Frequentes (Tire suas dúvidas)",
    subtitle: "Respostas transparentes para as dúvidas mais comuns dos motoristas.",
    items: [
      {
        question: "Preciso ter score alto para conseguir alugar?",
        answer: "Não! No Sua Empresa não fazemos análise impeditiva de score de crédito. Avaliamos apenas os requisitos básicos da CNH com EAR.",
      },
      {
        question: "A manutenção do veículo já está inclusa na diária?",
        answer: "Sim! Toda a manutenção preventiva e corretiva por desgaste natural é por nossa conta, além do seguro e suporte 24h.",
      },
      {
        question: "Como funciona para motoristas de Táxi / D-Taxi?",
        answer: "Nossos veículos possuem todas as homologações necessárias junto aos órgãos competentes (DTP/SP) e acesso direto às filas de embarque.",
      },
      {
        question: "Qual o prazo para liberação e retirada do carro?",
        answer: "Após a validação simples dos documentos, a liberação ocorre em até 24 horas úteis na nossa sede em São Paulo.",
      },
    ],
  },
  {
    id: "sec_form",
    type: "lead_form",
    enabled: true,
    order: 8,
    title: "Garanta seu veículo com Condições Exclusivas",
    subtitle: "Preencha o formulário abaixo. Um consultor entrará em contato em minutos para liberar seu cadastro.",
    buttonText: "Enviar Cadastro para Análise",
    successMessage: "Cadastro enviado com sucesso! Nosso consultor entrará em contato em breve pelo WhatsApp.",
  },
  {
    id: "sec_whatsapp_cta",
    type: "whatsapp_cta_banner",
    enabled: true,
    order: 9,
    title: "Prefere tirar suas dúvidas direto no WhatsApp?",
    subtitle: "Nosso time de atendimento está online agora para te ajudar a escolher o melhor carro.",
    buttonText: "Falar com Consultor no WhatsApp",
  },
];

export const DEFAULT_4V_SECTIONS: CampaignSection[] =
  BRAND.vertical === "juridico"
    ? DEFAULT_JURIDICO_4V_SECTIONS
    : DEFAULT_CATALOGO_4V_SECTIONS;
