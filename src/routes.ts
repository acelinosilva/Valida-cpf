import { NavTab } from './components/Header';

export interface RouteConfig {
  tab: NavTab;
  path: string;
  title: string;
  description: string;
  breadcrumbLabel: string;
}

export const ROUTES: Record<NavTab, RouteConfig> = {
  'gerador-e-validador': {
    tab: 'gerador-e-validador',
    path: '/',
    title: 'Gerador e Validador Grátis de CPF e CNPJ Atualizado | Gerar CPF',
    description: 'Gerador e validador grátis de CPF e CNPJ atualizado com algoritmo oficial. Crie números válidos para testes ou confira documentos instantaneamente sem cadastro.',
    breadcrumbLabel: 'Início / Ferramenta'
  },
  'lote-massa-de-testes': {
    tab: 'lote-massa-de-testes',
    path: '/lote',
    title: 'Gerador em Lote de CPF e CNPJ para Testes e QA | Gerar CPF',
    description: 'Gere até 500 CPFs e CNPJs sintéticos em lote. Exporte em JSON, CSV, SQL ou scripts prontos para Playwright, Cypress e k6.',
    breadcrumbLabel: 'Gerador em Lote'
  },
  'faq': {
    tab: 'faq',
    path: '/faq',
    title: 'Perguntas Frequentes (FAQ) sobre CPF, CNPJ e Módulo 11 | Gerar CPF',
    description: 'Tire dúvidas sobre algoritmo Módulo 11, novo CNPJ alfanumérico 2026, regras da Receita Federal e uso ético de documentos sintéticos.',
    breadcrumbLabel: 'Perguntas Frequentes (FAQ)'
  },
  'sobre': {
    tab: 'sobre',
    path: '/sobre',
    title: 'Sobre a Plataforma e Engenharia Client-Side | Gerar CPF',
    description: 'Conheça a arquitetura sandbox 100% local no navegador, o manifesto de privacidade e a história do projeto Gerar CPF.',
    breadcrumbLabel: 'Sobre o Projeto'
  },
  'politicas': {
    tab: 'politicas',
    path: '/politicas',
    title: 'Políticas de Privacidade, Termos de Uso e LGPD | Gerar CPF',
    description: 'Termos de uso, conformidade total com a Lei Geral de Proteção de Dados (LGPD) e diretrizes éticas para simulação de software.',
    breadcrumbLabel: 'Políticas & Termos'
  },
  'api-e-integracao': {
    tab: 'api-e-integracao',
    path: '/api',
    title: 'Documentação da API e Integrações | Gerar CPF',
    description: 'Exemplos de chamadas cURL, bibliotecas npm e integração de validação e geração sintética de documentos brasileiros.',
    breadcrumbLabel: 'API & Integrações'
  },
  'extensao-chrome': {
    tab: 'extensao-chrome',
    path: '/extensao',
    title: 'Extensão para Navegador e Atalhos Rápidos | Gerar CPF',
    description: 'Preencha formulários de teste com 1 clique direto no Chrome, Firefox ou Edge sem trocar de aba.',
    breadcrumbLabel: 'Extensão de Navegador'
  }
};

/**
 * Converte o pathname atual do navegador na respectiva NavTab
 */
export function getTabFromPath(pathname: string): NavTab {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  
  // Suporte a rotas limpas
  for (const route of Object.values(ROUTES)) {
    if (route.path === cleanPath) {
      return route.tab;
    }
  }

  // Suporte a query params legados (ex: ?tab=faq ou ?page=lote)
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') || params.get('page');
    if (tabParam && tabParam in ROUTES) {
      return tabParam as NavTab;
    }
    if (tabParam === 'lote') return 'lote-massa-de-testes';
    if (tabParam === 'inicio') return 'gerador-e-validador';
  }

  return 'gerador-e-validador';
}
