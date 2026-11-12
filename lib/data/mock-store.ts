// Store central para dados do NEXUS ERP Moçambique
// Suporta persistência no localStorage em modo Demo / offline e sincronização fluida

export interface Aluno {
  id: string;
  codigo: string;
  nome: string;
  nivel: 'Pré-escolar' | 'Primário' | 'Secundário';
  classe: string;
  turma: string;
  sexo: 'M' | 'F';
  dataNascimento: string;
  encarregado: string;
  contacto: string; // formato +258
  estado: 'Activo' | 'Transferido' | 'Pendente' | 'Inactivo';
  propinaStatus: 'Regular' | 'Em Atraso' | 'Isento';
}

export interface Professor {
  id: string;
  codigo: string;
  nome: string;
  sexo: 'M' | 'F';
  contacto: string;
  email: string;
  disciplinas: string[];
  turmas: string[];
  habilitacoes: string;
  estado: 'Activo' | 'Licença';
}

export interface Turma {
  id: string;
  codigo: string;
  nome: string;
  nivel: 'Pré-escolar' | 'Primário' | 'Secundário';
  classe: string;
  turno: 'Manhã' | 'Tarde' | 'Noite';
  sala: string;
  directorTurma: string;
  totalAlunos: number;
  capacidade: number;
}

export interface Matricula {
  id: string;
  numero: string;
  alunoNome: string;
  classe: string;
  anoLectivo: number;
  dataMatricula: string;
  tipo: 'Nova Matrícula' | 'Renovação';
  valor: number;
  estado: 'Confirmada' | 'Pendente' | 'Cancelada';
  contacto: string;
}

export interface Declaracao {
  id: string;
  numero: string;
  tipo: 'Declaração com Notas' | 'Declaração sem Notas' | 'Declaração de Matrícula' | 'Certificado de Habilitações';
  alunoNome: string;
  alunoCodigo: string;
  classe: string;
  turma: string;
  finalidade: string;
  dataEmissao: string;
  estado: 'Emitida' | 'Pronta' | 'Pendente';
}

export interface Pagamento {
  id: string;
  recibo: string;
  alunoId: string;
  alunoNome: string;
  classe: string;
  turma: string;
  mes: string;
  valor: number;
  metodo: 'M-Pesa' | 'E-Mola' | 'Transferência BIM' | 'Numerário' | 'POS';
  referencia: string;
  dataPagamento: string;
  estado: 'Liquidado' | 'Pendente' | 'Anulado';
}

export interface Divida {
  id: string;
  alunoId: string;
  alunoNome: string;
  classe: string;
  turma: string;
  encarregado: string;
  contacto: string;
  mesesEmAtraso: string[];
  valorTotal: number;
  diasAtraso: number;
  ultimoAvisoWhatsApp?: string;
}

export interface MovimentoTesouraria {
  id: string;
  tipo: 'Receita' | 'Despesa';
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
  formaPagamento: string;
  responsavel: string;
}

export interface Comunicado {
  id: string;
  titulo: string;
  categoria: 'Geral' | 'Urgente' | 'Académico' | 'Financeiro';
  data: string;
  conteudo: string;
  autor: string;
  destinatarios: string;
  visualizacoes: number;
}

const INITIAL_ALUNOS: Aluno[] = [
  {
    id: 'alu-1',
    codigo: 'ALU-2026-001',
    nome: 'Mateus Samora Cossa',
    nivel: 'Secundário',
    classe: '10ª Classe',
    turma: 'Turma A',
    sexo: 'M',
    dataNascimento: '2009-04-12',
    encarregado: 'Alberto Cossa',
    contacto: '+258843219012',
    estado: 'Activo',
    propinaStatus: 'Regular'
  },
  {
    id: 'alu-2',
    codigo: 'ALU-2026-002',
    nome: 'Amélia Graça Nhaca',
    nivel: 'Secundário',
    classe: '12ª Classe',
    turma: 'Turma B',
    sexo: 'F',
    dataNascimento: '2007-08-25',
    encarregado: 'Teresa Mondlane Nhaca',
    contacto: '+258872019944',
    estado: 'Activo',
    propinaStatus: 'Em Atraso'
  },
  {
    id: 'alu-3',
    codigo: 'ALU-2026-003',
    nome: 'Edmilson Félix Tembe',
    nivel: 'Primário',
    classe: '5ª Classe',
    turma: 'Turma C',
    sexo: 'M',
    dataNascimento: '2014-11-03',
    encarregado: 'Félix Tembe',
    contacto: '+258865543210',
    estado: 'Activo',
    propinaStatus: 'Regular'
  },
  {
    id: 'alu-4',
    codigo: 'ALU-2026-004',
    nome: 'Safira Luísa Mabunda',
    nivel: 'Pré-escolar',
    classe: 'Iniciação',
    turma: 'Jardim A',
    sexo: 'F',
    dataNascimento: '2020-02-18',
    encarregado: 'Dra. Luísa Mabunda',
    contacto: '+258849901234',
    estado: 'Activo',
    propinaStatus: 'Regular'
  },
  {
    id: 'alu-5',
    codigo: 'ALU-2026-005',
    nome: 'Nelson Arlindo Macamo',
    nivel: 'Secundário',
    classe: '11ª Classe',
    turma: 'Turma A',
    sexo: 'M',
    dataNascimento: '2008-06-15',
    encarregado: 'Arlindo Macamo',
    contacto: '+258841122334',
    estado: 'Activo',
    propinaStatus: 'Em Atraso'
  },
  {
    id: 'alu-6',
    codigo: 'ALU-2026-006',
    nome: 'Yara Esperança Chissano',
    nivel: 'Primário',
    classe: '3ª Classe',
    turma: 'Turma A',
    sexo: 'F',
    dataNascimento: '2016-09-09',
    encarregado: 'Dr. Armando Chissano',
    contacto: '+258823456789',
    estado: 'Activo',
    propinaStatus: 'Regular'
  }
];

const INITIAL_PROFESSORES: Professor[] = [
  {
    id: 'prof-1',
    codigo: 'PROF-001',
    nome: 'Prof. Sérgio Sitoe',
    sexo: 'M',
    contacto: '+258845001122',
    email: 'sergio.sitoe@nexus.ac.mz',
    disciplinas: ['Matemática', 'Física'],
    turmas: ['10ª A', '12ª B'],
    habilitacoes: 'Licenciatura em Ensino de Matemática - UP Maputo',
    estado: 'Activo'
  },
  {
    id: 'prof-2',
    codigo: 'PROF-002',
    nome: 'Prof.ª Teresa Mondlane',
    sexo: 'F',
    contacto: '+258867890123',
    email: 'teresa.mondlane@nexus.ac.mz',
    disciplinas: ['Língua Portuguesa', 'Literatura'],
    turmas: ['10ª A', '11ª A', '12ª B'],
    habilitacoes: 'Mestrado em Linguística e Literatura Moçambicana - UEM',
    estado: 'Activo'
  },
  {
    id: 'prof-3',
    codigo: 'PROF-003',
    nome: 'Prof. João Paulo Cuamba',
    sexo: 'M',
    contacto: '+258849001234',
    email: 'joao.cuamba@nexus.ac.mz',
    disciplinas: ['Biologia', 'Química'],
    turmas: ['11ª A', '12ª B'],
    habilitacoes: 'Licenciatura em Química Aplicada - UEM',
    estado: 'Activo'
  },
  {
    id: 'prof-4',
    codigo: 'PROF-004',
    nome: 'Prof.ª Isabel Matsinhe',
    sexo: 'F',
    contacto: '+258873456780',
    email: 'isabel.matsinhe@nexus.ac.mz',
    disciplinas: ['Ensino Primário Integrado'],
    turmas: ['5ª C', '3ª A'],
    habilitacoes: 'Bacharelato em Pedagogia e Educação Básica - IFP Matola',
    estado: 'Activo'
  }
];

const INITIAL_TURMAS: Turma[] = [
  {
    id: 'turma-1',
    codigo: 'TUR-10A',
    nome: '10ª Classe - Turma A',
    nivel: 'Secundário',
    classe: '10ª Classe',
    turno: 'Manhã',
    sala: 'Sala 04 (Bloco B)',
    directorTurma: 'Prof. Sérgio Sitoe',
    totalAlunos: 38,
    capacidade: 40
  },
  {
    id: 'turma-2',
    codigo: 'TUR-11A',
    nome: '11ª Classe - Turma A',
    nivel: 'Secundário',
    classe: '11ª Classe',
    turno: 'Manhã',
    sala: 'Sala 06 (Bloco B)',
    directorTurma: 'Prof.ª Teresa Mondlane',
    totalAlunos: 36,
    capacidade: 40
  },
  {
    id: 'turma-3',
    codigo: 'TUR-12B',
    nome: '12ª Classe - Turma B',
    nivel: 'Secundário',
    classe: '12ª Classe',
    turno: 'Tarde',
    sala: 'Sala 08 (Bloco C)',
    directorTurma: 'Prof. João Paulo Cuamba',
    totalAlunos: 34,
    capacidade: 35
  },
  {
    id: 'turma-4',
    codigo: 'TUR-05C',
    nome: '5ª Classe - Turma C',
    nivel: 'Primário',
    classe: '5ª Classe',
    turno: 'Manhã',
    sala: 'Sala 02 (Bloco A)',
    directorTurma: 'Prof.ª Isabel Matsinhe',
    totalAlunos: 29,
    capacidade: 30
  },
  {
    id: 'turma-5',
    codigo: 'TUR-JARDIM',
    nome: 'Pré-Escolar - Jardim A',
    nivel: 'Pré-escolar',
    classe: 'Iniciação',
    turno: 'Manhã',
    sala: 'Sala Arco-Íris',
    directorTurma: 'Educadora Cláudia Nguenha',
    totalAlunos: 22,
    capacidade: 25
  }
];

const INITIAL_MATRICULAS: Matricula[] = [
  {
    id: 'mat-1',
    numero: 'MAT-2026-001',
    alunoNome: 'Mateus Samora Cossa',
    classe: '10ª Classe',
    anoLectivo: 2026,
    dataMatricula: '2026-01-15',
    tipo: 'Renovação',
    valor: 2500,
    estado: 'Confirmada',
    contacto: '+258843219012'
  },
  {
    id: 'mat-2',
    numero: 'MAT-2026-002',
    alunoNome: 'Amélia Graça Nhaca',
    classe: '12ª Classe',
    anoLectivo: 2026,
    dataMatricula: '2026-01-18',
    tipo: 'Renovação',
    valor: 2800,
    estado: 'Confirmada',
    contacto: '+258872019944'
  },
  {
    id: 'mat-3',
    numero: 'MAT-2026-003',
    alunoNome: 'Edmilson Félix Tembe',
    classe: '5ª Classe',
    anoLectivo: 2026,
    dataMatricula: '2026-01-20',
    tipo: 'Nova Matrícula',
    valor: 1800,
    estado: 'Confirmada',
    contacto: '+258865543210'
  },
  {
    id: 'mat-4',
    numero: 'MAT-2026-004',
    alunoNome: 'Safira Luísa Mabunda',
    classe: 'Iniciação',
    anoLectivo: 2026,
    dataMatricula: '2026-02-02',
    tipo: 'Nova Matrícula',
    valor: 2000,
    estado: 'Confirmada',
    contacto: '+258849901234'
  },
  {
    id: 'mat-5',
    numero: 'MAT-2026-005',
    alunoNome: 'Ananias Salvador Mabjaia',
    classe: '8ª Classe',
    anoLectivo: 2026,
    dataMatricula: '2026-02-10',
    tipo: 'Nova Matrícula',
    valor: 2200,
    estado: 'Pendente',
    contacto: '+258848877665'
  }
];

const INITIAL_DECLARACOES: Declaracao[] = [
  {
    id: 'dec-1',
    numero: 'DEC-2026-0084',
    tipo: 'Declaração de Matrícula',
    alunoNome: 'Mateus Samora Cossa',
    alunoCodigo: 'ALU-2026-001',
    classe: '10ª Classe',
    turma: 'Turma A',
    finalidade: 'Para efeitos de obtenção de Bilhete de Identidade (DIRE / Identificação Civil)',
    dataEmissao: '2026-02-10',
    estado: 'Emitida'
  },
  {
    id: 'dec-2',
    numero: 'DEC-2026-0085',
    tipo: 'Declaração com Notas',
    alunoNome: 'Amélia Graça Nhaca',
    alunoCodigo: 'ALU-2026-002',
    classe: '12ª Classe',
    turma: 'Turma B',
    finalidade: 'Para efeitos de candidatura a Bolsa de Estudos do Instituto de Bolsas de Moçambique',
    dataEmissao: '2026-02-11',
    estado: 'Emitida'
  },
  {
    id: 'dec-3',
    numero: 'DEC-2026-0086',
    tipo: 'Certificado de Habilitações',
    alunoNome: 'Nelson Arlindo Macamo',
    alunoCodigo: 'ALU-2026-005',
    classe: '10ª Classe (Concluída)',
    turma: 'Turma A',
    finalidade: 'Apresentação no Instituto Industrial de Maputo',
    dataEmissao: '2026-02-12',
    estado: 'Pronta'
  }
];

const INITIAL_PAGAMENTOS: Pagamento[] = [
  {
    id: 'pag-1',
    recibo: 'REC-2026-0129',
    alunoId: 'alu-1',
    alunoNome: 'Mateus Samora Cossa',
    classe: '10ª Classe',
    turma: 'Turma A',
    mes: 'Fevereiro 2026',
    valor: 2500,
    metodo: 'M-Pesa',
    referencia: 'MP260211.8901',
    dataPagamento: '2026-02-11',
    estado: 'Liquidado'
  },
  {
    id: 'pag-2',
    recibo: 'REC-2026-0130',
    alunoId: 'alu-3',
    alunoNome: 'Edmilson Félix Tembe',
    classe: '5ª Classe',
    turma: 'Turma C',
    mes: 'Fevereiro 2026',
    valor: 1800,
    metodo: 'E-Mola',
    referencia: 'EM260210.4431',
    dataPagamento: '2026-02-10',
    estado: 'Liquidado'
  },
  {
    id: 'pag-3',
    recibo: 'REC-2026-0131',
    alunoId: 'alu-4',
    alunoNome: 'Safira Luísa Mabunda',
    classe: 'Iniciação',
    turma: 'Jardim A',
    mes: 'Fevereiro 2026',
    valor: 2000,
    metodo: 'Transferência BIM',
    referencia: 'TRF-BIM-99823',
    dataPagamento: '2026-02-09',
    estado: 'Liquidado'
  },
  {
    id: 'pag-4',
    recibo: 'REC-2026-0132',
    alunoId: 'alu-6',
    alunoNome: 'Yara Esperança Chissano',
    classe: '3ª Classe',
    turma: 'Turma A',
    mes: 'Fevereiro 2026',
    valor: 1800,
    metodo: 'POS',
    referencia: 'POS-SIMO-10294',
    dataPagamento: '2026-02-08',
    estado: 'Liquidado'
  }
];

const INITIAL_DIVIDAS: Divida[] = [
  {
    id: 'div-1',
    alunoId: 'alu-2',
    alunoNome: 'Amélia Graça Nhaca',
    classe: '12ª Classe',
    turma: 'Turma B',
    encarregado: 'Teresa Mondlane Nhaca',
    contacto: '+258872019944',
    mesesEmAtraso: ['Janeiro 2026', 'Fevereiro 2026'],
    valorTotal: 5600,
    diasAtraso: 24,
    ultimoAvisoWhatsApp: '2026-02-05'
  },
  {
    id: 'div-2',
    alunoId: 'alu-5',
    alunoNome: 'Nelson Arlindo Macamo',
    classe: '11ª Classe',
    turma: 'Turma A',
    encarregado: 'Arlindo Macamo',
    contacto: '+258841122334',
    mesesEmAtraso: ['Fevereiro 2026'],
    valorTotal: 2600,
    diasAtraso: 12
  },
  {
    id: 'div-3',
    alunoId: 'alu-7',
    alunoNome: 'Kátia Regina Munguambe',
    classe: '9ª Classe',
    turma: 'Turma C',
    encarregado: 'Regina Munguambe',
    contacto: '+258847778899',
    mesesEmAtraso: ['Dezembro 2025', 'Janeiro 2026', 'Fevereiro 2026'],
    valorTotal: 7200,
    diasAtraso: 45,
    ultimoAvisoWhatsApp: '2026-02-01'
  }
];

const INITIAL_TESOURARIA: MovimentoTesouraria[] = [
  {
    id: 'tes-1',
    tipo: 'Receita',
    categoria: 'Propinas',
    descricao: 'Arrecadação de Propinas - Fevereiro (M-Pesa / E-Mola / Bancos)',
    valor: 145000,
    data: '2026-02-12',
    formaPagamento: 'Diversos',
    responsavel: 'Tesouraria Central'
  },
  {
    id: 'tes-2',
    tipo: 'Receita',
    categoria: 'Matrículas',
    descricao: 'Novas Matrículas e Confirmações do Ano Lectivo 2026',
    valor: 48000,
    data: '2026-02-10',
    formaPagamento: 'M-Pesa / Transferência',
    responsavel: 'Secretaria'
  },
  {
    id: 'tes-3',
    tipo: 'Despesa',
    categoria: 'Material Escolar & Escritório',
    descricao: 'Aquisição de resmas de papel A4, toners de impressão e cadernos de chamada',
    valor: 18500,
    data: '2026-02-08',
    formaPagamento: 'Transferência BIM',
    responsavel: 'Administração'
  },
  {
    id: 'tes-4',
    tipo: 'Despesa',
    categoria: 'Infraestrutura & Manutenção',
    descricao: 'Manutenção da rede eléctrica das salas 03 a 08 e substituição de lâmpadas LED',
    valor: 12400,
    data: '2026-02-06',
    formaPagamento: 'Numerário',
    responsavel: 'Direcção'
  },
  {
    id: 'tes-5',
    tipo: 'Despesa',
    categoria: 'Telecomunicações e Internet',
    descricao: 'Mensalidade de Internet Fibra Óptica 100 Mbps (TDM/Vodacom)',
    valor: 6500,
    data: '2026-02-02',
    formaPagamento: 'M-Pesa Business',
    responsavel: 'TI'
  }
];

const INITIAL_COMUNICADOS: Comunicado[] = [
  {
    id: 'com-1',
    titulo: 'Início Oficial do 1º Trimestre Lectivo de 2026 e Uniforme Escolar',
    categoria: 'Geral',
    data: '2026-02-01',
    conteudo: 'Informamos a toda a comunidade escolar, pais e encarregados de educação que as aulas do ano lectivo 2026 iniciaram com cumprimento rigoroso do horário e uso de uniforme oficial.',
    autor: 'Direcção Pedagógica',
    destinatarios: 'Todos os Encarregados',
    visualizacoes: 412
  },
  {
    id: 'com-2',
    titulo: 'Reunião Geral de Pais e Encarregados de Educação - 10ª e 12ª Classes',
    categoria: 'Académico',
    data: '2026-02-08',
    conteudo: 'Convidam-se todos os pais e encarregados das turmas com exames finais (10ª e 12ª classes) para a 1ª Sessão de Alinhamento Pedagógico no próximo Sábado, pelas 09h00 no Salão Nobre.',
    autor: 'Conselho de Direcção',
    destinatarios: '10ª e 12ª Classes',
    visualizacoes: 289
  },
  {
    id: 'com-3',
    titulo: 'Lembrete: Prazo Limite para Liquidação da Propina de Fevereiro sem Multa',
    categoria: 'Financeiro',
    data: '2026-02-10',
    conteudo: 'Recordamos que o prazo para pagamento das propinas do mês corrente sem aplicação de sobretaxa decorre até ao dia 15 deste mês. Os pagamentos podem ser efectuados via M-Pesa, E-Mola ou Millennium BIM.',
    autor: 'Departamento Financeiro',
    destinatarios: 'Todos os Encarregados',
    visualizacoes: 530
  }
];

const STORAGE_KEY = 'nexus_erp_mock_store_v1';

export class MockDataStore {
  private static getStore() {
    if (typeof window === 'undefined') {
      return {
        alunos: INITIAL_ALUNOS,
        professores: INITIAL_PROFESSORES,
        turmas: INITIAL_TURMAS,
        matriculas: INITIAL_MATRICULAS,
        declaracoes: INITIAL_DECLARACOES,
        pagamentos: INITIAL_PAGAMENTOS,
        dividas: INITIAL_DIVIDAS,
        tesouraria: INITIAL_TESOURARIA,
        comunicados: INITIAL_COMUNICADOS
      };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }

    const defaultStore = {
      alunos: INITIAL_ALUNOS,
      professores: INITIAL_PROFESSORES,
      turmas: INITIAL_TURMAS,
      matriculas: INITIAL_MATRICULAS,
      declaracoes: INITIAL_DECLARACOES,
      pagamentos: INITIAL_PAGAMENTOS,
      dividas: INITIAL_DIVIDAS,
      tesouraria: INITIAL_TESOURARIA,
      comunicados: INITIAL_COMUNICADOS
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStore));
    } catch {}

    return defaultStore;
  }

  private static saveStore(data: any) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new Event('nexus_store_updated'));
    } catch (e) {
      console.error('Failed to save to mock store', e);
    }
  }

  // ALUNOS
  static getAlunos(): Aluno[] {
    return this.getStore().alunos;
  }

  static addAluno(aluno: Omit<Aluno, 'id' | 'codigo'>): Aluno {
    const store = this.getStore();
    const count = store.alunos.length + 1;
    const newAluno: Aluno = {
      ...aluno,
      id: `alu-${Date.now()}`,
      codigo: `ALU-2026-${String(count).padStart(3, '0')}`
    };
    store.alunos.unshift(newAluno);
    this.saveStore(store);
    return newAluno;
  }

  static updateAluno(id: string, updates: Partial<Aluno>): Aluno | null {
    const store = this.getStore();
    const index = store.alunos.findIndex((a: Aluno) => a.id === id);
    if (index === -1) return null;
    store.alunos[index] = { ...store.alunos[index], ...updates };
    this.saveStore(store);
    return store.alunos[index];
  }

  static deleteAluno(id: string): boolean {
    const store = this.getStore();
    const prev = store.alunos.length;
    store.alunos = store.alunos.filter((a: Aluno) => a.id !== id);
    if (store.alunos.length !== prev) {
      this.saveStore(store);
      return true;
    }
    return false;
  }

  // PROFESSORES
  static getProfessores(): Professor[] {
    return this.getStore().professores;
  }

  static addProfessor(prof: Omit<Professor, 'id' | 'codigo'>): Professor {
    const store = this.getStore();
    const count = store.professores.length + 1;
    const newProf: Professor = {
      ...prof,
      id: `prof-${Date.now()}`,
      codigo: `PROF-${String(count).padStart(3, '0')}`
    };
    store.professores.unshift(newProf);
    this.saveStore(store);
    return newProf;
  }

  static deleteProfessor(id: string): boolean {
    const store = this.getStore();
    const prev = store.professores.length;
    store.professores = store.professores.filter((p: Professor) => p.id !== id);
    if (store.professores.length !== prev) {
      this.saveStore(store);
      return true;
    }
    return false;
  }

  // TURMAS
  static getTurmas(): Turma[] {
    return this.getStore().turmas;
  }

  static addTurma(turma: Omit<Turma, 'id' | 'codigo'>): Turma {
    const store = this.getStore();
    const count = store.turmas.length + 1;
    const newTurma: Turma = {
      ...turma,
      id: `turma-${Date.now()}`,
      codigo: `TUR-${String(count).padStart(3, '0')}`
    };
    store.turmas.unshift(newTurma);
    this.saveStore(store);
    return newTurma;
  }

  static deleteTurma(id: string): boolean {
    const store = this.getStore();
    const prev = store.turmas.length;
    store.turmas = store.turmas.filter((t: Turma) => t.id !== id);
    if (store.turmas.length !== prev) {
      this.saveStore(store);
      return true;
    }
    return false;
  }

  // MATRÍCULAS
  static getMatriculas(): Matricula[] {
    return this.getStore().matriculas;
  }

  static addMatricula(mat: Omit<Matricula, 'id' | 'numero'>): Matricula {
    const store = this.getStore();
    const count = store.matriculas.length + 1;
    const newMat: Matricula = {
      ...mat,
      id: `mat-${Date.now()}`,
      numero: `MAT-2026-${String(count).padStart(3, '0')}`
    };
    store.matriculas.unshift(newMat);
    this.saveStore(store);
    return newMat;
  }

  static updateMatriculaStatus(id: string, estado: 'Confirmada' | 'Pendente' | 'Cancelada') {
    const store = this.getStore();
    const index = store.matriculas.findIndex((m: Matricula) => m.id === id);
    if (index !== -1) {
      store.matriculas[index].estado = estado;
      this.saveStore(store);
    }
  }

  // DECLARAÇÕES
  static getDeclaracoes(): Declaracao[] {
    return this.getStore().declaracoes;
  }

  static addDeclaracao(dec: Omit<Declaracao, 'id' | 'numero'>): Declaracao {
    const store = this.getStore();
    const count = store.declaracoes.length + 80;
    const newDec: Declaracao = {
      ...dec,
      id: `dec-${Date.now()}`,
      numero: `DEC-2026-${String(count).padStart(4, '0')}`
    };
    store.declaracoes.unshift(newDec);
    this.saveStore(store);
    return newDec;
  }

  // PAGAMENTOS & PROPINAS
  static getPagamentos(): Pagamento[] {
    return this.getStore().pagamentos;
  }

  static addPagamento(pag: Omit<Pagamento, 'id' | 'recibo'>): Pagamento {
    const store = this.getStore();
    const count = store.pagamentos.length + 130;
    const newPag: Pagamento = {
      ...pag,
      id: `pag-${Date.now()}`,
      recibo: `REC-2026-${String(count).padStart(4, '0')}`
    };
    store.pagamentos.unshift(newPag);

    // Se houver dívida deste aluno, abater ou atualizar
    const dividaIndex = store.dividas.findIndex((d: Divida) => d.alunoId === pag.alunoId || d.alunoNome === pag.alunoNome);
    if (dividaIndex !== -1) {
      store.dividas[dividaIndex].valorTotal = Math.max(0, store.dividas[dividaIndex].valorTotal - pag.valor);
      if (store.dividas[dividaIndex].valorTotal === 0) {
        store.dividas.splice(dividaIndex, 1);
      }
    }

    // Registar entrada na tesouraria
    store.tesouraria.unshift({
      id: `tes-${Date.now()}`,
      tipo: 'Receita',
      categoria: 'Propinas',
      descricao: `Propina ${pag.mes} - ${pag.alunoNome} (${pag.classe})`,
      valor: pag.valor,
      data: pag.dataPagamento,
      formaPagamento: pag.metodo,
      responsavel: 'Tesouraria'
    });

    this.saveStore(store);
    return newPag;
  }

  // DÍVIDAS
  static getDividas(): Divida[] {
    return this.getStore().dividas;
  }

  static recordWhatsAppCobrança(id: string): void {
    const store = this.getStore();
    const index = store.dividas.findIndex((d: Divida) => d.id === id);
    if (index !== -1) {
      store.dividas[index].ultimoAvisoWhatsApp = new Date().toISOString().split('T')[0];
      this.saveStore(store);
    }
  }

  // TESOURARIA
  static getTesouraria(): MovimentoTesouraria[] {
    return this.getStore().tesouraria;
  }

  static addMovimentoTesouraria(mov: Omit<MovimentoTesouraria, 'id'>): MovimentoTesouraria {
    const store = this.getStore();
    const newMov: MovimentoTesouraria = {
      ...mov,
      id: `tes-${Date.now()}`
    };
    store.tesouraria.unshift(newMov);
    this.saveStore(store);
    return newMov;
  }

  // COMUNICADOS
  static getComunicados(): Comunicado[] {
    return this.getStore().comunicados;
  }

  static addComunicado(com: Omit<Comunicado, 'id' | 'visualizacoes'>): Comunicado {
    const store = this.getStore();
    const newCom: Comunicado = {
      ...com,
      id: `com-${Date.now()}`,
      visualizacoes: 1
    };
    store.comunicados.unshift(newCom);
    this.saveStore(store);
    return newCom;
  }
}
