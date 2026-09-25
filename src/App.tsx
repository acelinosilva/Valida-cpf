/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Header, NavTab } from './components/Header';
import { Footer } from './components/Footer';
import { CommandPalette } from './components/CommandPalette';
import { EthicalDisclaimerModal } from './components/EthicalDisclaimerModal';
import { PageBreadcrumb } from './components/PageBreadcrumb';
import { MainToolView } from './views/MainToolView';
import { BatchToolView } from './views/BatchToolView';
import { ApiDocsView } from './views/ApiDocsView';
import { ChromeExtensionView } from './views/ChromeExtensionView';
import { FaqView } from './views/FaqView';
import { AboutView } from './views/AboutView';
import { LegalView } from './views/LegalView';
import { ROUTES, getTabFromPath } from './routes';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // Inicializa a rota a partir da URL do navegador
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    if (typeof window !== 'undefined') {
      return getTabFromPath(window.location.pathname);
    }
    return 'gerador-e-validador';
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  // Atualiza o <title>, meta tag description, meta tag canonical e URL do browser com pushState
  const navigateTo = useCallback((tab: NavTab, replace = false) => {
    setActiveTab(tab);
    const targetRoute = ROUTES[tab] || ROUTES['gerador-e-validador'];

    // Atualiza metatags para SEO
    document.title = targetRoute.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', targetRoute.description);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', targetRoute.title);
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', targetRoute.description);
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      const fullUrl = `https://gerarcpfecnpj.vercel.app${targetRoute.path === '/' ? '' : targetRoute.path}`;
      canonical.setAttribute('href', fullUrl);
    }

    // Atualiza a URL na barra de endereços (sem reload)
    const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
    if (currentPath !== targetRoute.path) {
      if (replace) {
        window.history.replaceState({ tab }, '', targetRoute.path);
      } else {
        window.history.pushState({ tab }, '', targetRoute.path);
      }
    }
  }, []);

  // Escuta botões Voltar / Avançar do navegador (popstate)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab) {
        setActiveTab(event.state.tab);
      } else {
        const detectedTab = getTabFromPath(window.location.pathname);
        setActiveTab(detectedTab);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sincroniza estado inicial no primeiro carregamento
  useEffect(() => {
    const initialTab = getTabFromPath(window.location.pathname);
    navigateTo(initialTab, true);
  }, [navigateTo]);

  // Toast Timer
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2400);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Global Keydown Listener for ⌘K or Ctrl+K
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleNavClick = (tab: NavTab) => {
    navigateTo(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0c1324] text-[#dce1fb] font-sans flex flex-col selection:bg-[#10b981] selection:text-[#003824]">
      {/* Fixed Header com links SEO */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleNavClick}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenDisclaimerModal={() => setIsDisclaimerOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full pt-20 pb-12 flex flex-col">
        {/* Breadcrumb em subpáginas */}
        <PageBreadcrumb currentTab={activeTab} onNavigate={handleNavClick} />

        {activeTab === 'gerador-e-validador' && (
          <MainToolView
            onCopyNotice={showToast}
            onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
            onNavigateToBatch={() => handleNavClick('lote-massa-de-testes')}
          />
        )}

        {activeTab === 'lote-massa-de-testes' && (
          <BatchToolView
            onCopyNotice={showToast}
            onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
          />
        )}

        {activeTab === 'api-e-integracao' && (
          <ApiDocsView
            onCopyNotice={showToast}
            onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
          />
        )}

        {activeTab === 'extensao-chrome' && (
          <ChromeExtensionView
            onCopyNotice={showToast}
            onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
          />
        )}

        {activeTab === 'faq' && (
          <FaqView onOpenDisclaimer={() => setIsDisclaimerOpen(true)} />
        )}

        {activeTab === 'sobre' && (
          <AboutView
            onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
            onNavigateToTool={() => handleNavClick('gerador-e-validador')}
          />
        )}

        {activeTab === 'politicas' && (
          <LegalView onOpenDisclaimer={() => setIsDisclaimerOpen(true)} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavClick}
        onOpenDisclaimerModal={() => setIsDisclaimerOpen(true)}
      />

      {/* Command Palette (⌘K) Modal */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavClick}
        onCopyDoc={(doc, label) => {
          showToast(`${label}: ${doc}`);
        }}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
      />

      {/* Ethical Usage / Legal Compliance Modal */}
      <EthicalDisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />

      {/* Floating Animated Toast Notification */}
      <div
        className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg bg-[#23293c] text-[#dce1fb] border border-[#4edea3]/40 shadow-2xl flex items-center gap-2.5 font-sans text-xs transition-all duration-300 pointer-events-none ${
          toastMessage
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4'
        }`}
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="w-4 h-4 text-[#4edea3] shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}
