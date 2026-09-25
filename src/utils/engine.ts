/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ValidaDev Core Cryptographic & Mathematical Engine (Modulo 11)
 * Native client-side implementation of Brazilian Federal Revenue (RFB) algorithms.
 */

export interface CpfValidationResult {
  isValid: boolean;
  type: 'CPF';
  raw: string;
  formatted: string;
  base: string;
  dv1Actual: number;
  dv1Expected: number;
  dv2Actual: number;
  dv2Expected: number;
  regionDigit: string;
  regionName: string;
  isRepetitive: boolean;
  statusLabel: string;
  errorReason?: string;
}

export interface CnpjValidationResult {
  isValid: boolean;
  type: 'CNPJ';
  formatVariant: 'NUMERIC' | 'ALPHANUMERIC_2026';
  raw: string;
  formatted: string;
  base: string;
  branch: string;
  isMatriz: boolean;
  dv1Actual: number;
  dv1Expected: number;
  dv2Actual: number;
  dv2Expected: number;
  isRepetitive: boolean;
  statusLabel: string;
  errorReason?: string;
}

export type ValidationResult = CpfValidationResult | CnpjValidationResult | {
  isValid: false;
  type: 'UNKNOWN';
  raw: string;
  errorReason: string;
};

export const UF_REGION_MAP: Record<string, { region: number; name: string; states: string[] }> = {
  '1': { region: 1, name: '1ª Região Fiscal', states: ['DF', 'GO', 'MT', 'MS', 'TO'] },
  '2': { region: 2, name: '2ª Região Fiscal', states: ['AC', 'AP', 'AM', 'PA', 'RO', 'RR'] },
  '3': { region: 3, name: '3ª Região Fiscal', states: ['CE', 'MA', 'PI'] },
  '4': { region: 4, name: '4ª Região Fiscal', states: ['AL', 'PB', 'PE', 'RN'] },
  '5': { region: 5, name: '5ª Região Fiscal', states: ['BA', 'SE'] },
  '6': { region: 6, name: '6ª Região Fiscal', states: ['MG'] },
  '7': { region: 7, name: '7ª Região Fiscal', states: ['RJ', 'ES'] },
  '8': { region: 8, name: '8ª Região Fiscal', states: ['SP'] },
  '9': { region: 9, name: '9ª Região Fiscal', states: ['PR', 'SC'] },
  '0': { region: 10, name: '10ª Região Fiscal', states: ['RS'] }
};

export const STATE_TO_REGION_DIGIT: Record<string, string> = {
  'DF': '1', 'GO': '1', 'MT': '1', 'MS': '1', 'TO': '1',
  'AC': '2', 'AP': '2', 'AM': '2', 'PA': '2', 'RO': '2', 'RR': '2',
  'CE': '3', 'MA': '3', 'PI': '3',
  'AL': '4', 'PB': '4', 'PE': '4', 'RN': '4',
  'BA': '5', 'SE': '5',
  'MG': '6',
  'RJ': '7', 'ES': '7',
  'SP': '8',
  'PR': '9', 'SC': '9',
  'RS': '0'
};

// Random integer generator helper
export function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ==========================================
// CPF ENGINE (MODULO 11)
// ==========================================

export function calcCpfDigit(digits: number[]): number {
  const factor = digits.length + 1;
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    sum += digits[i] * (factor - i);
  }
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function formatCPF(clean: string): string {
  if (clean.length !== 11) return clean;
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function generateCPF(options?: { mask?: boolean; uf?: string }): string {
  const mask = options?.mask ?? true;
  const uf = options?.uf ?? 'any';

  const base: number[] = [];
  for (let i = 0; i < 8; i++) {
    base.push(rand(0, 9));
  }

  // 9th digit represents fiscal region
  if (uf && uf !== 'any' && uf !== 'ALL') {
    const digitStr = STATE_TO_REGION_DIGIT[uf] ?? (uf.length === 1 && !isNaN(Number(uf)) ? uf : String(rand(0, 9)));
    base.push(parseInt(digitStr, 10));
  } else {
    base.push(rand(0, 9));
  }

  const dv1 = calcCpfDigit(base);
  const dv2 = calcCpfDigit([...base, dv1]);
  const raw = [...base, dv1, dv2].join('');

  // Protect against accidental repetitive sequence
  if (/^(\d)\1{10}$/.test(raw)) {
    return generateCPF(options);
  }

  return mask ? formatCPF(raw) : raw;
}

export function validateCPF(input: string): CpfValidationResult {
  const clean = input.replace(/\D/g, '');
  const isLengthValid = clean.length === 11;
  const isRepetitive = /^(\d)\1{10}$/.test(clean);

  if (!isLengthValid) {
    return {
      isValid: false,
      type: 'CPF',
      raw: clean,
      formatted: input,
      base: clean.slice(0, 9) || '---',
      dv1Actual: clean[9] !== undefined ? Number(clean[9]) : -1,
      dv1Expected: -1,
      dv2Actual: clean[10] !== undefined ? Number(clean[10]) : -1,
      dv2Expected: -1,
      regionDigit: clean[8] || '-',
      regionName: 'Comprimento inválido (requer 11 dígitos)',
      isRepetitive,
      statusLabel: 'Comprimento Incompleto',
      errorReason: 'O CPF deve possuir exatamente 11 dígitos numéricos.'
    };
  }

  if (isRepetitive) {
    return {
      isValid: false,
      type: 'CPF',
      raw: clean,
      formatted: formatCPF(clean),
      base: clean.slice(0, 9),
      dv1Actual: Number(clean[9]),
      dv1Expected: -1,
      dv2Actual: Number(clean[10]),
      dv2Expected: -1,
      regionDigit: clean[8],
      regionName: 'Sequência bloqueada por padrão repetitivo',
      isRepetitive: true,
      statusLabel: 'Padrão Repetitivo Rejeitado',
      errorReason: 'CPFs formados por 11 dígitos iguais (ex: 111.111.111-11) são expressamente invalidados pelas regras da Receita Federal.'
    };
  }

  const base = clean.slice(0, 9).split('').map(Number);
  const dv1Expected = calcCpfDigit(base);
  const dv2Expected = calcCpfDigit([...base, dv1Expected]);
  const dv1Actual = Number(clean[9]);
  const dv2Actual = Number(clean[10]);

  const isValid = dv1Actual === dv1Expected && dv2Actual === dv2Expected;
  const regDigit = clean[8];
  const regInfo = UF_REGION_MAP[regDigit];
  const regionName = regInfo
    ? `${regInfo.states.join(', ')} (${regInfo.name})`
    : `Dígito fiscal ${regDigit}`;

  let errorReason: string | undefined;
  if (!isValid) {
    if (dv1Actual !== dv1Expected && dv2Actual !== dv2Expected) {
      errorReason = `Ambos os dígitos verificadores falharam. Esperado ${dv1Expected} e ${dv2Expected}, recebido ${dv1Actual} e ${dv2Actual}.`;
    } else if (dv1Actual !== dv1Expected) {
      errorReason = `O 1º dígito verificador está incorreto. Esperado ${dv1Expected}, recebido ${dv1Actual}.`;
    } else {
      errorReason = `O 2º dígito verificador está incorreto. Esperado ${dv2Expected}, recebido ${dv2Actual}.`;
    }
  }

  return {
    isValid,
    type: 'CPF',
    raw: clean,
    formatted: formatCPF(clean),
    base: clean.slice(0, 9),
    dv1Actual,
    dv1Expected,
    dv2Actual,
    dv2Expected,
    regionDigit: regDigit,
    regionName,
    isRepetitive: false,
    statusLabel: isValid ? 'CPF Válido (RFB)' : 'Dígito Inválido',
    errorReason
  };
}

// ==========================================
// CNPJ ENGINE (NUMERIC & ALPHANUMERIC 2026)
// ==========================================

// Official ASCII - 48 conversion mapping for Alphanumeric CNPJ
export function charToCnpjValue(char: string): number {
  const code = char.toUpperCase().charCodeAt(0);
  // '0' is 48 -> 0; '9' is 57 -> 9; 'A' is 65 -> 17; 'Z' is 90 -> 42
  return code - 48;
}

export function calcCnpjDigitFromValues(values: number[]): number {
  let sum = 0;
  let weight = 2;
  for (let i = values.length - 1; i >= 0; i--) {
    sum += values[i] * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function formatCNPJ(raw: string): string {
  const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (clean.length !== 14) return raw;
  return clean.replace(/^([A-Z0-9]{2})([A-Z0-9]{3})([A-Z0-9]{3})([A-Z0-9]{4})([0-9]{2})$/, '$1.$2.$3/$4-$5');
}

export function generateCNPJ(options?: {
  mask?: boolean;
  branchMode?: 'matriz' | 'filial' | 'large';
  alphanumeric?: boolean;
}): string {
  const mask = options?.mask ?? true;
  const branchMode = options?.branchMode ?? 'matriz';
  const isAlpha = options?.alphanumeric ?? false;

  const ALPHANUM_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const NUM_CHARS = '0123456789';

  let baseStr = '';
  for (let i = 0; i < 8; i++) {
    if (isAlpha) {
      baseStr += ALPHANUM_CHARS[rand(0, ALPHANUM_CHARS.length - 1)];
    } else {
      baseStr += NUM_CHARS[rand(0, NUM_CHARS.length - 1)];
    }
  }

  let branchStr = '0001';
  if (branchMode === 'filial') {
    branchStr = String(rand(2, 99)).padStart(4, '0');
  } else if (branchMode === 'large') {
    branchStr = String(rand(100, 999)).padStart(4, '0');
  }

  const fullBaseStr = baseStr + branchStr;
  const values = fullBaseStr.split('').map(charToCnpjValue);

  const dv1 = calcCnpjDigitFromValues(values);
  const dv2 = calcCnpjDigitFromValues([...values, dv1]);

  const raw = `${fullBaseStr}${dv1}${dv2}`;

  // Check repetitive check
  if (/^([A-Z0-9])\1{13}$/.test(raw)) {
    return generateCNPJ(options);
  }

  return mask ? formatCNPJ(raw) : raw;
}

export function validateCNPJ(input: string): CnpjValidationResult {
  const clean = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const isLengthValid = clean.length === 14;
  const isRepetitive = /^([A-Z0-9])\1{13}$/.test(clean);
  const isAlpha = /[A-Z]/.test(clean.slice(0, 12));

  if (!isLengthValid) {
    return {
      isValid: false,
      type: 'CNPJ',
      formatVariant: isAlpha ? 'ALPHANUMERIC_2026' : 'NUMERIC',
      raw: clean,
      formatted: input,
      base: clean.slice(0, 8) || '---',
      branch: clean.slice(8, 12) || '---',
      isMatriz: false,
      dv1Actual: -1,
      dv1Expected: -1,
      dv2Actual: -1,
      dv2Expected: -1,
      isRepetitive,
      statusLabel: 'Comprimento Incompleto',
      errorReason: 'O CNPJ deve possuir 14 caracteres (8 de raiz + 4 de filial/ordem + 2 dígitos verificadores).'
    };
  }

  if (isRepetitive) {
    return {
      isValid: false,
      type: 'CNPJ',
      formatVariant: isAlpha ? 'ALPHANUMERIC_2026' : 'NUMERIC',
      raw: clean,
      formatted: formatCNPJ(clean),
      base: clean.slice(0, 8),
      branch: clean.slice(8, 12),
      isMatriz: false,
      dv1Actual: Number(clean[12]) || -1,
      dv1Expected: -1,
      dv2Actual: Number(clean[13]) || -1,
      dv2Expected: -1,
      isRepetitive: true,
      statusLabel: 'Padrão Repetitivo Rejeitado',
      errorReason: 'CNPJ formado por caracteres estritamente repetitivos é rejeitado pela Receita Federal.'
    };
  }

  // The last two positions must always be digits
  if (!/^\d{2}$/.test(clean.slice(12, 14))) {
    return {
      isValid: false,
      type: 'CNPJ',
      formatVariant: isAlpha ? 'ALPHANUMERIC_2026' : 'NUMERIC',
      raw: clean,
      formatted: formatCNPJ(clean),
      base: clean.slice(0, 8),
      branch: clean.slice(8, 12),
      isMatriz: false,
      dv1Actual: -1,
      dv1Expected: -1,
      dv2Actual: -1,
      dv2Expected: -1,
      isRepetitive: false,
      statusLabel: 'DVs não numéricos',
      errorReason: 'Os dois últimos caracteres (DVs) de qualquer CNPJ, inclusive alfanumérico, devem ser dígitos de 0 a 9.'
    };
  }

  const values = clean.slice(0, 12).split('').map(charToCnpjValue);
  const dv1Expected = calcCnpjDigitFromValues(values);
  const dv2Expected = calcCnpjDigitFromValues([...values, dv1Expected]);

  const dv1Actual = Number(clean[12]);
  const dv2Actual = Number(clean[13]);

  const isValid = dv1Actual === dv1Expected && dv2Actual === dv2Expected;
  const branchPart = clean.slice(8, 12);
  const isMatriz = branchPart === '0001';

  let errorReason: string | undefined;
  if (!isValid) {
    if (dv1Actual !== dv1Expected && dv2Actual !== dv2Expected) {
      errorReason = `Ambos os dígitos verificadores falharam. Esperado ${dv1Expected} e ${dv2Expected}, recebido ${dv1Actual} e ${dv2Actual}.`;
    } else if (dv1Actual !== dv1Expected) {
      errorReason = `O 1º dígito verificador está incorreto. Esperado ${dv1Expected}, recebido ${dv1Actual}.`;
    } else {
      errorReason = `O 2º dígito verificador está incorreto. Esperado ${dv2Expected}, recebido ${dv2Actual}.`;
    }
  }

  return {
    isValid,
    type: 'CNPJ',
    formatVariant: isAlpha ? 'ALPHANUMERIC_2026' : 'NUMERIC',
    raw: clean,
    formatted: formatCNPJ(clean),
    base: clean.slice(0, 8),
    branch: branchPart,
    isMatriz,
    dv1Actual,
    dv1Expected,
    dv2Actual,
    dv2Expected,
    isRepetitive: false,
    statusLabel: isValid
      ? (isAlpha ? 'CNPJ Alfanumérico Válido (RFB 2026)' : 'CNPJ Válido (RFB)')
      : 'CNPJ Inválido',
    errorReason
  };
}

// Unified Auto-Detect Validator
export function validateDocument(input: string): ValidationResult {
  const clean = input.toUpperCase().replace(/[^A-Z0-9]/g, '');

  if (clean.length === 11 && /^\d+$/.test(clean)) {
    return validateCPF(clean);
  }

  if (clean.length === 14) {
    return validateCNPJ(clean);
  }

  return {
    isValid: false,
    type: 'UNKNOWN',
    raw: clean,
    errorReason: `Entrada com ${clean.length} caracteres. Um CPF requer 11 dígitos e um CNPJ requer 14 caracteres.`
  };
}

// ==========================================
// SYNTHETIC PERSON & COMPANY GENERATORS (QA)
// ==========================================

const FIRST_NAMES = [
  'Lucas', 'Mariana', 'Gabriel', 'Beatriz', 'Rodrigo', 'Camila', 'Rafael', 'Larissa',
  'Bruno', 'Juliana', 'Felipe', 'Fernanda', 'Diego', 'Aline', 'Thiago', 'Patricia',
  'Eduardo', 'Carolina', 'Gustavo', 'Renata', 'Leonardo', 'Vanessa', 'Matheus', 'Amanda',
  'Vinicius', 'Leticia', 'Danilo', 'Gabriela', 'Alexandre', 'Tatiana', 'Caio', 'Helena'
];

const LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
  'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes',
  'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Andrade',
  'Moreira', 'Nunes', 'Marques', 'Machado', 'Mendes', 'Freitas', 'Cardoso', 'Ramos'
];

const COMPANY_PREFIXES = [
  'Nexus', 'Alpha', 'Vortex', 'Synapse', 'Omni', 'Apex', 'Hyper', 'DataFlow', 'Optima',
  'Quantum', 'Inova', 'Cyber', 'Stratum', 'Vanguard', 'Logic', 'Zenith', 'Prisma', 'Aura'
];

const COMPANY_SECTORS = [
  'Sistemas e Tecnologia', 'Consultoria e Soluções', 'Logística e Transportes',
  'Comércio Eletrônico', 'Serviços Financeiros', 'Engenharia e Software', 'Inteligência e Dados'
];

const COMPANY_TYPES = ['LTDA', 'S.A.', 'ME', 'EPP'];

const DDD_MAP: Record<string, number> = {
  'SP': 11, 'RJ': 21, 'MG': 31, 'RS': 51, 'PR': 41, 'BA': 71,
  'PE': 81, 'CE': 85, 'DF': 61, 'GO': 62, 'SC': 48, 'ES': 27,
  'AM': 92, 'PA': 91, 'MT': 65, 'MS': 67, 'RN': 84, 'PB': 83
};

export interface SyntheticRecord {
  id: number;
  tipo: 'CPF' | 'CNPJ';
  documento: string;
  uf: string;
  nome: string;
  email: string;
  telefone: string;
}

export function generateSyntheticRecord(
  id: number,
  type: 'CPF' | 'CNPJ',
  options: { mask?: boolean; uf?: string; isAlphanumeric?: boolean }
): SyntheticRecord {
  const chosenUF = options.uf && options.uf !== 'ALL' && options.uf !== 'any'
    ? options.uf
    : ['SP', 'RJ', 'MG', 'RS', 'PR', 'BA', 'PE', 'SC', 'DF', 'CE'][rand(0, 9)];

  const ddd = DDD_MAP[chosenUF] || 11;

  if (type === 'CPF') {
    const doc = generateCPF({ mask: options.mask, uf: chosenUF });
    const fn = FIRST_NAMES[rand(0, FIRST_NAMES.length - 1)];
    const ln = LAST_NAMES[rand(0, LAST_NAMES.length - 1)];
    const cleanFn = fn.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const cleanLn = ln.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const email = `${cleanFn}.${cleanLn}${rand(10, 99)}@testvalida.dev.br`;
    const fone = `(${ddd}) 9${rand(1000, 9999)}-${rand(1000, 9999)}`;

    return {
      id,
      tipo: 'CPF',
      documento: doc,
      uf: chosenUF,
      nome: `${fn} ${ln}`,
      email,
      telefone: fone
    };
  } else {
    const doc = generateCNPJ({
      mask: options.mask,
      alphanumeric: options.isAlphanumeric
    });
    const prefix = COMPANY_PREFIXES[rand(0, COMPANY_PREFIXES.length - 1)];
    const sector = COMPANY_SECTORS[rand(0, COMPANY_SECTORS.length - 1)];
    const cType = COMPANY_TYPES[rand(0, COMPANY_TYPES.length - 1)];
    const name = `${prefix} ${sector} ${cType}`;
    const email = `fiscal@${prefix.toLowerCase()}${rand(10, 99)}.corp.dev`;
    const fone = `(${ddd}) 3${rand(100, 999)}-${rand(1000, 9999)}`;

    return {
      id,
      tipo: 'CNPJ',
      documento: doc,
      uf: chosenUF,
      nome: name,
      email,
      telefone: fone
    };
  }
}

export function generateBatch(params: {
  volume: number;
  docMode: 'CPF' | 'CNPJ' | 'MIX' | 'ALPHANUMERIC';
  mask: boolean;
  uf: string;
  enrich: boolean;
  ensureUnique: boolean;
}): SyntheticRecord[] {
  const records: SyntheticRecord[] = [];
  const seenDocs = new Set<string>();
  const limit = Math.min(Math.max(params.volume, 1), 500);

  let attempts = 0;
  while (records.length < limit && attempts < limit * 10) {
    attempts++;
    let type: 'CPF' | 'CNPJ' = 'CPF';
    let isAlpha = false;

    if (params.docMode === 'CPF') {
      type = 'CPF';
    } else if (params.docMode === 'CNPJ') {
      type = 'CNPJ';
    } else if (params.docMode === 'ALPHANUMERIC') {
      type = 'CNPJ';
      isAlpha = true;
    } else if (params.docMode === 'MIX') {
      type = Math.random() > 0.5 ? 'CPF' : 'CNPJ';
    }

    const rec = generateSyntheticRecord(records.length + 1, type, {
      mask: params.mask,
      uf: params.uf,
      isAlphanumeric: isAlpha
    });

    if (params.ensureUnique && seenDocs.has(rec.documento)) {
      continue;
    }

    seenDocs.add(rec.documento);
    if (!params.enrich) {
      rec.nome = '-';
      rec.email = '-';
      rec.telefone = '-';
    }
    records.push(rec);
  }

  return records;
}

// Batch Exporters
export function exportToCSV(data: SyntheticRecord[]): string {
  const header = 'id,tipo,documento,uf,nome,email,telefone\n';
  const rows = data.map(r =>
    `"${r.id}","${r.tipo}","${r.documento}","${r.uf}","${r.nome.replace(/"/g, '""')}","${r.email}","${r.telefone}"`
  ).join('\n');
  return header + rows;
}

export function exportToSQL(data: SyntheticRecord[]): string {
  const rows = data.map(r =>
    `  (${r.id}, '${r.tipo}', '${r.documento}', '${r.uf}', '${r.nome.replace(/'/g, "''")}', '${r.email}', '${r.telefone}')`
  ).join(',\n');
  return `CREATE TABLE IF NOT EXISTS massa_testes (
  id INT PRIMARY KEY,
  tipo VARCHAR(10),
  documento VARCHAR(20),
  uf VARCHAR(2),
  nome VARCHAR(150),
  email VARCHAR(150),
  telefone VARCHAR(20)
);

INSERT INTO massa_testes (id, tipo, documento, uf, nome, email, telefone) VALUES
${rows};`;
}

export function exportToTXT(data: SyntheticRecord[]): string {
  return data.map(r => r.documento).join('\n');
}

export function exportToJSON(data: SyntheticRecord[]): string {
  return JSON.stringify(data, null, 2);
}
