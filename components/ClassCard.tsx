import React, { useState, useRef, useEffect } from 'react';
import { ClassRoom, Shift, EducationLevel } from '../types';
import { Users, UserPlus, AlertCircle, Edit2, Check, X, Accessibility, Plus, Minus, Save } from 'lucide-react';

interface ClassCardProps {
  room: ClassRoom;
  onEnroll: (roomId: string, count: number) => void;
  onUpdateCapacity: (roomId: string, newCapacity: number) => void;
  onUpdateLaudados: (roomId: string, delta: number) => void;
  onSaveClass: (roomId: string) => void;
}

const getLevelColor = (level: EducationLevel) => {
  switch (level) {
    case EducationLevel.INFANTIL: return 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/40 dark:text-pink-300 dark:border-pink-800';
    case EducationLevel.FUNDAMENTAL_1: return 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-300 dark:border-cyan-800';
    case EducationLevel.FUNDAMENTAL_2: return 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-800';
    case EducationLevel.ENSINO_MEDIO: return 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-800';
    default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300';
  }
};

export const ClassCard: React.FC<ClassCardProps> = ({ room, onEnroll, onUpdateCapacity, onUpdateLaudados, onSaveClass }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempCapacity, setTempCapacity] = useState(room.capacity);
  const [isModified, setIsModified] = useState(false); // New state to track unsaved changes
  const inputRef = useRef<HTMLInputElement>(null);

  // State for batch enrollment
  const [enrollQuantity, setEnrollQuantity] = useState(1);

  const occupancy = (room.enrolled / room.capacity) * 100;
  const isFull = room.enrolled >= room.capacity;
  const remainingSpots = room.capacity - room.enrolled;
  
  let colorClass = "bg-green-500";
  let textColorClass = "text-green-700 dark:text-green-400";
  let borderColorClass = "border-green-200 dark:border-green-800";
  
  if (occupancy >= 90) {
    colorClass = "bg-red-500";
    textColorClass = "text-red-700 dark:text-red-400";
    borderColorClass = "border-red-200 dark:border-red-800";
  } else if (occupancy >= 70) {
    colorClass = "bg-yellow-500";
    textColorClass = "text-yellow-700 dark:text-yellow-400";
    borderColorClass = "border-yellow-200 dark:border-yellow-800";
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Reset enrollment quantity if spots run out
  useEffect(() => {
    if (enrollQuantity > remainingSpots && remainingSpots > 0) {
      setEnrollQuantity(remainingSpots);
    } else if (remainingSpots === 0) {
      setEnrollQuantity(0);
    } else if (enrollQuantity === 0 && remainingSpots > 0) {
      setEnrollQuantity(1);
    }
  }, [remainingSpots]);

  const handleSaveCapacity = () => {
    if (tempCapacity >= room.enrolled) {
      onUpdateCapacity(room.id, tempCapacity);
      setIsEditing(false);
      setIsModified(true); // Mark as modified
    } else {
      alert("A nova capacidade não pode ser menor que o número de matriculados.");
    }
  };

  const handleCancelEdit = () => {
    setTempCapacity(room.capacity);
    setIsEditing(false);
  };

  const handleEnrollWrapper = () => {
    onEnroll(room.id, enrollQuantity);
    setIsModified(true); // Mark as modified
  };

  const handleUpdateLaudadosWrapper = (delta: number) => {
    onUpdateLaudados(room.id, delta);
    setIsModified(true); // Mark as modified
  };

  const handleSaveClassWrapper = () => {
    onSaveClass(room.id);
    setIsModified(false); // Reset modified state after save
  };

  const incrementEnroll = () => {
    if (enrollQuantity < remainingSpots) {
      setEnrollQuantity(prev => prev + 1);
    }
  };

  const decrementEnroll = () => {
    if (enrollQuantity > 1) {
      setEnrollQuantity(prev => prev - 1);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${borderColorClass} p-5 transition-all hover:shadow-md flex flex-col h-full`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col gap-2">
           <span className={`self-start px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getLevelColor(room.level)}`}>
            {room.level}
          </span>
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">
              {room.grade} <span className="text-gray-500 dark:text-gray-400 font-normal">- {room.name}</span>
            </h3>
            <span className={`mt-1 self-start px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${room.shift === Shift.MORNING ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
              {room.shift}
            </span>
          </div>
        </div>
        {isFull && <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />}
      </div>
      
      <div className="text-xs text-gray-400 mb-4 font-mono">ID: {room.id}</div>

      <div className="mb-4 mt-auto">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400 font-medium">Ocupação</span>
          <span className={`font-bold ${textColorClass}`}>{Math.round(occupancy)}%</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div 
            className={`h-2.5 rounded-full ${colorClass} transition-all duration-500`} 
            style={{ width: `${Math.min(occupancy, 100)}%` }}
          ></div>
        </div>
        
        {/* Enrolled and Capacity Controls */}
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-2 h-8 border-b border-gray-50 dark:border-gray-700 pb-2">
          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Matriculados: {room.enrolled}</span>
          
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-1 animate-fade-in">
                <span className="text-xs">Max:</span>
                <input
                  ref={inputRef}
                  type="number"
                  min={room.enrolled}
                  className="w-12 border rounded px-1 py-0.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={tempCapacity}
                  onChange={(e) => setTempCapacity(parseInt(e.target.value) || 0)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveCapacity()}
                />
                <button onClick={handleSaveCapacity} className="p-0.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded">
                  <Check className="w-3 h-3" />
                </button>
                <button onClick={handleCancelEdit} className="p-0.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 group">
                <span>Max: {room.capacity}</span>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                  title="Alterar capacidade"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Laudados Control */}
        <div className="flex justify-between items-center text-xs mt-2 pt-1">
          <span 
            className="flex items-center gap-1.5 font-medium text-purple-700 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300 px-2.5 py-1 rounded-full border border-purple-100 dark:border-purple-800/50 cursor-help transition-colors hover:bg-purple-100 dark:hover:bg-purple-900/50"
            title="Alunos com laudo médico/necessidades especiais"
          >
            <Accessibility className="w-3.5 h-3.5" /> 
            <span>Laudados: {room.laudados || 0}</span>
          </span>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => handleUpdateLaudadosWrapper(-1)}
              disabled={!room.laudados || room.laudados <= 0}
              className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-50"
            >
              <Minus className="w-3 h-3" />
            </button>
            <button 
              onClick={() => handleUpdateLaudadosWrapper(1)}
              disabled={room.laudados >= room.enrolled}
              className="w-6 h-6 flex items-center justify-center rounded bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 disabled:opacity-50"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-1">
            <button
              onClick={decrementEnroll}
              disabled={enrollQuantity <= 1 || isFull}
              className="w-8 h-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="number"
              min="1"
              max={remainingSpots}
              value={enrollQuantity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 1 && val <= remainingSpots) {
                  setEnrollQuantity(val);
                }
              }}
              disabled={isFull}
              className="w-10 text-center bg-transparent border-none focus:ring-0 p-0 text-sm font-bold text-gray-800 dark:text-white"
            />
            <button
              onClick={incrementEnroll}
              disabled={enrollQuantity >= remainingSpots || isFull}
              className="w-8 h-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleEnrollWrapper}
            disabled={isFull || enrollQuantity < 1}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors
              ${isFull 
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow dark:bg-indigo-700 dark:hover:bg-indigo-600'
              }`}
          >
            <UserPlus className="w-4 h-4" />
            {isFull ? 'Lotada' : `Matricular ${enrollQuantity}`}
          </button>
        </div>

        {/* Save Button - Only visible when modified */}
        {isModified && (
          <button
            onClick={handleSaveClassWrapper}
            className="w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 shadow-sm transition-all animate-fade-in dark:bg-green-700 dark:hover:bg-green-600"
          >
            <Save className="w-4 h-4" />
            Salvar Turma
          </button>
        )}
      </div>
    </div>
  );
};