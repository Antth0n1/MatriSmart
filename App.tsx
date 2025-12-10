import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Sun, 
  Moon, 
  Search, 
  Sparkles,
  PieChart,
  BookOpen,
  Baby,
  School,
  Backpack,
  Filter,
  CheckCircle2,
  Accessibility,
  Download,
  Menu,
  X,
  Palette,
  FileText,
  LogOut,
  User as UserIcon,
  Shield,
  Users
} from 'lucide-react';
import { ClassRoom, ClassName, Shift, EducationLevel, AIAnalysisResult, LogEntry, LogType, User, UserRole } from './types';
import { ClassCard } from './components/ClassCard';
import { MetricsChart } from './components/MetricsChart';
import { LevelOccupancyChart } from './components/LevelOccupancyChart';
import { analyzeCapacity } from './services/geminiService';
import { AIModal } from './components/AIModal';
import { DailyReportModal } from './components/DailyReportModal';
import { AuthPages } from './components/AuthPages';
import { UserManagementModal } from './components/UserManagementModal';

// Initial Mock Data with specific grades for Infantil and generic for others
const INITIAL_CLASSES: ClassRoom[] = [
  // --- INFANTIL ---
  // Maternal
  { id: 'inf-mat-a', name: ClassName.A, grade: 'Maternal', shift: Shift.MORNING, level: EducationLevel.INFANTIL, capacity: 15, enrolled: 10, laudados: 1 },
  { id: 'inf-mat-b', name: ClassName.B, grade: 'Maternal', shift: Shift.AFTERNOON, level: EducationLevel.INFANTIL, capacity: 15, enrolled: 8, laudados: 0 },
  // Nível 1
  { id: 'inf-n1-a', name: ClassName.A, grade: 'Nível 1', shift: Shift.MORNING, level: EducationLevel.INFANTIL, capacity: 20, enrolled: 18, laudados: 2 },
  { id: 'inf-n1-b', name: ClassName.B, grade: 'Nível 1', shift: Shift.AFTERNOON, level: EducationLevel.INFANTIL, capacity: 20, enrolled: 12, laudados: 0 },
  // Nível 2
  { id: 'inf-n2-a', name: ClassName.A, grade: 'Nível 2', shift: Shift.MORNING, level: EducationLevel.INFANTIL, capacity: 20, enrolled: 19, laudados: 1 },
  { id: 'inf-n2-b', name: ClassName.B, grade: 'Nível 2', shift: Shift.AFTERNOON, level: EducationLevel.INFANTIL, capacity: 20, enrolled: 8, laudados: 0 },
  
  // --- FUNDAMENTAL 1 (1º ao 5º Ano, A a C) ---
  // 1º Ano
  { id: 'fun1-1a', name: ClassName.A, grade: '1º Ano', shift: Shift.MORNING, level: EducationLevel.FUNDAMENTAL_1, capacity: 25, enrolled: 25, laudados: 3 },
  { id: 'fun1-1b', name: ClassName.B, grade: '1º Ano', shift: Shift.MORNING, level: EducationLevel.FUNDAMENTAL_1, capacity: 25, enrolled: 22, laudados: 1 },
  { id: 'fun1-1c', name: ClassName.C, grade: '1º Ano', shift: Shift.AFTERNOON, level: EducationLevel.FUNDAMENTAL_1, capacity: 25, enrolled: 18, laudados: 0 },
  // 2º Ano
  { id: 'fun1-2a', name: ClassName.A, grade: '2º Ano', shift: Shift.MORNING, level: EducationLevel.FUNDAMENTAL_1, capacity: 25, enrolled: 24, laudados: 2 },
  { id: 'fun1-2b', name: ClassName.B, grade: '2º Ano', shift: Shift.MORNING, level: EducationLevel.FUNDAMENTAL_1, capacity: 25, enrolled: 20, laudados: 1 },
  { id: 'fun1-2c', name: ClassName.C, grade: '2º Ano', shift: Shift.AFTERNOON, level: EducationLevel.FUNDAMENTAL_1, capacity: 25, enrolled: 15, laudados: 0 },
  // 3º Ano
  { id: 'fun1-3a', name: ClassName.A, grade: '3º Ano', shift: Shift.MORNING, level: EducationLevel.FUNDAMENTAL_1, capacity: 25, enrolled: 23, laudados: 1 },
  { id: 'fun1-3b', name: ClassName.B, grade: '3º Ano', shift: Shift.MORNING, level: EducationLevel.FUNDAMENTAL_1, capacity: 25, enrolled: 21, laudados: 2 },
  { id: 'fun1-3c', name: ClassName.C, grade: '3º Ano', shift: Shift.AFTERNOON, level: EducationLevel.FUNDAMENTAL_1, capacity: 25, enrolled: 19, laudados: 0 },
  // 4º Ano
  { id: 'fun1-4a', name: ClassName.A, grade: '4º Ano', shift: Shift.MORNING, level: EducationLevel.FUNDAMENTAL_1, capacity: 25, enrolled: 25, laudados: 0 },
  { id: 'fun1-4b', name: ClassName.B, grade: '4º Ano', shift: Shift.MORNING, level: EducationLevel.FUNDAMENTAL_1, capacity: 25, enrolled: 18, laudados: 1 },
  { id: 'fun1-4c', name: ClassName.C, grade: '4º Ano', shift: Shift.AFTERNOON, level: EducationLevel.FUNDAMENTAL_1, capacity: 25, enrolled: 12, laudados: 0 },
  // 5º Ano
  { id: 'fun1-5a', name: ClassName.A, grade: '5º Ano', shift: Shift.MORNING, level: EducationLevel.FUNDAMENTAL_1, capacity: 25, enrolled: 22, laudados: 1 },
  { id: 'fun1-5b', name: ClassName.B, grade: '5º Ano', shift: Shift.MORNING, level: EducationLevel.FUNDAMENTAL_1, capacity: 25, enrolled: 20, laudados: 0 },
  { id: 'fun1-5c', name: ClassName.C, grade: '5º Ano', shift: Shift.AFTERNOON, level: EducationLevel.FUNDAMENTAL_1, capacity: 25, enrolled: 14, laudados: 0 },

  // --- FUNDAMENTAL 2 (6º ao 9º Ano, A a C) ---
  // 6º Ano
  { id: 'fun2-6a', name: ClassName.A, grade: '6º Ano', shift: Shift.MORNING, level: EducationLevel.FUNDAMENTAL_2, capacity: 30, enrolled: 28, laudados: 2 },
  { id: 'fun2-6b', name: ClassName.B, grade: '6º Ano', shift: Shift.MORNING, level: EducationLevel.FUNDAMENTAL_2, capacity: 30, enrolled: 25, laudados: 1 },
  { id: 'fun2-6c', name: ClassName.C, grade: '6º Ano', shift: Shift.AFTERNOON, level: EducationLevel.FUNDAMENTAL_2, capacity: 30, enrolled: 20, laudados: 0 },
  // 7º Ano
  { id: 'fun2-7a', name: ClassName.A, grade: '7º Ano', shift: Shift.MORNING, level: EducationLevel.FUNDAMENTAL_2, capacity: 30, enrolled: 29, laudados: 3 },
  { id: 'fun2-7b', name: ClassName.B, grade: '7º Ano', shift: Shift.MORNING, level: EducationLevel.FUNDAMENTAL_2, capacity: 30, enrolled: 27, laudados: 0 },
  { id: 'fun2-7c', name: ClassName.C, grade: '7º Ano', shift: Shift.AFTERNOON, level: EducationLevel.FUNDAMENTAL_2, capacity: 30, enrolled: 22, laudados: 1 },
  // 8º Ano
  { id: 'fun2-8a', name: ClassName.A, grade: '8º Ano', shift: Shift.MORNING, level: EducationLevel.FUNDAMENTAL_2, capacity: 30, enrolled: 30, laudados: 2 },
  { id: 'fun2-8b', name: ClassName.B, grade: '8º Ano', shift: Shift.MORNING, level: EducationLevel.FUNDAMENTAL_2, capacity: 30, enrolled: 28, laudados: 1 },
  { id: 'fun2-8c', name: ClassName.C, grade: '8º Ano', shift: Shift.AFTERNOON, level: EducationLevel.FUNDAMENTAL_2, capacity: 30, enrolled: 24, laudados: 0 },
  // 9º Ano
  { id: 'fun2-9a', name: ClassName.A, grade: '9º Ano', shift: Shift.MORNING, level: EducationLevel.FUNDAMENTAL_2, capacity: 30, enrolled: 26, laudados: 0 },
  { id: 'fun2-9b', name: ClassName.B, grade: '9º Ano', shift: Shift.MORNING, level: EducationLevel.FUNDAMENTAL_2, capacity: 30, enrolled: 25, laudados: 1 },
  { id: 'fun2-9c', name: ClassName.C, grade: '9º Ano', shift: Shift.AFTERNOON, level: EducationLevel.FUNDAMENTAL_2, capacity: 30, enrolled: 18, laudados: 0 },

  // --- ENSINO MÉDIO (1ª a 3ª Série, A a C, SOMENTE MANHÃ) ---
  // 1ª Série
  { id: 'em-1a', name: ClassName.A, grade: '1ª Série', shift: Shift.MORNING, level: EducationLevel.ENSINO_MEDIO, capacity: 35, enrolled: 32, laudados: 1 },
  { id: 'em-1b', name: ClassName.B, grade: '1ª Série', shift: Shift.MORNING, level: EducationLevel.ENSINO_MEDIO, capacity: 35, enrolled: 30, laudados: 1 },
  { id: 'em-1c', name: ClassName.C, grade: '1ª Série', shift: Shift.MORNING, level: EducationLevel.ENSINO_MEDIO, capacity: 35, enrolled: 28, laudados: 0 },
  // 2ª Série
  { id: 'em-2a', name: ClassName.A, grade: '2ª Série', shift: Shift.MORNING, level: EducationLevel.ENSINO_MEDIO, capacity: 35, enrolled: 33, laudados: 2 },
  { id: 'em-2b', name: ClassName.B, grade: '2ª Série', shift: Shift.MORNING, level: EducationLevel.ENSINO_MEDIO, capacity: 35, enrolled: 29, laudados: 0 },
  { id: 'em-2c', name: ClassName.C, grade: '2ª Série', shift: Shift.MORNING, level: EducationLevel.ENSINO_MEDIO, capacity: 35, enrolled: 25, laudados: 0 },
  // 3ª Série
  { id: 'em-3a', name: ClassName.A, grade: '3ª Série', shift: Shift.MORNING, level: EducationLevel.ENSINO_MEDIO, capacity: 35, enrolled: 34, laudados: 1 },
  { id: 'em-3b', name: ClassName.B, grade: '3ª Série', shift: Shift.MORNING, level: EducationLevel.ENSINO_MEDIO, capacity: 35, enrolled: 31, laudados: 1 },
  { id: 'em-3c', name: ClassName.C, grade: '3ª Série', shift: Shift.MORNING, level: EducationLevel.ENSINO_MEDIO, capacity: 35, enrolled: 27, laudados: 0 },
];

const App: React.FC = () => {
  // --- Authentication State ---
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('matrismart_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // State to manage all users (loaded from local storage)
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('matrismart_theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Mobile Sidebar State
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Apply Dark Mode Class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('matrismart_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('matrismart_theme', 'light');
    }
  }, [isDarkMode]);

  // Load all users on mount (for Admin management)
  useEffect(() => {
    const usersStr = localStorage.getItem('matrismart_users');
    if (usersStr) {
      setAllUsers(JSON.parse(usersStr));
    }
  }, [currentUser]); // Reload if currentUser changes (e.g. login)

  const [classes, setClasses] = useState<ClassRoom[]>(() => {
    const saved = localStorage.getItem('school_classes_v6');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0 && typeof parsed[0].laudados === 'undefined') {
        return INITIAL_CLASSES;
      }
      return parsed;
    }
    return INITIAL_CLASSES;
  });

  // Logs State
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('school_logs_v1');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShift, setSelectedShift] = useState<Shift | 'ALL'>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel | 'ALL'>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<string | 'ALL'>('ALL');
  
  // AI State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  // User Management Modal State
  const [isUserMgmtModalOpen, setIsUserMgmtModalOpen] = useState(false);

  // Reset selected grade when level changes
  useEffect(() => {
    setSelectedGrade('ALL');
  }, [selectedLevel]);

  // Derive unique grades based on selected level
  const availableGrades = useMemo(() => {
    let filtered = classes;
    if (selectedLevel !== 'ALL') {
      filtered = classes.filter(c => c.level === selectedLevel);
    }
    const gradesSet = new Set(filtered.map(c => c.grade));
    return Array.from(gradesSet);
  }, [classes, selectedLevel]);

  // Stats
  const stats = useMemo(() => {
    const totalCapacity = classes.reduce((acc, c) => acc + c.capacity, 0);
    const totalEnrolled = classes.reduce((acc, c) => acc + c.enrolled, 0);
    const totalLaudados = classes.reduce((acc, c) => acc + (c.laudados || 0), 0);
    const morningEnrolled = classes.filter(c => c.shift === Shift.MORNING).reduce((acc, c) => acc + c.enrolled, 0);
    const afternoonEnrolled = classes.filter(c => c.shift === Shift.AFTERNOON).reduce((acc, c) => acc + c.enrolled, 0);
    
    return {
      totalCapacity,
      totalEnrolled,
      totalLaudados,
      occupancyRate: Math.round((totalEnrolled / totalCapacity) * 100) || 0,
      morningEnrolled,
      afternoonEnrolled
    };
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('school_classes_v6', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('school_logs_v1', JSON.stringify(logs));
  }, [logs]);

  // Helper to add log
  const addLog = (type: LogType, classId: string, className: string, details: string) => {
    const now = new Date();
    const newLog: LogEntry = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), // Fallback if randomUUID not available
      date: now.toISOString().split('T')[0], // YYYY-MM-DD
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type,
      classId,
      className,
      details,
      timestamp: now.getTime()
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleEnroll = (classId: string, count: number = 1) => {
    let enrolledClass: ClassRoom | undefined;
    setClasses(prev => prev.map(room => {
      if (room.id === classId && (room.enrolled + count) <= room.capacity) {
        enrolledClass = room;
        return { ...room, enrolled: room.enrolled + count };
      }
      return room;
    }));

    if (enrolledClass) {
      const studentText = count === 1 ? 'Nova matrícula realizada' : `${count} novas matrículas realizadas`;
      addLog(
        'MATRICULA', 
        enrolledClass.id, 
        `${enrolledClass.grade} ${enrolledClass.name}`, 
        studentText
      );
    }
  };

  const handleUpdateCapacity = (classId: string, newCapacity: number) => {
    let targetClass: ClassRoom | undefined;
    setClasses(prev => prev.map(room => {
      if (room.id === classId) {
        targetClass = room;
        return { ...room, capacity: newCapacity };
      }
      return room;
    }));

    if (targetClass) {
      addLog(
        'CAPACIDADE',
        targetClass.id,
        `${targetClass.grade} ${targetClass.name}`,
        `Capacidade alterada de ${targetClass.capacity} para ${newCapacity}`
      );
    }
  };

  const handleUpdateLaudados = (classId: string, delta: number) => {
    let targetClass: ClassRoom | undefined;
    let newValue = 0;
    setClasses(prev => prev.map(room => {
      if (room.id === classId) {
        const current = room.laudados || 0;
        newValue = current + delta;
        if (newValue >= 0 && newValue <= room.enrolled) {
           targetClass = room;
           return { ...room, laudados: newValue };
        }
      }
      return room;
    }));

    if (targetClass) {
      const action = delta > 0 ? 'adicionado' : 'removido';
      addLog(
        'LAUDADO',
        targetClass.id,
        `${targetClass.grade} ${targetClass.name}`,
        `Aluno laudado ${action}. Total: ${newValue}`
      );
    }
  };

  const handleSaveClass = (classId: string) => {
    const targetClass = classes.find(c => c.id === classId);
    if (targetClass) {
      addLog(
        'OUTRO',
        targetClass.id,
        `${targetClass.grade} ${targetClass.name}`,
        'Alterações salvas manualmente e consolidadas.'
      );
    }
  };

  const handleAnalyze = async () => {
    setIsAIModalOpen(true);
    setIsAnalyzing(true);
    const result = await analyzeCapacity(classes);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleExportCSV = () => {
    const BOM = "\uFEFF";
    const headers = ["ID", "Nível", "Série/Ano", "Turma", "Turno", "Capacidade", "Matriculados", "Ocupação (%)", "Laudados"];
    
    const rows = classes.map(c => {
      const occupancy = Math.round((c.enrolled / c.capacity) * 100);
      return [
        c.id,
        `"${c.level}"`,
        `"${c.grade}"`,
        c.name,
        c.shift,
        c.capacity,
        c.enrolled,
        occupancy,
        c.laudados || 0
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `matrismart_vagas_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Auth Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('matrismart_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('matrismart_current_user');
  };

  // User Management Handlers (Admin Only)
  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    const updatedUsers = allUsers.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    );
    setAllUsers(updatedUsers);
    localStorage.setItem('matrismart_users', JSON.stringify(updatedUsers));
    
    // Update current user if it's the same person
    if (currentUser?.id === userId) {
      const updatedUser = { ...currentUser, role: newRole };
      setCurrentUser(updatedUser);
      localStorage.setItem('matrismart_current_user', JSON.stringify(updatedUser));
    }
  };

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = allUsers.filter(u => u.id !== userId);
    setAllUsers(updatedUsers);
    localStorage.setItem('matrismart_users', JSON.stringify(updatedUsers));
  };

  const handleAddUser = (newUser: User) => {
    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);
    localStorage.setItem('matrismart_users', JSON.stringify(updatedUsers));
  };

  // Render Auth Pages if not logged in
  if (!currentUser) {
    return (
      <AuthPages 
        onLogin={handleLogin} 
        isDarkMode={isDarkMode} 
        onToggleTheme={() => setIsDarkMode(!isDarkMode)} 
      />
    );
  }

  const visibleLevels = selectedLevel === 'ALL' 
    ? Object.values(EducationLevel) 
    : [selectedLevel];

  const getFilteredClassesByLevel = (level: EducationLevel) => {
    return classes.filter(c => {
      const matchesLevel = c.level === level;
      const searchString = `${c.grade} ${c.name} ${c.shift}`.toLowerCase();
      const matchesSearch = searchString.includes(searchTerm.toLowerCase());
      const matchesShift = selectedShift === 'ALL' || c.shift === selectedShift;
      const matchesGrade = selectedGrade === 'ALL' || c.grade === selectedGrade;
      return matchesLevel && matchesSearch && matchesShift && matchesGrade;
    });
  };

  const getLevelIcon = (level: EducationLevel) => {
    switch (level) {
      case EducationLevel.INFANTIL: return <Baby className="w-5 h-5 text-pink-500" />;
      case EducationLevel.FUNDAMENTAL_1: return <Backpack className="w-5 h-5 text-cyan-500" />;
      case EducationLevel.FUNDAMENTAL_2: return <School className="w-5 h-5 text-teal-500" />;
      case EducationLevel.ENSINO_MEDIO: return <BookOpen className="w-5 h-5 text-violet-500" />;
      default: return <GraduationCap className="w-5 h-5" />;
    }
  };

  // Sidebar Content Component to reuse in desktop and mobile
  const SidebarContent = () => (
    <>
      <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Matri<span className="text-indigo-600 dark:text-indigo-400">Smart</span></h1>
        </div>
        {/* Close button for mobile only */}
        <button onClick={() => setMobileSidebarOpen(false)} className="md:hidden text-gray-500 dark:text-gray-400">
          <X size={24} />
        </button>
      </div>

      {/* User Info Snippet */}
      <div className="px-6 py-4 border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentUser.role === 'ADMIN' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
            <UserIcon size={20} />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{currentUser.name}</p>
              {currentUser.role === 'ADMIN' && (
                <Shield className="w-3 h-3 text-indigo-500" />
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser.email}</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {/* Admin Management Button */}
        {currentUser.role === 'ADMIN' && (
          <button 
            onClick={() => { setIsUserMgmtModalOpen(true); setMobileSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium mb-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800/50 transition-colors"
          >
            <Users size={20} />
            Gerenciar Usuários
          </button>
        )}

        <button 
          onClick={() => { setSelectedShift('ALL'); setSelectedLevel('ALL'); setSelectedGrade('ALL'); setMobileSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium mb-4 ${selectedLevel === 'ALL' && selectedShift === 'ALL' && selectedGrade === 'ALL' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm border dark:border-gray-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
        >
          <LayoutDashboard size={20} />
          Visão Geral
        </button>

        {/* Turnos Filter */}
        <div className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Filtrar Turno
        </div>
        <div className="space-y-1 mb-4">
           <button 
            onClick={() => { setSelectedShift('ALL'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedShift === 'ALL' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <PieChart size={16} />
            Todos
          </button>
          <button 
            onClick={() => { setSelectedShift(Shift.MORNING); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedShift === Shift.MORNING ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <Sun size={16} />
            Manhã
          </button>
          <button 
            onClick={() => { setSelectedShift(Shift.AFTERNOON); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedShift === Shift.AFTERNOON ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <Moon size={16} />
            Tarde
          </button>
        </div>

        {/* Levels Filter */}
        <div className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Nível de Ensino
        </div>
        <div className="space-y-1 mb-4">
          <button 
            onClick={() => { setSelectedLevel('ALL'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedLevel === 'ALL' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <LayoutDashboard size={16} />
            Todos os Níveis
          </button>
          <button 
            onClick={() => { setSelectedLevel(EducationLevel.INFANTIL); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedLevel === EducationLevel.INFANTIL ? 'bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <Baby size={16} />
            Infantil
          </button>
          <button 
            onClick={() => { setSelectedLevel(EducationLevel.FUNDAMENTAL_1); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedLevel === EducationLevel.FUNDAMENTAL_1 ? 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <Backpack size={16} />
            Fundamental 1
          </button>
          <button 
            onClick={() => { setSelectedLevel(EducationLevel.FUNDAMENTAL_2); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedLevel === EducationLevel.FUNDAMENTAL_2 ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <School size={16} />
            Fundamental 2
          </button>
          <button 
            onClick={() => { setSelectedLevel(EducationLevel.ENSINO_MEDIO); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedLevel === EducationLevel.ENSINO_MEDIO ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <BookOpen size={16} />
            Ensino Médio
          </button>
        </div>

        {/* Grades Filter */}
        {selectedLevel !== 'ALL' && (
          <div className="animate-fade-in">
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Filter size={12} />
              Série / Ano
            </div>
            <div className="space-y-1">
              <button
                 onClick={() => { setSelectedGrade('ALL'); setMobileSidebarOpen(false); }}
                 className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedGrade === 'ALL' ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                <CheckCircle2 size={16} className={selectedGrade === 'ALL' ? 'opacity-100' : 'opacity-0'} />
                Todas as Séries
              </button>
              {availableGrades.map((grade) => (
                <button 
                  key={grade}
                  onClick={() => { setSelectedGrade(grade); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedGrade === grade ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedGrade === grade ? 'border-indigo-500' : 'border-gray-300 dark:border-gray-600'}`}>
                    {selectedGrade === grade && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                  </div>
                  {grade}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Theme Toggle & AI Button */}
      <div className="p-4 mt-auto border-t dark:border-gray-700 space-y-3">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          {isDarkMode ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={18} />
          Sair do Sistema
        </button>

        <div className="bg-indigo-900 dark:bg-indigo-950 rounded-xl p-4 text-white">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            IA Analysis
          </h3>
          <p className="text-xs text-indigo-200 mb-3">Obtenha insights sobre a distribuição de vagas.</p>
          <button 
            onClick={handleAnalyze}
            className="w-full py-2 bg-white text-indigo-900 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors"
          >
            Analisar Vagas
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row transition-colors duration-200`}>
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
           <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <GraduationCap size={20} />
          </div>
          <span className="font-bold text-gray-800 dark:text-white">Matri<span className="text-indigo-600 dark:text-indigo-400">Smart</span></span>
        </div>
        <button onClick={() => setMobileSidebarOpen(true)} className="text-gray-600 dark:text-gray-300">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay & Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-xl flex flex-col animate-slide-in">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex bg-white dark:bg-gray-800 border-r dark:border-gray-700 w-64 flex-shrink-0 z-10 flex-col h-screen sticky top-0 overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-[calc(100vh-64px)] md:max-h-screen">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Controle de Vagas</h2>
            <p className="text-gray-500 dark:text-gray-400">Gerencie matrículas separadas por níveis de ensino.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors shadow-sm"
              title="Relatório Diário"
            >
              <FileText className="w-4 h-4" />
              <span>Relatórios</span>
            </button>
             <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors shadow-sm"
              title="Exportar tabela completa"
            >
              <Download className="w-4 h-4" />
              <span>Exportar CSV</span>
            </button>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Buscar turma..." 
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border dark:border-gray-700 shadow-sm transition-colors">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Matriculados</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalEnrolled}</p>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">Em todas as turmas</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border dark:border-gray-700 shadow-sm transition-colors">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Taxa de Ocupação</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.occupancyRate}%</p>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mt-2">
              <div className="bg-indigo-600 h-1.5 rounded-full" style={{width: `${stats.occupancyRate}%`}}></div>
            </div>
          </div>
           {/* New Laudados Card */}
           <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border dark:border-gray-700 shadow-sm transition-colors">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Alunos Laudados</p>
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-400 mt-2">{stats.totalLaudados}</p>
            <div className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-medium flex items-center gap-1">
              <Accessibility className="w-3 h-3" /> Total Escola
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border dark:border-gray-700 shadow-sm transition-colors">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Turno Manhã</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.morningEnrolled}</p>
            <div className="text-xs text-orange-600 dark:text-orange-400 mt-1 font-medium flex items-center gap-1">
              <Sun className="w-3 h-3" /> Alunos
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border dark:border-gray-700 shadow-sm transition-colors">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Turno Tarde</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.afternoonEnrolled}</p>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium flex items-center gap-1">
              <Moon className="w-3 h-3" /> Alunos
            </div>
          </div>
        </div>

        {/* Chart Section */}
        {selectedLevel === 'ALL' && selectedShift === 'ALL' && selectedGrade === 'ALL' && !searchTerm && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm xl:col-span-2 transition-colors">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Visão Geral de Turmas</h3>
              <MetricsChart classes={classes} isDarkMode={isDarkMode} />
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm transition-colors">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Média por Nível</h3>
              <LevelOccupancyChart classes={classes} isDarkMode={isDarkMode} />
            </div>
          </div>
        )}

        {/* Class Sections Grouped by Level */}
        <div className="space-y-10 pb-12">
          {visibleLevels.map((level) => {
            const levelClasses = getFilteredClassesByLevel(level as EducationLevel);
            if (levelClasses.length === 0) return null;

            return (
              <section key={level} className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6 border-b dark:border-gray-700 pb-4">
                  <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700`}>
                    {getLevelIcon(level as EducationLevel)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">{level}</h3>
                  <span className="text-sm font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                    {levelClasses.length} turmas
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {levelClasses.map((room) => (
                    <ClassCard 
                      key={room.id} 
                      room={room} 
                      onEnroll={handleEnroll} 
                      onUpdateCapacity={handleUpdateCapacity}
                      onUpdateLaudados={handleUpdateLaudados}
                      onSaveClass={handleSaveClass}
                    />
                  ))}
                </div>
              </section>
            );
          })}
          
          {/* Empty State */}
          {visibleLevels.every(l => getFilteredClassesByLevel(l as EducationLevel).length === 0) && (
            <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 border-dashed">
              <div className="flex justify-center mb-4">
                <Search className="w-12 h-12 text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nenhuma turma encontrada</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Tente ajustar seus filtros ou termos de busca.</p>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedLevel('ALL'); setSelectedShift('ALL'); setSelectedGrade('ALL');}}
                className="mt-4 text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </main>

      {/* AI Analysis Modal */}
      <AIModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        analysis={aiAnalysis}
        isLoading={isAnalyzing}
      />
      
      {/* Daily Report Modal */}
      <DailyReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        logs={logs}
      />

      {/* User Management Modal (Admin Only) */}
      <UserManagementModal 
        isOpen={isUserMgmtModalOpen}
        onClose={() => setIsUserMgmtModalOpen(false)}
        currentUser={currentUser}
        allUsers={allUsers}
        onUpdateRole={handleUpdateUserRole}
        onDeleteUser={handleDeleteUser}
        onAddUser={handleAddUser}
      />
    </div>
  );
};

export default App;