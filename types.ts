export enum Shift {
  MORNING = 'Manhã',
  AFTERNOON = 'Tarde'
}

export enum ClassName {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D'
}

export enum EducationLevel {
  INFANTIL = 'Infantil',
  FUNDAMENTAL_1 = 'Fundamental 1',
  FUNDAMENTAL_2 = 'Fundamental 2',
  ENSINO_MEDIO = 'Ensino Médio'
}

export interface ClassRoom {
  id: string;
  name: ClassName;
  grade: string; // e.g., 'Maternal', 'Nível 1', '1º Ano'
  shift: Shift;
  level: EducationLevel;
  capacity: number;
  enrolled: number;
  laudados: number; // New field for special needs students count
}

export interface Student {
  id: string;
  name: string;
  classId: string;
  registrationDate: string;
}

export interface AIAnalysisResult {
  summary: string;
  recommendations: string[];
  alertLevel: 'low' | 'medium' | 'high';
}

export type LogType = 'MATRICULA' | 'CAPACIDADE' | 'LAUDADO' | 'OUTRO';

export interface LogEntry {
  id: string;
  date: string; // ISO Date YYYY-MM-DD
  time: string; // HH:mm
  type: LogType;
  classId: string;
  className: string; // Snapshot of class name "1º Ano A"
  details: string;
  timestamp: number;
}

export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this should be hashed
  role: UserRole;
}