import React, { useState } from 'react';
import type { Student } from '../types';

interface EditStudentProps {
  student: Student;
  onUpdate: (student: Student) => void;
  onCancel: () => void;
}

const SaveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M10 2a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 2zM3 5.75A2.75 2.75 0 015.75 3h8.5A2.75 2.75 0 0117 5.75v8.5A2.75 2.75 0 0114.25 17h-8.5A2.75 2.75 0 013 14.25v-8.5zM5.75 4.5a1.25 1.25 0 00-1.25 1.25v8.5c0 .69.56 1.25 1.25 1.25h8.5c.69 0 1.25-.56 1.25-1.25v-8.5c0-.69-.56-1.25-1.25-1.25h-8.5z" />
        <path d="M10 6.5a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5a.75.75 0 00-.75-.75z" />
    </svg>
);


const BackIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
    </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" />
    </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zM4.5 8.25v7a1.25 1.25 0 001.25 1.25h9.5a1.25 1.25 0 001.25-1.25v-7h-12z" clipRule="evenodd" />
    </svg>
);


const EditStudent: React.FC<EditStudentProps> = ({ student, onUpdate, onCancel }) => {
  const [name, setName] = useState(student.name);
  const [birthDate, setBirthDate] = useState(student.birthDate || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onUpdate({ ...student, name: name.trim(), birthDate });
    }
  };

  return (
     <div className="w-full max-w-lg mx-auto flex flex-col items-center">
        <div className="w-full bg-slate-800/50 backdrop-blur-sm shadow-2xl shadow-yellow-500/10 rounded-2xl p-8 border border-slate-700">
            <h1 className="text-4xl text-center font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400">
                Editar Explorador
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="student-name" className="block text-sm font-bold text-slate-400 mb-2">Nombre del Explorador</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <UserIcon className="w-5 h-5 text-slate-500" />
                        </div>
                        <input
                            id="student-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="birth-date" className="block text-sm font-bold text-slate-400 mb-2">Fecha de Lanzamiento (Nacimiento)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <CalendarIcon className="w-5 h-5 text-slate-500" />
                        </div>
                        <input
                            id="birth-date"
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300"
                        />
                    </div>
                </div>
                
                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-yellow-500/30 transform hover:scale-105 transition-all duration-300 ease-in-out"
                >
                    <SaveIcon className="w-6 h-6" />
                    <span>Guardar Cambios</span>
                </button>
            </form>
        </div>
        <button
            onClick={onCancel}
            className="mt-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
            <BackIcon className="w-5 h-5"/>
            <span>Cancelar y Volver</span>
        </button>
     </div>
  );
};

export default EditStudent;
