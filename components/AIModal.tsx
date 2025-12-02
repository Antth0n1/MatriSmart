import React from 'react';
import { AIAnalysisResult } from '../types';
import { Sparkles, X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AIAnalysisResult | null;
  isLoading: boolean;
}

export const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, analysis, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in transition-colors">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 animate-pulse" />
            <h2 className="text-xl font-bold">Assistente Gemini</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-gray-500 dark:text-gray-400 animate-pulse">Analisando dados das turmas...</p>
            </div>
          ) : analysis ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border flex items-start gap-3 
                ${analysis.alertLevel === 'high' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200' : 
                  analysis.alertLevel === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200' : 
                  'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'}`}>
                {analysis.alertLevel === 'high' ? <AlertTriangle className="w-6 h-6 shrink-0" /> :
                 analysis.alertLevel === 'medium' ? <Info className="w-6 h-6 shrink-0" /> :
                 <CheckCircle className="w-6 h-6 shrink-0" />}
                <div>
                  <h3 className="font-bold mb-1">Status: {analysis.alertLevel.toUpperCase()}</h3>
                  <p className="text-sm leading-relaxed">{analysis.summary}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  Recomendações Sugeridas
                </h4>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
             <p className="text-center text-gray-500 dark:text-gray-400">Nenhuma análise disponível.</p>
          )}
        </div>

        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};