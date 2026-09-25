/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  Copy, 
  Check, 
  RefreshCw, 
  Layers, 
  Trash2, 
  ClipboardPaste, 
  Delete, 
  Terminal, 
  Calculator, 
  Keyboard, 
  Info, 
  AlertCircle,
  Cpu,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  MousePointerClick,
  FileCheck2,
  Lock
} from 'lucide-react';
import { 
  generateCPF, 
  generateCNPJ, 
  validateCPF, 
  validateCNPJ, 
  formatCPF, 
  formatCNPJ,
  CpfValidationResult,
  CnpjValidationResult,
  UF_REGION_MAP
} from '../utils/engine';
import { EthicalDisclaimerBanner } from '../components/EthicalDisclaimerBanner';

interface HistoryItem {
  id: string;
  doc: string;
  type: 'CPF' | 'CNPJ' | 'CNPJ ALFA';
  timestamp: string;
}

interface MainToolViewProps {
  onCopyNotice: (msg: string) => void;
  onOpenDisclaimer: () => void;
  onNavigateToBatch: () => void;
}

export const MainToolView: React.FC<MainToolViewProps> = ({
  onCopyNotice,
  onOpenDisclaimer,
  onNavigateToBatch
}) => {
  // Generator State
  const [docType, setDocType] = useState<'CPF' | 'CNPJ'>('CPF');
  const [withMask, setWithMask] = useState(true);
  const [cpfUF, setCpfUF] = useState('any');
  const [cnpjBranch, setCnpjBranch] = useState<'matriz' | 'filial' | 'large'>('matriz');
  const [isAlphanumeric, setIsAlphanumeric] = useState(false);
  const [currentGenerated, setCurrentGenerated] = useState('');
  const [copiedRecently, setCopiedRecently] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Validator State
  const [validatorInput, setValidatorInput] = useState('');
  const [cpfResult, setCpfResult] = useState<CpfValidationResult | null>(null);
  const [cnpjResult, setCnpjResult] = useState<CnpjValidationResult | null>(null);
  const [detectedType, setDetectedType] = useState<'CPF' | 'CNPJ' | 'NONE'>('NONE');
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({
    'home-faq-1': true,
    'home-faq-2': false,
    'home-faq-3': false,
    'home-faq-4': false,
    'home-faq-5': false,
    'home-faq-6': false
  });

  const toggleHomeFaq = (id: string) => {
    setOpenFaqIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Generator Function
  const handleGenerate = useCallback(() => {
    let result = '';
    let typeLabel: 'CPF' | 'CNPJ' | 'CNPJ ALFA' = 'CPF';

    if (docType === 'CPF') {
      result = generateCPF({ mask: withMask, uf: cpfUF });
      typeLabel = 'CPF';
    } else {
      result = generateCNPJ({
        mask: withMask,
        branchMode: cnpjBranch,
        alphanumeric: isAlphanumeric
      });
      typeLabel = isAlphanumeric ? 'CNPJ ALFA' : 'CNPJ';
    }

    setCurrentGenerated(result);

    // Add to history (max 6 items)
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setHistory((prev) => [
      { id: `${Date.now()}-${Math.random()}`, doc: result, type: typeLabel, timestamp: timeStr },
      ...prev.slice(0, 5)
    ]);
  }, [docType, withMask, cpfUF, cnpjBranch, isAlphanumeric]);

  // Initial generation
  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  // Keyboard shortcut listener (Space to generate, Alt+C to copy)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger if typing inside input, textarea, or select
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleGenerate();
      } else if (e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        if (currentGenerated) {
          navigator.clipboard.writeText(currentGenerated);
          setCopiedRecently(true);
          onCopyNotice(`Documento ${currentGenerated} copiado!`);
          setTimeout(() => setCopiedRecently(false), 1800);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGenerate, currentGenerated, onCopyNotice]);

  // Copy Main Generated
  const handleCopyGenerated = () => {
    if (!currentGenerated) return;
    navigator.clipboard.writeText(currentGenerated);
    setCopiedRecently(true);
    onCopyNotice(`Documento ${currentGenerated} copiado!`);
    setTimeout(() => setCopiedRecently(false), 1800);
  };

  // Generate 5 in batch
  const handleGenerateBatch5 = () => {
    const list: string[] = [];
    for (let i = 0; i < 5; i++) {
      if (docType === 'CPF') {
        list.push(generateCPF({ mask: withMask, uf: cpfUF }));
      } else {
        list.push(generateCNPJ({ mask: withMask, branchMode: cnpjBranch, alphanumeric: isAlphanumeric }));
      }
    }
    const joined = list.join('\n');
    navigator.clipboard.writeText(joined);
    onCopyNotice('5 documentos gerados e copiados para a área de transferência!');
  };

  // Live Validation Handler
  const handleValidationChange = (text: string) => {
    setValidatorInput(text);
    const clean = text.toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (!clean) {
      setDetectedType('NONE');
      setCpfResult(null);
      setCnpjResult(null);
      return;
    }

    if (clean.length === 11 && /^\d+$/.test(clean)) {
      setDetectedType('CPF');
      setCpfResult(validateCPF(clean));
      setCnpjResult(null);
    } else if (clean.length === 14) {
      setDetectedType('CNPJ');
      setCnpjResult(validateCNPJ(clean));
      setCpfResult(null);
    } else {
      setDetectedType('NONE');
      setCpfResult(null);
      setCnpjResult(null);
    }
  };

  // Quick Samples
  const handleQuickSample = (type: 'valid-cpf' | 'valid-cnpj' | 'invalid-dv' | 'valid-alpha') => {
    let sample = '';
    if (type === 'valid-cpf') {
      sample = formatCPF(generateCPF({ uf: '8' })); // SP
    } else if (type === 'valid-cnpj') {
      sample = formatCNPJ(generateCNPJ({ branchMode: 'matriz' }));
    } else if (type === 'invalid-dv') {
      const raw = generateCPF({ mask: false });
      // Corrupt the last digit
      const lastDigit = Number(raw[10]);
      const brokenLast = (lastDigit + 1) % 10;
      sample = formatCPF(raw.slice(0, 10) + brokenLast);
    } else if (type === 'valid-alpha') {
      sample = formatCNPJ(generateCNPJ({ alphanumeric: true }));
    }
    setValidatorInput(sample);
    handleValidationChange(sample);
  };

  // Paste from Clipboard
  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setValidatorInput(text);
      handleValidationChange(text);
      onCopyNotice('Texto colado da área de transferência');
    } catch {
      onCopyNotice('Não foi possível acessar a área de transferência diretamente.');
    }
  };

  const handleClearValidator = () => {
    setValidatorInput('');
    handleValidationChange('');
  };

  // Clean raw digits for count
  const cleanLen = validatorInput.toUpperCase().replace(/[^A-Z0-9]/g, '').length;

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Permanent Ethical Disclaimer Banner required by PRD */}
      <EthicalDisclaimerBanner onOpenDetails={onOpenDisclaimer} />

      {/* Hero / Context Header Bar */}
      <div className="pb-6 sm:pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#23293c]/50">
        <div className="max-w-3xl">
          <h1 className="font-sans text-2xl sm:text-3xl md:text-4xl text-[#dce1fb] font-semibold tracking-tight leading-tight">
            Gerador e Validador de CPF e CNPJ <span className="text-[#4edea3]">Atualizado</span>
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#bbcabf] mt-2 leading-relaxed">
            Crie números válidos para preencher cadastros e formulários de teste ou confira se um CPF ou CNPJ foi digitado corretamente. É 100% gratuito, seguro e muito simples de usar: clique no botão para gerar e copiar um número na hora, ou cole qualquer documento na caixa ao lado para descobrir se ele está certo.
          </p>

          {/* Guia Rápido e Descomplicado para Usuários */}
          <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#151b2d] border border-[#23293c]/70 text-[#cbd5e1]">
              <span className="w-5 h-5 rounded-full bg-[#4edea3]/10 text-[#4edea3] flex items-center justify-center font-bold text-[11px] shrink-0 border border-[#4edea3]/30">1</span>
              <span><strong>Para gerar:</strong> Escolha CPF ou CNPJ e clique em <em>Gerar Novo Documento</em>.</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#151b2d] border border-[#23293c]/70 text-[#cbd5e1]">
              <span className="w-5 h-5 rounded-full bg-[#4cd7f6]/10 text-[#4cd7f6] flex items-center justify-center font-bold text-[11px] shrink-0 border border-[#4cd7f6]/30">2</span>
              <span><strong>Para testar:</strong> Cole o número na caixa da direita e veja se ele é válido na hora.</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-start lg:self-end shrink-0">
          <div className="px-3 py-1.5 rounded-lg bg-[#23293c] text-[#bbcabf] font-mono text-xs flex items-center gap-2 border border-[#3c4a42]/40 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
            <span>Direto no seu Navegador</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#191f31] text-[#4cd7f6] font-mono text-xs flex items-center gap-2 border border-[#3c4a42]/40 shadow-sm">
            <kbd className="px-1.5 py-0.5 rounded bg-[#070d1f] text-[#4cd7f6] text-[10px] border border-[#3c4a42]/40">
              Espaço
            </kbd>
            <span className="text-[#bbcabf] font-sans text-xs">Gerar Novo</span>
          </div>
        </div>
      </div>

      {/* Main Bento Grid: Generator (Left) & Validator (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* LEFT COLUMN: GENERATOR (lg:col-span-6) */}
        <section className="lg:col-span-6 flex flex-col gap-5 bg-[#191f31] p-5 sm:p-6 rounded-xl border border-[#23293c] shadow-xl">
          {/* Header & Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#4edea3]/10 border border-[#4edea3]/30 flex items-center justify-center text-[#4edea3]">
                <Zap className="w-4 h-4 text-[#4edea3]" />
              </div>
              <div>
                <h2 className="font-sans text-base font-semibold text-[#dce1fb]">Gerador Instantâneo</h2>
                <p className="font-sans text-xs text-[#bbcabf]">Emissão com pesos oficiais e DVs calculados</p>
              </div>
            </div>

            {/* Document Switcher Pill */}
            <div className="inline-flex p-1 rounded-lg bg-[#070d1f] border border-[#23293c]">
              <button
                type="button"
                onClick={() => setDocType('CPF')}
                className={`px-3 py-1 rounded font-mono text-xs font-semibold transition-all ${
                  docType === 'CPF'
                    ? 'bg-[#10b981] text-[#003824] shadow-sm'
                    : 'text-[#bbcabf] hover:text-[#dce1fb]'
                }`}
              >
                CPF PESSOA
              </button>
              <button
                type="button"
                onClick={() => setDocType('CNPJ')}
                className={`px-3 py-1 rounded font-mono text-xs font-semibold transition-all ${
                  docType === 'CNPJ'
                    ? 'bg-[#10b981] text-[#003824] shadow-sm'
                    : 'text-[#bbcabf] hover:text-[#dce1fb]'
                }`}
              >
                CNPJ EMPRESA
              </button>
            </div>
          </div>

          {/* Primary Output Display Box */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#070d1f] border border-[#23293c]/80 flex flex-col gap-3 relative shadow-inner group">
            <div className="flex items-center justify-between text-[#bbcabf] font-mono text-xs">
              <span className="flex items-center gap-1.5 text-[#4edea3]">
                <Cpu className="w-3.5 h-3.5 text-[#4edea3]" />
                <span className="font-semibold">
                  {docType === 'CPF'
                    ? 'CPF PESSOA FÍSICA'
                    : isAlphanumeric
                    ? 'CNPJ ALFANUMÉRICO (2026)'
                    : 'CNPJ PESSOA JURÍDICA'}
                </span>
              </span>
              <span className="font-mono text-[10px] text-[#4cd7f6] uppercase tracking-wider">
                ENTROPIA MÁXIMA
              </span>
            </div>

            {/* Number Display */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2 border-y border-[#23293c]/40">
              <span className="font-mono text-2xl sm:text-3xl tracking-wider text-[#4edea3] font-semibold select-all truncate drop-shadow-[0_0_12px_rgba(78,222,163,0.25)]">
                {currentGenerated || '000.000.000-00'}
              </span>

              <button
                type="button"
                onClick={handleCopyGenerated}
                className="px-3.5 py-2 rounded-lg bg-[#23293c] hover:bg-[#33394c] text-[#4cd7f6] hover:text-[#dce1fb] transition-all flex items-center justify-center gap-1.5 font-mono text-xs border border-[#3c4a42]/50 shadow-sm active:scale-95 shrink-0"
              >
                {copiedRecently ? (
                  <>
                    <Check className="w-4 h-4 text-[#4edea3]" />
                    <span className="text-[#4edea3] font-semibold">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#4cd7f6]" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>

            {/* Generation Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleGenerate}
                className="flex-1 py-2.5 px-4 rounded-lg bg-[#4edea3] hover:bg-[#10b981] text-[#003824] font-sans text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(78,222,163,0.3)] active:scale-[0.98]"
              >
                <RefreshCw className="w-4 h-4 text-[#003824]" />
                <span>Gerar Novo Documento</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[#003824]/20 text-[#003824] font-mono text-[10px] hidden sm:inline">
                  Space
                </kbd>
              </button>

              <button
                type="button"
                onClick={handleGenerateBatch5}
                title="Gerar 5 documentos válidos e copiar tudo em lote"
                className="px-3.5 py-2.5 rounded-lg bg-[#23293c] hover:bg-[#33394c] text-[#bbcabf] hover:text-[#dce1fb] font-mono text-xs transition-all flex items-center gap-1.5 border border-[#3c4a42]/40 shrink-0"
              >
                <Layers className="w-4 h-4 text-[#4cd7f6]" />
                <span className="hidden sm:inline">Lote (+5)</span>
              </button>
            </div>
          </div>

          {/* Parameters / Generation Controls */}
          <div className="flex flex-col gap-2.5 bg-[#151b2d] p-3.5 sm:p-4 rounded-lg border border-[#23293c]">
            <span className="font-mono text-[10px] text-[#bbcabf] uppercase tracking-wider font-semibold">
              Parâmetros de Geração
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Formatted Mask Switch */}
              <label className="flex items-center justify-between gap-2 p-2.5 rounded bg-[#191f31] hover:bg-[#23293c]/60 cursor-pointer transition-colors border border-[#23293c]/60">
                <div className="flex flex-col">
                  <span className="text-xs text-[#dce1fb] font-medium">Pontuação Formatada</span>
                  <span className="font-mono text-[10px] text-[#bbcabf]">
                    {docType === 'CPF' ? 'Ex: 123.456.789-01' : 'Ex: 12.345.678/0001-90'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={withMask}
                  onChange={(e) => setWithMask(e.target.checked)}
                  className="w-4 h-4 accent-[#4edea3] rounded cursor-pointer"
                />
              </label>

              {/* CPF UF Region Selector */}
              {docType === 'CPF' ? (
                <div className="flex flex-col justify-between p-2.5 rounded bg-[#191f31] border border-[#23293c]/60">
                  <label htmlFor="opt-cpf-uf" className="text-xs text-[#dce1fb] font-medium flex justify-between items-center">
                    <span>Região Fiscal (UF)</span>
                    <span className="text-[#4cd7f6] font-mono text-[10px]">
                      {cpfUF === 'any' ? 'Indiferente' : `${cpfUF}`}
                    </span>
                  </label>
                  <select
                    id="opt-cpf-uf"
                    value={cpfUF}
                    onChange={(e) => setCpfUF(e.target.value)}
                    className="mt-1 bg-[#070d1f] text-[#dce1fb] font-mono text-xs rounded p-1.5 border border-[#3c4a42]/40 focus:outline-none focus:border-[#4edea3] cursor-pointer"
                  >
                    <option value="any">Qualquer UF (Aleatório)</option>
                    <option value="8">8ª Região - SP (Dígito 8)</option>
                    <option value="7">7ª Região - RJ, ES (Dígito 7)</option>
                    <option value="6">6ª Região - MG (Dígito 6)</option>
                    <option value="9">9ª Região - PR, SC (Dígito 9)</option>
                    <option value="0">10ª Região - RS (Dígito 0)</option>
                    <option value="1">1ª Região - DF, GO, MT, MS, TO</option>
                    <option value="2">2ª Região - AC, AP, AM, PA, RO, RR</option>
                    <option value="3">3ª Região - CE, MA, PI</option>
                    <option value="4">4ª Região - AL, PB, PE, RN</option>
                    <option value="5">5ª Região - BA, SE</option>
                  </select>
                </div>
              ) : (
                /* CNPJ Branch Mode Selector */
                <div className="flex flex-col justify-between p-2.5 rounded bg-[#191f31] border border-[#23293c]/60">
                  <label htmlFor="opt-cnpj-branch" className="text-xs text-[#dce1fb] font-medium flex justify-between items-center">
                    <span>Estrutura de Filial</span>
                    <span className="text-[#4cd7f6] font-mono text-[10px]">Ordem</span>
                  </label>
                  <select
                    id="opt-cnpj-branch"
                    value={cnpjBranch}
                    onChange={(e) => setCnpjBranch(e.target.value as any)}
                    className="mt-1 bg-[#070d1f] text-[#dce1fb] font-mono text-xs rounded p-1.5 border border-[#3c4a42]/40 focus:outline-none focus:border-[#4edea3] cursor-pointer"
                  >
                    <option value="matriz">Matriz Padrão (/0001)</option>
                    <option value="filial">Filial Aleatória (/0002 a /0099)</option>
                    <option value="large">Grande Filial (/0100 a /0999)</option>
                  </select>
                </div>
              )}
            </div>

            {/* CNPJ Alphanumeric Toggle (Receita Federal 2026) */}
            {docType === 'CNPJ' && (
              <label className="flex items-center justify-between gap-2 p-2.5 rounded bg-[#191f31] hover:bg-[#23293c]/60 cursor-pointer transition-colors border border-[#3c4a42]/60 mt-1">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[#dce1fb] font-medium">Novo Padrão Alfanumérico (2026)</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#070d1f] text-[#4cd7f6] font-mono text-[9px] border border-[#4cd7f6]/40">
                      RFB Oficial
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#bbcabf]">
                    Gera raiz com letras e números (Ex: 12ABC345000190)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isAlphanumeric}
                  onChange={(e) => setIsAlphanumeric(e.target.checked)}
                  className="w-4 h-4 accent-[#4edea3] rounded cursor-pointer"
                />
              </label>
            )}
          </div>

          {/* Buffer Recente (Local Session History) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[#bbcabf] font-mono text-[10px] uppercase tracking-wider">
              <span>Buffer Recente (Histórico Local)</span>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={() => setHistory([])}
                  className="text-[#bbcabf] hover:text-[#ffb4ab] transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Limpar</span>
                </button>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              {history.length === 0 ? (
                <div className="text-[#86948a] text-xs py-2 text-center bg-[#151b2d]/60 rounded border border-[#23293c]/40 font-mono">
                  Nenhum documento gerado nesta sessão.
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 px-3 rounded bg-[#151b2d] hover:bg-[#23293c] transition-colors border border-[#23293c]/50 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#070d1f] text-[#4cd7f6] border border-[#3c4a42]/40 shrink-0">
                        {item.type}
                      </span>
                      <span className="font-mono text-xs text-[#dce1fb] font-medium truncate select-all">
                        {item.doc}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-[#86948a] font-mono hidden sm:inline">
                        {item.timestamp}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(item.doc);
                          onCopyNotice(`Copiado: ${item.doc}`);
                        }}
                        title="Copiar do buffer"
                        className="text-[#bbcabf] hover:text-[#4edea3] transition-colors p-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: REAL-TIME VALIDATOR & X-RAY INSPECTOR (lg:col-span-6) */}
        <section className="lg:col-span-6 flex flex-col gap-5 bg-[#191f31] p-5 sm:p-6 rounded-xl border border-[#23293c] shadow-xl">
          {/* Header & Status Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#4cd7f6]/10 border border-[#4cd7f6]/30 flex items-center justify-center text-[#4cd7f6]">
                <CheckCircle2 className="w-4 h-4 text-[#4cd7f6]" />
              </div>
              <div>
                <h2 className="font-sans text-base font-semibold text-[#dce1fb]">Validador &amp; Analisador</h2>
                <p className="font-sans text-xs text-[#bbcabf]">Auditoria matemática Módulo 11 e Raio-X</p>
              </div>
            </div>

            {/* Dynamic Status Badge */}
            {detectedType === 'NONE' ? (
              <div className="px-3 py-1 rounded-full bg-[#23293c] text-[#bbcabf] font-mono text-[10px] uppercase font-semibold flex items-center gap-1.5 border border-[#3c4a42]/40">
                <span className="w-1.5 h-1.5 rounded-full bg-[#86948a]"></span>
                <span>Aguardando Entrada</span>
              </div>
            ) : detectedType === 'CPF' && cpfResult ? (
              <div
                className={`px-3 py-1 rounded-full font-mono text-[10px] uppercase font-semibold flex items-center gap-1.5 border shadow-sm ${
                  cpfResult.isValid
                    ? 'bg-[#4edea3]/15 text-[#4edea3] border-[#4edea3]/40'
                    : 'bg-[#93000a]/25 text-[#ffb4ab] border-[#93000a]/50'
                }`}
              >
                {cpfResult.isValid ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4edea3]" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-[#ffb4ab]" />
                )}
                <span>{cpfResult.statusLabel}</span>
              </div>
            ) : cnpjResult ? (
              <div
                className={`px-3 py-1 rounded-full font-mono text-[10px] uppercase font-semibold flex items-center gap-1.5 border shadow-sm ${
                  cnpjResult.isValid
                    ? 'bg-[#4edea3]/15 text-[#4edea3] border-[#4edea3]/40'
                    : 'bg-[#93000a]/25 text-[#ffb4ab] border-[#93000a]/50'
                }`}
              >
                {cnpjResult.isValid ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4edea3]" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-[#ffb4ab]" />
                )}
                <span>{cnpjResult.statusLabel}</span>
              </div>
            ) : null}
          </div>

          {/* Input & Quick Action Bar */}
          <div className="flex flex-col gap-2">
            <div className="relative flex items-center">
              <input
                type="text"
                value={validatorInput}
                onChange={(e) => handleValidationChange(e.target.value)}
                placeholder="Cole CPF ou CNPJ (com ou sem pontuação)..."
                className="w-full bg-[#070d1f] text-[#dce1fb] font-mono text-base sm:text-lg tracking-wide px-4 py-3 pr-24 rounded-lg placeholder:text-[#86948a] border border-[#23293c] focus:outline-none focus:border-[#4cd7f6] focus:ring-1 focus:ring-[#4cd7f6] transition-all shadow-inner"
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  title="Colar da Área de Transferência"
                  className="p-1.5 rounded bg-[#191f31] hover:bg-[#23293c] text-[#4cd7f6] transition-colors border border-[#3c4a42]/40"
                >
                  <ClipboardPaste className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleClearValidator}
                  title="Limpar campo"
                  className="p-1.5 rounded bg-[#191f31] hover:bg-[#23293c] text-[#bbcabf] hover:text-[#ffb4ab] transition-colors border border-[#3c4a42]/40"
                >
                  <Delete className="w-4 h-4" />
                </button>
              </div>
            </div>

            <span className="font-mono text-[11px] text-[#86948a] flex items-center gap-1">
              <Info className="w-3 h-3 text-[#4cd7f6]" />
              <span>
                {cleanLen > 0
                  ? `Sanitização ativa: ${cleanLen} dígitos detectados (esperado 11 para CPF ou 14 para CNPJ).`
                  : 'Sanitização automática: espaços, traços e barras são normalizados em tempo real.'}
              </span>
            </span>
          </div>

          {/* Document X-Ray Breakdown / Algorithmic Inspector */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#151b2d] border border-[#23293c] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-2.5 border-[#23293c]">
              <span className="font-mono text-[11px] font-semibold text-[#dce1fb] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#4cd7f6]" />
                Raio-X Estrutural dos Dígitos
              </span>
              <span className="font-mono text-xs text-[#4cd7f6]">
                {detectedType === 'CPF'
                  ? 'Cadastro Pessoa Física (CPF)'
                  : detectedType === 'CNPJ'
                  ? cnpjResult?.formatVariant === 'ALPHANUMERIC_2026'
                    ? 'CNPJ Alfanumérico (RFB 2026)'
                    : 'Cadastro Pessoa Jurídica (CNPJ)'
                  : 'Aguardando documento...'}
              </span>
            </div>

            {/* 3 Digital Segment Anatomy Boxes */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              {/* Base */}
              <div className="p-3 rounded bg-[#191f31] border border-[#23293c]/80 flex flex-col">
                <span className="font-mono text-[10px] text-[#bbcabf] uppercase">Base / Raiz</span>
                <span className="font-mono text-xs sm:text-sm font-semibold text-[#dce1fb] mt-1 truncate">
                  {detectedType === 'CPF' && cpfResult
                    ? cpfResult.base
                    : detectedType === 'CNPJ' && cnpjResult
                    ? `${cnpjResult.base} / ${cnpjResult.branch}`
                    : '---'}
                </span>
                <span className="font-mono text-[9px] text-[#86948a] mt-0.5">
                  {detectedType === 'CPF' ? '9 Dígitos Base' : detectedType === 'CNPJ' ? 'Raiz (8) + Filial (4)' : 'Primeiros dígitos'}
                </span>
              </div>

              {/* DV1 */}
              <div className="p-3 rounded bg-[#191f31] border border-[#23293c]/80 flex flex-col">
                <span className="font-mono text-[10px] text-[#bbcabf] uppercase">1º Dígito (DV1)</span>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <span className="font-mono text-xs sm:text-sm font-semibold text-[#dce1fb]">
                    {detectedType === 'CPF' && cpfResult
                      ? cpfResult.dv1Actual >= 0 ? cpfResult.dv1Actual : '-'
                      : detectedType === 'CNPJ' && cnpjResult
                      ? cnpjResult.dv1Actual >= 0 ? cnpjResult.dv1Actual : '-'
                      : '-'}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      detectedType === 'CPF' && cpfResult
                        ? cpfResult.dv1Actual === cpfResult.dv1Expected
                          ? 'bg-[#4edea3]'
                          : 'bg-[#ffb4ab]'
                        : detectedType === 'CNPJ' && cnpjResult
                        ? cnpjResult.dv1Actual === cnpjResult.dv1Expected
                          ? 'bg-[#4edea3]'
                          : 'bg-[#ffb4ab]'
                        : 'bg-[#86948a]'
                    }`}
                  ></span>
                </div>
                <span className="font-mono text-[9px] text-[#86948a] mt-0.5">
                  {detectedType === 'CPF' && cpfResult && cpfResult.dv1Expected >= 0
                    ? `Esperado: ${cpfResult.dv1Expected}`
                    : detectedType === 'CNPJ' && cnpjResult && cnpjResult.dv1Expected >= 0
                    ? `Esperado: ${cnpjResult.dv1Expected}`
                    : 'Esperado: -'}
                </span>
              </div>

              {/* DV2 */}
              <div className="p-3 rounded bg-[#191f31] border border-[#23293c]/80 flex flex-col">
                <span className="font-mono text-[10px] text-[#bbcabf] uppercase">2º Dígito (DV2)</span>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <span className="font-mono text-xs sm:text-sm font-semibold text-[#dce1fb]">
                    {detectedType === 'CPF' && cpfResult
                      ? cpfResult.dv2Actual >= 0 ? cpfResult.dv2Actual : '-'
                      : detectedType === 'CNPJ' && cnpjResult
                      ? cnpjResult.dv2Actual >= 0 ? cnpjResult.dv2Actual : '-'
                      : '-'}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      detectedType === 'CPF' && cpfResult
                        ? cpfResult.dv2Actual === cpfResult.dv2Expected
                          ? 'bg-[#4edea3]'
                          : 'bg-[#ffb4ab]'
                        : detectedType === 'CNPJ' && cnpjResult
                        ? cnpjResult.dv2Actual === cnpjResult.dv2Expected
                          ? 'bg-[#4edea3]'
                          : 'bg-[#ffb4ab]'
                        : 'bg-[#86948a]'
                    }`}
                  ></span>
                </div>
                <span className="font-mono text-[9px] text-[#86948a] mt-0.5">
                  {detectedType === 'CPF' && cpfResult && cpfResult.dv2Expected >= 0
                    ? `Esperado: ${cpfResult.dv2Expected}`
                    : detectedType === 'CNPJ' && cnpjResult && cnpjResult.dv2Expected >= 0
                    ? `Esperado: ${cnpjResult.dv2Expected}`
                    : 'Esperado: -'}
                </span>
              </div>
            </div>

            {/* Diagnostic Information List */}
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-[#191f31]/60">
                <span className="text-[#bbcabf] font-mono text-[11px]">Origem Fiscal / Jurisdição:</span>
                <span className="font-mono text-[11px] text-[#dce1fb] font-medium truncate max-w-[240px]">
                  {detectedType === 'CPF' && cpfResult
                    ? cpfResult.regionName
                    : detectedType === 'CNPJ'
                    ? 'Nacional (Sem restrição de UF)'
                    : 'Aguardando documento...'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-[#191f31]/60">
                <span className="text-[#bbcabf] font-mono text-[11px]">Classificação Operacional:</span>
                <span className="font-mono text-[11px] text-[#dce1fb] font-medium">
                  {detectedType === 'CPF'
                    ? 'Pessoa Física (Cadastro Individual)'
                    : detectedType === 'CNPJ' && cnpjResult
                    ? cnpjResult.isMatriz
                      ? 'Matriz Principal (/0001)'
                      : `Filial Registrada (/${cnpjResult.branch})`
                    : 'Não aplicável'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-[#191f31]/60">
                <span className="text-[#bbcabf] font-mono text-[11px]">Padrão Repetitivo (Blacklist):</span>
                <span
                  className={`font-mono text-[11px] font-medium ${
                    (cpfResult?.isRepetitive || cnpjResult?.isRepetitive)
                      ? 'text-[#ffb4ab]'
                      : 'text-[#4edea3]'
                  }`}
                >
                  {cpfResult?.isRepetitive || cnpjResult?.isRepetitive
                    ? 'Detectado (Rejeitado pela RFB)'
                    : detectedType !== 'NONE'
                    ? 'Íntegro (Aprovado)'
                    : 'Nenhum'}
                </span>
              </div>

              {/* Error Reason Banner if invalid */}
              {((cpfResult && !cpfResult.isValid) || (cnpjResult && !cnpjResult.isValid)) && (
                <div className="mt-1 p-2.5 rounded bg-[#93000a]/20 border border-[#93000a]/40 text-[#ffb4ab] text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    {cpfResult?.errorReason || cnpjResult?.errorReason || 'Documento matematicamente inválido.'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Sample Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] text-[#bbcabf] uppercase font-semibold mr-1">
              Carregar Exemplo:
            </span>
            <button
              type="button"
              onClick={() => handleQuickSample('valid-cpf')}
              className="px-2.5 py-1 rounded bg-[#23293c] hover:bg-[#33394c] text-[#4edea3] font-mono text-[11px] transition-colors border border-[#3c4a42]/40"
            >
              CPF Válido (SP)
            </button>
            <button
              type="button"
              onClick={() => handleQuickSample('valid-cnpj')}
              className="px-2.5 py-1 rounded bg-[#23293c] hover:bg-[#33394c] text-[#4cd7f6] font-mono text-[11px] transition-colors border border-[#3c4a42]/40"
            >
              CNPJ Matriz Válido
            </button>
            <button
              type="button"
              onClick={() => handleQuickSample('valid-alpha')}
              className="px-2.5 py-1 rounded bg-[#23293c] hover:bg-[#33394c] text-[#c0c1ff] font-mono text-[11px] transition-colors border border-[#3c4a42]/40"
            >
              CNPJ Alfanumérico (2026)
            </button>
            <button
              type="button"
              onClick={() => handleQuickSample('invalid-dv')}
              className="px-2.5 py-1 rounded bg-[#23293c] hover:bg-[#33394c] text-[#ffb4ab] font-mono text-[11px] transition-colors border border-[#93000a]/40"
            >
              DV Quebrado (Inválido)
            </button>
          </div>
        </section>
      </div>

      {/* 3 Developer Fast Actions Cards (Screen 1 bottom) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Shell / cURL */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#151b2d] border border-[#23293c] flex flex-col justify-between gap-4 shadow-md">
          <div>
            <div className="flex items-center gap-2 text-[#4edea3] mb-1.5">
              <Terminal className="w-5 h-5 text-[#4edea3]" />
              <h3 className="font-sans text-sm font-semibold text-[#dce1fb]">Geração via Shell / cURL</h3>
            </div>
            <p className="text-xs text-[#bbcabf] leading-relaxed">
              Invoque o gerador matemático diretamente na sua esteira de CI/CD ou scripts de teste de carga.
            </p>
          </div>
          <div className="p-2.5 rounded bg-[#070d1f] font-mono text-xs text-[#4cd7f6] flex items-center justify-between border border-[#23293c]/80">
            <code className="truncate mr-2">curl -s https://api.validador.dev/v1/cpf</code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText('curl -s https://api.validador.dev/v1/cpf?mask=true');
                onCopyNotice('Comando cURL copiado!');
              }}
              title="Copiar comando cURL"
              className="text-[#bbcabf] hover:text-[#4edea3] transition-colors shrink-0"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 2: Pesos Oficiais Módulo 11 */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#151b2d] border border-[#23293c] flex flex-col justify-between gap-4 shadow-md">
          <div>
            <div className="flex items-center gap-2 text-[#4cd7f6] mb-1.5">
              <Calculator className="w-5 h-5 text-[#4cd7f6]" />
              <h3 className="font-sans text-sm font-semibold text-[#dce1fb]">Pesos Oficiais da Receita</h3>
            </div>
            <p className="text-xs text-[#bbcabf] leading-relaxed">
              CPF utiliza multiplicadores de 10 a 2 para DV1 e 11 a 2 para DV2. Resto 0 ou 1 define DV = 0.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[#bbcabf] font-mono text-[11px]">
            <span className="px-2 py-0.5 rounded bg-[#191f31] text-[#dce1fb] font-semibold border border-[#3c4a42]/40">
              MÓDULO 11
            </span>
            <span>Pesos decrescentes padrão ISO/IEC 7064</span>
          </div>
        </div>

        {/* Card 3: Key Shortcuts */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#151b2d] border border-[#23293c] flex flex-col justify-between gap-4 shadow-md">
          <div>
            <div className="flex items-center gap-2 text-[#c0c1ff] mb-1.5">
              <Keyboard className="w-5 h-5 text-[#c0c1ff]" />
              <h3 className="font-sans text-sm font-semibold text-[#dce1fb]">Atalhos do Teclado</h3>
            </div>
            <p className="text-xs text-[#bbcabf] leading-relaxed">
              Desenvolvido para uso contínuo sem tirar as mãos do teclado durante rotinas de testes manuais.
            </p>
          </div>
          <div className="flex flex-col gap-1.5 font-mono text-xs text-[#bbcabf]">
            <div className="flex items-center justify-between">
              <span>Gerar documento novo:</span>
              <kbd className="px-2 py-0.5 rounded bg-[#191f31] text-[#4edea3] text-[10px] border border-[#3c4a42]/40">
                Space
              </kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Copiar para clipboard:</span>
              <kbd className="px-2 py-0.5 rounded bg-[#191f31] text-[#4edea3] text-[10px] border border-[#3c4a42]/40">
                Alt + C
              </kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Link to Batch Mass Data */}
      <div className="mt-8 p-5 rounded-xl bg-gradient-to-r from-[#151b2d] to-[#191f31] border border-[#3c4a42]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-[#dce1fb]">
            Precisa de dezenas ou centenas de documentos para seus testes de carga?
          </h4>
          <p className="text-xs text-[#bbcabf] mt-0.5">
            Utilize nosso gerador em lote para exportar JSON, CSV, SQL e scripts prontos para Playwright, Cypress e k6.
          </p>
        </div>
        <a
          href="/lote"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
              e.preventDefault();
              onNavigateToBatch();
            }
          }}
          className="px-4 py-2 rounded-lg bg-[#23293c] hover:bg-[#33394c] text-[#4edea3] font-medium text-xs flex items-center gap-1.5 transition-colors border border-[#3c4a42]/60 shrink-0"
        >
          <span>Ir para Lote / Massa de Testes</span>
          <ArrowRight className="w-4 h-4 text-[#4edea3]" />
        </a>
      </div>

      {/* SEÇÃO: PARA QUE SERVE A FERRAMENTA (CASOS DE USO REAIS E LEGÍTIMOS) */}
      <section className="mt-12 pt-8 border-t border-[#23293c]/60 flex flex-col gap-6">
        <div>
          <div className="inline-flex items-center gap-1 text-[#4edea3] font-mono text-xs uppercase tracking-wider mb-1 font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Finalidades e Aplicações</span>
          </div>
          <h2 className="font-sans text-xl sm:text-2xl font-semibold text-[#dce1fb]">
            Para que serve esta ferramenta?
          </h2>
          <p className="text-xs sm:text-sm text-[#bbcabf] mt-1 max-w-3xl leading-relaxed">
            Desenvolvida para economizar tempo e trazer segurança jurídica, privacidade e eficiência para quem cria e testa tecnologia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#151b2d] p-5 rounded-xl border border-[#23293c] flex flex-col gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#4edea3]/10 border border-[#4edea3]/30 flex items-center justify-center text-[#4edea3]">
              <FileCheck2 className="w-5 h-5 text-[#4edea3]" />
            </div>
            <h3 className="font-sans text-sm font-semibold text-[#dce1fb]">Preencher Formulários e Cadastros</h3>
            <p className="text-xs text-[#bbcabf] leading-relaxed">
              Muitos sites, lojas virtuais e aplicativos bloqueiam o cadastro se o CPF ou CNPJ não for matematicamente válido. Esta ferramenta gera números que passam nessa verificação inicial sem que você precise usar documentos reais.
            </p>
          </div>

          <div className="bg-[#151b2d] p-5 rounded-xl border border-[#23293c] flex flex-col gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#4cd7f6]/10 border border-[#4cd7f6]/30 flex items-center justify-center text-[#4cd7f6]">
              <Lock className="w-5 h-5 text-[#4cd7f6]" />
            </div>
            <h3 className="font-sans text-sm font-semibold text-[#dce1fb]">Segurança e Conformidade com a LGPD</h3>
            <p className="text-xs text-[#bbcabf] leading-relaxed">
              Equipes de empresas e programadores não podem utilizar CPFs de clientes reais em bancos de dados de teste por exigência da Lei Geral de Proteção de Dados (LGPD). O ValidaDev resolve isso fornecendo dados puramente fictícios.
            </p>
          </div>

          <div className="bg-[#151b2d] p-5 rounded-xl border border-[#23293c] flex flex-col gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#c0c1ff]/10 border border-[#c0c1ff]/30 flex items-center justify-center text-[#c0c1ff]">
              <CheckCircle2 className="w-5 h-5 text-[#c0c1ff]" />
            </div>
            <h3 className="font-sans text-sm font-semibold text-[#dce1fb]">Conferir se Digitou Corretamente</h3>
            <p className="text-xs text-[#bbcabf] leading-relaxed">
              Digitou um número de documento e deu erro em algum sistema? Cole aqui para descobrir na hora se faltou algum dígito, se os números verificadores estão trocados ou se foi apenas um erro de digitação.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO: COMO USAR A FERRAMENTA PASSO A PASSO */}
      <section className="mt-12 pt-8 border-t border-[#23293c]/60 flex flex-col gap-6">
        <div>
          <div className="inline-flex items-center gap-1 text-[#4cd7f6] font-mono text-xs uppercase tracking-wider mb-1 font-semibold">
            <MousePointerClick className="w-4 h-4" />
            <span>Guia Passo a Passo</span>
          </div>
          <h2 className="font-sans text-xl sm:text-2xl font-semibold text-[#dce1fb]">
            Como usar o Gerador e o Validador
          </h2>
          <p className="text-xs sm:text-sm text-[#bbcabf] mt-1 max-w-3xl leading-relaxed">
            Não é necessário cadastro, login ou download. Tudo funciona direto no seu navegador com dois cliques.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Como Gerar */}
          <div className="bg-[#151b2d] p-5 sm:p-6 rounded-xl border border-[#23293c] flex flex-col gap-4">
            <div className="flex items-center gap-2.5 text-[#4edea3]">
              <Zap className="w-5 h-5 text-[#4edea3]" />
              <h3 className="font-sans text-base font-semibold text-[#dce1fb]">
                Como Gerar um Documento Novo
              </h3>
            </div>
            <ol className="space-y-3 text-xs text-[#cbd5e1] leading-relaxed list-none">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#4edea3]/10 text-[#4edea3] flex items-center justify-center font-bold text-[11px] shrink-0 border border-[#4edea3]/30 mt-0.5">1</span>
                <div>
                  <strong className="text-[#f8fafc]">Escolha o tipo:</strong> Clique no botão <span className="font-mono text-[#4edea3] bg-[#070d1f] px-1.5 py-0.5 rounded border border-[#23293c]">CPF PESSOA</span> ou <span className="font-mono text-[#4edea3] bg-[#070d1f] px-1.5 py-0.5 rounded border border-[#23293c]">CNPJ EMPRESA</span> no topo do quadro à esquerda.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#4edea3]/10 text-[#4edea3] flex items-center justify-center font-bold text-[11px] shrink-0 border border-[#4edea3]/30 mt-0.5">2</span>
                <div>
                  <strong className="text-[#f8fafc]">Defina as opções (opcional):</strong> Marque ou desmarque a opção <em>"Pontuação Formatada"</em> se desejar o número com pontos e traço (ex: <code>000.000.000-00</code>) ou apenas os números puros.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#4edea3]/10 text-[#4edea3] flex items-center justify-center font-bold text-[11px] shrink-0 border border-[#4edea3]/30 mt-0.5">3</span>
                <div>
                  <strong className="text-[#f8fafc]">Copie na hora:</strong> Clique no botão verde <em>"Gerar Novo Documento"</em> (ou aperte a tecla <kbd className="px-1.5 py-0.5 bg-[#070d1f] font-mono text-[10px] text-[#4edea3] rounded border border-[#23293c]">Espaço</kbd>) e depois em <em>"Copiar"</em> para colar onde precisar.
                </div>
              </li>
            </ol>
          </div>

          {/* Card: Como Validar */}
          <div className="bg-[#151b2d] p-5 sm:p-6 rounded-xl border border-[#23293c] flex flex-col gap-4">
            <div className="flex items-center gap-2.5 text-[#4cd7f6]">
              <CheckCircle2 className="w-5 h-5 text-[#4cd7f6]" />
              <h3 className="font-sans text-base font-semibold text-[#dce1fb]">
                Como Conferir e Validar um Documento
              </h3>
            </div>
            <ol className="space-y-3 text-xs text-[#cbd5e1] leading-relaxed list-none">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#4cd7f6]/10 text-[#4cd7f6] flex items-center justify-center font-bold text-[11px] shrink-0 border border-[#4cd7f6]/30 mt-0.5">1</span>
                <div>
                  <strong className="text-[#f8fafc]">Cole o número:</strong> Digite ou cole o CPF ou CNPJ no campo da direita. Não se preocupe com pontos, traços ou espaços — o validador limpa tudo automaticamente.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#4cd7f6]/10 text-[#4cd7f6] flex items-center justify-center font-bold text-[11px] shrink-0 border border-[#4cd7f6]/30 mt-0.5">2</span>
                <div>
                  <strong className="text-[#f8fafc]">Resultado imediato:</strong> Se o número for matematicamente correto, surgirá o selo verde <span className="text-[#4edea3] font-semibold">"CPF VÁLIDO"</span> ou <span className="text-[#4edea3] font-semibold">"CNPJ VÁLIDO"</span>.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#4cd7f6]/10 text-[#4cd7f6] flex items-center justify-center font-bold text-[11px] shrink-0 border border-[#4cd7f6]/30 mt-0.5">3</span>
                <div>
                  <strong className="text-[#f8fafc]">Diagnóstico do erro:</strong> Se houver erro, a ferramenta explica exatamente o que está errado (por exemplo, se o primeiro ou o segundo dígito verificador não batem).
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* SEÇÃO: PERGUNTAS FREQUENTES (FAQ NA TELA INICIAL) */}
      <section className="mt-12 pt-8 border-t border-[#23293c]/60 flex flex-col gap-6">
        <div>
          <div className="inline-flex items-center gap-1 text-[#c0c1ff] font-mono text-xs uppercase tracking-wider mb-1 font-semibold">
            <HelpCircle className="w-4 h-4" />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="font-sans text-xl sm:text-2xl font-semibold text-[#dce1fb]">
            Perguntas Frequentes sobre CPF e CNPJ
          </h2>
          <p className="text-xs sm:text-sm text-[#bbcabf] mt-1 max-w-3xl leading-relaxed">
            As principais respostas para quem utiliza geradores e validadores de documentos no dia a dia.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {[
            {
              id: 'home-faq-1',
              question: 'Os números de CPF ou CNPJ gerados são de pessoas reais?',
              answer: 'Não. Todos os números gerados pelo ValidaDev são combinações aleatórias criadas na hora pelo seu próprio navegador usando fórmulas matemáticas. Eles passam nos testes porque os dois últimos números (dígitos verificadores) foram calculados corretamente, mas não pertencem a nenhuma pessoa física ou empresa verdadeira.'
            },
            {
              id: 'home-faq-2',
              question: 'Posso usar um CPF gerado para comprar ou abrir contas na internet?',
              answer: 'Nunca. O uso de documentos gerados para abrir contas bancárias, solicitar cartões de crédito, fazer compras ou qualquer atividade real configura crime de falsidade ideológica (Artigo 299) e estelionato (Artigo 171 do Código Penal). Esta ferramenta serve exclusivamente para testes de software, estudos de programação e simulação de cadastros em homologação.'
            },
            {
              id: 'home-faq-3',
              question: 'É seguro digitar o meu documento nesta página?',
              answer: 'Sim, é totalmente seguro. A validação acontece 100% no seu próprio computador ou celular através do navegador. O site não envia os números para nenhum servidor na internet e não guarda nenhum tipo de histórico ou banco de dados.'
            },
            {
              id: 'home-faq-4',
              question: 'Por que números como 111.111.111-11 ou 000.000.000-00 dão como inválidos?',
              answer: 'Embora esses números repetidos consigam passar pela fórmula matemática tradicional, a Receita Federal do Brasil criou uma regra que rejeita expressamente qualquer CPF com todos os dígitos iguais para evitar fraudes simples. Nosso sistema segue à risca essa mesma regra oficial.'
            },
            {
              id: 'home-faq-5',
              question: 'O que muda no Novo CNPJ Alfanumérico a partir de 2026?',
              answer: 'Como os números de CNPJ estavam acabando no Brasil, a Receita Federal determinou que os novos CNPJs poderão conter letras e números misturados nos primeiros 12 caracteres (exemplo: 12ABC3450001). Apenas os 2 últimos dígitos continuarão sendo puramente numéricos. O ValidaDev já está preparado e gera esse novo formato.'
            },
            {
              id: 'home-faq-6',
              question: 'A ferramenta é realmente gratuita? Há limite de uso?',
              answer: 'Sim, a ferramenta é totalmente gratuita, sem necessidade de pagamento, sem cadastro de e-mail e sem limite diário de uso. Você pode gerar e validar quantos documentos desejar.'
            }
          ].map((item) => {
            const isOpen = !!openFaqIds[item.id];
            return (
              <div
                key={item.id}
                className="bg-[#151b2d] border border-[#23293c] rounded-xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleHomeFaq(item.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#191f31]/60 transition-colors"
                >
                  <span className="font-sans text-xs sm:text-sm font-semibold text-[#dce1fb]">
                    {item.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#4edea3] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#86948a] shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs text-[#bbcabf] leading-relaxed border-t border-[#23293c]/60">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
