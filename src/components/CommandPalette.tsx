/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  Layers, 
  Terminal, 
  HelpCircle, 
  Info, 
  FileText, 
  Copy, 
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { NavTab } from './Header';
import { generateCPF, generateCNPJ } from '../utils/engine';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab) => void;
  onCopyDoc: (doc: string, label: string) => void;
  onOpenDisclaimer: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Ações Rápidas' | 'Navegação' | 'Legal & Suporte';
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onCopyDoc,
  onOpenDisclaimer
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    {
      id: 'gen-cpf-masked',
      title: 'Gerar CPF Formatado e Copiar',
      subtitle: 'Emite CPF matematicamente válido com máscara (000.000.000-00)',
      category: 'Ações Rápidas',
      icon: <Sparkles className="w-4 h-4 text-[#4edea3]" />,
      action: () => {
        const cpf = generateCPF({ mask: true });
        onCopyDoc(cpf, 'CPF copiado');
        onClose();
      }
    },
    {
      id: 'gen-cpf-raw',
      title: 'Gerar CPF Sem Pontuação (Raw)',
      subtitle: 'Emite CPF válido somente com 11 dígitos numéricos',
      category: 'Ações Rápidas',
      icon: <Sparkles className="w-4 h-4 text-[#4edea3]" />,
      action: () => {
        const cpf = generateCPF({ mask: false });
        onCopyDoc(cpf, 'CPF (sem máscara) copiado');
        onClose();
      }
    },
    {
      id: 'gen-cnpj-matriz',
      title: 'Gerar CNPJ Matriz Formatado',
      subtitle: 'Emite CNPJ válido padrão /0001 com dígitos calculados',
      category: 'Ações Rápidas',
      icon: <Sparkles className="w-4 h-4 text-[#4cd7f6]" />,
      action: () => {
        const cnpj = generateCNPJ({ mask: true, branchMode: 'matriz' });
        onCopyDoc(cnpj, 'CNPJ Matriz copiado');
        onClose();
      }
    },
    {
      id: 'gen-cnpj-alpha',
      title: 'Gerar Novo CNPJ Alfanumérico 2026',
      subtitle: 'Padrão alfanumérico oficial da Receita Federal (RFB 2026)',
      category: 'Ações Rápidas',
      icon: <Sparkles className="w-4 h-4 text-[#4cd7f6]" />,
      action: () => {
        const cnpj = generateCNPJ({ mask: true, alphanumeric: true });
        onCopyDoc(cnpj, 'CNPJ Alfanumérico copiado');
        onClose();
      }
    },
    {
      id: 'nav-validator',
      title: 'Abrir Gerador & Validador (Raio-X)',
      subtitle: 'Auditoria e cálculo em tempo real Módulo 11',
      category: 'Navegação',
      icon: <Sparkles className="w-4 h-4 text-[#4edea3]" />,
      action: () => {
        onNavigate('gerador-e-validador');
        onClose();
      }
    },
    {
      id: 'nav-batch',
      title: 'Abrir Gerador de Lote e Massa de Testes',
      subtitle: 'Gerar de 1 a 500 registros, perfis sintéticos, CSV/JSON/SQL',
      category: 'Navegação',
      icon: <Layers className="w-4 h-4 text-[#c0c1ff]" />,
      action: () => {
        onNavigate('lote-massa-de-testes');
        onClose();
      }
    },
    {
      id: 'nav-api',
      title: 'Ver Documentação de API & Integração',
      subtitle: 'Playwright, Cypress, k6, TypeScript SDK e cURL',
      category: 'Navegação',
      icon: <Terminal className="w-4 h-4 text-[#4cd7f6]" />,
      action: () => {
        onNavigate('api-e-integracao');
        onClose();
      }
    },
    {
      id: 'nav-chrome',
      title: 'Ver Extensão Google Chrome',
      subtitle: 'Preenchimento automático em 1 clique para formulários',
      category: 'Navegação',
      icon: <ExternalLink className="w-4 h-4 text-[#bbcabf]" />,
      action: () => {
        onNavigate('extensao-chrome');
        onClose();
      }
    },
    {
      id: 'nav-faq',
      title: 'Perguntas Frequentes (FAQ)',
      subtitle: 'Dúvidas sobre o Módulo 11, novo CNPJ 2026, limites e legalidade',
      category: 'Legal & Suporte',
      icon: <HelpCircle className="w-4 h-4 text-[#bbcabf]" />,
      action: () => {
        onNavigate('faq');
        onClose();
      }
    },
    {
      id: 'nav-about',
      title: 'Sobre o Projeto ValidaDev',
      subtitle: 'Arquitetura client-side, sandbox local e manifesto',
      category: 'Legal & Suporte',
      icon: <Info className="w-4 h-4 text-[#bbcabf]" />,
      action: () => {
        onNavigate('sobre');
        onClose();
      }
    },
    {
      id: 'nav-legal',
      title: 'Políticas de Privacidade & Termos de Uso',
      subtitle: 'Conformidade com a LGPD e regras de uso aceitável',
      category: 'Legal & Suporte',
      icon: <FileText className="w-4 h-4 text-[#bbcabf]" />,
      action: () => {
        onNavigate('politicas');
        onClose();
      }
    },
    {
      id: 'open-disclaimer',
      title: 'Ver Aviso Legal Obrigatório (Art. 299 / 171)',
      subtitle: 'Detalhes sobre finalidade ética e restrição contra fraudes',
      category: 'Legal & Suporte',
      icon: <ShieldCheck className="w-4 h-4 text-[#ffb4ab]" />,
      action: () => {
        onOpenDisclaimer();
        onClose();
      }
    }
  ];

  const filteredCommands = commands.filter((cmd) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation inside palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-[#0f172a] border border-[#334155] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 bg-[#1e293b]/60 border-b border-[#334155]/60 gap-3">
          <Search className="w-5 h-5 text-[#94a3b8] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite um comando, ferramenta ou ação (ex: CPF, Lote, API)..."
            className="w-full bg-transparent text-sm text-[#f8fafc] placeholder-[#64748b] focus:outline-none font-sans"
          />
          <kbd className="px-2 py-0.5 rounded bg-[#020617] text-[#94a3b8] font-mono text-[10px] border border-[#334155]/40 shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-[#1e293b]/40">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#94a3b8]">
              Nenhum recurso encontrado para "{query}". Tente "CPF", "CNPJ", "Lote" ou "API".
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between gap-3 transition-colors ${
                    isSelected
                      ? 'bg-[#1e293b] text-[#f8fafc] border border-[#4edea3]/30'
                      : 'text-[#cbd5e1] hover:bg-[#1e293b]/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded bg-[#020617] border border-[#334155]/40 flex items-center justify-center shrink-0">
                      {cmd.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-[#f8fafc] truncate flex items-center gap-2">
                        <span>{cmd.title}</span>
                        <span className="text-[10px] font-mono text-[#64748b] px-1.5 py-0.2 rounded bg-[#020617] hidden sm:inline">
                          {cmd.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#94a3b8] truncate">{cmd.subtitle}</div>
                    </div>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#4edea3]' : 'text-transparent'}`} />
                </button>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-4 py-2.5 bg-[#020617]/70 border-t border-[#334155]/40 flex items-center justify-between text-[11px] font-mono text-[#64748b]">
          <div className="flex items-center gap-3">
            <span><kbd className="text-[#94a3b8]">↑↓</kbd> navegar</span>
            <span><kbd className="text-[#94a3b8]">↵</kbd> executar</span>
          </div>
          <span>ValidaDev Engine 100% Local</span>
        </div>
      </div>
    </div>
  );
};
