/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Lock, 
  Scale, 
  AlertOctagon, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { EthicalDisclaimerBanner } from '../components/EthicalDisclaimerBanner';

interface LegalViewProps {
  onOpenDisclaimer: () => void;
}

export const LegalView: React.FC<LegalViewProps> = ({ onOpenDisclaimer }) => {
  const [activeSubTab, setActiveSubTab] = useState<'termos' | 'privacidade' | 'disclaimer'>('termos');

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 gap-8">
      <EthicalDisclaimerBanner onOpenDetails={onOpenDisclaimer} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#23293c]/50">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#191f31] text-[#4cd7f6] font-mono text-[10px] font-semibold uppercase mb-2 border border-[#3c4a42]/50">
            <FileText className="w-3 h-3 text-[#4cd7f6]" />
            Jurídico &amp; Conformidade
          </div>
          <h1 className="font-sans text-2xl sm:text-3xl font-semibold text-[#dce1fb] tracking-tight">
            Políticas de Privacidade &amp; Termos de Uso
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#bbcabf] mt-1">
            Conformidade integral com a LGPD (Lei Federal nº 13.709/2018) e Código Penal Brasileiro.
          </p>
        </div>

        <div className="text-xs text-[#86948a] font-mono flex items-center gap-1.5 self-start sm:self-auto">
          <Calendar className="w-3.5 h-3.5" />
          <span>Última revisão: Setembro de 2026</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-[#23293c] pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('termos')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
            activeSubTab === 'termos'
              ? 'bg-[#191f31] text-[#4edea3] border border-[#3c4a42]'
              : 'text-[#bbcabf] hover:text-[#dce1fb]'
          }`}
        >
          Termos de Uso
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('privacidade')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
            activeSubTab === 'privacidade'
              ? 'bg-[#191f31] text-[#4edea3] border border-[#3c4a42]'
              : 'text-[#bbcabf] hover:text-[#dce1fb]'
          }`}
        >
          Política de Privacidade (LGPD)
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('disclaimer')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
            activeSubTab === 'disclaimer'
              ? 'bg-[#191f31] text-[#ffb4ab] border border-[#93000a]/50'
              : 'text-[#bbcabf] hover:text-[#dce1fb]'
          }`}
        >
          Aviso de Uso Ético &amp; Fraude
        </button>
      </div>

      {/* Content based on sub-tab */}
      <div className="bg-[#151b2d] p-6 sm:p-8 rounded-xl border border-[#23293c] text-xs sm:text-sm text-[#cbd5e1] leading-relaxed space-y-6">
        {activeSubTab === 'termos' && (
          <>
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-[#dce1fb]">1. Objeto e Aceitação dos Termos</h2>
              <p>
                Ao acessar e utilizar o portal <strong className="text-[#f8fafc]">ValidaDev</strong>, você concorda expressamente com os presentes Termos de Uso. O serviço consiste em uma plataforma de utilidade técnica para geração algorítmica de dados numéricos e alfanuméricos estocásticos, e verificação matemática de dígitos verificadores (Módulo 11 da Receita Federal do Brasil).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold text-[#dce1fb]">2. Finalidades Estritamente Autorizadas</h2>
              <p>O uso da ferramenta é autorizado unicamente para:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-[#bbcabf]">
                <li>Testes automatizados e manuais de software (QA, testes unitários, CI/CD);</li>
                <li>Ambientes de homologação, staging e desenvolvimento de sistemas;</li>
                <li>Testes de estresse e performance de carga (via ferramentas como k6, JMeter, Locust);</li>
                <li>Ensino didático de computação e algoritmos de dígitos verificadores (ISO/IEC 7064).</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold text-[#ffb4ab]">3. Usos Estritamente Proibidos e Consequências Legais</h2>
              <p>
                É expressamente vedado o uso dos dados obtidos no ValidaDev para:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-[#ffdad6]">
                <li>Abertura ou tentativa de abertura de contas bancárias, cartões ou linhas de crédito;</li>
                <li>Realização de cadastros em portais de comércio eletrônico, serviços ou redes sociais reais;</li>
                <li>Prática de fraude, estelionato, falsidade ideológica ou qualquer conduta delituosa tipificada no Código Penal Brasileiro;</li>
                <li>Simulação de dados fiscais com intenção de evasão ou sonegação.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold text-[#dce1fb]">4. Isenção de Garantias e Vínculo Governamental</h2>
              <p>
                O ValidaDev não possui vínculo, chancela ou afiliação oficial com a Receita Federal do Brasil, Ministério da Fazenda, SERPRO ou qualquer entidade estatal. A validação é realizada puramente por cálculo aritmético local.
              </p>
            </section>
          </>
        )}

        {activeSubTab === 'privacidade' && (
          <>
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-[#4edea3] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#4edea3]" />
                1. Compromisso com a Lei Geral de Proteção de Dados (Lei 13.709/2018)
              </h2>
              <p>
                A privacidade e o anonimato dos usuários são o pilar central de arquitetura do ValidaDev. Nossa infraestrutura foi desenhada sob o conceito de <strong className="text-[#f8fafc]">Privacy by Design</strong> e <strong className="text-[#f8fafc]">Data Minimization</strong> absoluto.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold text-[#dce1fb]">2. Ausência de Tratamento de Dados Pessoais</h2>
              <p>
                Ao utilizar o ValidaDev:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#bbcabf]">
                <li><strong className="text-[#dce1fb]">Zero Envio de Documentos:</strong> Qualquer CPF ou CNPJ digitado no validador é analisado no próprio navegador via JavaScript. Nenhum número é transmitido para servidores remotos.</li>
                <li><strong className="text-[#dce1fb]">Zero Armazenamento em Banco:</strong> Não mantemos bancos de dados relacionais ou NoSQL para registrar números digitados ou gerados.</li>
                <li><strong className="text-[#dce1fb]">Zero Cookies de Rastreamento:</strong> Não utilizamos cookies de terceiros para fingerprinting ou rastreamento de perfil comportamental.</li>
                <li><strong className="text-[#dce1fb]">Histórico 100% Volátil:</strong> O histórico de documentos gerados é mantido apenas na memória da sessão atual do seu navegador e é limpo ao fechar a aba.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold text-[#dce1fb]">3. Segurança para Ambientes Corporativos e QA</h2>
              <p>
                Empresas sob auditoria SOC2, ISO 27001 ou LGPD podem autorizar seus times técnicos a utilizarem o ValidaDev com tranquilidade, pois a ferramenta não cria vetores de vazamento de dados de clientes reais ou cópia indevida de dados produtivos.
              </p>
            </section>
          </>
        )}

        {activeSubTab === 'disclaimer' && (
          <>
            <div className="p-4 rounded-lg bg-[#93000a]/20 border border-[#93000a]/40 flex items-start gap-3">
              <AlertOctagon className="w-5 h-5 text-[#ffb4ab] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#ffb4ab]">
                  Aviso Obrigatório Permanente de Isenção e Tipificação Criminal
                </h3>
                <p className="text-xs text-[#ffdad6] mt-1 leading-relaxed">
                  "Documentos gerados aqui são fictícios, servem apenas para testes de software e não pertencem a nenhuma pessoa ou empresa real. Não utilize para fraude, abertura de conta ou qualquer finalidade que exija documento real — isso é crime."
                </p>
              </div>
            </div>

            <section className="space-y-3">
              <h2 className="text-base font-semibold text-[#dce1fb] flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#ffb4ab]" />
                Enquadramento no Código Penal Brasileiro (Decreto-Lei nº 2.848/1940)
              </h2>
              <div className="space-y-3">
                <div className="p-3.5 rounded bg-[#191f31] border border-[#23293c]">
                  <strong className="text-[#f8fafc]">Artigo 299 - Falsidade Ideológica:</strong>
                  <p className="text-xs text-[#bbcabf] mt-1">
                    "Omitir, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante."
                  </p>
                  <p className="text-xs text-[#ffb4ab] font-mono mt-1">Pena: Reclusão de 1 a 5 anos e multa.</p>
                </div>

                <div className="p-3.5 rounded bg-[#191f31] border border-[#23293c]">
                  <strong className="text-[#f8fafc]">Artigo 171 - Estelionato:</strong>
                  <p className="text-xs text-[#bbcabf] mt-1">
                    "Obter, para si ou para outrem, vantagem ilícita, em prejuízo alheio, induzindo ou mantendo alguém em erro, mediante artifício, ardil, ou qualquer outro meio fraudulento."
                  </p>
                  <p className="text-xs text-[#ffb4ab] font-mono mt-1">Pena: Reclusão de 1 a 5 anos e multa.</p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};
