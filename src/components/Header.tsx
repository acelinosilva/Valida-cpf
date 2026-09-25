/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { Logo } from './Logo';
import { 
  ShieldCheck, 
  Search, 
  Menu, 
  X, 
  HelpCircle, 
  FileText, 
  Info, 
  Layers, 
  Sparkles 
} from 'lucide-react';

export type NavTab = 
  | 'gerador-e-validador'
  | 'lote-massa-de-testes'
  | 'api-e-integracao'
  | 'extensao-chrome'
  | 'faq'
  | 'sobre'
  | 'politicas';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSearch: () => void;
  onOpenDisclaimerModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenSearch,
  onOpenDisclaimerModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'gerador-e-validador', label: 'Gerador & Validador', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'lote-massa-de-testes', label: 'Lote / Massa de Testes', icon: <Layers className="w-4 h-4" /> },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'sobre', label: 'Sobre', icon: <Info className="w-4 h-4" /> },
    { id: 'politicas', label: 'Políticas & Termos', icon: <FileText className="w-4 h-4" /> },
  ];

  const handleNavClick = (id: NavTab) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-[#0c1324]/85 backdrop-blur-xl border-b border-[#23293c]/60 shadow-[0_1px_8px_rgba(0,0,0,0.35)]">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand & Desktop Navigation */}
        <div className="flex items-center gap-6 xl:gap-8">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('gerador-e-validador')}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4edea3] rounded-lg p-1 group text-left transition-transform active:scale-95"
            aria-label="Ir para Gerador e Validador"
          >
            <Logo size="md" />
          </button>

          {/* RFB Badge - Desktop */}
          <div className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#23293c] text-[#4cd7f6] font-mono text-[10px] font-semibold tracking-wider uppercase border border-[#3c4a42]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
            RFB 100% Atualizado
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navegação Principal">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'text-[#4edea3] bg-[#191f31] border border-[#3c4a42]/70 font-semibold shadow-sm'
                      : 'text-[#bbcabf] hover:text-[#dce1fb] hover:bg-[#191f31]/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Icons & Badges */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Search / Command Palette Trigger */}
          <button
            onClick={onOpenSearch}
            type="button"
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#23293c] hover:bg-[#33394c] text-[#bbcabf] hover:text-[#dce1fb] transition-all border border-[#3c4a42]/40 shadow-sm active:scale-95"
            title="Buscar ferramenta ou atalhos (⌘K)"
          >
            <Search className="w-4 h-4 text-[#bbcabf]" />
            <span className="font-mono text-xs hidden md:inline">Buscar recurso</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#070d1f] text-[#4cd7f6] font-mono text-[10px] border border-[#3c4a42]/30">
              ⌘K
            </kbd>
          </button>

          {/* Ethical Usage / Info Quick Trigger */}
          <button
            onClick={onOpenDisclaimerModal}
            type="button"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#191f31] hover:bg-[#23293c] text-[#bbcabf] hover:text-[#4edea3] text-xs font-medium transition-colors border border-[#3c4a42]/40"
            title="Aviso de Uso Ético e Legal"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#4edea3]" />
            <span className="hidden xl:inline">Uso Ético</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#191f31] text-[#dce1fb] hover:bg-[#23293c] transition-colors border border-[#3c4a42]/50"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c1324] border-b border-[#23293c] px-4 py-4 flex flex-col gap-1.5 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#23293c]/70 text-xs font-mono text-[#bbcabf]">
            <span>NAVEGAÇÃO PRINCIPAL</span>
            <span className="text-[#4edea3] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-ping"></span>
              RFB 100% Client-Side
            </span>
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all ${
                  isActive
                    ? 'bg-[#191f31] text-[#4edea3] font-medium border border-[#3c4a42]'
                    : 'text-[#bbcabf] hover:bg-[#151b2d] hover:text-[#dce1fb]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 mt-2 border-t border-[#23293c]/70 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                onOpenDisclaimerModal();
                setMobileMenuOpen(false);
              }}
              className="text-[#4edea3] hover:underline flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Aviso Legal &amp; Uso Ético</span>
            </button>
            <span className="text-[#86948a] font-mono text-[11px]">v3.4 WASM</span>
          </div>
        </div>
      )}
    </header>
  );
};
