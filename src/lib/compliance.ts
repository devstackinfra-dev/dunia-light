/**
 * Verificador de compliance publicitário da advocacia (Engine 2.0).
 *
 * Portado do mvp_guilhermeHoluboski, onde as regras foram calibradas contra a
 * copy real de um escritório (scripts/testar-compliance). Mantenha as duas
 * cópias em sincronia ao ajustar uma regra.
 *
 * Traduz as vedações do Provimento nº 205/2021 do CFOAB e dos arts. 39-47 do
 * Código de Ética e Disciplina da OAB em regras executáveis de governança.
 *
 * Princípio fundamental:
 *  "O código define as leis físicas e regras mandatórias; o CMS define a composição e conteúdo."
 *
 * Estados de Conformidade:
 *  - BLOCKED: Possui ao menos 1 impedimento grave (promessa de resultado, captação, mercantilização).
 *  - REVIEW_REQUIRED: Possui avisos que exigem validação expressa do advogado.
 *  - READY: Conteúdo tecnicamente limpo pelo scanner automático.
 *  - APPROVED: Estado de governança atribuído exclusivamente após revisão do advogado responsável.
 */

export type NivelSeveridade = "BLOCKER" | "WARNING" | "RECOMMENDATION" | "INFO";
export type Severidade = "bloqueio" | "aviso" | NivelSeveridade;

export type ComplianceStatus =
  | "BLOCKED"
  | "REVIEW_REQUIRED"
  | "READY"
  | "APPROVED";

export type BaseNormativa = {
  documento:
    | "Provimento 205/2021"
    | "Código de Ética e Disciplina"
    | "Estatuto da Advocacia";
  artigo: string;
  paragrafoOuInciso?: string;
};

export type ComplianceAudit = {
  status: ComplianceStatus;
  revisadoPor?: string;
  oabRevisor?: string;
  revisadoEm?: string;
  engineVersion: string;
};

export type Regra = {
  id: string;
  rotulo: string;
  severidade: NivelSeveridade;
  baseNormativa: BaseNormativa;
  versao: string;
  padrao: RegExp;
  explicacao: string;
  sugestao: string;
  /**
   * Padrões contextuais que descartam o achado (ex: "desconto em folha",
   * "garantia constitucional", "não garantimos").
   */
  excecoes?: RegExp[];
};

export type Achado = {
  regra: Regra;
  trecho: string;
  indice: number;
  campo?: string;
  aprovadoComRevisao?: boolean;
};

export type RelatorioCompliance = {
  status: Exclude<ComplianceStatus, "APPROVED">;
  permitido: boolean;
  score: number; // Métrica editorial informativa (0 a 100)
  bloqueios: Achado[];
  avisos: Achado[];
  recomendacoes: Achado[];
  informacoes: Achado[];
  todosAchados: Achado[];
};

/** Caracteres de contexto examinados de cada lado ao testar as exceções. */
const JANELA_CONTEXTO = 90;

const ACENTOS: Record<string, string> = {
  á: "a", à: "a", ã: "a", â: "a", ä: "a",
  é: "e", è: "e", ê: "e", ë: "e",
  í: "i", ì: "i", î: "i", ï: "i",
  ó: "o", ò: "o", õ: "o", ô: "o", ö: "o",
  ú: "u", ù: "u", û: "u", ü: "u",
  ç: "c", ñ: "n",
  Á: "A", À: "A", Ã: "A", Â: "A", Ä: "A",
  É: "E", È: "E", Ê: "E", Ë: "E",
  Í: "I", Ì: "I", Î: "I", Ï: "I",
  Ó: "O", Ò: "O", Õ: "O", Ô: "O", Ö: "O",
  Ú: "U", Ù: "U", Û: "U", Ü: "U",
  Ç: "C", Ñ: "N",
};

function semAcento(texto: string): string {
  return texto.replace(/[À-ɏ]/g, (c) => ACENTOS[c] ?? c);
}

export function normalizarSeveridade(sev: Severidade): NivelSeveridade {
  if (sev === "bloqueio" || sev === "BLOCKER") return "BLOCKER";
  if (sev === "aviso" || sev === "WARNING") return "WARNING";
  if (sev === "RECOMMENDATION") return "RECOMMENDATION";
  return "INFO";
}

export const regras: Regra[] = [
  {
    id: "taxa-exito",
    rotulo: "Percentual de êxito",
    severidade: "BLOCKER",
    baseNormativa: { documento: "Provimento 205/2021", artigo: "6" },
    versao: "2.0",
    padrao:
      /\b\d{1,3}\s*%\s*(?:de\s+)?(?:êxito|exito|sucesso|aprovaç(?:ão|ões)|vitórias?|absolviç(?:ão|ões)|ganho\s+de\s+causa|acordos\s+favoráveis)/i,
    explicacao:
      "Percentual de êxito é apresentação de resultado — vedação expressa no Código de Ética e no Provimento 205/2021.",
    sugestao: "Remova o número. Descreva o serviço prestado, não o desfecho.",
  },
  {
    id: "casos-com-sucesso",
    rotulo: "Volume de casos ganhos",
    severidade: "BLOCKER",
    baseNormativa: { documento: "Provimento 205/2021", artigo: "6" },
    versao: "2.0",
    padrao:
      /\b(?:\+?\s*\d[\d.,]*\s+)?casos?\s+(?:(?:conclu[íi]dos?|encerrados?|ganhos?|resolvidos?|vencidos?)(?:\s+com\s+(?:sucesso|êxito))?|com\s+(?:sucesso|êxito))/i,
    explicacao:
      "Quantificar casos concluídos “com sucesso” converte um número em afirmação de resultado.",
    sugestao: "Troque por dado factual e verificável, como o ano de início da atuação.",
  },
  {
    id: "promessa-resultado",
    rotulo: "Promessa de resultado",
    severidade: "BLOCKER",
    baseNormativa: { documento: "Provimento 205/2021", artigo: "6" },
    versao: "2.0",
    padrao:
      /\b(?:garant(?:o|e|em|imos|ido|ida|ir)|assegur(?:o|a|amos)|prometemos|maximizar|reverta|recupere|receba\s+o\s+que|ganhe\s+(?:sua|seu)|vença\s+(?:sua|seu)|garantia\s+de\s+(?:resultado|êxito|exito|ganho|vitória|sucesso)|com\s+certeza\s+(?:vai|você)|causa\s+ganha)\b/i,
    explicacao:
      "Nenhum advogado pode se comprometer com desfecho — ele depende de prova, do juízo e da parte contrária.",
    sugestao:
      "Descreva a atuação (“orientação e planejamento”) em vez do resultado esperado.",
    excecoes: [
      /\b(?:n[ãa]o|nunca|jamais|nada|ningu[ée]m|nenhum[a]?|sem)\s+(?:se\s+|lhe\s+|nos\s+)?(?:garant|assegur|promet)/i,
      /\bn[ãa]o\s+h[áa]\s+(?:como\s+)?(?:garantia|garantir)/i,
      /\bresultado\s+n[ãa]o\s+se\s+promete/i,
      /\bgarantias?\s+(?:lega(?:l|is)|contratua(?:l|is)|constituciona(?:l|is)|reais|pessoais|de\s+execu)/i,
      /\b(?:definição|estruturação|análise|revisão|cláusulas?)\s+de\s+garantias?/i,
      // Perguntas educativas de FAQ e averiguação de direito objetivo:
      /\b(?:garante|garantem|garantiria|garantir)\s+(?:automaticamente|por\s+si\s+s[óo]|de\s+plano|sempre)\b/i,
      /\b(?:a\s+lei|o\s+direito|o\s+trabalho|a\s+profiss[ãa]o|o\s+cargo|a\s+fun[çc][ãa]o|o\s+acidente)\s+(?:garante|assegura)/i,
      /\b(?:garante|garantem|garantia|assegura).*\?/i,
      /\b(?:quem|quando|como|o\s+que|qual|ser[áa]\s+que|por\s+que).*\b(?:garante|garantem|garantir)\b/i,
    ],
  },
  {
    id: "honorarios",
    rotulo: "Honorários, gratuidade ou desconto",
    severidade: "BLOCKER",
    baseNormativa: { documento: "Provimento 205/2021", artigo: "3", paragrafoOuInciso: "I" },
    versao: "2.0",
    padrao:
      /\b(?:(?:consulta|análise|avaliaç(?:ão|ao)|atendimento|orçamento)\s+(?:inicial\s+)?(?:gratuit[ao]|grátis|gratis|sem\s+custo)|honorários?\s+a\s+partir|parcelamos|parcelamento\s+em\s+at[ée]|em\s+promoç(?:ão|ões)|promoç(?:ão|ões)\s+(?:especial|exclusiva|imperdível|de\s+lançamento|por\s+tempo)|desconto\s+(?:de\s+\d|especial|exclusivo|imperdível|progressivo)|com\s+desconto|primeira\s+consulta\s+gr)/i,
    explicacao:
      "Referência a preço, gratuidade ou desconto como forma de atrair cliente é vedação expressa.",
    sugestao: "Remova. Condições de contratação são tratadas no atendimento privado.",
    excecoes: [
      /\bdesconto\s+em\s+folha/i,
      /\bdescontos?\s+(?:legais|previdenci|do\s+imposto|salariais|tributários)/i,
      /\bgratuidade\s+(?:de\s+)?justiça/i,
      /\bjustiça\s+gratuita/i,
      /\bassistência\s+judiciária\s+gratuita/i,
    ],
  },
  {
    id: "especialista",
    rotulo: "“Especialista” sem título registrado",
    severidade: "BLOCKER",
    baseNormativa: { documento: "Provimento 205/2021", artigo: "3", paragrafoOuInciso: "III" },
    versao: "2.0",
    padrao: /\bespecialist[ao]s?\b|\bespecializad[oa]s?\s+em\b/i,
    explicacao:
      "O termo é reservado a quem possui especialização formal reconhecida.",
    sugestao: "Use “atuação em”, “com foco em” ou cite expressamente o título acadêmico registrado.",
    excecoes: [
      /\b(?:escola|cl[íi]nica|hospital|tribunal|vara|junta|c[âa]mara|per[íi]cia|m[ée]dic[oa]|profissional\s+de\s+sa[úu]de)\s+especializad/i,
      /\btribunais\s+especializados/i,
      /\bespecializad[oa]s?\s+em\s+(?:sa[úu]de|pediatria|oncologia)/i,
    ],
  },
  {
    id: "superlativo",
    rotulo: "Superlativo, comparação ou autoelogio",
    severidade: "BLOCKER",
    baseNormativa: { documento: "Provimento 205/2021", artigo: "3", paragrafoOuInciso: "IV" },
    versao: "2.0",
    padrao:
      /\b(?:[oa]s?\s+melhor(?:es)?\s+(?:escritório|advogad|banca|assessoria)|melhores\s+advogados|maior\s+escritório|l[íi]der\s+(?:em|no|de)\s|l[íi]der\s+de\s+mercado|referência\s+(?:em|no|nacional)|[oa]\s+único\s+(?:escritório|advogado)|altamente\s+qualificad|renomad[oa]|de\s+excelência|excelência\s+em|incomparáve|imbat[íi]ve|autoridade\s+incontest)/i,
    explicacao:
      "Expressões persuasivas, de autoengrandecimento ou de comparação são vedadas.",
    sugestao: "Descreva fatos objetivos: titulação, ano de fundação e áreas de atuação.",
  },
  {
    id: "urgencia",
    rotulo: "Urgência ou incitação ao litígio",
    severidade: "BLOCKER",
    baseNormativa: { documento: "Provimento 205/2021", artigo: "3", paragrafoOuInciso: "§ 1º" },
    versao: "2.0",
    padrao:
      /\b(?:n[ãa]o\s+perca|corra\b|aja\s+agora|entre\s+com\s+a\s+aç(?:ão|ao)|processe\s+(?:agora|já|ja)|últim(?:as|os)\s+(?:vagas|dias|horas)|garanta\s+já|tempo\s+esgotando|antes\s+que\s+seja\s+tarde|clique\s+e\s+resolva|compre\s+agora|contrate\s+já)/i,
    explicacao:
      "A publicidade jurídica não pode incitar diretamente ao litígio nem à contratação urgente.",
    sugestao: "Convide ao contato em tom informativo, sem pressão temporal artificial.",
  },
  {
    id: "caso-concreto",
    rotulo: "Caso concreto usado como oferta",
    severidade: "BLOCKER",
    baseNormativa: { documento: "Provimento 205/2021", artigo: "6" },
    versao: "2.0",
    padrao:
      /\b(?:um\s+(?:cliente|caso)\s+(?:nosso|meu|que\s+atendemos)|atendemos\s+um\s+caso|em\s+um\s+caso\s+recente|conseguimos\s+(?:para|a)\s+(?:o\s+)?client|nesse\s+processo\s+(?:conseguimos|obtivemos)|decisão\s+que\s+obtivemos|liminar\s+que\s+(?:conseguimos|obtivemos))/i,
    explicacao: "Usar casos concretos de clientes para ofertar atuação é vedado.",
    sugestao: "Se precisar ilustrar uma tese, utilize hipóteses genéricas e didáticas.",
  },
  {
    id: "prova-social",
    rotulo: "Depoimento ou avaliação de cliente",
    severidade: "BLOCKER",
    baseNormativa: { documento: "Provimento 205/2021", artigo: "3", paragrafoOuInciso: "IV" },
    versao: "2.0",
    padrao:
      /\b(?:depoimentos?\s+(?:de\s+)?(?:cliente|quem)|o\s+que\s+dizem\s+(?:os\s+)?(?:nossos\s+)?clientes|avaliaç(?:ão|ões)\s+(?:dos?\s+)?clientes|\d[.,]\d\s+estrelas|nota\s+\d[.,]\d\s+no\s+google)/i,
    explicacao: "Prova social comercial e depoimentos de clientes configuram mercantilização.",
    sugestao: "Remova. A autoridade deve provir do conteúdo técnico e da titulação.",
  },
  {
    id: "estrutura",
    rotulo: "Dimensões ou estrutura do escritório",
    severidade: "WARNING",
    baseNormativa: { documento: "Provimento 205/2021", artigo: "6" },
    versao: "2.0",
    padrao:
      /\b(?:equipe\s+de\s+(?:mais\s+de\s+)?\d+|\d+\s+(?:advogados|profissionais|colaboradores)|\d+\s*m²|nossa\s+ampla\s+estrutura|escritório\s+de\s+\d+\s*m)/i,
    explicacao: "Informações sobre porte e estrutura física são vedadas na publicidade ativa.",
    sugestao: "Foque no conteúdo informativo e nas teses de Direito.",
  },
  {
    id: "ostentacao",
    rotulo: "Ostentação de bens",
    severidade: "WARNING",
    baseNormativa: { documento: "Provimento 205/2021", artigo: "6", paragrafoOuInciso: "Parágrafo único" },
    versao: "2.0",
    padrao:
      /\b(?:jatinho|iate|lamborghini|ferrari|porsche|rolex|carr[oã]o?\s+de\s+luxo|vida\s+de\s+luxo|alto\s+padrão\s+de\s+vida)/i,
    explicacao: "Ostentação de patrimônio e bens de luxo é vedada em qualquer publicidade jurídica.",
    sugestao: "Remova a referência.",
  },
  {
    id: "metrica-comercial",
    rotulo: "Métrica comercial",
    severidade: "WARNING",
    baseNormativa: { documento: "Provimento 205/2021", artigo: "3", paragrafoOuInciso: "IV" },
    versao: "2.0",
    padrao:
      /\b\d{1,3}\s*%\s+(?:de\s+|dos?\s+)?(?:clientes\s+(?:recorrentes|satisfeitos)|crescimento|aumento\s+(?:de|na)\s+receita|indicaç(?:ão|ões)|retenç(?:ão|ao)|novos\s+clientes)/i,
    explicacao: "KPIs e números de conversão comercial não possuem função institucional.",
    sugestao: "Remova. Apresente dados e estatísticas oficiais do Judiciário ou da lei.",
  },
  {
    id: "promessa-operacional-nao-verificada",
    rotulo: "Promessa operacional rígida (SLA)",
    severidade: "RECOMMENDATION",
    baseNormativa: { documento: "Código de Ética e Disciplina", artigo: "39" },
    versao: "2.0",
    padrao: /\b(?:retorno\s+em\s+at[ée]\s+\d+\s*h(?:oras)?|resposta\s+imediata\s+em\s+\d+|atendimento\s+24\s*h(?:oras)?)/i,
    explicacao: "Promessas operacionais de tempo de resposta devem ser rigorosamente factíveis.",
    sugestao: "Use formulações seguras como “Atendimento pelos canais profissionais em horário comercial”.",
  },
  {
    id: "disclaimer-informativo",
    rotulo: "Finalidade informativa da página",
    severidade: "INFO",
    baseNormativa: { documento: "Provimento 205/2021", artigo: "1" },
    versao: "2.0",
    padrao: /\bconte[úu]do\s+(?:estritamente\s+)?informativo\b/i,
    explicacao: "A menção ao caráter informativo do conteúdo resguarda a finalidade educativa do material.",
    sugestao: "Excelente prática. Mantenha a nota de transparência presente.",
  },
];

export type OpcoesValidacao = {
  excecoesCustomizadas?: string[];
  termosAprovados?: string[];
};

/** Percorre o texto e devolve tudo que bate com alguma regra. */
export function verificarTexto(
  texto: string,
  campo?: string,
  opcoes?: OpcoesValidacao,
): Achado[] {
  if (!texto) return [];

  const alvo = texto.normalize("NFC");
  const alvoPlano = semAcento(alvo);
  const achados: Achado[] = [];

  const excecoesCustom =
    opcoes?.excecoesCustomizadas?.map((e) => semAcento(e.trim().toLowerCase())) || [];
  const aprovados =
    opcoes?.termosAprovados?.map((a) => semAcento(a.trim().toLowerCase())) || [];

  for (const regra of regras) {
    const flags = regra.padrao.flags.includes("g")
      ? regra.padrao.flags
      : regra.padrao.flags + "g";
    const rx = new RegExp(semAcento(regra.padrao.source), flags);

    let m: RegExpExecArray | null;
    while ((m = rx.exec(alvoPlano)) !== null) {
      const trechoAlvo = alvo.slice(m.index, m.index + m[0].length).trim();
      const trechoPlano = m[0].trim().toLowerCase();
      const inicio = Math.max(0, m.index - JANELA_CONTEXTO);
      const fim = m.index + m[0].length + JANELA_CONTEXTO;
      const contextoPlano = alvoPlano.slice(inicio, fim).toLowerCase();

      // 1. Exceções nativas da regra
      let dispensado = regra.excecoes?.some((e) =>
        new RegExp(semAcento(e.source), e.flags).test(contextoPlano),
      );

      // 2. Exceções customizadas adicionadas ao dicionário pelo usuário
      if (
        !dispensado &&
        excecoesCustom.some(
          (exc) => exc && (contextoPlano.includes(exc) || trechoPlano === exc),
        )
      ) {
        dispensado = true;
      }

      if (!dispensado) {
        // 3. Verifica se foi aprovado com revisão humana pelo advogado
        const foiAprovado = aprovados.some(
          (ap) =>
            ap &&
            (trechoPlano === ap ||
              contextoPlano.includes(ap) ||
              trechoAlvo.toLowerCase() === ap),
        );

        achados.push({
          regra: foiAprovado
            ? {
                ...regra,
                severidade: "INFO",
                rotulo: `${regra.rotulo} (Aprovado com Revisão)`,
                explicacao: `Aprovado expressamente pelo advogado responsável para este contexto específico.`,
              }
            : regra,
          trecho: trechoAlvo,
          indice: m.index,
          campo,
          aprovadoComRevisao: foiAprovado,
        });
      }

      if (m.index === rx.lastIndex) rx.lastIndex++;
    }
  }

  return achados.sort((a, b) => a.indice - b.indice);
}

export function validarTexto(
  texto: string,
  campo?: string,
  opcoes?: OpcoesValidacao,
): RelatorioCompliance {
  const achados = verificarTexto(texto, campo, opcoes);
  return processarAchados(achados);
}

function processarAchados(achados: Achado[]): RelatorioCompliance {
  const bloqueios = achados.filter(
    (a) => normalizarSeveridade(a.regra.severidade) === "BLOCKER",
  );
  const avisos = achados.filter(
    (a) => normalizarSeveridade(a.regra.severidade) === "WARNING",
  );
  const recomendacoes = achados.filter(
    (a) => normalizarSeveridade(a.regra.severidade) === "RECOMMENDATION",
  );
  const informacoes = achados.filter(
    (a) => normalizarSeveridade(a.regra.severidade) === "INFO",
  );

  let status: Exclude<ComplianceStatus, "APPROVED"> = "READY";
  if (bloqueios.length > 0) {
    status = "BLOCKED";
  } else if (avisos.length > 0) {
    status = "REVIEW_REQUIRED";
  }

  let score = 100;
  score -= bloqueios.length * 30;
  score -= avisos.length * 10;
  score -= recomendacoes.length * 3;
  if (score < 0) score = 0;

  return {
    status,
    permitido: status !== "BLOCKED",
    score,
    bloqueios,
    avisos,
    recomendacoes,
    informacoes,
    todosAchados: achados,
  };
}

export function validarPaginaLegal(dados: Record<string, unknown>): RelatorioCompliance {
  const achados: Achado[] = [];

  for (const [campo, valor] of Object.entries(dados)) {
    if (valor == null) continue;
    const texto = typeof valor === "string" ? valor : extrairTexto(valor);
    achados.push(...verificarTexto(texto, campo));
  }

  return processarAchados(achados);
}

/**
 * Chave única do impedimento de publicação por compliance.
 *
 * Decisão de cada escritório, por variável de ambiente
 * (NEXT_PUBLIC_COMPLIANCE_BLOQUEIO=true). Desligada por padrão, como no
 * projeto de origem: as regras rodam e mostram os achados no painel, mas
 * quem decide publicar é o advogado — o Provimento 205/2021 e o Código de
 * Ética continuam aplicáveis a ele de qualquer forma. Ligada, um achado
 * BLOCKER impede salvar o texto.
 */
export const BLOQUEIO_DE_PUBLICACAO_ATIVO = process.env.NEXT_PUBLIC_COMPLIANCE_BLOQUEIO === "true";

/**
 * Indica se há achado de severidade BLOCKER.
 *
 * Mantém o significado original — serve à barra de compliance do Studio e aos
 * relatórios, que seguem distinguindo bloqueio de aviso. Quem decide barrar a
 * gravação é `BLOQUEIO_DE_PUBLICACAO_ATIVO`, não esta função.
 */
export function temBloqueio(achados: Achado[]): boolean {
  return achados.some(
    (a) => normalizarSeveridade(a.regra.severidade) === "BLOCKER",
  );
}

/** Mensagem legível para o painel ou para logs. */
export function formatarAchados(achados: Achado[]): string {
  const linha = (a: Achado) =>
    `• ${a.campo ? `[${a.campo}] ` : ""}“${a.trecho}” — ${a.regra.rotulo} (${a.regra.baseNormativa.documento}, art. ${a.regra.baseNormativa.artigo}). ${a.regra.sugestao}`;

  const bloqueios = achados.filter(
    (a) => normalizarSeveridade(a.regra.severidade) === "BLOCKER",
  );
  const avisos = achados.filter(
    (a) => normalizarSeveridade(a.regra.severidade) === "WARNING",
  );
  const recomendacoes = achados.filter(
    (a) => normalizarSeveridade(a.regra.severidade) === "RECOMMENDATION",
  );

  const partes: string[] = [];
  if (bloqueios.length) {
    // O rótulo acompanha a chave: dizer "impedem a publicação" com o bloqueio
    // desativado seria mentir para quem lê o log ou a barra do Studio.
    const titulo = BLOQUEIO_DE_PUBLICACAO_ATIVO
      ? "🛑 Impedem a publicação (BLOCKER)"
      : "🛑 Vedações do Provimento 205/2021 detectadas (BLOCKER) — publicação não foi impedida";
    partes.push(`${titulo}:\n${bloqueios.map(linha).join("\n")}`);
  }
  if (avisos.length) {
    partes.push(`⚠️ Revisar antes de publicar (WARNING):\n${avisos.map(linha).join("\n")}`);
  }
  if (recomendacoes.length) {
    partes.push(`💡 Sugestões de melhoria (RECOMMENDATION):\n${recomendacoes.map(linha).join("\n")}`);
  }
  return partes.join("\n\n");
}

export function extrairTextoLexical(valor: unknown): string {
  const pedacos: string[] = [];

  const andar = (no: unknown): void => {
    if (!no || typeof no !== "object") return;
    const n = no as Record<string, unknown>;

    if (typeof n.text === "string") pedacos.push(n.text);

    if (Array.isArray(n.children)) {
      n.children.forEach(andar);
    } else if (n.root) {
      andar(n.root);
    }
  };

  andar(valor);
  return pedacos.join(" ");
}

const CHAVES_ESTRUTURAIS = new Set([
  "type",
  "format",
  "version",
  "direction",
  "mode",
  "style",
  "tag",
  "listType",
  "id",
  "blockType",
  "relationTo",
]);

export function extrairTexto(valor: unknown): string {
  const pedacos: string[] = [];

  const andar = (no: unknown): void => {
    if (typeof no === "string") {
      pedacos.push(no);
      return;
    }
    if (!no || typeof no !== "object") return;

    if (Array.isArray(no)) {
      no.forEach(andar);
      return;
    }

    for (const [chave, filho] of Object.entries(no as Record<string, unknown>)) {
      if (CHAVES_ESTRUTURAIS.has(chave)) continue;
      andar(filho);
    }
  };

  andar(valor);
  return pedacos.join(" ");
}

export const checklistPublicacao = [
  "Nenhum caso concreto, nem anonimizado, foi usado para ofertar atuação",
  "Toda afirmação factual do texto é comprovável documentalmente",
  "Nenhuma imagem do conteúdo mostra ostentação de bens",
  "Nenhum símbolo oficial da OAB foi utilizado",
  "O conteúdo trata do Direito com propósito informativo e educativo",
  "A legislação citada está vigente e as fontes foram informadas",
] as const;
