/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { ShieldAlert, AlertTriangle, ArrowRight } from 'lucide-react';

interface EthicalDisclaimerBannerProps {
  onOpenDetails: () => void;
}

export const EthicalDisclaimerBanner: React.FC<EthicalDisclaimerBannerProps> = ({ onOpenDetails }) => {
  return (
    <div className="w-full bg-[#151b2d] border border-[#23293c] rounded-xl p-3.5 sm:p-4 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#93000a]/20 border border-[#93000a]/40 flex items-center justify-center text-[#ffb4ab] shrink-0 mt-0.5 sm:mt-0">
            <AlertTriangle className="w-4 h-4 text-[#ffb4ab]" />
          </div>
          <div className="text-xs">
            <span className="font-semibold text-[#ffb4ab] mr-1">
              Aviso de Uso Ético e Finalidade:
            </span>
            <span className="text-[#bbcabf] leading-relaxed">
              Documentos gerados aqui são fictícios, matematicamente válidos apenas para testes de software, QA e homologação. Não utilize para fraude ou abertura de conta — isso constitui crime (Art. 299 e 171 do CPB).
            </span>
          </div>
        </div>

        <button
          onClick={onOpenDetails}
          className="shrink-0 text-xs font-mono text-[#4cd7f6] hover:text-[#4edea3] hover:underline flex items-center gap-1 transition-colors self-end sm:self-center"
        >
          <span>Termos Legais</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
