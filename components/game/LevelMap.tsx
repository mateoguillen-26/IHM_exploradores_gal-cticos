
import React from 'react';
import type { Character } from './gameData';
import Battery from './Battery';

interface LevelMapProps {
    currentLevel: number;
    character: Character;
    energy: number;
    onNextLevel: () => void;
}

const LevelMap: React.FC<LevelMapProps> = ({ currentLevel, character, energy, onNextLevel }) => {
    
    // Coordenadas fijas para cada nivel (Posiciones estáticas en el mapa)
    const positions = [
        { left: '15%', top: '75%' }, // Nivel 1
        { left: '35%', top: '55%' }, // Nivel 2
        { left: '65%', top: '45%' }, // Nivel 3
        { left: '50%', top: '25%' }, // Nivel 4
        { left: '80%', top: '15%' }, // Nivel 5
        { left: '85%', top: '10%' }, // Nivel 6 (Final/Destination)
    ];

    // Obtener posición actual directamente sin estados de transición
    // El índice es currentLevel - 1, limitándolo para que no se salga del array
    const currentPos = positions[Math.min(currentLevel - 1, positions.length - 1)];

    return (
        <div className="w-full max-w-5xl h-[85vh] relative flex flex-col items-center justify-center rounded-3xl overflow-hidden border-4 border-slate-700 bg-slate-900 shadow-2xl">
            
            {/* --- FONDO (IMAGEN DEL MAPA) --- */}
            {/* Este contenedor simula ser la "imagen única" del mapa cargado */}
            <div className="absolute inset-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1465101162946-4377e57745c3?q=80&w=2948&auto=format&fit=crop')] bg-cover bg-center opacity-80">
                {/* Capa de tinte para mejorar contraste */}
                <div className="absolute inset-0 bg-indigo-900/40 mix-blend-multiply"></div>
            </div>

            {/* --- ELEMENTOS DIBUJADOS EN "LA IMAGEN" (Ruta y Planetas Estáticos) --- */}
            <div className="absolute inset-0 pointer-events-none">
                 {/* Línea de ruta estática */}
                 <svg className="absolute inset-0 w-full h-full opacity-60">
                    <path 
                        d="M 15% 75% Q 25% 65%, 35% 55% T 65% 45% T 50% 25% T 80% 15% T 85% 10%" 
                        stroke="white" 
                        strokeWidth="3" 
                        fill="none" 
                        strokeDasharray="8,8"
                    />
                </svg>

                {/* Planetas estáticos (marcadores visuales en el mapa) */}
                {positions.map((pos, index) => (
                    <div 
                        key={index}
                        className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-2 border-white/50 flex items-center justify-center font-bold text-white text-sm
                            ${(index + 1) < currentLevel ? 'bg-green-500/50' : 'bg-slate-800/80'}
                            ${(index + 1) === currentLevel ? 'bg-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.8)] border-white scale-110' : ''}
                        `}
                        style={{ left: pos.left, top: pos.top }}
                    >
                        {index + 1}
                    </div>
                ))}
            </div>

            {/* --- INTERFAZ SUPERIOR (BATERÍA) --- */}
            <div className="absolute top-6 right-6 z-30 flex flex-col items-end">
                <span className="text-white text-xs font-bold uppercase tracking-widest mb-1 drop-shadow-md">Energía de la Nave</span>
                <Battery charge={energy} className="w-36 h-14 shadow-lg" />
            </div>

            {/* --- PERSONAJE (ESTÁTICO) --- */}
            {/* Se posiciona directamente sin clases de animación (animate-bounce, duration, etc. eliminados) */}
            <div 
                className="absolute z-20 w-24 h-24 -ml-12 -mt-12 filter drop-shadow-2xl"
                style={{ 
                    left: currentPos?.left || '15%', 
                    top: currentPos?.top || '75%',
                }}
            >
                <character.Component className="w-full h-full" />
            </div>

            {/* --- BOTÓN SIGUIENTE --- */}
            <div className="absolute bottom-10 z-30">
                <button 
                    onClick={onNextLevel}
                    className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-black text-2xl py-3 px-10 rounded-full shadow-xl transform hover:scale-105 transition-transform"
                >
                    <span>SIGUIENTE MISIÓN</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default LevelMap;
