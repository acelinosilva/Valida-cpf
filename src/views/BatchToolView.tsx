/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  RotateCcw, 
  Table, 
  Code, 
  Copy, 
  Check, 
  Download, 
  CheckCircle2, 
  Bolt, 
  ShieldCheck, 
  Lock, 
  Activity,
  Layers,
  FileSpreadsheet,
  FileCode,
  FileText
} from 'lucide-react';
import { 
  generateBatch, 
  SyntheticRecord, 
  exportToCSV, 
  exportToSQL, 
  exportToTXT, 
  exportToJSON 
} from '../utils/engine';
import { EthicalDisclaimerBanner } from '../components/EthicalDisclaimerBanner';

interface BatchToolViewProps {
  onCopyNotice: (msg: string) => void;
  onOpenDisclaimer: () => void;
}

export const BatchToolView: React.FC<BatchToolViewProps> = ({ onCopyNotice, onOpenDisclaimer }) => {
  // Config state
  const [volume, setVolume] = useState<number>(25);
  const [docMode, setDocMode] = useState<'CPF' | 'CNPJ' | 'MIX' | 'ALPHANUMERIC'>('CPF');
  const [selectedUF, setSelectedUF] = useState<string>('ALL');
  const [withMask, setWithMask] = useState<boolean>(true);
  const [enrich, setEnrich] = useState<boolean>(true);
  const [ensureUnique, setEnsureUnique] = useState<boolean>(true);
  const [format, setFormat] = useState<'json' | 'csv' | 'sql' | 'txt'>('json');

  // View state
  const [viewTab, setViewTab] = useState<'table' | 'raw'>('table');
  const [records, setRecords] = useState<SyntheticRecord[]>([]);
  const [copiedBatch, setCopiedBatch] = useState<boolean>(false);
  const [generationTimeMs, setGenerationTimeMs] = useState<number>(1.2);
  const [activeSnippet, setActiveSnippet] = useState<'playwright' | 'cypress' | 'k6' | 'jest' | 'python'>('playwright');

  // Batch Generation Logic
  const handleGenerate = () => {
    const t0 = performance.now();
    const batch = generateBatch({
      volume,
      docMode,
      mask: withMask,
      uf: selectedUF,
      enrich,
      ensureUnique
    });
    const t1 = performance.now();
    setRecords(batch);
    setGenerationTimeMs(Math.max(0.1, Number((t1 - t0).toFixed(2))));
  };

  // Generate on mount or reset
  useEffect(() => {
    handleGenerate();
  }, []);

  // Reset to defaults
  const handleReset = () => {
    setVolume(25);
    setDocMode('CPF');
    setSelectedUF('ALL');
    setWithMask(true);
    setEnrich(true);
    setEnsureUnique(true);
    setFormat('json');
    handleGenerate();
    onCopyNotice('Configurações redefinidas para o padrão.');
  };

  // Raw Content Generator
  const rawContent = useMemo(() => {
    switch (format) {
      case 'json':
        return exportToJSON(records);
      case 'csv':
        return exportToCSV(records);
      case 'sql':
        return exportToSQL(records);
      case 'txt':
        return exportToTXT(records);
      default:
        return '';
    }
  }, [records, format]);

  // Copy All Raw
  const handleCopyRaw = () => {
    navigator.clipboard.writeText(rawContent);
    setCopiedBatch(true);
    onCopyNotice(`Massa completa com ${records.length} registros copiada!`);
    setTimeout(() => setCopiedBatch(false), 1800);
  };

  // Download File
  const handleDownload = () => {
    const mimeTypes: Record<string, string> = {
      json: 'application/json',
      csv: 'text/csv',
      sql: 'application/sql',
      txt: 'text/plain'
    };

    const blob = new Blob([rawContent], { type: mimeTypes[format] || 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `validadev_massa_${records.length}docs_${Date.now()}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
    onCopyNotice(`Arquivo .${format} descarregado com sucesso!`);
  };

  // Automation Snippets templates
  const snippetTemplates = {
    playwright: `// Playwright Automation Suite (Testes E2E)
import { test, expect } from '@playwright/test';
import dataset from './validadev_massa.json';

test.describe('Validação Transacional em Lote - ValidaDev', () => {
  for (const record of dataset) {
    test(\`Cadastrando \${record.tipo}: \${record.documento} (\${record.nome})\`, async ({ page }) => {
      await page.goto('/checkout');
      await page.fill('#docInput', record.documento);
      await page.fill('#nomeInput', record.nome);
      await page.fill('#emailInput', record.email);
      await page.click('#submitBtn');
      await expect(page.locator('.status-sucesso')).toBeVisible();
    });
  }
});`,
    cypress: `// Cypress E2E Spec
describe('Carga Transacional em Massa', () => {
  before(() => {
    cy.fixture('validadev_massa.json').as('records');
  });

  it('Valida inserção de lote sem rejeição de DV', function() {
    this.records.forEach((record) => {
      cy.visit('/onboarding');
      cy.get('[data-cy="documento"]').clear().type(record.documento);
      cy.get('[data-cy="nome"]').clear().type(record.nome);
      cy.get('[data-cy="btn-avancar"]').click();
      cy.contains('Identificação confirmada').should('exist');
    });
  });
});`,
    k6: `// k6 Performance Load Script (Stress Test)
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// Carrega a massa gerada pelo ValidaDev
const data = new SharedArray('massa', () => JSON.parse(open('./validadev_massa.json')));

export const options = {
  vus: 50,
  duration: '30s',
};

export default function () {
  const item = data[Math.floor(Math.random() * data.length)];
  const payload = JSON.stringify({
    documento: item.documento,
    tipo: item.tipo,
    uf: item.uf
  });

  const res = http.post('https://api.suaempresa.com.br/v1/auth/doc', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(0.1);
}`,
    jest: `// Jest / Node.js Integration Test
const { validateDocument } = require('@validadev/core');
const dataset = require('./validadev_massa.json');

describe('Suite de Integridade Algorítmica da Massa RFB', () => {
  test.each(dataset)('Garante integridade matemática do documento $documento ($tipo)', (record) => {
    const result = validateDocument(record.documento);
    expect(result.isValid).toBe(true);
    expect(result.type).toBe(record.tipo);
  });
});`,
    python: `# Python Pytest / Requests Script
import json
import pytest
import requests

with open('validadev_massa.json') as f:
    dataset = json.load(f)

@pytest.mark.parametrize('record', dataset)
def test_validar_documento(record):
    response = requests.post(
        'https://api.empresa.com.br/v1/clientes',
        json={
            'documento': record['documento'],
            'nome': record['nome'],
            'email': record['email']
        }
    )
    assert response.status_code == 201
`
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 gap-6">
      {/* Permanent Ethical Disclaimer */}
      <EthicalDisclaimerBanner onOpenDetails={onOpenDisclaimer} />

      {/* Header Context Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#23293c]/50">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#191f31] border border-[#3c4a42]/60 flex items-center justify-center text-[#4edea3] shadow-[0_0_20px_rgba(78,222,163,0.15)] shrink-0">
            <Database className="w-6 h-6 text-[#4edea3]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-sans text-xl sm:text-2xl font-semibold text-[#dce1fb] tracking-tight">
                Geração em Lote e Massa Sintética
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#4edea3]/10 text-[#4edea3] font-mono text-[10px] font-semibold uppercase flex items-center gap-1 border border-[#4edea3]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                V3 Engine
              </span>
            </div>
            <p className="font-sans text-xs text-[#bbcabf] mt-0.5">
              Carga de validação estocástica para pipelines de CI/CD, k6, Cypress e migrações SQL sem risco LGPD.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-[#151b2d] border border-[#23293c] flex items-center gap-2 font-mono text-xs text-[#bbcabf]">
            <span className="w-2 h-2 rounded-full bg-[#4cd7f6]"></span>
            <span>
              Latência: <strong className="text-[#4edea3]">{generationTimeMs}ms</strong> / {records.length} docs
            </span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-[#23293c] hover:bg-[#33394c] text-[#bbcabf] hover:text-[#dce1fb] text-xs font-medium transition-all flex items-center gap-1.5 border border-[#3c4a42]/40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetar</span>
          </button>
        </div>
      </div>

      {/* 2-Columns Workspace Grid: Configurator (5 cols) & Viewport (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Configurator Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5 bg-[#151b2d] p-5 sm:p-6 rounded-xl border border-[#23293c] shadow-lg">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#4cd7f6] font-semibold">
              1. Parâmetros de Carga
            </span>
            <span className="font-mono text-xs text-[#bbcabf] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
              Algoritmo Mod 11
            </span>
          </div>

          {/* Volume Slider & Counter */}
          <div className="bg-[#191f31] p-3.5 sm:p-4 rounded-lg border border-[#23293c] flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label htmlFor="inputVolume" className="text-xs text-[#dce1fb] font-medium">
                Volume de Registros
              </label>
              <div className="flex items-center gap-1 bg-[#070d1f] px-2 py-0.5 rounded border border-[#3c4a42]/40">
                <input
                  id="inputVolume"
                  type="number"
                  min={1}
                  max={500}
                  value={volume}
                  onChange={(e) => setVolume(Math.min(500, Math.max(1, Number(e.target.value) || 1)))}
                  className="bg-transparent text-right font-mono text-xs text-[#4edea3] w-12 outline-none font-semibold"
                />
                <span className="font-mono text-xs text-[#86948a]">docs</span>
              </div>
            </div>

            <input
              type="range"
              min={1}
              max={500}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-1.5 bg-[#2e3447] rounded-lg appearance-none cursor-pointer accent-[#4edea3]"
            />

            <div className="flex justify-between font-mono text-[10px] text-[#86948a]">
              <span>1</span>
              <span>100</span>
              <span>250</span>
              <span>500 max</span>
            </div>
          </div>

          {/* Document Type Selector Segment */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#dce1fb] font-medium">Tipologia Documental</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-[#191f31] p-1 rounded-lg border border-[#23293c]">
              <button
                type="button"
                onClick={() => setDocMode('CPF')}
                className={`py-1.5 px-2 rounded text-center font-mono text-xs transition-all ${
                  docMode === 'CPF'
                    ? 'bg-[#10b981] text-[#003824] font-semibold shadow-sm'
                    : 'text-[#bbcabf] hover:text-[#dce1fb]'
                }`}
              >
                Apenas CPF
              </button>
              <button
                type="button"
                onClick={() => setDocMode('CNPJ')}
                className={`py-1.5 px-2 rounded text-center font-mono text-xs transition-all ${
                  docMode === 'CNPJ'
                    ? 'bg-[#10b981] text-[#003824] font-semibold shadow-sm'
                    : 'text-[#bbcabf] hover:text-[#dce1fb]'
                }`}
              >
                Apenas CNPJ
              </button>
              <button
                type="button"
                onClick={() => setDocMode('MIX')}
                className={`py-1.5 px-2 rounded text-center font-mono text-xs transition-all ${
                  docMode === 'MIX'
                    ? 'bg-[#10b981] text-[#003824] font-semibold shadow-sm'
                    : 'text-[#bbcabf] hover:text-[#dce1fb]'
                }`}
              >
                Misto 50/50
              </button>
              <button
                type="button"
                onClick={() => setDocMode('ALPHANUMERIC')}
                className={`py-1.5 px-2 rounded text-center font-mono text-xs transition-all ${
                  docMode === 'ALPHANUMERIC'
                    ? 'bg-[#10b981] text-[#003824] font-semibold shadow-sm'
                    : 'text-[#bbcabf] hover:text-[#dce1fb]'
                }`}
              >
                CNPJ Alfa
              </button>
            </div>
          </div>

          {/* Regional UF Allocation */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="selectBatchUF" className="text-xs text-[#dce1fb] font-medium">
                Origem Fiscal (UF Região Fiscal)
              </label>
              <span className="font-mono text-[10px] text-[#bbcabf]">9º Dígito</span>
            </div>
            <select
              id="selectBatchUF"
              value={selectedUF}
              onChange={(e) => setSelectedUF(e.target.value)}
              className="w-full bg-[#191f31] px-3 py-2 rounded-lg text-[#dce1fb] font-sans text-xs outline-none border border-[#23293c] focus:border-[#4cd7f6] cursor-pointer"
            >
              <option value="ALL">Aleatório (Todo o Brasil)</option>
              <option value="SP">SP - São Paulo (8ª Região)</option>
              <option value="RJ">RJ / ES (7ª Região)</option>
              <option value="MG">MG - Minas Gerais (6ª Região)</option>
              <option value="RS">RS - Rio Grande do Sul (10ª Região)</option>
              <option value="PR">PR / SC (9ª Região)</option>
              <option value="BA">BA / SE (5ª Região)</option>
              <option value="PE">PE / RN / PB / AL (4ª Região)</option>
              <option value="CE">CE / MA / PI (3ª Região)</option>
              <option value="DF">DF / GO / MT / MS / TO (1ª Região)</option>
            </select>
          </div>

          {/* Mask & Enrichment Toggles */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#dce1fb] font-medium">Estrutura e Enriquecimento</label>
            
            {/* Mask */}
            <label className="flex items-center justify-between p-3 rounded-lg bg-[#191f31] border border-[#23293c] cursor-pointer hover:bg-[#23293c]/50 transition-colors">
              <div className="flex items-center gap-2.5">
                <Table className="w-4 h-4 text-[#4cd7f6]" />
                <div className="flex flex-col">
                  <span className="text-xs text-[#dce1fb] font-medium">Máscara / Pontuação</span>
                  <span className="font-mono text-[10px] text-[#86948a]">Ex: 000.000.000-00</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={withMask}
                onChange={(e) => setWithMask(e.target.checked)}
                className="w-4 h-4 accent-[#4edea3] rounded cursor-pointer"
              />
            </label>

            {/* Enrichment */}
            <label className="flex items-center justify-between p-3 rounded-lg bg-[#191f31] border border-[#23293c] cursor-pointer hover:bg-[#23293c]/50 transition-colors">
              <div className="flex items-center gap-2.5">
                <Bolt className="w-4 h-4 text-[#4edea3]" />
                <div className="flex flex-col">
                  <span className="text-xs text-[#dce1fb] font-medium">Perfil Sintético Completo</span>
                  <span className="font-mono text-[10px] text-[#86948a]">Nome, E-mail corporativo, Tel celular</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={enrich}
                onChange={(e) => setEnrich(e.target.checked)}
                className="w-4 h-4 accent-[#4edea3] rounded cursor-pointer"
              />
            </label>

            {/* Uniqueness */}
            <label className="flex items-center justify-between p-3 rounded-lg bg-[#191f31] border border-[#23293c] cursor-pointer hover:bg-[#23293c]/50 transition-colors">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#c0c1ff]" />
                <div className="flex flex-col">
                  <span className="text-xs text-[#dce1fb] font-medium">Validação Pré-Emissão</span>
                  <span className="font-mono text-[10px] text-[#86948a]">Check de unicidade estrita dentro do lote</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={ensureUnique}
                onChange={(e) => setEnsureUnique(e.target.checked)}
                className="w-4 h-4 accent-[#4edea3] rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Format Preset Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#dce1fb] font-medium">Formato de Saída</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['json', 'csv', 'sql', 'txt'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  className={`py-2 rounded font-mono text-xs text-center uppercase transition-all ${
                    format === fmt
                      ? 'bg-[#23293c] text-[#4edea3] font-semibold border border-[#4edea3]/40'
                      : 'bg-[#191f31] text-[#bbcabf] hover:text-[#dce1fb] border border-[#23293c]'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleGenerate}
            className="w-full py-3 px-4 rounded-xl bg-[#4edea3] text-[#003824] font-sans text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#10b981] active:scale-[0.99] transition-all shadow-[0_0_24px_rgba(78,222,163,0.35)] mt-2"
          >
            <Bolt className="w-4 h-4 text-[#003824]" />
            <span>Gerar Massa de Testes</span>
          </button>
        </div>

        {/* Right Output & Telemetry Viewport (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Main Viewport Box */}
          <div className="bg-[#151b2d] rounded-xl border border-[#23293c] flex flex-col overflow-hidden shadow-xl">
            {/* Top Viewport Control Bar */}
            <div className="bg-[#191f31] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-[#23293c]">
              <div className="flex items-center gap-1 bg-[#070d1f] p-1 rounded-lg border border-[#23293c]">
                <button
                  type="button"
                  onClick={() => setViewTab('table')}
                  className={`px-3 py-1 rounded font-mono text-xs flex items-center gap-1.5 transition-all ${
                    viewTab === 'table'
                      ? 'bg-[#191f31] text-[#4edea3] font-semibold'
                      : 'text-[#bbcabf] hover:text-[#dce1fb]'
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Tabela ({records.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewTab('raw')}
                  className={`px-3 py-1 rounded font-mono text-xs flex items-center gap-1.5 transition-all ${
                    viewTab === 'raw'
                      ? 'bg-[#191f31] text-[#4edea3] font-semibold'
                      : 'text-[#bbcabf] hover:text-[#dce1fb]'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Código Raw</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#4edea3] hidden sm:inline-flex items-center gap-1 mr-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4edea3]" />
                  <span>Pronto</span>
                </span>

                <button
                  type="button"
                  onClick={handleCopyRaw}
                  className="px-3 py-1.5 rounded-lg bg-[#23293c] hover:bg-[#33394c] text-[#4cd7f6] font-mono text-xs transition-all flex items-center gap-1.5 border border-[#3c4a42]/40 shadow-sm"
                >
                  {copiedBatch ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#4edea3]" />
                      <span className="text-[#4edea3]">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-3 py-1.5 rounded-lg bg-[#10b981] hover:bg-[#4edea3] text-[#003824] font-mono text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar .{format}</span>
                </button>
              </div>
            </div>

            {/* View 1: Interactive Table */}
            {viewTab === 'table' ? (
              <div className="p-3 overflow-x-auto max-h-[460px]">
                <table className="w-full text-left font-sans text-xs text-[#dce1fb] border-collapse">
                  <thead>
                    <tr className="font-mono text-[10px] text-[#bbcabf] uppercase bg-[#191f31]/70 border-b border-[#23293c]">
                      <th className="py-2.5 px-3 rounded-l">#</th>
                      <th className="py-2.5 px-3">Tipo</th>
                      <th className="py-2.5 px-3">Documento</th>
                      <th className="py-2.5 px-3">UF</th>
                      <th className="py-2.5 px-3">Nome Sintético</th>
                      <th className="py-2.5 px-3 rounded-r text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#23293c]/50 font-mono text-xs">
                    {records.map((row) => (
                      <tr key={row.id} className="hover:bg-[#191f31]/50 transition-colors">
                        <td className="py-2 px-3 text-[#86948a]">{row.id}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-mono font-semibold ${
                              row.tipo === 'CPF'
                                ? 'bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/30'
                                : 'bg-[#4cd7f6]/10 text-[#4cd7f6] border border-[#4cd7f6]/30'
                            }`}
                          >
                            {row.tipo}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-[#dce1fb] font-medium select-all">
                          {row.documento}
                        </td>
                        <td className="py-2 px-3 text-[#bbcabf]">{row.uf}</td>
                        <td className="py-2 px-3 text-[#bbcabf] truncate max-w-[160px] font-sans">
                          {row.nome}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(row.documento);
                              onCopyNotice(`Documento ${row.documento} copiado!`);
                            }}
                            className="text-[#4cd7f6] hover:text-[#4edea3] hover:underline font-mono text-[11px]"
                          >
                            Copiar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* View 2: Raw Code Container */
              <div className="p-4 max-h-[460px] overflow-auto bg-[#070d1f]">
                <pre className="font-mono text-xs text-[#4cd7f6] leading-relaxed select-all">
                  <code>{rawContent}</code>
                </pre>
              </div>
            )}

            {/* Viewport Footer Telemetry */}
            <div className="px-4 py-2 bg-[#070d1f] border-t border-[#23293c] flex items-center justify-between text-[#86948a] font-mono text-[11px]">
              <div className="flex items-center gap-4">
                <span>Encoding: <strong className="text-[#dce1fb]">UTF-8</strong></span>
                <span>
                  Estrutura: <strong className="text-[#dce1fb] uppercase">{format}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[#4edea3]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Client-Side Engine</span>
              </div>
            </div>
          </div>

          {/* Automation Frameworks Code Snippets */}
          <div className="bg-[#151b2d] p-5 rounded-xl border border-[#23293c] flex flex-col gap-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#c0c1ff]" />
                <h2 className="font-sans text-sm font-semibold text-[#dce1fb]">
                  Consumir nos Frameworks de Automação
                </h2>
              </div>
              <span className="font-mono text-[10px] text-[#4cd7f6] uppercase font-semibold">
                Zero Setup
              </span>
            </div>

            <div className="flex flex-wrap gap-1 bg-[#191f31] p-1 rounded-lg border border-[#23293c]">
              {(['playwright', 'cypress', 'k6', 'jest', 'python'] as const).map((snip) => (
                <button
                  key={snip}
                  type="button"
                  onClick={() => setActiveSnippet(snip)}
                  className={`py-1 px-3 rounded font-mono text-xs transition-all ${
                    activeSnippet === snip
                      ? 'bg-[#23293c] text-[#4edea3] font-semibold border border-[#3c4a42]/50'
                      : 'text-[#bbcabf] hover:text-[#dce1fb]'
                  }`}
                >
                  {snip === 'k6' ? 'k6 Load Test' : snip.charAt(0).toUpperCase() + snip.slice(1)}
                </button>
              ))}
            </div>

            <div className="bg-[#070d1f] p-3.5 rounded-lg border border-[#23293c] overflow-x-auto relative group">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(snippetTemplates[activeSnippet]);
                  onCopyNotice(`Snippet para ${activeSnippet} copiado!`);
                }}
                className="absolute top-2.5 right-2.5 p-1.5 rounded bg-[#191f31] hover:bg-[#23293c] text-[#bbcabf] hover:text-[#4edea3] transition-colors border border-[#3c4a42]/40"
                title="Copiar script"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <pre className="font-mono text-xs text-[#dce1fb] leading-relaxed">
                <code>{snippetTemplates[activeSnippet]}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance & Security LGPD Grid (Screen 2 bottom) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
        {/* Card 1 */}
        <div className="bg-[#151b2d] p-5 rounded-xl border border-[#23293c] flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#4edea3]">
            <ShieldCheck className="w-5 h-5 text-[#4edea3]" />
            <h3 className="font-sans text-sm font-semibold text-[#dce1fb]">
              100% Em Conformidade LGPD
            </h3>
          </div>
          <p className="text-xs text-[#bbcabf] leading-relaxed">
            Nenhum documento gerado pertence a cidadãos ou entidades reais. Algoritmos sintéticos respeitam a lógica da Receita Federal sem colisão ou vazamento de bases produtivas.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#151b2d] p-5 rounded-xl border border-[#23293c] flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#4cd7f6]">
            <Lock className="w-5 h-5 text-[#4cd7f6]" />
            <h3 className="font-sans text-sm font-semibold text-[#dce1fb]">
              Execução em Sandbox Local
            </h3>
          </div>
          <p className="text-xs text-[#bbcabf] leading-relaxed">
            A geração opera inteiramente no browser via V8 Engine. Seus dados e configurações não trafegam em nenhum servidor externo ou persistência em banco.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-[#151b2d] p-5 rounded-xl border border-[#23293c] flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#c0c1ff]">
            <Activity className="w-5 h-5 text-[#c0c1ff]" />
            <h3 className="font-sans text-sm font-semibold text-[#dce1fb]">
              Performance para Carga k6
            </h3>
          </div>
          <p className="text-xs text-[#bbcabf] leading-relaxed">
            Exporte diretamente no formato JSON Array ou CSV para preencher virtual users em testes de estresse de gateways de pagamento e autenticações governamentais.
          </p>
        </div>
      </div>
    </div>
  );
};
