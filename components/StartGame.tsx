import React, { useState } from 'react';
import type { Student } from '../types';
import { characters, Character } from './game/gameData';

interface StartGameProps {
  student: Student;
  onBack: () => void;
  onGameStart: (characterId: string) => void;
}

// --- Iconos de la Interfaz ---
const RocketIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.25c.586 0 1.162.034 1.726.1a.75.75 0 01.713.888 6.743 6.743 0 00-1.07 4.393c.117.375.25.741.399 1.095l.8-3.996a.75.75 0 01.748-.659h.01c.414 0 .75.336.75.75V15a.75.75 0 01-1.5 0v-4.432l-.636 3.182a.75.75 0 01-.703.55h-.01a.75.75 0 01-.702-.55L9.636 10.568V15a.75.75 0 01-1.5 0V8.25a.75.75 0 01.75-.75h.01a.75.75 0 01.748.659l.8 3.996A9.223 9.223 0 0010.5 7.63a6.743 6.743 0 00-1.07-4.393.75.75 0 01.713-.888c.564-.066 1.14-.1 1.726-.1zM12 9a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 0112 9z" />
      <path fillRule="evenodd" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 2.25c-6.213 0-11.25-5.037-11.25-11.25S5.787-1.5 12-1.5s11.25 5.037 11.25 11.25S18.213 23.25 12 23.25z" clipRule="evenodd" />
    </svg>
  );

const BackIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
    </svg>
);

const StartGame: React.FC<StartGameProps> = ({ student, onBack, onGameStart }) => {
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);

  const handleStart = () => {
    if (selectedCharId) {
      onGameStart(selectedCharId);
    }
  };

  const colorClasses: Record<string, { ring: string; text: string; shadow: string; bg:string }> = {
    yellow: { ring: 'ring-yellow-400', text: 'text-yellow-300', shadow: 'shadow-yellow-500/30', bg: 'bg-yellow-500/10' },
    cyan: { ring: 'ring-cyan-400', text: 'text-cyan-300', shadow: 'shadow-cyan-500/30', bg: 'bg-cyan-500/10' },
    purple: { ring: 'ring-purple-400', text: 'text-purple-300', shadow: 'shadow-purple-500/30', bg: 'bg-purple-500/10' },
    green: { ring: 'ring-green-400', text: 'text-green-300', shadow: 'shadow-green-500/30', bg: 'bg-green-500/10' },
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      <div className="w-full bg-slate-800/50 backdrop-blur-sm shadow-2xl shadow-cyan-500/10 rounded-2xl p-8 sm:p-12 border border-slate-700 text-center">
        <p className="text-xl sm:text-2xl text-slate-300">¡Hola, valiente explorador</p>
        <h1 className="text-4xl sm:text-6xl font-black my-2 text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-teal-400 to-sky-300">
          {student.name}!
        </h1>
        <p className="text-lg sm:text-xl text-slate-400 mb-8">Elige tu compañero de aventuras</p>
        
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {characters.map(char => {
            const isSelected = selectedCharId === char.id;
            const colors = colorClasses[char.color];
            return (
              <button 
                key={char.id}
                onClick={() => setSelectedCharId(char.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none w-40 sm:w-48 ${isSelected ? `${colors.ring} ${colors.bg} border-transparent shadow-lg ${colors.shadow}` : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'}`}
                aria-pressed={isSelected}
              >
                <char.Component className="w-full h-auto" />
                <span className={`mt-2 font-bold text-lg ${isSelected ? colors.text : 'text-slate-300'}`}>{char.name}</span>
              </button>
            )
          })}
        </div>

        <button
          onClick={handleStart}
          disabled={!selectedCharId}
          className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-xl sm:text-2xl py-4 px-10 rounded-full shadow-lg shadow-green-500/30 transform hover:scale-110 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
        >
          <RocketIcon className="w-8 h-8 transform transition-transform duration-500 group-hover:-rotate-45 group-hover:scale-125" />
          <span>¡EMPEZAR AVENTURA!</span>
        </button>

      </div>
      <button
        onClick={onBack}
        className="mt-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <BackIcon className="w-5 h-5"/>
        <span>Volver a la Lista</span>
      </button>
    </div>
  );
};

export default StartGame;