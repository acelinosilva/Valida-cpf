/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Lock, 
  Terminal, 
  CheckCircle2, 
  HeartHandshake, 
  Scale,
  Zap,
  ArrowRight
} from 'lucide-react';
import { EthicalDisclaimerBanner } from '../components/EthicalDisclaimerBanner';

interface AboutViewProps {
  onOpenDisclaimer: () => void;
  onNavigateToTool: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenDisclaimer, onNavigateToTool }) => {
  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 gap-8">
      <EthicalDisclaimerBanner onOpenDetails={onOpenDisclaimer} />

      {/* Header */}
      <div className="pb-6 border-b border-[#23293c]/50">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#191f31] text-[#4edea3] font-mono text-[10px] font-semibold uppercase mb-2 border border-[#3c4a42]/50">
          <ShieldCheck className="w-3 h-3 text-[#4edea3]" />
          Engenharia de Software &amp; QA
        </div>
        <h1 className="font-sans text-2xl sm:text-3xl font-semibold text-[#dce1fb] tracking-tight">
          Sobre o ValidaDev Engine
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#bbcabf] mt-1.5 leading-relaxed max-w-3xl">
          Construído por desenvolvedores e para desenvolvedores com a missão de erradicar ferramentas legadas, lentas e cheias de spam do fluxo diário de testes.
        </p>
      </div>

      {/* Manifesto Content */}
      <div className="space-y-6 text-xs sm:text-sm text-[#bbcabf] leading-relaxed">
        <div className="bg-[#151b2d] p-5 sm:p-6 rounded-xl border border-[#23293c] flex flex-col gap-3">
          <h2 className="text-base font-semibold text-[#dce1fb] flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#4edea3]" />
            Nossa Proposta de Valor
          </h2>
          <p>
            Durante anos, desenvolvedores e profissionais de QA no Brasil dependeram de sites antiquados, lentos, repletos de pop-ups intrusivos e sem suporte para teclados para simplesmente obter ou testar um número de CPF ou CNPJ.
          </p>
          <p>
            O <strong className="text-[#dce1fb]">ValidaDev</strong> foi criado para redefinir esse padrão: oferecemos uma ferramenta de alta densidade visual (inspirada no estilo técnico de interfaces como Linear e Raycast), com respostas em sub-milissegundos, atalhos de teclado (como <kbd className="px-1.5 py-0.5 rounded bg-[#070d1f] text-[#4edea3] font-mono text-[10px]">Espaço</kbd> e <kbd className="px-1.5 py-0.5 rounded bg-[#070d1f] text-[#4edea3] font-mono text-[10px]">Alt + C</kbd>), e geração em lote para frameworks modernos como Playwright, Cypress e k6.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#151b2d] p-5 rounded-xl border border-[#23293c] flex flex-col gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#4edea3]/10 border border-[#4edea3]/30 flex items-center justify-center text-[#4edea3]">
              <Lock className="w-5 h-5 text-[#4edea3]" />
            </div>
            <h3 className="font-sans text-sm font-semibold text-[#dce1fb]">100% Client-Side</h3>
            <p className="text-xs text-[#bbcabf] leading-relaxed">
              Nenhuma digitação, cópia ou clique trafega para servidores externos. O cálculo dos dígitos verificadores roda inteiramente na máquina do usuário via V8/WASM.
            </p>
          </div>

          <div className="bg-[#151b2d] p-5 rounded-xl border border-[#23293c] flex flex-col gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#4cd7f6]/10 border border-[#4cd7f6]/30 flex items-center justify-center text-[#4cd7f6]">
              <Cpu className="w-5 h-5 text-[#4cd7f6]" />
            </div>
            <h3 className="font-sans text-sm font-semibold text-[#dce1fb]">Auditoria Raio-X</h3>
            <p className="text-xs text-[#bbcabf] leading-relaxed">
              Não dizemos apenas "válido" ou "inválido". Decompomos os 9 dígitos da raiz, os pesos do Módulo 11, o estado da filial e o motivo exato de qualquer inconsistência.
            </p>
          </div>

          <div className="bg-[#151b2d] p-5 rounded-xl border border-[#23293c] flex flex-col gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#c0c1ff]/10 border border-[#c0c1ff]/30 flex items-center justify-center text-[#c0c1ff]">
              <HeartHandshake className="w-5 h-5 text-[#c0c1ff]" />
            </div>
            <h3 className="font-sans text-sm font-semibold text-[#dce1fb]">Zero Fricção &amp; Gratuito</h3>
            <p className="text-xs text-[#bbcabf] leading-relaxed">
              Sem login, sem e-mails obrigatórios e sem paywalls. Você abre, copia o que precisa e segue com seu fluxo de desenvolvimento sem interrupções.
            </p>
          </div>
        </div>

        {/* Ethical Stance */}
        <div className="bg-[#151b2d] p-5 sm:p-6 rounded-xl border border-[#93000a]/40 flex flex-col gap-3">
          <h2 className="text-base font-semibold text-[#ffb4ab] flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#ffb4ab]" />
            Compromisso Ético e Repúdio a Fraudes
          </h2>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            Reafirmamos categoricamente que o ValidaDev não mantém registros de cidadãos reais e não se destina a intermediar atividades ilícitas. A fraude documental é crime passível de prisão no Brasil. Apoiaremos sempre as melhores práticas de privacidade, incentivando o uso de dados sintéticos estocásticos em ambientes de teste para que os dados reais de cidadãos permaneçam em segurança.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-start">
          <button
            type="button"
            onClick={onNavigateToTool}
            className="px-5 py-2.5 rounded-lg bg-[#4edea3] hover:bg-[#10b981] text-[#003824] font-semibold text-xs transition-colors flex items-center gap-2 shadow-md"
          >
            <span>Experimentar o Gerador &amp; Validador</span>
            <ArrowRight className="w-4 h-4 text-[#003824]" />
          </button>
        </div>
      </div>
    </div>
  );
};
