import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showBadge = false 
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Emblema Gráfico Profissional (Escudo de Validação Criptográfica) */}
      <div className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-br from-[#192638] to-[#0c1524] border border-[#4edea3]/40 p-1 flex items-center justify-center shadow-[0_0_12px_rgba(78,222,163,0.15)] group-hover:border-[#4edea3] transition-all`}>
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
        >
          {/* Escudo */}
          <path 
            d="M16 2.5C23 5 28 7.5 28 13.5C28 22.5 21 27.5 16 30C11 27.5 4 22.5 4 13.5C4 7.5 9 5 16 2.5Z" 
            fill="#0f192b"
            stroke="url(#logoGreen)" 
            strokeWidth="1.8" 
            strokeLinejoin="round"
          />
          {/* Arco decorativo ciano */}
          <path 
            d="M11 9C13 8 15 7.5 16 7.5C17 7.5 19 8 21 9" 
            stroke="#4cd7f6" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
            opacity="0.8"
          />
          {/* Checkmark dinâmico */}
          <path 
            d="M10 16.5L14.2 20.7L22.5 12" 
            stroke="url(#logoGreen)" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="logoGreen" x1="4" y1="2.5" x2="28" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4edea3" />
              <stop offset="1" stopColor="#22c55e" />
            </linearGradient>
          </defs>
        </svg>

        {/* Ponto indicador de estado de prontidão */}
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#4edea3] shadow-[0_0_6px_#4edea3]" />
      </div>

      {/* Tipografia da Marca */}
      <div className="flex flex-col">
        <span className={`font-sans font-bold tracking-tight text-[#dce1fb] leading-none ${textSizes[size]}`}>
          Gerar <span className="text-[#4edea3]">CPF</span>
        </span>
        {showBadge && (
          <span className="font-mono text-[9px] text-[#86948a] uppercase tracking-wider mt-0.5">
            &amp; CNPJ Validador
          </span>
        )}
      </div>
    </div>
  );
};
