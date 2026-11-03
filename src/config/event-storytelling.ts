export interface StoryChapter {
  id: string
  year: string
  label: string
  title: string
  location: string
  text: string
  quote?: string
  image: string
}

export interface HonorMember {
  name: string
  role: string
  description: string
}

export interface DressCodeConfig {
  style: string
  tagline: string
  description: string
  palette: { name: string; hex: string; note?: string }[]
  forHer: string
  forHim: string
  caution: string
}

export interface PlaylistItem {
  title: string
  artist: string
  duration: string
  mood: string
  note: string
}

export interface PoeticScheduleItem {
  time: string
  act: string
  title: string
  atmosphere: string
  description: string
  icon: "cocktail" | "ring" | "fork" | "music"
  image: string
}

export interface GuestWish {
  id: string
  name: string
  relationship: string
  text: string
  timeAgo: string
}

export interface EventStorytelling {
  eventId: string
  kicker: string
  heroTagline: string
  openLetter: {
    kicker: string
    title: string
    salutation: string
    paragraphs: string[]
    signature: string
    dateAndCity: string
  }
  chapters: StoryChapter[]
  honorCourt: {
    title: string
    subtitle: string
    parents: HonorMember[]
    witnesses: HonorMember[]
  }
  dressCode: DressCodeConfig
  playlist: {
    title: string
    subtitle: string
    tracks: PlaylistItem[]
  }
  poeticSchedule: PoeticScheduleItem[]
  guestWishes: GuestWish[]
}

export const EVENT_STORYTELLING_DATA: Record<string, EventStorytelling> = {
  "ev-jm": {
    eventId: "ev-jm",
    kicker: "A CELEBRAÇÃO DO NOSSO AMOR • LAGO SUL, BRASÍLIA",
    heroTagline: "Há dias que não cabem no tempo. E noites que se tornam parte de quem somos para sempre.",
    openLetter: {
      kicker: "CARTA ABERTA AOS NOSSOS CONVIDADOS",
      title: "O Sentimento de Estar com Quem Amamos",
      salutation: "Querida família e queridos amigos,",
      paragraphs: [
        "Dizem que o amor verdadeiro não é apenas encontrar alguém com quem viver, mas encontrar a pessoa sem a qual a vida perde a poesia e o riso fácil. Quando nos conhecemos nas margens ensolaradas do Lago Paranoá, em Brasília, não imaginávamos que um café despretensioso seria o primeiro traço do nosso destino compartilhado.",
        "Ao longo desses anos, aprendemos que o amor se constrói na delicadeza dos gestos diários: no olhar que acalma após um dia cansativo, na paciência mútua, no apoio incondicional aos sonhos um do outro e nas risadas sinceras nos dias de chuva da capital. Vocês que seguram nossas mãos desde o início, que torcem pelas nossas vitórias e que enxugam nossas lágrimas, são as testemunhas vivas de que este amor cresceu forte e verdadeiro.",
        "A escolha do Dúnia City Hall foi uma certeza imediata do coração: queríamos um santuário de luz, lustres de cristal e hospitalidade incomparável no Lago Sul, onde pudéssemos acolher cada um de vocês com o carinho que merecem. Sob a luz das velas e ao som da nossa primeira valsa, queremos brindar à vida ao lado das pessoas que mais amamos no mundo.",
        "Obrigado por caminharem conosco. Que esta noite fique guardada em nossos corações pela eternidade.",
      ],
      signature: "Com todo o nosso amor e gratidão, Juliana & Marcos",
      dateAndCity: "21 de Novembro de 2026 • Brasília, Distrito Federal",
    },
    chapters: [
      {
        id: "ch-1",
        year: "2019",
        label: "CAPÍTULO I",
        title: "O Primeiro Olhar no Lago Paranoá",
        location: "Pontão do Lago Sul • Brasília, DF",
        text: "Uma tarde dourada de sábado, um encontro entre amigos em comum e uma conversa que começou despretensiosa sobre música e viagens. Quando as luzes da Ponte JK começaram a refletir na água, já tínhamos a certeza serena de que Brasília nunca mais seria a mesma para nós dois. Ali nascia o nosso porto seguro.",
        quote: "O destino não tem pressa; ele apenas coloca no mesmo instante duas almas que já se procuravam.",
        image: "/images/acervo/03-casamento/Juliana-Lucas-127.jpeg",
      },
      {
        id: "ch-2",
        year: "2022",
        label: "CAPÍTULO II",
        title: "Cúmplices de Cada Jornada & Nosso Lar",
        location: "A Construção do Nosso Ninho",
        text: "Entre caixas empilhadas, café coado na caneca e noites intermináveis de planos na sala do novo apartamento, descobrimos que o nosso lugar favorito no mundo era onde estivéssemos juntos. Viajamos serras e praias, adotamos rotinas e aprendemos que amar é decidir ser parceiro em todas as estações.",
        quote: "A vida a dois é mais leve quando o riso é cúmplice e o abraço é casa.",
        image: "/images/acervo/03-casamento/bruncasamento-1075.jpg",
      },
      {
        id: "ch-3",
        year: "2024",
        label: "CAPÍTULO III",
        title: "O Sim Sob as Estrelas da Chapada",
        location: "Mirante da Chapada dos Veadeiros, GO",
        text: "No alto de um cânion silencioso, com o horizonte pintado em tons de âmbar e violeta, Marcos tirou a aliança de veludo do bolso. O coração acelerou, a voz embargou de emoção e as mãos tremeram ao segurar as da Juliana. O 'Sim' ecoou com lágrimas de alegria que selaram a promessa de uma vida inteira.",
        quote: "Você é a minha resposta para todas as orações que já fiz sobre o futuro.",
        image: "/images/acervo/03-casamento/bruncasamento-1143.jpg",
      },
      {
        id: "ch-4",
        year: "2026",
        label: "CAPÍTULO IV",
        title: "O Grande Altar: Dúnia City Hall",
        location: "Salão Imperial • Dúnia City Hall",
        text: "A consagração de uma história verdadeira. Reunir todas as gerações das nossas famílias e os nossos amigos mais preciosos sob a arquitetura deslumbrante e o acolhimento caloroso do Lago Sul. Uma noite desenhada nos mínimos detalhes para celebrar a vitória do amor.",
        quote: "Hoje duas vidas se tornam uma única melodia inesquecível.",
        image: "/images/acervo/03-casamento/CASAMENTO-101.jpg",
      },
    ],
    honorCourt: {
      title: "Corte de Honra • Aqueles que Caminham Conosco",
      subtitle: "Nenhuma história bonita se escreve sozinho. Honramos as pessoas que sustentam o nosso mundo com amor, conselhos e afeto incondicional.",
      parents: [
        {
          name: "Helena & Carlos Eduardo Mendes",
          role: "Pais da Noiva",
          description: "Nossa base sólida, fonte inesgotável de doçura, valores firmes e o abraço que sempre nos devolve a paz.",
        },
        {
          name: "Beatriz & Roberto Silveira",
          role: "Pais do Noivo",
          description: "Nosso exemplo diário de cumplicidade duradoura, lealdade inegociável e sabedoria que nos guia.",
        },
      ],
      witnesses: [
        {
          name: "Camila Mendes & Rodrigo Albuquerque",
          role: "Padrinhos de Altar",
          description: "Irmã e cunhado, os primeiros a saberem do pedido e nossos cúmplices de todas as horas.",
        },
        {
          name: "Mariana Silveira & Felipe Drummond",
          role: "Padrinhos de Altar",
          description: "Parceiros de viagens e churrascos, trazendo alegria e lealdade desde os tempos de faculdade.",
        },
        {
          name: "Beatriz Nogueira & Lucas Vianna",
          role: "Padrinhos de Altar",
          description: "Amigos de infância que viram nosso amor nascer no Lago e torceram por cada vitória.",
        },
        {
          name: "Larissa Prado & Gustavo Meneses",
          role: "Padrinhos de Altar",
          description: "Coração generoso e conselheiros de ouro, que iluminam qualquer ambiente com energia positiva.",
        },
      ],
    },
    dressCode: {
      style: "Passeio Completo / Black Tie Opcional",
      tagline: "Elegância & Conforto para uma Noite Inesquecível",
      description: "Sonhamos com uma celebração clássica e acolhedora sob o brilho dos lustres de cristal. Preparamos este guia para você se sentir deslumbrante e confortável a noite toda.",
      palette: [
        { name: "Champagne Gold", hex: "#D3B47C", note: "Tom oficial do Dúnia" },
        { name: "Azul Meia-Noite", hex: "#1A2536", note: "Clássico e nobre" },
        { name: "Terracota Quente", hex: "#8C4A32", note: "Sofisticação terrosa" },
        { name: "Verde Esmeralda", hex: "#1E3A2F", note: "Profundidade & luxo" },
        { name: "Rosa Quartzo", hex: "#C79A91", note: "Delicadeza atemporal" },
      ],
      forHer: "Vestidos longos ou midi sofisticados em tecidos nobres (seda, crepe, zibeline). Sandálias ou sapatos confortáveis para aproveitar tanto a cerimônia quanto a pista de dança de mármore.",
      forHim: "Costume completo ou smoking escuro (preto, grafite ou marinho), camisa social de corte refinado, gravata de seda e sapato social de couro bem alinhado.",
      caution: "Pedimos com muito carinho que os tons de branco, marfim, off-white e gelo sejam reservados com exclusividade para a nossa noiva.",
    },
    playlist: {
      title: "A Trilha Sonora da Nossa História",
      subtitle: "Músicas que embalaram nossas viagens, nossos domingos preguiçosos e o momento em que dissemos 'Sim'.",
      tracks: [
        { title: "Partilhar", artist: "Rubel & Anavitória", duration: "4:12", mood: "Nossa Canção", note: "A música que tocou no rádio da nossa primeira viagem juntos para a serra." },
        { title: "Stand by Me", artist: "Ben E. King", duration: "3:01", mood: "O Primeiro Brinde", note: "O ritmo que nos fez dançar descalços na cozinha da casa nova." },
        { title: "Yellow", artist: "Coldplay", duration: "4:29", mood: "O Pedido de Casamento", note: "A canção que tocou no fone de ouvido momentos antes do 'Sim' na Chapada." },
        { title: "Photograph", artist: "Ed Sheeran", duration: "4:19", mood: "Nossas Memórias", note: "Para lembrar que guardamos o amor em cada retrato que tiramos." },
        { title: "La Vie En Rose", artist: "Louis Armstrong", duration: "3:24", mood: "A Valsa dos Noivos", note: "A elegância clássica que abrirá a nossa pista de dança no Dúnia City Hall." },
      ],
    },
    poeticSchedule: [
      {
        time: "18:00",
        act: "ATO I • O ACOLHIMENTO",
        title: "Recepção no Foyer & Jardim Imperial",
        atmosphere: "Brisa suave do Lago Sul, espumantes gelados & quarteto de cordas acústico.",
        description: "Seja acolhido com taças tilintando, antepastos artesanais e a arquitetura iluminada do Dúnia recebendo cada abraço.",
        icon: "cocktail",
        image: "/images/acervo/09-jardim/Dunia-24-06-23-144.jpg",
      },
      {
        time: "19:00",
        act: "ATO II • O SAGRADO",
        title: "A Cerimônia sob Lustres de Cristal",
        atmosphere: "O silêncio comovente, a marcha nupcial & a troca de votos e alianças.",
        description: "As portas monumentais se abrem. Sob a luz cálida de cristais nobres, Juliana e Marcos selam o juramento de uma vida.",
        icon: "ring",
        image: "/images/acervo/03-casamento/CASAMENTO-101.jpg",
      },
      {
        time: "20:30",
        act: "ATO III • A GASTRONOMIA",
        title: "Banquete dos Afetos & Brinde Oficial",
        atmosphere: "Alta gastronomia assinada, vinhos selecionados & conversas que aquecem a alma.",
        description: "Menu autoral do Buffet Dúnia com ingredientes frescos, ilha de queijos nobres e pratos quentes servidos com primor.",
        icon: "fork",
        image: "/assets/mesa.jpg",
      },
      {
        time: "22:00",
        act: "ATO IV • A CELEBRAÇÃO",
        title: "Primeira Valsa & Abertura da Pista de Dança",
        atmosphere: "Sonorização de alta fidelidade, alta coquetelaria & energia até o amanhecer.",
        description: "O casal abre a pista sob efeitos cenográficos deslumbrantes. O DJ assume o comando para celebrarmos a vida sem hora para acabar.",
        icon: "music",
        image: "/assets/festa.jpg",
      },
    ],
    guestWishes: [
      {
        id: "gw-1",
        name: "Camila & Rodrigo Albuquerque",
        relationship: "Padrinhos de Altar",
        text: "Ver meu irmão tão radiante ao lado da Ju é a maior alegria da nossa família. Preparem os lencinhos porque a emoção vai transbordar!",
        timeAgo: "há 2 dias",
      },
      {
        id: "gw-2",
        name: "Dr. Roberto & Beatriz Silveira",
        relationship: "Pais do Noivo",
        text: "Filhos amados, nosso coração se enche de orgulho em ver o lar que vocês já estão construindo. Estaremos na primeira fila com o coração em festa.",
        timeAgo: "há 4 dias",
      },
      {
        id: "gw-3",
        name: "Lucas Vianna",
        relationship: "Amigo de Infância",
        text: "Desde a época do colégio o Marcos falava que quando encontrasse a mulher da vida dele, faria uma festa histórica. O dia finalmente chegou!",
        timeAgo: "há 1 semana",
      },
      {
        id: "gw-4",
        name: "Mariana Drummond",
        relationship: "Madrinha",
        text: "Ju, você será a noiva mais deslumbrante que Brasília já viu! Mal posso esperar para dançar até o sol raiar nesse salão maravilhoso.",
        timeAgo: "há 1 semana",
      },
    ],
  },

  "ev-clarice": {
    eventId: "ev-clarice",
    kicker: "CASAMENTO AO ENTARDECER NO JARDIM IMPERIAL • BRASÍLIA",
    heroTagline: "Onde a brisa suave do Lago Sul encontra a promessa mais bonita de nossas vidas.",
    openLetter: {
      kicker: "NOSSA CARTA DE BOAS-VINDAS",
      title: "Celebrando o Amor com a Natureza como Testemunha",
      salutation: "Queridos amigos e familiares,",
      paragraphs: [
        "Sempre sonhamos com um casamento que respirasse ar puro, luz dourada de pôr do sol e aconchego sincero. A nossa conexão com a natureza de Brasília sempre foi o nosso refúgio nos fins de semana.",
        "O Jardim Imperial do Dúnia City Hall foi amor à primeira vista: palmeiras maduras, espelho d'água cristalino e um céu aberto que receberá os nossos votos no entardecer mais esperado de nossas vidas.",
        "Agradecemos de coração por fazerem parte da nossa jornada. Tragam seus sorrisos e o coração leve para brindarmos juntos a esse novo ciclo.",
      ],
      signature: "Com amor, Clarice & Gustavo",
      dateAndCity: "28 de Novembro de 2026 • Jardim Dúnia, Lago Sul",
    },
    chapters: [
      {
        id: "ch-1",
        year: "2020",
        label: "CAPÍTULO I",
        title: "Um Café, Uma Trilha & O Primeiro Sorriso",
        location: "Ermida Dom Bosco • Brasília, DF",
        text: "Encontramo-nos para uma caminhada ao ar livre que terminou em um piquenique com café e bolo. Entre conversas sobre arquitetura, botânica e música brasileira, descobrimos uma afinidade rara e serena.",
        quote: "O amor verdadeiro cresce com a paciência das raízes fortes.",
        image: "/images/acervo/09-jardim/dunia-20-08-36-of-36.jpg",
      },
      {
        id: "ch-2",
        year: "2023",
        label: "CAPÍTULO II",
        title: "Nossa Casa de Plantas & Sonhos",
        location: "Lago Norte • Brasília",
        text: "Montamos nossa primeira varanda com mais de trinta vasos, adotamos dois cachorros e construímos uma rotina onde o café da manhã é sempre sagrado. A cumplicidade se tornou o ar que respiramos.",
        quote: "Cuidar um do outro é a nossa rotina favorita.",
        image: "/images/acervo/03-casamento/bruncasamento-1089.jpg",
      },
      {
        id: "ch-3",
        year: "2025",
        label: "CAPÍTULO III",
        title: "O Pôr do Sol do Sim",
        location: "Praia do Rosa, SC",
        text: "Com os pés na areia e o barulho das ondas quebrando, Gustavo ajoelhou ao crepúsculo. Um anel artesanal e a certeza de que a vida juntos seria a maior aventura das nossas vidas.",
        quote: "Você é o meu mar calmo e a minha melhor surpresa.",
        image: "/images/acervo/03-casamento/bruncasamento-1203.jpg",
      },
      {
        id: "ch-4",
        year: "2026",
        label: "CAPÍTULO IV",
        title: "A Celebração no Jardim Imperial",
        location: "Dúnia City Hall",
        text: "A harmonia perfeita entre o verde do jardim e o luxo arquitetônico do salão. Vamos celebrar sob as estrelas de Brasília rodeados por quem amamos.",
        quote: "O amor floresce quando encontra solo fértil de carinho e verdade.",
        image: "/images/acervo/09-jardim/Dunia-24-06-23-144.jpg",
      },
    ],
    honorCourt: {
      title: "Nossos Padrinhos & Pais Queridos",
      subtitle: "A bênção da nossa família e dos amigos que compartilham a vida conosco.",
      parents: [
        { name: "Sônia & Renato Vasconcelos", role: "Pais da Noiva", description: "Carinho, doçura e apoio irrestrito em todas as fases da vida." },
        { name: "Luciana & Marcelo Antunes", role: "Pais do Noivo", description: "Exemplo de respeito, diálogo sincero e união familiar." },
      ],
      witnesses: [
        { name: "Fernanda & Thiago", role: "Padrinhos", description: "Irmãos do coração e companheiros de trilhas e conversas profundas." },
        { name: "Juliana & André", role: "Padrinhos", description: "Testemunhas do nosso primeiro café na Ermida." },
      ],
    },
    dressCode: {
      style: "Passeio Completo Romântico / Jardim Chic",
      tagline: "Leveza, Elegância & Cores da Natureza",
      description: "Nossa cerimônia acontecerá ao ar livre no Jardim Imperial, seguida de recepção no salão climatizado. Recomendamos sapatos com salto bloco para as senhoras.",
      palette: [
        { name: "Terracota Suave", hex: "#A85D45", note: "Tom quente do pôr do sol" },
        { name: "Verde Sálvia", hex: "#7E927A", note: "Harmonia botânica" },
        { name: "Champagne Dourado", hex: "#D3B47C", note: "Luz de velas" },
        { name: "Azul Hortênsia", hex: "#6C88A3", note: "Frescor suave" },
      ],
      forHer: "Vestidos fluidos, midi ou longos com caimento suave. Tons florais ou lisos da paleta.",
      forHim: "Ternos de linho ou lã fria em tons de cinza claro, bege ou azul marinho, sem obrigatoriedade de gravata pesada.",
      caution: "Tons de branco e marfim reservados exclusivamente para a noiva.",
    },
    playlist: {
      title: "Trilha Sonora Botânica & Poética",
      subtitle: "Músicas acústicas que tocam o coração.",
      tracks: [
        { title: "Dona de Mim", artist: "Iza (Acústico)", duration: "3:45", mood: "Força & Amor", note: "Nossa energia diária." },
        { title: "Velha Infância", artist: "Tribalistas", duration: "4:10", mood: "Doçura", note: "Para lembrar da pureza do sentimento." },
        { title: "Dia Branco", artist: "Geraldo Azevedo", duration: "3:20", mood: "A Cerimônia", note: "A entrada no Jardim Imperial." },
      ],
    },
    poeticSchedule: [
      {
        time: "17:30",
        act: "ATO I • O ENCONTRO",
        title: "Welcome Drink no Jardim ao Entardecer",
        atmosphere: "Luz dourada do Lago Sul e espumante rosé.",
        description: "Recepção dos convidados sob a sombra das palmeiras imperiais.",
        icon: "cocktail",
        image: "/images/acervo/09-jardim/Dunia-24-06-23-144.jpg",
      },
      {
        time: "18:15",
        act: "ATO II • O SIM",
        title: "Cerimônia no Espelho D'Água",
        atmosphere: "O pôr do sol de Brasília como pano de fundo.",
        description: "Troca de alianças e votos na passarela sobre as águas.",
        icon: "ring",
        image: "/images/acervo/09-jardim/dunia-20-08-36-of-36.jpg",
      },
      {
        time: "19:30",
        act: "ATO III • O BANQUETE",
        title: "Jantar sob Pergolado & Salão Cristal",
        atmosphere: "Ilha de frutos do mar e risotos artesanais.",
        description: "Gastronomia leve e sofisticada harmonizada com vinhos refinados.",
        icon: "fork",
        image: "/assets/mesa.jpg",
      },
      {
        time: "21:30",
        act: "ATO IV • A FESTA",
        title: "Banda ao Vivo & Pista Integrada",
        atmosphere: "Luzes de quermesse no jardim e DJ na pista principal.",
        description: "Celebração livre e alegre até a madrugada.",
        icon: "music",
        image: "/assets/festa.jpg",
      },
    ],
    guestWishes: [
      { id: "gw-c1", name: "Renato Vasconcelos", relationship: "Pai da Noiva", text: "Minha filha, ver você se casar nesse jardim tão lindo é a realização do meu maior sonho de pai.", timeAgo: "há 3 dias" },
      { id: "gw-c2", name: "Fernanda & Thiago", relationship: "Padrinhos", text: "Vocês nasceram um para o outro! Mal podemos esperar para brindar esse pôr do sol.", timeAgo: "há 5 dias" },
    ],
  },

  "ev-sb": {
    eventId: "ev-sb",
    kicker: "A NOITE DOS MEUS SONHOS • 15 ANOS DE SOFIA",
    heroTagline: "Celebrando a transição mais mágica da minha vida ao lado de quem amo.",
    openLetter: {
      kicker: "MENSAGEM DA DEBUTANTE & FAMÍLIA",
      title: "Uma Noite Feita de Brilho, Gratidão & Memórias",
      salutation: "Queridos amigos e familiares,",
      paragraphs: [
        "Completar 15 anos é olhar para trás com carinho por cada passo da minha infância e olhar para a frente com o coração cheio de sonhos e coragem.",
        "Meus pais prepararam esta noite no Dúnia City Hall com tanto carinho e amor que mal posso acreditar que o momento chegou. O Espaço Cristal se transformará em um cenário mágico de luzes, música e afeto.",
        "A presença de cada um de vocês torna essa noite inesquecível. Vamos dançar, rir e celebrar muito juntos!",
      ],
      signature: "Com muito carinho e animação, Sofia e Família",
      dateAndCity: "05 de Dezembro de 2026 • Dúnia City Hall",
    },
    chapters: [
      {
        id: "ch-1",
        year: "2011",
        label: "CAPÍTULO I",
        title: "O Nascimento de um Sonho",
        location: "Brasília, DF",
        text: "O sorriso que mudou o rumo da família. Primeiras descobertas, gargalhadas no parquinho e a paixão precoce pela arte e pela dança.",
        quote: "A infância deixa marcas douradas em quem a vive com amor.",
        image: "/assets/debutante.jpg",
      },
      {
        id: "ch-2",
        year: "2020",
        label: "CAPÍTULO II",
        title: "Crescer, Descobrir & Ter Amigos de Ouro",
        location: "Colégio & Vida",
        text: "Os desafios de crescer, os primeiros grupos de amigas inseparáveis e a construção de uma personalidade meiga, decidida e luminosa.",
        quote: "Amizades verdadeiras são o maior tesouro da juventude.",
        image: "/images/acervo/05-debutante/03-12-22-12-Personalizado.jpeg",
      },
      {
        id: "ch-3",
        year: "2026",
        label: "CAPÍTULO III",
        title: "A Valsa dos 15 Anos no Dúnia City Hall",
        location: "Espaço Cristal • Lago Sul",
        text: "O grande momento da valsa tradicional com meu pai e meu avô, seguida de uma pista de dança eletrizante com DJ, pulseiras de LED e mocktails assinados.",
        quote: "Esta noite não é apenas uma festa; é o início de tudo o que ainda vou construir.",
        image: "/images/acervo/05-debutante/0I9A2063-Personalizado-e1692637622475.jpeg",
      },
    ],
    honorCourt: {
      title: "Corte das 15 Velas & Homenagens Especiais",
      subtitle: "As pessoas fundamentais que me ensinaram a voar.",
      parents: [
        { name: "Patrícia & Eduardo Bueno", role: "Pais Orgulhosos", description: "Nosso maior tesouro, o coração da nossa casa." },
        { name: "Vovô Geraldo", role: "Avô Amado", description: "Com quem dançarei a primeira valsa de honra da noite." },
      ],
      witnesses: [
        { name: "As 15 Melhores Amigas", role: "Corte de Honra", description: "Meninas que compartilham os segredos, as risadas e a pista de dança." },
      ],
    },
    dressCode: {
      style: "Traje Gala Teen & Passeio Completo",
      tagline: "Brilho, Sofisticação & Muita Animação",
      description: "Para os meninos: terno escuro moderno ou blazer com calça de alfaiataria. Para as meninas: vestidos de festa com brilho, fendas ou modelos contemporâneos.",
      palette: [
        { name: "Rose Gold", hex: "#B76E79", note: "Tom oficial dos 15 Anos" },
        { name: "Preto Black Tie", hex: "#111111", note: "Elegância jovem" },
        { name: "Prata Espelhado", hex: "#C0C0C0", note: "Brilho de pista" },
        { name: "Champagne Glow", hex: "#D3B47C", note: "Dúnia Crystal" },
      ],
      forHer: "Vestidos longos ou curtos refinados. Vale brilho, tecidos acetinados e saltos ou tênis estilosos para a hora da balada!",
      forHim: "Terno bem ajustado, camisa social e sapato ou tênis de couro elegante.",
      caution: "Evitar a cor rosa blush da valsa principal da debutante.",
    },
    playlist: {
      title: "Trilha Sonora dos Meus 15 Anos",
      subtitle: "Do clássico emocionante da valsa aos hits mais bombados do momento.",
      tracks: [
        { title: "Enchanted", artist: "Taylor Swift", duration: "5:53", mood: "A Grande Valsa", note: "A música da entrada triunfal." },
        { title: "Dancing Queen", artist: "ABBA", duration: "3:51", mood: "Abertura da Pista", note: "Com a mãe e as tias na pista!" },
        { title: "Levitating", artist: "Dua Lipa", duration: "3:23", mood: "Balada Teen", note: "Hora das pulseiras de LED acenderem." },
      ],
    },
    poeticSchedule: [
      {
        time: "20:00",
        act: "ATO I • A CHEGADA",
        title: "Recepção VIP & Lounge de Mocktails",
        atmosphere: "Música pop lounge, ilha de sushis e bar sem álcool.",
        description: "Os convidados são recepcionados com fotos no backdrop instagramável.",
        icon: "cocktail",
        image: "/assets/mesa.jpg",
      },
      {
        time: "22:00",
        act: "ATO II • A EMOÇÃO",
        title: "A Grande Valsa & Cerimônia das 15 Velas",
        atmosphere: "Luz de velas, cortejo das amigas e palavras emocionadas dos pais.",
        description: "Momento solene da troca de sapatos e primeira dança com o pai e avô.",
        icon: "ring",
        image: "/images/acervo/05-debutante/0I9A2063-Personalizado-e1692637622475.jpeg",
      },
      {
        time: "23:00",
        act: "ATO III • A BALADA",
        title: "Dúnia Neon Club & Pista de LED",
        atmosphere: "Robô de LED, DJ residente e estação de hambúrguer gourmet.",
        description: "A pista pega fogo com a debutante trocando para o look balada.",
        icon: "music",
        image: "/assets/festa.jpg",
      },
    ],
    guestWishes: [
      { id: "gw-s1", name: "Patrícia Bueno", relationship: "Mãe da Debutante", text: "Minha menina virou essa jovem mulher maravilhosa. Te amo mais que tudo, Sofia!", timeAgo: "ontem" },
      { id: "gw-s2", name: "Bia & Giu", relationship: "Melhores Amigas", text: "Sofi, essa vai ser a melhor festa do ano! Estamos com os vestidos prontos!", timeAgo: "há 2 dias" },
    ],
  },

  "ev-bruno": {
    eventId: "ev-bruno",
    kicker: "GALA DE CASAMENTO BLACK TIE • SALÃO IMPERIAL",
    heroTagline: "A união de duas vidas e dois propósitos em uma noite de distinção e alta gastronomia.",
    openLetter: {
      kicker: "CONVITE DE HONRA DOS NOIVOS",
      title: "Uma Noite de Gratidão, Conquistas & Amor",
      salutation: "Distintos colegas, amigos de uma vida e familiares queridos,",
      paragraphs: [
        "A medicina e o destino cruzaram os nossos caminhos em um congresso internacional em 2018. Desde então, entre plantões intensos, noites em claro e pesquisas, encontramos um no outro o nosso porto seguro e o nosso maior incentivo intelectual e humano.",
        "Decidimos celebrar o nosso juramento matrimonial no Dúnia City Hall pela sua reputação impecável de excelência e privacidade diplomática no Lago Sul. Desejamos oferecer a cada um de vocês uma experiência gastronômica e musical inigualável.",
        "Será uma honra imensa brindar à vida e ao amor com todos que admiramos e queremos bem.",
      ],
      signature: "Dra. Helena de Vasconcelos & Dr. Bruno Alencar",
      dateAndCity: "14 de Dezembro de 2026 • Dúnia City Hall, Brasília",
    },
    chapters: [
      {
        id: "ch-1",
        year: "2018",
        label: "CAPÍTULO I",
        title: "O Encontro em Genebra",
        location: "Suíça • Congresso Médico Internacional",
        text: "Uma mesa redonda sobre cardiologia e neurologia que resultou em um jantar à beira do lago e conversas que vararam a noite sobre a vida e a ciência.",
        quote: "Grandes encontros acontecem quando duas mentes e corações vibram no mesmo tom.",
        image: "/assets/casal.jpg",
      },
      {
        id: "ch-2",
        year: "2023",
        label: "CAPÍTULO II",
        title: "Parceiros de Vida & Medicina",
        location: "Brasília, DF",
        text: "Abrindo nossa clínica integrada e provando que o trabalho dedicado e o carinho mútuo são a melhor fórmula para transformar vidas.",
        quote: "Cuidar do mundo ao lado de quem se ama é a nossa maior vocação.",
        image: "/images/acervo/03-casamento/bruncasamento-1107.jpg",
      },
      {
        id: "ch-3",
        year: "2026",
        label: "CAPÍTULO III",
        title: "A Gala no Salão Imperial",
        location: "Dúnia City Hall",
        text: "Menu degustação de 7 tempos assinado pelo Chef Executivo Dúnia, harmonização com vinhos Grand Cru e um quarteto de jazz clássico para uma noite inesquecível.",
        quote: "A distinção está na simplicidade com que a elegância acolhe o amor.",
        image: "/assets/salao.jpg",
      },
    ],
    honorCourt: {
      title: "Mesa de Honra & Testemunhas",
      subtitle: "Nossos mentores, pais e colegas de profissão que honram a nossa jornada.",
      parents: [
        { name: "Des. Otávio & Maria Amélia Vasconcelos", role: "Pais da Noiva", description: "Pilar de retidão e amor." },
        { name: "Dr. Henrique & Laura Alencar", role: "Pais do Noivo", description: "Legado médico de três gerações." },
      ],
      witnesses: [
        { name: "Dr. Marcelo & Dra. Paula", role: "Padrinhos", description: "Cúmplices de residência médica e amigos inseparáveis." },
      ],
    },
    dressCode: {
      style: "Black Tie Rigoroso / Smoking & Longo",
      tagline: "Máxima Distinção no Coração do Lago Sul",
      description: "Para cavalheiros: smoking clássico com gravata borboleta de cetim preto e sapatos de verniz. Para damas: vestidos longos de gala.",
      palette: [
        { name: "Preto Smoking", hex: "#0A0A0A", note: "Rigor clássico" },
        { name: "Ouro Imperial", hex: "#D3B47C", note: "Dúnia Heritage" },
        { name: "Branco Piqué", hex: "#F8F8F8", note: "Camisaria nobre" },
        { name: "Bordeaux Nobre", hex: "#5C1D24", note: "Veludos & sedas" },
      ],
      forHer: "Vestidos longos de gala com cortes estruturados, pedrarias finas e joias clássicas.",
      forHim: "Smoking preto ou midnight blue com lapela de seda, faixa ou colete e sapatos sociais finos.",
      caution: "Vestidos brancos ou perolados são de uso exclusivo da noiva.",
    },
    playlist: {
      title: "Sinfonia & Jazz Contemporâneo",
      subtitle: "A elegância dos clássicos universais.",
      tracks: [
        { title: "Clair de Lune", artist: "Debussy", duration: "5:03", mood: "A Entrada", note: "Piano solo na abertura das portas." },
        { title: "Fly Me to the Moon", artist: "Frank Sinatra", duration: "2:27", mood: "Primeira Valsa", note: "O brinde do casal de médicos." },
      ],
    },
    poeticSchedule: [
      {
        time: "19:00",
        act: "ATO I • O COQUETEL",
        title: "Recepção com Champanhe Francês & Ostras Frescas",
        atmosphere: "Jazz instrumental e acolhimento com valet privativo.",
        description: "Recepção de convidados nacionais e internacionais.",
        icon: "cocktail",
        image: "/assets/mesa.jpg",
      },
      {
        time: "20:00",
        act: "ATO II • O PACTO",
        title: "Celebração de Votos Solenes",
        atmosphere: "Nave nupcial espelhada sob os lustres monumentais.",
        description: "Discursos breves e comoventes dos noivos.",
        icon: "ring",
        image: "/assets/salao.jpg",
      },
      {
        time: "21:15",
        act: "ATO III • O BANQUETE",
        title: "Jantar Degustação em 7 Tempos",
        atmosphere: "Serviço à francesa impecável e harmonização com vinhos.",
        description: "Alta culinária assinada para paladares exigentes.",
        icon: "fork",
        image: "/assets/mesa.jpg",
      },
    ],
    guestWishes: [
      { id: "gw-b1", name: "Prof. Dr. Cláudio Brandão", relationship: "Mentor Acadêmico", text: "Helena e Bruno formam a união mais brilhante que já conheci na medicina e na vida. Parabéns!", timeAgo: "há 3 dias" },
    ],
  },
}

export function saveStorytellingForEvent(eventId: string, data: EventStorytelling): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(`dunia_storytelling_${eventId}`, JSON.stringify(data))
    window.dispatchEvent(new Event("dunia_storytelling_updated"))
  } catch (e) {
    console.error("Failed to save storytelling to localStorage", e)
  }
}

export function getStorytellingForEvent(eventId: string): EventStorytelling {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`dunia_storytelling_${eventId}`)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (e) {}
  }
  return EVENT_STORYTELLING_DATA[eventId] || EVENT_STORYTELLING_DATA["ev-jm"]
}
