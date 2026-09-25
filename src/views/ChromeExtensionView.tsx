/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { 
  Chrome, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Download, 
  Zap, 
  MousePointerClick,
  Laptop
} from 'lucide-react';
import { generateCPF, generateCNPJ } from '../utils/engine';
import { EthicalDisclaimerBanner } from '../components/EthicalDisclaimerBanner';

interface ChromeExtensionViewProps {
  onCopyNotice: (msg: string) => void;
  onOpenDisclaimer: () => void;
}

export const ChromeExtensionView: React.FC<ChromeExtensionViewProps> = ({ onCopyNotice, onOpenDisclaimer }) => {
  // Interactive Simulator Form
  const [formCpf, setFormCpf] = useState('');
  const [formCnpj, setFormCnpj] = useState('');
  const [formNome, setFormNome] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [simulatedAutofill, setSimulatedAutofill] = useState(false);

  const handleSimulateFill = () => {
    const cpf = generateCPF({ mask: true, uf: 'SP' });
    const cnpj = generateCNPJ({ mask: true, branchMode: 'matriz' });
    setFormCpf(cpf);
    setFormCnpj(cnpj);
    setFormNome('Mariana Silva QA');
    setFormEmail('mariana.qa@testvalida.dev.br');
    setSimulatedAutofill(true);
    onCopyNotice('Campos preenchidos automaticamente via extensão simulada!');
  };

  const handleClearForm = () => {
    setFormCpf('');
    setFormCnpj('');
    setFormNome('');
    setFormEmail('');
    setSimulatedAutofill(false);
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 gap-8">
      <EthicalDisclaimerBanner onOpenDetails={onOpenDisclaimer} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#23293c]/50">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#191f31] text-[#4edea3] font-mono text-[10px] font-semibold uppercase mb-2 border border-[#3c4a42]/50">
            <Chrome className="w-3 h-3 text-[#4edea3]" />
            Navegador Web / QA Toolkit
          </div>
          <h1 className="font-sans text-2xl sm:text-3xl font-semibold text-[#dce1fb] tracking-tight">
            Extensão ValidaDev para Google Chrome
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#bbcabf] mt-1">
            Preencha cadastros, checkouts e formulários de homologação com 1 clique ou atalho de teclado, sem sair da aba.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onCopyNotice('O pacote de extensão está preparado para instalação em modo desenvolvedor.')}
          className="px-4 py-2.5 rounded-lg bg-[#4edea3] hover:bg-[#10b981] text-[#003824] font-semibold text-xs transition-all flex items-center gap-2 shadow-[0_0_16px_rgba(78,222,163,0.3)] shrink-0"
        >
          <Download className="w-4 h-4 text-[#003824]" />
          <span>Baixar Pacote (.zip)</span>
        </button>
      </div>

      {/* Interactive Autofill Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Form Simulation */}
        <div className="lg:col-span-6 bg-[#151b2d] p-5 sm:p-6 rounded-xl border border-[#23293c] flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#23293c] pb-3">
            <div className="flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-[#4cd7f6]" />
              <h2 className="text-sm font-semibold text-[#dce1fb]">
                Simulador de Formulário Alvo (Qualquer Site)
              </h2>
            </div>
            <span className="font-mono text-[10px] text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded border border-[#4edea3]/30">
              Demo Interativa
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-[#bbcabf] font-mono">CAMPO CPF</label>
              <input
                type="text"
                readOnly
                placeholder="Aguardando autofill..."
                value={formCpf}
                className="w-full mt-1 bg-[#070d1f] text-[#4edea3] font-mono text-sm px-3.5 py-2.5 rounded border border-[#23293c]"
              />
            </div>

            <div>
              <label className="text-xs text-[#bbcabf] font-mono">CAMPO CNPJ</label>
              <input
                type="text"
                readOnly
                placeholder="Aguardando autofill..."
                value={formCnpj}
                className="w-full mt-1 bg-[#070d1f] text-[#4cd7f6] font-mono text-sm px-3.5 py-2.5 rounded border border-[#23293c]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#bbcabf] font-mono">NOME SINTÉTICO</label>
                <input
                  type="text"
                  readOnly
                  placeholder="Nome fake..."
                  value={formNome}
                  className="w-full mt-1 bg-[#070d1f] text-[#dce1fb] font-sans text-xs px-3.5 py-2.5 rounded border border-[#23293c]"
                />
              </div>
              <div>
                <label className="text-xs text-[#bbcabf] font-mono">E-MAIL CORPORATIVO</label>
                <input
                  type="text"
                  readOnly
                  placeholder="E-mail teste..."
                  value={formEmail}
                  className="w-full mt-1 bg-[#070d1f] text-[#dce1fb] font-sans text-xs px-3.5 py-2.5 rounded border border-[#23293c]"
                />
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSimulateFill}
              className="flex-1 py-2.5 px-4 rounded-lg bg-[#4edea3] hover:bg-[#10b981] text-[#003824] font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Zap className="w-4 h-4 text-[#003824]" />
              <span>Simular Preenchimento com 1 Clique</span>
            </button>
            {simulatedAutofill && (
              <button
                type="button"
                onClick={handleClearForm}
                className="px-3 py-2.5 rounded-lg bg-[#23293c] hover:bg-[#33394c] text-[#bbcabf] text-xs transition-colors border border-[#3c4a42]/40"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Right: Architecture & Installation */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-[#151b2d] p-5 sm:p-6 rounded-xl border border-[#23293c] flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-[#dce1fb] flex items-center gap-2">
              <Laptop className="w-4 h-4 text-[#4cd7f6]" />
              Como Funciona a Extensão
            </h3>
            <p className="text-xs text-[#bbcabf] leading-relaxed">
              A extensão ValidaDev roda 100% no navegador utilizando Manifest v3. Ela identifica campos de CPF e CNPJ por meio de seletores semânticos (nomes, placeholders, IDs e atributos data) e injeta dados matematicamente válidos sem enviar nenhuma informação para a rede.
            </p>
            <ul className="text-xs text-[#cbd5e1] space-y-2 mt-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4edea3] shrink-0 mt-0.5" />
                <span>Atalho rápido configurável: <kbd className="px-1.5 py-0.5 bg-[#070d1f] font-mono text-[10px] border border-[#23293c] rounded text-[#4cd7f6]">Alt + Shift + V</kbd></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4edea3] shrink-0 mt-0.5" />
                <span>Menu de contexto no botão direito com opções para CPF, CNPJ e CNPJ Alfanumérico</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4edea3] shrink-0 mt-0.5" />
                <span>Zero permissões invasivas: sem leitura de histórico e sem telemetria</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#151b2d] p-5 sm:p-6 rounded-xl border border-[#23293c] flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-[#dce1fb]">
              Instalação em 3 Passos
            </h3>
            <ol className="text-xs text-[#bbcabf] space-y-2 list-decimal list-inside leading-relaxed">
              <li>Baixe o arquivo <code className="text-[#4cd7f6] bg-[#070d1f] px-1 py-0.5 rounded">validadev-chrome.zip</code> e descompacte em sua máquina.</li>
              <li>Acesse <code className="text-[#4cd7f6] bg-[#070d1f] px-1 py-0.5 rounded">chrome://extensions</code> e ative o <strong>Modo do desenvolvedor</strong> no canto superior direito.</li>
              <li>Clique em <strong>Carregar sem compactação</strong> e selecione a pasta descompactada.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
