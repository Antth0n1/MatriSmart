import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { X, Shield, Trash2, User as UserIcon, Plus, Save, ArrowLeft, Mail, Lock, AlertCircle } from 'lucide-react';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  allUsers: User[];
  onUpdateRole: (userId: string, newRole: UserRole) => void;
  onDeleteUser: (userId: string) => void;
  onAddUser: (user: User) => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({ 
  isOpen, 
  onClose, 
  currentUser, 
  allUsers, 
  onUpdateRole, 
  onDeleteUser,
  onAddUser
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('USER');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (allUsers.find(u => u.email === newEmail)) {
      setError('Este e-mail já está cadastrado.');
      return;
    }

    const newUser: User = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: newName,
      email: newEmail,
      password: newPassword,
      role: newRole
    };

    onAddUser(newUser);
    
    // Reset and go back to list
    setNewName('');
    setNewEmail('');
    setNewPassword('');
    setNewRole('USER');
    setIsCreating(false);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setError('');
    setNewName('');
    setNewEmail('');
    setNewPassword('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden transition-colors">
        
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 p-6 border-b dark:border-gray-700 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Gerenciar Usuários</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Controle de acesso e permissões</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isCreating && (
              <button 
                onClick={() => setIsCreating(true)}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Novo Usuário
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900/50">
          
          {isCreating ? (
            /* CREATE USER FORM */
            <div className="animate-fade-in">
              <button 
                onClick={handleCancelCreate}
                className="mb-6 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para lista
              </button>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm max-w-lg mx-auto">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Adicionar Novo Usuário</h3>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-sm text-red-600 dark:text-red-300">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleCreateSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Nome Completo</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        required 
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        placeholder="Nome do usuário"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="email" 
                        required 
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        placeholder="email@exemplo.com"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="password" 
                        required 
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        placeholder="Mínimo 6 caracteres"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Permissão</label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="role" 
                          value="USER" 
                          checked={newRole === 'USER'}
                          onChange={() => setNewRole('USER')}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Usuário Padrão</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="role" 
                          value="ADMIN" 
                          checked={newRole === 'ADMIN'}
                          onChange={() => setNewRole('ADMIN')}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Administrador</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button" 
                      onClick={handleCancelCreate}
                      className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      Salvar Usuário
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* USER LIST */
            <div className="space-y-4 animate-fade-in">
              {allUsers.map((user) => (
                <div 
                  key={user.id} 
                  className={`bg-white dark:bg-gray-800 p-4 rounded-xl border ${user.id === currentUser.id ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/30' : 'dark:border-gray-700'} shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                      {user.role === 'ADMIN' ? <Shield className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-800 dark:text-white">{user.name}</p>
                        {user.id === currentUser.id && (
                          <span className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                            VOCÊ
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Permission Controls */}
                    {user.role === 'USER' ? (
                      <button 
                        onClick={() => onUpdateRole(user.id, 'ADMIN')}
                        className="px-3 py-1.5 text-xs font-medium bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-lg flex items-center gap-1 transition-colors"
                        title="Promover a Administrador"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        Tornar Admin
                      </button>
                    ) : (
                      <button 
                        onClick={() => onUpdateRole(user.id, 'USER')}
                        disabled={user.id === currentUser.id} // Cannot demote yourself
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors ${
                          user.id === currentUser.id 
                            ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
                            : 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/40 text-orange-700 dark:text-orange-300'
                        }`}
                        title={user.id === currentUser.id ? "Você não pode remover seu próprio acesso de admin" : "Rebaixar para Usuário"}
                      >
                        <UserIcon className="w-3.5 h-3.5" />
                        Remover Admin
                      </button>
                    )}

                    {/* Delete Button */}
                    <button 
                      onClick={() => {
                        if (confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
                          onDeleteUser(user.id);
                        }
                      }}
                      disabled={user.id === currentUser.id}
                      className={`p-2 rounded-lg transition-colors ${
                        user.id === currentUser.id
                          ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                          : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                      }`}
                      title="Excluir Usuário"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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