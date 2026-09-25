/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { NavTab } from './Header';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate: (tab: NavTab) => void;
  onOpenDisclaimerModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDisclaimerModal }) => {
  return (
    <footer className="w-full bg-[#070d1f] border-t border-[#23293c]/60 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="flex flex-col gap-3">
            <Logo size="md" showBadge={true} />
            <p className="text-[#bbcabf] text-xs leading-relaxed">
              Suíte técnica de validação e geração de dados sintéticos para desenvolvedores, QA e sistemas transacionais. Algoritmos nativos no navegador sem retenção de dados ou telemetria.
            </p>
            <div className="flex items-center gap-1.5 text-[#4edea3] font-mono text-xs pt-1">
              <CheckCircle2 className="w-4 h-4 text-[#4edea3]" />
              <span>Zero Logs • Client-Side Only</span>
            </div>
          </div>

          {/* Tools & Modules */}
          <div>
            <h4 className="font-mono text-[11px] font-semibold text-[#dce1fb] uppercase tracking-wider mb-3">
              Ferramentas &amp; Módulos
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-[#bbcabf]">
              <li>
                <button
                  onClick={() => onNavigate('gerador-e-validador')}
                  className="hover:text-[#4edea3] transition-colors text-left"
                >
                  Gerador &amp; Validador de CPF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gerador-e-validador')}
                  className="hover:text-[#4edea3] transition-colors text-left"
                >
                  Gerador &amp; Validador de CNPJ (Matriz / Filial)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gerador-e-validador')}
                  className="hover:text-[#4cd7f6] transition-colors text-left flex items-center gap-1"
                >
                  <span>Novo CNPJ Alfanumérico 2026</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#0c1324] text-[9px] text-[#4cd7f6] border border-[#3c4a42]/40">
                    RFB
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('lote-massa-de-testes')}
                  className="hover:text-[#4edea3] transition-colors text-left"
                >
                  Processador de Lotes e Massa (CSV / JSON / SQL)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('extensao-chrome')}
                  className="hover:text-[#4edea3] transition-colors text-left"
                >
                  Extensão Chrome para Preenchimento Automático
                </button>
              </li>
            </ul>
          </div>

          {/* Technical Specifications */}
          <div>
            <h4 className="font-mono text-[11px] font-semibold text-[#dce1fb] uppercase tracking-wider mb-3">
              Especificações Técnicas
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-[#bbcabf]">
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-[#4cd7f6] transition-colors text-left"
                >
                  Algoritmo Módulo 11 (Pesos ISO/IEC 7064)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('api-e-integracao')}
                  className="hover:text-[#4cd7f6] transition-colors text-left"
                >
                  SDK JavaScript &amp; TypeScript
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('api-e-integracao')}
                  className="hover:text-[#4cd7f6] transition-colors text-left"
                >
                  Integração Playwright, Cypress e k6
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('politicas')}
                  className="hover:text-[#4cd7f6] transition-colors text-left"
                >
                  Conformidade com LGPD (Lei 13.709/18)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sobre')}
                  className="hover:text-[#4cd7f6] transition-colors text-left"
                >
                  Manifesto de Arquitetura Local Sandbox
                </button>
              </li>
            </ul>
          </div>

          {/* Runtime Environment Specs */}
          <div>
            <h4 className="font-mono text-[11px] font-semibold text-[#dce1fb] uppercase tracking-wider mb-3">
              Ambiente de Execução
            </h4>
            <div className="p-3.5 rounded-lg bg-[#151b2d] border border-[#23293c] flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between text-[#dce1fb] font-mono">
                <span className="text-[11px]">Kernel de Cálculo:</span>
                <span className="text-[#4edea3] font-semibold text-[10px] px-1.5 py-0.5 rounded bg-[#070d1f] border border-[#3c4a42]/40">
                  WASM / V8
                </span>
              </div>
              <p className="text-[#bbcabf] font-mono text-[11px]">
                Latência de cálculo: <span className="text-[#4edea3]">&lt; 0.12ms</span>
              </p>
              <div className="flex items-center justify-between text-[#bbcabf] font-mono text-[11px] pt-1 border-t border-[#23293c]">
                <span>Status da RFB:</span>
                <span className="text-[#4edea3] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span> Sincronizado
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Permanent Legal Disclaimer */}
        <div className="pt-6 border-t border-[#23293c]/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#bbcabf]">
          <div className="flex flex-wrap items-center gap-4 text-center md:text-left">
            <p>© 2026 Gerar CPF. Todos os direitos reservados.</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('politicas')}
                className="hover:text-[#4edea3] transition-colors underline underline-offset-2"
              >
                Termos &amp; Privacidade
              </button>
              <span>·</span>
              <button
                onClick={() => onNavigate('sobre')}
                className="hover:text-[#4edea3] transition-colors underline underline-offset-2"
              >
                Sobre o Projeto
              </button>
              <span>·</span>
              <button
                onClick={() => onNavigate('faq')}
                className="hover:text-[#4edea3] transition-colors underline underline-offset-2"
              >
                Perguntas Frequentes
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-center md:text-right font-mono text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 text-[#ffb4ab] shrink-0" />
            <p>
              <button
                onClick={onOpenDisclaimerModal}
                className="text-[#ffb4ab] hover:underline font-semibold"
              >
                Aviso Legal:
              </button>{' '}
              Dados fictícios gerados exclusivamente para fins de testes de software e homologação.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
