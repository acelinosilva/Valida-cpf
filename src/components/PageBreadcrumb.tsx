import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { NavTab } from './Header';
import { ROUTES } from '../routes';

interface PageBreadcrumbProps {
  currentTab: NavTab;
  onNavigate: (tab: NavTab) => void;
}

export const PageBreadcrumb: React.FC<PageBreadcrumbProps> = ({ currentTab, onNavigate }) => {
  const currentRoute = ROUTES[currentTab];
  if (!currentRoute || currentTab === 'gerador-e-validador') {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-2 pb-0 flex items-center gap-2 text-xs font-mono text-[#86948a]"
    >
      <button
        onClick={() => onNavigate('gerador-e-validador')}
        className="flex items-center gap-1.5 hover:text-[#4edea3] transition-colors focus:outline-none focus:underline"
        title="Voltar para o Gerador Principal"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Início</span>
      </button>

      <ChevronRight className="w-3.5 h-3.5 text-[#3c4a42]" />

      <span className="text-[#dce1fb] font-semibold truncate">
        {currentRoute.breadcrumbLabel}
      </span>
    </nav>
  );
};
