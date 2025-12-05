
import React, { useState, useEffect } from 'react';
import type { Student } from '../../types';
import type { Character } from './gameData';
import Battery from './Battery';

// --- Props del Componente ---
interface VowelGameProps {
    student: Student;
    character: Character;
    score: number;
    progress: number;
    onScoreChange: (newScore: number) => void;
    onErrorChange: (newErrorCount: number) => void;
    onComplete: () => void;
    onQuit: () => void;
    userEmail?: string;
}

// --- Iconos y Componentes Gráficos ---

const FlippableStar: React.FC<{
    vowel: string;
    isFlipped: boolean;
    isDiscovered: boolean;
    onClick: () => void;
}> = ({ vowel, isFlipped, isDiscovered, onClick }) => {
    const vowelImage = `/img/estrella${vowel.toUpperCase()}.png`;
    const defaultImage = '/img/estrella.png';

    return (
        <button
            onClick={onClick}
            className="group w-20 h-20 md:w-24 md:h-24 [perspective:1000px] focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 rounded-full"
            aria-label={`Reproducir sonido de la vocal ${vowel}`}
        >
            <div
                className={`relative w-full h-full text-center transition-transform duration-700 [transform-style:preserve-3d] ${
                    isFlipped ? '[transform:rotateY(180deg)]' : ''
                }`}
            >
                {/* Front: default star image */}
                <div className="absolute w-full h-full [backface-visibility:hidden]">
                    <img src={defaultImage} alt="estrella" className={`w-full h-full object-contain rounded-full ${isDiscovered ? 'brightness-105' : ''}`} />
                </div>

                {/* Back: vowel-specific star image (visible when flipped) */}
                <div className="absolute w-full h-full flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <img src={vowelImage} alt={`estrella ${vowel}`} className="w-full h-full object-contain rounded-full shadow-lg" />
                </div>
            </div>
        </button>
    );
};


const Spaceship: React.FC<{ character: React.ReactNode; characterColor?: string }> = ({ characterColor = 'yellow' }) => {
    const shipsrc = characterColor === 'yellow' ? '/img/nave amarillo 1.png' : '/img/nave morado 1.png';
    
    return (
        <div className="relative w-64 h-48 animate-float">
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
            `}</style>
            <img 
                src={shipsrc}
                alt="Nave" 
                className="w-full h-full object-contain"
            />
        </div>
    );
};

// --- Componente Principal del Juego ---

const VowelGame: React.FC<VowelGameProps> = ({ student, character, score, progress, onScoreChange, onErrorChange, onComplete, onQuit, userEmail }) => {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const [activeVowel, setActiveVowel] = useState<string | null>(null);
    const [discoveredVowels, setDiscoveredVowels] = useState<Set<string>>(new Set());
    const [showIntro, setShowIntro] = useState(true);

    useEffect(() => {
        if (discoveredVowels.size === vowels.length) {
            // El nivel terminó, notificar al padre
            setTimeout(() => {
                onComplete();
            }, 1000);
        }
    }, [discoveredVowels, vowels.length, onComplete]);

    const handleStarClick = (vowel: string) => {
        if (activeVowel || showIntro) return;

        setActiveVowel(vowel);
        
        const utterance = new SpeechSynthesisUtterance(vowel);
        utterance.lang = 'es-ES';
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
        
        if (!discoveredVowels.has(vowel)) {
            onScoreChange(score + 20);
            setDiscoveredVowels(prev => new Set(prev).add(vowel));
        }

        setTimeout(() => setActiveVowel(null), 1500);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-between p-4 rounded-2xl border border-slate-700 relative overflow-hidden" style={{ backgroundImage: "url('/img/fondo 1 4.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
             {showIntro && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-30 flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-slate-800/90 border border-slate-500 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl animate-fade-in-up">
                        <div className="w-40 h-40 mb-4 transform scale-110">
                            <character.Component className="w-full h-full" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-4">¡Nivel 1!</h2>
                        <p className="text-xl text-slate-200 mb-8 leading-relaxed">
                            Haz clic en las estrellas para cargar la batería de la nave.
                        </p>
                        <button
                            onClick={() => setShowIntro(false)}
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black text-2xl py-3 px-10 rounded-full shadow-lg transform hover:scale-105 transition-all"
                        >
                            ¡DESPEGAR!
                        </button>
                    </div>
                </div>
            )}
             
             <header className="w-full flex justify-between items-start md:items-center p-4 bg-slate-900/50 rounded-xl border border-slate-700 backdrop-blur-sm z-10 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-cyan-300">{student.name}</h2>
                    <p className="text-2xl font-black text-white">Puntuación: {score}</p>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">Energía</span>
                    <Battery charge={progress} className="w-24 h-12 md:w-32 md:h-16" />
                </div>
            </header>

            <main className="flex-1 w-full flex flex-col md:flex-row items-center justify-around p-4 relative">
                <div className="mb-8 md:mb-0">
                    <Spaceship characterColor={character.color} />
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 w-full md:max-w-md">
                    {vowels.map(vowel => (
                       <FlippableStar
                            key={vowel}
                            vowel={vowel}
                            isFlipped={activeVowel === vowel}
                            isDiscovered={discoveredVowels.has(vowel)}
                            onClick={() => handleStarClick(vowel)}
                        />
                    ))}
                </div>
            </main>

            <footer className="w-full z-10 mt-4 flex justify-between">
                <button onClick={onQuit} className="px-4 py-2 bg-slate-700 hover:bg-red-600/80 rounded-lg text-slate-300 hover:text-white font-bold transition-colors text-sm flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Abandonar Misión
                </button>
                {userEmail === 'mateo@mateo' && (
                    <button onClick={onComplete} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold transition-colors text-sm flex items-center gap-2">
                        Skip ⏭️
                    </button>
                )}
            </footer>
        </div>
    );
};

export default VowelGame;
