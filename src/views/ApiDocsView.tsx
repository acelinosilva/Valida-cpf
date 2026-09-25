/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { 
  Terminal, 
  Code2, 
  Copy, 
  Check, 
  Play, 
  ExternalLink, 
  Server, 
  Cpu, 
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { generateCPF, generateCNPJ, validateDocument } from '../utils/engine';
import { EthicalDisclaimerBanner } from '../components/EthicalDisclaimerBanner';

interface ApiDocsViewProps {
  onCopyNotice: (msg: string) => void;
  onOpenDisclaimer: () => void;
}

export const ApiDocsView: React.FC<ApiDocsViewProps> = ({ onCopyNotice, onOpenDisclaimer }) => {
  const [selectedLang, setSelectedLang] = useState<'node' | 'python' | 'go' | 'curl'>('node');
  
  // Interactive Live REST Playground
  const [endpoint, setEndpoint] = useState<'/v1/cpf' | '/v1/cnpj' | '/v1/validate'>('/v1/cpf');
  const [testDoc, setTestDoc] = useState('272.159.185-13');
  const [responseJson, setResponseJson] = useState<string>('Clique em "Executar Chamada" para testar');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecutePlayground = () => {
    setIsExecuting(true);
    setTimeout(() => {
      if (endpoint === '/v1/cpf') {
        const cpf = generateCPF({ mask: true });
        setResponseJson(JSON.stringify({
          status: 200,
          documento: cpf,
          tipo: 'CPF',
          valido: true,
          algoritmo: 'Modulo 11 (ISO/IEC 7064)',
          timestamp: new Date().toISOString()
        }, null, 2));
      } else if (endpoint === '/v1/cnpj') {
        const cnpj = generateCNPJ({ mask: true });
        setResponseJson(JSON.stringify({
          status: 200,
          documento: cnpj,
          tipo: 'CNPJ',
          matriz: true,
          valido: true,
          algoritmo: 'Modulo 11 (ISO/IEC 7064)',
          timestamp: new Date().toISOString()
        }, null, 2));
      } else {
        const res = validateDocument(testDoc);
        setResponseJson(JSON.stringify({
          status: 200,
          documento_testado: testDoc,
          resultado: res,
          timestamp: new Date().toISOString()
        }, null, 2));
      }
      setIsExecuting(false);
      onCopyNotice('Resposta simulada em 0.4ms!');
    }, 120);
  };

  const codeSnippets = {
    node: `// 1. Instalação: npm install @validadev/core
import { generateCPF, generateCNPJ, validateDocument } from '@validadev/core';

// Gerar CPF válido com máscara oficial
const cpf = generateCPF({ mask: true, uf: 'SP' });
console.log('CPF Gerado:', cpf); // '123.456.789-01'

// Validar qualquer CPF ou CNPJ em tempo real
const analise = validateDocument('12.345.678/0001-90');
if (analise.isValid) {
  console.log('Documento íntegro e aprovado pela Receita Federal!');
} else {
  console.error('Falha de dígito:', analise.errorReason);
}`,
    python: `# 1. Instalação: pip install validadev
from validadev import generate_cpf, generate_cnpj, validate_document

# Gerar CNPJ para pipeline de testes
cnpj = generate_cnpj(mask=True, branch='matriz')
print(f"CNPJ de Teste: {cnpj}")

# Validar entrada
resultado = validate_document("272.159.185-13")
assert resultado.is_valid is True`,
    go: `package main

import (
	"fmt"
	"github.com/validadev/engine"
)

func main() {
	// Emite CPF em sub-milissegundo
	cpf := engine.GenerateCPF(engine.CPFOptions{Mask: true, UF: "SP"})
	fmt.Println("CPF Gerado:", cpf)

	// Validação de entrada de webhook
	valido := engine.ValidateCPF(cpf)
	fmt.Printf("Válido: %t\\n", valido)
}`,
    curl: `# Geração de CPF direto no terminal
curl -s "https://api.validador.dev/v1/cpf?mask=true"

# Geração de CNPJ em formato JSON
curl -s "https://api.validador.dev/v1/cnpj?filial=matriz"

# Validação via POST
curl -X POST "https://api.validador.dev/v1/validate" \\
  -H "Content-Type: application/json" \\
  -d '{"documento": "272.159.185-13"}'`
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 gap-8">
      <EthicalDisclaimerBanner onOpenDetails={onOpenDisclaimer} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#23293c]/50">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#191f31] text-[#4cd7f6] font-mono text-[10px] font-semibold uppercase mb-2 border border-[#3c4a42]/50">
            <Terminal className="w-3 h-3 text-[#4cd7f6]" />
            Developer Integration Suite
          </div>
          <h1 className="font-sans text-2xl sm:text-3xl font-semibold text-[#dce1fb] tracking-tight">
            API &amp; Integração para Pipelines de CI/CD
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#bbcabf] mt-1">
            Consuma os algoritmos oficiais diretamente no seu código Node.js, Python, Go ou execute localmente via Docker.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-[#151b2d] border border-[#23293c] font-mono text-xs text-[#bbcabf] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
            <span>REST Mock Engine v1</span>
          </div>
        </div>
      </div>

      {/* 2-Columns: Live Playground (Left) & SDK Snippets (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Playground */}
        <div className="lg:col-span-5 bg-[#151b2d] p-5 sm:p-6 rounded-xl border border-[#23293c] flex flex-col gap-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-[#23293c] pb-3">
            <h2 className="font-sans text-sm font-semibold text-[#dce1fb] flex items-center gap-2">
              <Play className="w-4 h-4 text-[#4edea3]" />
              Playground Interativo da API
            </h2>
            <span className="font-mono text-[10px] text-[#4cd7f6] uppercase">Client-Side Sandbox</span>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-[#bbcabf] font-mono">SELECIONE O ENDPOINT</label>
              <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                {(['/v1/cpf', '/v1/cnpj', '/v1/validate'] as const).map((ep) => (
                  <button
                    key={ep}
                    type="button"
                    onClick={() => {
                      setEndpoint(ep);
                      setResponseJson('Clique em "Executar Chamada" para testar');
                    }}
                    className={`py-1.5 px-2 rounded font-mono text-xs text-center transition-all ${
                      endpoint === ep
                        ? 'bg-[#23293c] text-[#4edea3] font-semibold border border-[#4edea3]/40'
                        : 'bg-[#191f31] text-[#bbcabf] hover:text-[#dce1fb] border border-[#23293c]'
                    }`}
                  >
                    {ep}
                  </button>
                ))}
              </div>
            </div>

            {endpoint === '/v1/validate' && (
              <div>
                <label className="text-xs text-[#bbcabf] font-mono">DOCUMENTO PARA TESTE</label>
                <input
                  type="text"
                  value={testDoc}
                  onChange={(e) => setTestDoc(e.target.value)}
                  className="w-full mt-1 bg-[#070d1f] text-[#dce1fb] font-mono text-xs px-3 py-2 rounded border border-[#23293c] focus:outline-none focus:border-[#4cd7f6]"
                />
              </div>
            )}

            <button
              type="button"
              onClick={handleExecutePlayground}
              disabled={isExecuting}
              className="py-2.5 px-4 rounded-lg bg-[#4edea3] hover:bg-[#10b981] text-[#003824] font-semibold text-xs flex items-center justify-center gap-2 transition-all mt-1"
            >
              <Play className="w-3.5 h-3.5 text-[#003824]" />
              <span>{isExecuting ? 'Calculando...' : 'Executar Chamada'}</span>
            </button>
          </div>

          {/* Response Container */}
          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#bbcabf]">
              <span>RESPONSE PAYLOAD (JSON)</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(responseJson);
                  onCopyNotice('Payload copiado!');
                }}
                className="hover:text-[#4edea3] flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>Copiar</span>
              </button>
            </div>
            <div className="bg-[#070d1f] p-3.5 rounded-lg border border-[#23293c] max-h-[220px] overflow-auto">
              <pre className="font-mono text-xs text-[#4cd7f6] leading-relaxed">
                <code>{responseJson}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Right: SDK Documentation */}
        <div className="lg:col-span-7 bg-[#151b2d] p-5 sm:p-6 rounded-xl border border-[#23293c] flex flex-col gap-4 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#23293c] pb-3">
            <h2 className="font-sans text-sm font-semibold text-[#dce1fb] flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#c0c1ff]" />
              SDKs &amp; Bibliotecas Oficiais
            </h2>

            <div className="flex gap-1 bg-[#191f31] p-1 rounded-lg border border-[#23293c]">
              {(['node', 'python', 'go', 'curl'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedLang(lang)}
                  className={`py-1 px-3 rounded font-mono text-xs transition-all ${
                    selectedLang === lang
                      ? 'bg-[#23293c] text-[#4edea3] font-semibold border border-[#3c4a42]/50'
                      : 'text-[#bbcabf] hover:text-[#dce1fb]'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#070d1f] p-4 rounded-lg border border-[#23293c] relative group overflow-x-auto">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(codeSnippets[selectedLang]);
                onCopyNotice(`Snippet ${selectedLang} copiado!`);
              }}
              className="absolute top-3 right-3 p-1.5 rounded bg-[#191f31] hover:bg-[#23293c] text-[#bbcabf] hover:text-[#4edea3] transition-colors border border-[#3c4a42]/40"
              title="Copiar código"
            >
              <Copy className="w-4 h-4" />
            </button>
            <pre className="font-mono text-xs text-[#dce1fb] leading-relaxed">
              <code>{codeSnippets[selectedLang]}</code>
            </pre>
          </div>

          {/* Docker Container Card */}
          <div className="p-3.5 rounded-lg bg-[#191f31] border border-[#23293c] flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#dce1fb]">
                <Server className="w-4 h-4 text-[#4cd7f6]" />
                <span>Docker Microservice Local</span>
              </div>
              <p className="text-[11px] text-[#bbcabf] mt-0.5">
                Rode o mock server localmente em containers de teste sem dependência de internet.
              </p>
            </div>
            <code className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#070d1f] text-[#4edea3] border border-[#3c4a42]/40 select-all">
              docker run -p 8080:8080 validadev/engine
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};
