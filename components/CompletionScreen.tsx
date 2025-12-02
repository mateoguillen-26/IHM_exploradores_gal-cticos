
import React from 'react';
import Battery from './game/Battery';

interface CompletionScreenProps {
  score: number;
  onReset: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ score, onReset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center justify-center min-h-[80vh] text-center">
      
      {/* Fondo decorativo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
         {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute text-4xl animate-bounce" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
            }}>
                ⭐
            </div>
         ))}
      </div>

      <div className="bg-slate-800/90 border-4 border-yellow-400 rounded-3xl p-10 sm:p-16 shadow-[0_0_50px_rgba(250,204,21,0.5)] relative z-10 flex flex-col items-center gap-8 animate-fade-in-up">
        
        <div className="flex flex-col items-center">
             <h1 className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 mb-4 drop-shadow-sm">
                ¡MISIÓN CUMPLIDA!
            </h1>
            <p className="text-2xl text-cyan-200 font-bold">Has salvado el planeta Tierra</p>
        </div>

        <div className="flex flex-col items-center gap-2 bg-slate-900/50 p-6 rounded-2xl border border-slate-700 w-full max-w-md">
            <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Energía Final</span>
            <Battery charge={6} maxCharge={6} className="w-48 h-20" />
            <span className="text-green-400 font-bold mt-2">100% CARGADA</span>
        </div>

        <div className="text-6xl font-black text-white bg-slate-700/50 px-8 py-4 rounded-xl border-2 border-slate-500">
            {score} <span className="text-2xl text-yellow-400">pts</span>
        </div>

        <p className="text-slate-300 max-w-lg">
            ¡Eres un explorador increíble! Los marcianos y los humanos están celebrando gracias a tu ayuda.
        </p>

        <button 
            onClick={onReset}
            className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xl py-5 px-10 rounded-full shadow-xl transform hover:scale-105 transition-all"
        >
            <span className="text-3xl">🎓</span>
            <span>Volver a Selección de Alumno</span>
        </button>

      </div>
    </div>
  );
};

export default CompletionScreen;
