/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { NavTab } from './Header';
import { Logo } from './Logo';
import { ROUTES } from '../routes';

interface FooterProps {
  onNavigate: (tab: NavTab) => void;
  onOpenDisclaimerModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDisclaimerModal }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, tab: NavTab) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(tab);
    }
  };

  return (
    <footer className="w-full bg-[#070d1f] border-t border-[#23293c]/60 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="flex flex-col gap-3">
            <a 
              href={ROUTES['gerador-e-validador'].path} 
              onClick={(e) => handleLinkClick(e, 'gerador-e-validador')}
              className="inline-block"
            >
              <Logo size="md" showBadge={true} />
            </a>
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
                <a
                  href={ROUTES['gerador-e-validador'].path}
                  onClick={(e) => handleLinkClick(e, 'gerador-e-validador')}
                  className="hover:text-[#4edea3] transition-colors inline-block"
                >
                  Gerador &amp; Validador de CPF
                </a>
              </li>
              <li>
                <a
                  href={ROUTES['gerador-e-validador'].path}
                  onClick={(e) => handleLinkClick(e, 'gerador-e-validador')}
                  className="hover:text-[#4edea3] transition-colors inline-block"
                >
                  Gerador &amp; Validador de CNPJ (Matriz / Filial)
                </a>
              </li>
              <li>
                <a
                  href={ROUTES['gerador-e-validador'].path}
                  onClick={(e) => handleLinkClick(e, 'gerador-e-validador')}
                  className="hover:text-[#4cd7f6] transition-colors inline-flex items-center gap-1"
                >
                  <span>Novo CNPJ Alfanumérico 2026</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#0c1324] text-[9px] text-[#4cd7f6] border border-[#3c4a42]/40">
                    RFB
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={ROUTES['lote-massa-de-testes'].path}
                  onClick={(e) => handleLinkClick(e, 'lote-massa-de-testes')}
                  className="hover:text-[#4edea3] transition-colors inline-block"
                >
                  Processador de Lotes e Massa (CSV / JSON / SQL)
                </a>
              </li>
              <li>
                <a
                  href={ROUTES['extensao-chrome'].path}
                  onClick={(e) => handleLinkClick(e, 'extensao-chrome')}
                  className="hover:text-[#4edea3] transition-colors inline-block"
                >
                  Extensão Chrome para Preenchimento Automático
                </a>
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
                <a
                  href={ROUTES['faq'].path}
                  onClick={(e) => handleLinkClick(e, 'faq')}
                  className="hover:text-[#4cd7f6] transition-colors inline-block"
                >
                  Algoritmo Módulo 11 (Pesos ISO/IEC 7064)
                </a>
              </li>
              <li>
                <a
                  href={ROUTES['api-e-integracao'].path}
                  onClick={(e) => handleLinkClick(e, 'api-e-integracao')}
                  className="hover:text-[#4cd7f6] transition-colors inline-block"
                >
                  Endpoints de Integração &amp; SDKs
                </a>
              </li>
              <li>
                <a
                  href={ROUTES['sobre'].path}
                  onClick={(e) => handleLinkClick(e, 'sobre')}
                  className="hover:text-[#4cd7f6] transition-colors inline-block"
                >
                  Arquitetura Sandbox Local sem Servidor
                </a>
              </li>
              <li>
                <a
                  href={ROUTES['faq'].path}
                  onClick={(e) => handleLinkClick(e, 'faq')}
                  className="hover:text-[#4cd7f6] transition-colors inline-block"
                >
                  Tabela Oficial de Regiões Fiscais do CPF
                </a>
              </li>
              <li>
                <a
                  href="https://www.gov.br/receitafederal/pt-br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#dce1fb] transition-colors inline-flex items-center gap-1 text-[#86948a]"
                >
                  <span>Portal Oficial Receita Federal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Compliance & Security */}
          <div>
            <h4 className="font-mono text-[11px] font-semibold text-[#dce1fb] uppercase tracking-wider mb-3">
              Conformidade &amp; Segurança
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-[#bbcabf]">
              <li>
                <a
                  href={ROUTES['politicas'].path}
                  onClick={(e) => handleLinkClick(e, 'politicas')}
                  className="hover:text-[#4edea3] transition-colors inline-block"
                >
                  LGPD (Art. 7º - Dados Fictícios / Sintéticos)
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenDisclaimerModal}
                  className="text-left hover:text-[#4edea3] transition-colors"
                >
                  Termos de Uso e Isenção de Responsabilidade
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenDisclaimerModal}
                  className="text-left text-[#ffb4ab] hover:underline"
                >
                  Alerta Penal (Art. 299 e 171 do CPB)
                </button>
              </li>
              <li>
                <a
                  href={ROUTES['sobre'].path}
                  onClick={(e) => handleLinkClick(e, 'sobre')}
                  className="hover:text-[#4edea3] transition-colors inline-block"
                >
                  Transparência de Código &amp; Algoritmos
                </a>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t border-[#23293c] flex flex-col gap-1.5 font-mono text-[11px] text-[#86948a]">
              <div className="flex items-center justify-between">
                <span>Algoritmo:</span>
                <span className="text-[#4cd7f6]">Módulo 11 v2.6</span>
              </div>
              <div className="flex items-center justify-between">
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
              <a
                href={ROUTES['politicas'].path}
                onClick={(e) => handleLinkClick(e, 'politicas')}
                className="hover:text-[#4edea3] transition-colors underline underline-offset-2"
              >
                Termos &amp; Privacidade
              </a>
              <span>·</span>
              <a
                href={ROUTES['sobre'].path}
                onClick={(e) => handleLinkClick(e, 'sobre')}
                className="hover:text-[#4edea3] transition-colors underline underline-offset-2"
              >
                Sobre o Projeto
              </a>
              <span>·</span>
              <a
                href={ROUTES['faq'].path}
                onClick={(e) => handleLinkClick(e, 'faq')}
                className="hover:text-[#4edea3] transition-colors underline underline-offset-2"
              >
                Perguntas Frequentes
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 text-center md:text-right font-mono text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 text-[#ffb4ab] shrink-0" />
            <p>
              <button
                type="button"
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
