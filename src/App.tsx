/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { Header, NavTab } from './components/Header';
import { Footer } from './components/Footer';
import { CommandPalette } from './components/CommandPalette';
import { EthicalDisclaimerModal } from './components/EthicalDisclaimerModal';
import { MainToolView } from './views/MainToolView';
import { BatchToolView } from './views/BatchToolView';
import { ApiDocsView } from './views/ApiDocsView';
import { ChromeExtensionView } from './views/ChromeExtensionView';
import { FaqView } from './views/FaqView';
import { AboutView } from './views/AboutView';
import { LegalView } from './views/LegalView';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('gerador-e-validador');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

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

  return (
    <div className="min-h-screen bg-[#0c1324] text-[#dce1fb] font-sans flex flex-col selection:bg-[#10b981] selection:text-[#003824]">
      {/* Fixed Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenDisclaimerModal={() => setIsDisclaimerOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full pt-16 pb-12">
        {activeTab === 'gerador-e-validador' && (
          <MainToolView
            onCopyNotice={showToast}
            onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
            onNavigateToBatch={() => {
              setActiveTab('lote-massa-de-testes');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
            onNavigateToTool={() => {
              setActiveTab('gerador-e-validador');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'politicas' && (
          <LegalView onOpenDisclaimer={() => setIsDisclaimerOpen(true)} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDisclaimerModal={() => setIsDisclaimerOpen(true)}
      />

      {/* Command Palette (⌘K) Modal */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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
      >
        <CheckCircle2 className="w-4 h-4 text-[#4edea3] shrink-0" />
        <span className="font-medium">{toastMessage}</span>
      </div>
    </div>
  );
}
