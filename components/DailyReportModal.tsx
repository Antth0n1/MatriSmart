import React, { useState, useMemo } from 'react';
import { LogEntry, LogType } from '../types';
import { Calendar, X, FileText, Users, Settings, Accessibility, Clock, Filter, AlertCircle } from 'lucide-react';

interface DailyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogEntry[];
}

export const DailyReportModal: React.FC<DailyReportModalProps> = ({ isOpen, onClose, logs }) => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const filteredLogs = useMemo(() => {
    return logs
      .filter(log => log.date === selectedDate)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [logs, selectedDate]);

  const stats = useMemo(() => {
    return {
      total: filteredLogs.length,
      matriculas: filteredLogs.filter(l => l.type === 'MATRICULA').length,
      capacidade: filteredLogs.filter(l => l.type === 'CAPACIDADE').length,
      laudados: filteredLogs.filter(l => l.type === 'LAUDADO').length,
    };
  }, [filteredLogs]);

  if (!isOpen) return null;

  const getIcon = (type: LogType) => {
    switch (type) {
      case 'MATRICULA': return <Users className="w-4 h-4 text-indigo-500" />;
      case 'CAPACIDADE': return <Settings className="w-4 h-4 text-orange-500" />;
      case 'LAUDADO': return <Accessibility className="w-4 h-4 text-purple-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getBadgeColor = (type: LogType) => {
    switch (type) {
      case 'MATRICULA': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'CAPACIDADE': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'LAUDADO': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transition-colors">
        
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 p-6 border-b dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Relatório Diário</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Acompanhe as movimentações por data</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900/50">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700 shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Total Ações</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.total}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700 shadow-sm border-l-4 border-l-indigo-500">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Matrículas</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{stats.matriculas}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700 shadow-sm border-l-4 border-l-orange-500">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Capacidade</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">{stats.capacidade}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700 shadow-sm border-l-4 border-l-purple-500">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Laudados</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.laudados}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Linha do Tempo
            </h3>
            
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 border-dashed">
                <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">Nenhum registro encontrado para esta data.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 shadow-sm flex items-start gap-4 transition-all hover:shadow-md">
                    <div className={`p-2 rounded-lg shrink-0 mt-1 ${getBadgeColor(log.type)}`}>
                      {getIcon(log.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {log.details}
                        </p>
                        <span className="text-xs text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {log.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                          {log.className}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                          ID: {log.classId}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};