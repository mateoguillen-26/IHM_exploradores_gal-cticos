import React, { useState } from 'react';
import type { Student } from '../types';

interface DashboardProps {
  userEmail: string;
  students: Student[];
  onAddStudent: (name: string) => void;
  onSelectStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onLogout: () => void;
}

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
    </svg>
);

const PlanetIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06l1.06-1.06zM11.72 15.22a.75.75 0 001.06-1.06l-1.06 1.06zM5.22 6.28l6.5 9-1.06 1.06-6.5-9 1.06-1.06z" />
        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
    </svg>
);

const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M16.72 9.22a.75.75 0 011.06 0l2.25 2.25a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 11-1.06-1.06L17.94 11l-1.22-1.22a.75.75 0 010-1.06z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M11 10a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6A.75.75 0 0111 10z" clipRule="evenodd" />
  </svg>
);

const ProfileIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" />
  </svg>
);


const Dashboard: React.FC<DashboardProps> = ({ userEmail, students, onAddStudent, onSelectStudent, onEditStudent, onLogout }) => {
  const [newStudentName, setNewStudentName] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStudent(newStudentName);
    setNewStudentName('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-sm shadow-2xl shadow-pink-500/10 rounded-2xl p-8 border border-slate-700">
        <h1 className="text-4xl text-center font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300">
          Clase de Exploradores
        </h1>
        <p className="text-center text-slate-400 mb-8">Comandante: {userEmail}</p>

        <form onSubmit={handleAddSubmit} className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
            placeholder="Nombre del nuevo explorador..."
            className="flex-grow w-full px-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-yellow-500/30 transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <PlusIcon className="w-5 h-5"/>
            <span>Agregar Alumno</span>
          </button>
        </form>

        <div className="space-y-4">
          {students.length > 0 ? (
            students.map(student => (
                <div key={student.id} className="flex items-center gap-2 w-full bg-slate-900/50 border border-slate-700 rounded-lg hover:border-cyan-400 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400 transition-all duration-300 group">
                    <button
                        onClick={() => onSelectStudent(student)}
                        className="flex-grow text-left flex items-center gap-4 p-4 rounded-l-lg hover:bg-slate-700/50 transition-colors duration-300"
                        aria-label={`Iniciar juego para ${student.name}`}
                    >
                        <PlanetIcon className="w-8 h-8 text-cyan-400 group-hover:animate-spin" style={{animationDuration: '10s'}} />
                        <span className="text-xl font-bold text-slate-200">{student.name}</span>
                    </button>
                    <div className="border-l border-slate-700 h-10"></div>
                    <button
                        onClick={() => onEditStudent(student)}
                        className="p-4 text-slate-400 hover:text-yellow-400 rounded-r-lg hover:bg-slate-700/50 transition-colors duration-300"
                        aria-label={`Editar ${student.name}`}
                    >
                        <PencilIcon className="w-5 h-5" />
                    </button>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-400 py-8">Tu clase está vacía. ¡Agrega a tu primer explorador!</p>
          )}
        </div>
        <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onLogout} className="flex items-center justify-center gap-2 w-full sm:w-auto bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white font-bold py-2 px-5 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
                <LogoutIcon className="w-5 h-5"/>
                <span>Cerrar Sesión</span>
            </button>
            <button onClick={() => alert('¡Próximamente: Perfil del Comandante!')} className="flex items-center justify-center gap-2 w-full sm:w-auto bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white font-bold py-2 px-5 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
                <ProfileIcon className="w-5 h-5"/>
                <span>Mi Perfil</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;