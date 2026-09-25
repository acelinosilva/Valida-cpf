/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  ShieldCheck, 
  AlertTriangle,
  Scale,
  Sparkles
} from 'lucide-react';
import { EthicalDisclaimerBanner } from '../components/EthicalDisclaimerBanner';

interface FaqItem {
  id: string;
  category: 'Legal & Uso' | 'Algoritmos' | 'Segurança & LGPD' | 'Ferramentas';
  question: string;
  answer: string;
}

interface FaqViewProps {
  onOpenDisclaimer: () => void;
}

export const FaqView: React.FC<FaqViewProps> = ({ onOpenDisclaimer }) => {
  const [search, setSearch] = useState('');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-2': true
  });

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'Legal & Uso',
      question: 'Os números de CPF e CNPJ gerados pertencem a pessoas ou empresas reais?',
      answer: 'Não. Todos os números emitidos pelo ValidaDev são gerados de forma estritamente sintética e probabilística por cálculos matemáticos em seu próprio navegador. Eles cumprem a regra de validação dos dígitos verificadores (Módulo 11), mas não correspondem a registros de pessoas físicas ou jurídicas na base oficial da Receita Federal.'
    },
    {
      id: 'faq-2',
      category: 'Legal & Uso',
      question: 'Posso usar os números gerados para abrir contas bancárias ou contratar serviços?',
      answer: 'Absolutamente NÃO. A utilização de dados fictícios para fins de cadastro comercial, abertura de contas bancárias, emissão de cartões ou obtenção de vantagem ilícita constitui crime tipificado no Código Penal Brasileiro (Art. 299 - Falsidade Ideológica e Art. 171 - Estelionato). Esta ferramenta destina-se única e exclusivamente a testes de software, homologação e garantia de qualidade (QA).'
    },
    {
      id: 'faq-3',
      category: 'Algoritmos',
      question: 'O que é o algoritmo Módulo 11 e como ele funciona na validação dos documentos?',
      answer: 'O Módulo 11 é uma técnica de verificação de integridade estabelecida pela norma internacional ISO/IEC 7064. Cada dígito do documento é multiplicado por um peso decrescente (de 10 a 2 no primeiro dígito do CPF; e de 11 a 2 no segundo). A soma desses produtos é dividida por 11, e o resto da divisão determina o dígito verificador. Se o resto for menor que 2, o dígito é 0; caso contrário, é 11 menos o resto.'
    },
    {
      id: 'faq-4',
      category: 'Algoritmos',
      question: 'Por que CPFs com todos os dígitos iguais (ex: 111.111.111-11) são considerados inválidos?',
      answer: 'Matematicamente, sequências repetidas como 111.111.111-11 ou 222.222.222-22 resultam em restos de divisão que satisfazem a fórmula do Módulo 11. No entanto, por determinação expressa da Receita Federal do Brasil, todos os números com 11 dígitos repetitivos foram colocados em uma "blacklist" e são sumariamente rejeitados para evitar falsificações triviais.'
    },
    {
      id: 'faq-5',
      category: 'Algoritmos',
      question: 'Como funciona o novo padrão de CNPJ Alfanumérico da Receita Federal para 2026?',
      answer: 'Diante do esgotamento iminente das combinações estritamente numéricas, a Receita Federal (Instrução Normativa RFB nº 2.229/2024) determinou que os novos CNPJs poderão conter letras (A a Z) e números nas 12 primeiras posições (raiz e filial). Os dois últimos dígitos permanecem exclusivamente numéricos e continuam sendo calculados via Módulo 11, convertendo cada caractere alfanumérico para seu respectivo valor da tabela ASCII menos 48.'
    },
    {
      id: 'faq-6',
      category: 'Segurança & LGPD',
      question: 'Os números digitados no validador são enviados para algum servidor ou salvos em banco?',
      answer: 'Zero envio e zero armazenamento. O ValidaDev opera com uma arquitetura estritamente client-side: todo o cálculo ocorre em milissegundos dentro da máquina do usuário através do motor JavaScript/WebAssembly do navegador. Não há tráfego de rede para APIs de validação e nenhum banco de dados de retenção.'
    },
    {
      id: 'faq-7',
      category: 'Segurança & LGPD',
      question: 'Como o ValidaDev garante conformidade com a LGPD (Lei Geral de Proteção de Dados)?',
      answer: 'Como o ValidaDev nunca coleta, transmite, processa em nuvem ou armazena dados de pessoas reais, ele não gera qualquer passivo de tratamento de dados pessoais conforme a Lei 13.709/2018. Para as equipes de QA e desenvolvimento, utilizar nossos dados sintéticos em vez de copiar bases de produção é a prática padrão exigida por auditorias de segurança e conformidade.'
    },
    {
      id: 'faq-8',
      category: 'Ferramentas',
      question: 'Existe algum limite de geração gratuita ou necessidade de cadastro?',
      answer: 'Não. O ValidaDev é 100% gratuito e não exige cadastro, login ou fornecimento de e-mail. Você pode gerar quantos documentos precisar, tanto individualmente quanto em lotes de até 500 registros por vez para suas esteiras de CI/CD.'
    }
  ];

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = faqs.filter(
    (item) =>
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 gap-8">
      <EthicalDisclaimerBanner onOpenDetails={onOpenDisclaimer} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#23293c]/50">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#191f31] text-[#4cd7f6] font-mono text-[10px] font-semibold uppercase mb-2 border border-[#3c4a42]/50">
            <HelpCircle className="w-3 h-3 text-[#4cd7f6]" />
            Base de Conhecimento Técnico
          </div>
          <h1 className="font-sans text-2xl sm:text-3xl font-semibold text-[#dce1fb] tracking-tight">
            Perguntas Frequentes &amp; FAQ
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#bbcabf] mt-1">
            Respostas detalhadas sobre algoritmos, enquadramento legal, segurança da informação e uso ético.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#86948a] absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filtrar perguntas por tema (ex: LGPD, Módulo 11, Alfanumérico, Crime)..."
          className="w-full bg-[#151b2d] text-[#dce1fb] placeholder:text-[#86948a] text-xs sm:text-sm font-sans pl-10 pr-4 py-3 rounded-xl border border-[#23293c] focus:outline-none focus:border-[#4edea3] transition-colors"
        />
      </div>

      {/* FAQ Accordion List */}
      <div className="flex flex-col gap-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center bg-[#151b2d] rounded-xl border border-[#23293c] text-xs text-[#bbcabf]">
            Nenhuma pergunta encontrada com o termo "{search}". Tente buscar por "Módulo 11" ou "LGPD".
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = !!openIds[faq.id];
            return (
              <div
                key={faq.id}
                className="bg-[#151b2d] border border-[#23293c] rounded-xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#191f31]/60 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-[#070d1f] text-[#4cd7f6] border border-[#3c4a42]/40 self-start">
                      {faq.category}
                    </span>
                    <span className="font-sans text-xs sm:text-sm font-semibold text-[#dce1fb]">
                      {faq.question}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#4edea3] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#86948a] shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs text-[#bbcabf] leading-relaxed border-t border-[#23293c]/60">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
