
import React, { useState, useEffect } from 'react';
import type { Student } from '../../types';
import type { Character } from './gameData';
import Battery from './Battery';

interface LevelFiveProps {
    student: Student;
    character: Character;
    score: number;
    progress: number;
    onScoreChange: (newScore: number) => void;
    onComplete: () => void;
    onQuit: () => void;
}

interface WordChallenge {
    id: string;
    fullWord: string;
    suffix: string; // The part displayed (e.g., "rte")
    syllable: string; // The answer (e.g., "ma")
    image?: string; // Optional icon/emoji
}

const CHALLENGES: WordChallenge[] = [
    { id: 'marte', fullWord: 'MARTE', suffix: 'RTE', syllable: 'MA', image: '🪐' },
    { id: 'meteorito', fullWord: 'METEORITO', suffix: 'TEORITO', syllable: 'ME', image: '☄️' },
    { id: 'mision', fullWord: 'MISION', suffix: 'SION', syllable: 'MI', image: '🚩' },
    { id: 'monstruo', fullWord: 'MONSTRUO', suffix: 'NSTRUO', syllable: 'MO', image: '👾' },
    { id: 'mundo', fullWord: 'MUNDO', suffix: 'NDO', syllable: 'MU', image: '🌍' },
];

const SYLLABLES = ['MA', 'ME', 'MI', 'MO', 'MU'];

const LevelFive: React.FC<LevelFiveProps> = ({ student, score, progress, onScoreChange, onComplete, onQuit }) => {
    const [gameQueue, setGameQueue] = useState<WordChallenge[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showDialog, setShowDialog] = useState(true);
    const [isCorrect, setIsCorrect] = useState(false); // To trigger success animation

    // Initialize randomized queue
    useEffect(() => {
        const shuffled = [...CHALLENGES].sort(() => Math.random() - 0.5);
        setGameQueue(shuffled);
    }, []);

    const currentChallenge = gameQueue[currentIndex];

    const handleSyllableClick = (syllable: string) => {
        if (!currentChallenge || isCorrect) return;

        // Speech feedback for the pressed button
        const u = new SpeechSynthesisUtterance(syllable.toLowerCase());
        u.lang = 'es-ES';
        window.speechSynthesis.speak(u);

        if (syllable === currentChallenge.syllable) {
            // Correct!
            setIsCorrect(true);
            onScoreChange(score + 50);
            
            // Speak full word
            const wordU = new SpeechSynthesisUtterance(currentChallenge.fullWord.toLowerCase());
            wordU.lang = 'es-ES';
            setTimeout(() => window.speechSynthesis.speak(wordU), 500);

            // Move to next
            setTimeout(() => {
                if (currentIndex < gameQueue.length - 1) {
                    setIsCorrect(false);
                    setCurrentIndex(prev => prev + 1);
                } else {
                    // Level Complete
                    const endU = new SpeechSynthesisUtterance("¡Rumbo fijado! Nivel completado.");
                    window.speechSynthesis.speak(endU);
                    onComplete();
                }
            }, 2000);
        } else {
            // Error
            const errU = new SpeechSynthesisUtterance("Intenta otra vez");
            errU.lang = 'es-ES';
            window.speechSynthesis.speak(errU);
        }
    };

    return (
        <div className="w-full h-full flex flex-col p-4 bg-slate-900 rounded-2xl border border-slate-700 relative overflow-hidden">
             
             {/* Header */}
            <header className="w-full flex justify-between items-center p-4 bg-slate-800/80 rounded-xl mb-4 z-20">
                <div className="flex items-center gap-4">
                    <span className="text-cyan-300 font-bold text-xl">{student.name}</span>
                    <span className="bg-slate-700 px-3 py-1 rounded text-white font-mono">Nivel 5</span>
                </div>
                <Battery charge={progress} className="w-24 h-10" />
            </header>

            {/* Cockpit View */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                
                {/* Windshield / Space View */}
                <div className="w-full max-w-3xl h-64 md:h-80 bg-black rounded-t-3xl border-4 border-slate-600 relative overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
                    {/* Stars animation */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-80 animate-pulse"></div>
                    
                    {/* HUD Screen */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 flex flex-col items-center justify-center">
                         {currentChallenge && (
                             <div className={`transition-all duration-500 transform ${isCorrect ? 'scale-110' : 'scale-100'}`}>
                                 <div className="text-6xl mb-4 animate-bounce-short">{currentChallenge.image}</div>
                                 <div className="flex items-baseline gap-1 bg-slate-900/50 p-4 rounded-xl backdrop-blur-sm border border-cyan-500/30">
                                     <span className={`text-5xl md:text-7xl font-black ${isCorrect ? 'text-green-400' : 'text-yellow-400 border-b-4 border-dashed border-yellow-400 min-w-[3ch] text-center'}`}>
                                         {isCorrect ? currentChallenge.syllable : "?"}
                                     </span>
                                     <span className="text-5xl md:text-7xl font-black text-white tracking-widest">
                                         {currentChallenge.suffix}
                                     </span>
                                 </div>
                             </div>
                         )}
                    </div>
                </div>

                {/* Dashboard / Controls */}
                <div className="w-full max-w-3xl bg-slate-700 rounded-b-3xl p-6 border-x-4 border-b-4 border-slate-600 shadow-2xl relative">
                    {/* Lights decoration */}
                    <div className="absolute top-2 left-4 flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse delay-75"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse delay-150"></div>
                    </div>

                    <p className="text-center text-slate-300 font-bold mb-4 uppercase tracking-wider text-sm">Sistema de Navegación Manual</p>
                    
                    <div className="flex flex-wrap justify-center gap-4">
                        {SYLLABLES.map((syllable) => (
                            <button
                                key={syllable}
                                onClick={() => handleSyllableClick(syllable)}
                                disabled={isCorrect}
                                className={`w-16 h-16 md:w-20 md:h-20 rounded-xl font-black text-2xl shadow-[0_6px_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-1 transition-all
                                    ${isCorrect && syllable === currentChallenge?.syllable 
                                        ? 'bg-green-500 text-white shadow-none ring-4 ring-green-300' 
                                        : 'bg-gradient-to-b from-cyan-600 to-cyan-800 text-cyan-100 hover:from-cyan-500 hover:to-cyan-700'
                                    }
                                `}
                            >
                                {syllable}
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Intro Dialog */}
            {showDialog && (
                 <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border-2 border-cyan-400 rounded-2xl p-8 max-w-md text-center shadow-2xl animate-fade-in-up">
                        <div className="text-6xl mb-4">🕹️</div>
                        <p className="text-xl text-white font-bold mb-6">
                            Para dirigir la nave, tienes que completar las palabras.
                        </p>
                        <button 
                            onClick={() => setShowDialog(false)}
                            className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all"
                        >
                            ¡Tomar el Control!
                        </button>
                    </div>
                 </div>
            )}
            
            {/* Quit */}
            <div className="absolute top-4 right-4 md:static md:mt-4 md:flex md:justify-end z-20">
                 <button onClick={onQuit} className="text-slate-500 hover:text-red-400 text-sm font-bold flex items-center gap-1">
                    Salir
                </button>
            </div>
        </div>
    );
};

export default LevelFive;
