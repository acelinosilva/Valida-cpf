/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { AlertOctagon, ShieldAlert, CheckCircle2, X, Scale } from 'lucide-react';

interface EthicalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EthicalDisclaimerModal: React.FC<EthicalDisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0f172a] border border-[#334155]/80 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="disclaimer-title"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#1e293b]/70 border-b border-[#334155]/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#93000a]/20 border border-[#93000a]/40 flex items-center justify-center text-[#ffb4ab]">
              <AlertOctagon className="w-5 h-5 text-[#ffb4ab]" />
            </div>
            <div>
              <h2 id="disclaimer-title" className="text-base font-semibold text-[#f8fafc]">
                Aviso de Uso Ético e Finalidade Legal
              </h2>
              <p className="text-xs text-[#94a3b8] font-mono">
                Declaração de Isenção e Conformidade Jurídica
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#334155] transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-[#cbd5e1] leading-relaxed">
          <div className="p-4 rounded-lg bg-[#93000a]/15 border border-[#93000a]/35 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#ffb4ab] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#ffb4ab] mb-1">
                Aviso Obrigatório a Todos os Usuários:
              </p>
              <p className="text-xs text-[#ffdad6] leading-relaxed">
                "Documentos gerados aqui são fictícios, servem apenas para testes de software e não pertencem a nenhuma pessoa ou empresa real. Não utilize para fraude, abertura de conta ou qualquer finalidade que exija documento real — isso é crime tipificado no Código Penal Brasileiro."
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#4edea3] flex items-center gap-1.5">
              <Scale className="w-4 h-4" />
              1. Enquadramento Legal (Código Penal Brasileiro)
            </h3>
            <p className="text-xs text-[#94a3b8]">
              A criação, fornecimento deliberado ou utilização de documentos sintéticos ou de terceiros em cadastros de serviços comerciais, instituições bancárias, cadastros públicos ou transações civis configura infração penal:
            </p>
            <ul className="list-disc list-inside text-xs space-y-1.5 pl-1 text-[#cbd5e1]">
              <li>
                <strong className="text-[#f8fafc]">Artigo 299 (Falsidade Ideológica):</strong> Omitir, em documento público ou particular, declaração que dele devia constar, ou nele inserir declaração falsa ou diversa da que devia ser escrita. Pena: reclusão de 1 a 5 anos e multa.
              </li>
              <li>
                <strong className="text-[#f8fafc]">Artigo 171 (Estelionato):</strong> Obter, para si ou para outrem, vantagem ilícita, em prejuízo alheio, induzindo ou mantendo alguém em erro. Pena: reclusão de 1 a 5 anos e multa.
              </li>
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#334155]/50">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#4cd7f6] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              2. Finalidades Estritamente Legítimas
            </h3>
            <p className="text-xs text-[#94a3b8]">
              O <strong className="text-[#f8fafc]">ValidaDev</strong> foi projetado e é disponibilizado exclusivamente para engenheiros de software, arquitetos de sistemas e analistas de qualidade (QA) para:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded bg-[#1e293b]/70 border border-[#334155]/40">
                <span className="font-semibold text-[#4edea3]">✔ Testes Unitários e CI/CD</span>
                <p className="text-[#94a3b8] mt-0.5">Validação de máscaras, algoritmos e regex em pipelines automatizados.</p>
              </div>
              <div className="p-2.5 rounded bg-[#1e293b]/70 border border-[#334155]/40">
                <span className="font-semibold text-[#4edea3]">✔ Homologação e Staging</span>
                <p className="text-[#94a3b8] mt-0.5">Popular bancos de dados de teste sem violar a privacidade da LGPD.</p>
              </div>
              <div className="p-2.5 rounded bg-[#1e293b]/70 border border-[#334155]/40">
                <span className="font-semibold text-[#4edea3]">✔ Testes de Carga (k6 / JMeter)</span>
                <p className="text-[#94a3b8] mt-0.5">Simulação de alto tráfego com registros com dígitos válidos.</p>
              </div>
              <div className="p-2.5 rounded bg-[#1e293b]/70 border border-[#334155]/40">
                <span className="font-semibold text-[#4edea3]">✔ Ensino e Didática</span>
                <p className="text-[#94a3b8] mt-0.5">Estudo do cálculo do Módulo 11 e transição para o CNPJ alfanumérico 2026.</p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#334155]/50 text-xs text-[#94a3b8]">
            <h3 className="font-mono uppercase tracking-wider text-[#cbd5e1]">
              3. Isenção de Consulta à Base da Receita Federal
            </h3>
            <p>
              Este sistema <strong className="text-[#f8fafc]">não possui qualquer conexão</strong> com as bases governamentais da Receita Federal do Brasil (SERPRO/Dataprev). Não realizamos consulta de situação cadastral, histórico de débitos ou titularidade real. A verificação é puramente matemática.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#1e293b]/70 border-t border-[#334155]/60 flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#64748b]">
            Art. 299 &amp; 171 do CPB · 100% Client-Side
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#4edea3] hover:bg-[#10b981] text-[#003824] font-semibold text-xs transition-colors shadow-md"
          >
            Entendi e Concordo
          </button>
        </div>
      </div>
    </div>
  );
};
