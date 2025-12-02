
import React, { useState, useEffect } from 'react';
import type { Student } from '../../types';
import type { Character } from './gameData';
import Battery from './Battery';

interface LevelSixProps {
    student: Student;
    character: Character;
    score: number;
    progress: number;
    onScoreChange: (newScore: number) => void;
    onComplete: () => void;
    onQuit: () => void;
}

interface WordCard {
    id: string;
    text: string;
    image: string; // Emoji or simple visual rep
    widthClass: string; // Tailwind width class for box size variation
}

const CORRECT_ORDER = ["mi", "mama", "me", "mima"];

const WORDS_DATA: WordCard[] = [
    { id: 'mi', text: 'mi', image: '🙋', widthClass: 'w-20' },
    { id: 'mama', text: 'mama', image: '👩‍👦', widthClass: 'w-32' },
    { id: 'me', text: 'me', image: '👈', widthClass: 'w-20' },
    { id: 'mima', text: 'mima', image: '🤗', widthClass: 'w-32' },
];

const LevelSix: React.FC<LevelSixProps> = ({ student, character, score, progress, onScoreChange, onComplete, onQuit }) => {
    
    // Game State
    const [slots, setSlots] = useState<(WordCard | null)[]>([null, null, null, null]);
    const [availableWords, setAvailableWords] = useState<WordCard[]>([]);
    
    const [showIntroDialog, setShowIntroDialog] = useState(true);
    const [victoryPhase, setVictoryPhase] = useState<'playing' | 'cinematic'>('playing');
    const [cinematicStep, setCinematicStep] = useState(0); // 0: Landed, 1: Laser Charge, 2: Fire, 3: Explosion, 4: Celebration
    const [cinematicText, setCinematicText] = useState<string | null>(null);

    // Prevent multiple triggers
    const [isCompleteTriggered, setIsCompleteTriggered] = useState(false);

    useEffect(() => {
        // Scramble words initially
        const scrambled = [...WORDS_DATA].sort(() => Math.random() - 0.5);
        setAvailableWords(scrambled);
    }, []);

    const handleWordClick = (word: WordCard) => {
        // Find first empty slot
        const emptyIndex = slots.findIndex(s => s === null);
        if (emptyIndex === -1) return; // Full

        const newSlots = [...slots];
        newSlots[emptyIndex] = word;
        setSlots(newSlots);

        // Remove from available
        setAvailableWords(prev => prev.filter(w => w.id !== word.id));

        // Speak word
        const u = new SpeechSynthesisUtterance(word.text);
        u.lang = 'es-ES';
        window.speechSynthesis.speak(u);

        // Check Win
        checkWin(newSlots);
    };

    const handleSlotClick = (index: number) => {
        const word = slots[index];
        if (!word) return;

        // Return to available
        setAvailableWords(prev => [...prev, word]);
        
        // Remove from slot
        const newSlots = [...slots];
        newSlots[index] = null;
        setSlots(newSlots);
    };

    const checkWin = (currentSlots: (WordCard | null)[]) => {
        // Check if full
        if (currentSlots.some(s => s === null)) return;

        // Check order
        const currentWords = currentSlots.map(s => s!.text);
        const isWin = currentWords.join(' ') === CORRECT_ORDER.join(' ');

        if (isWin) {
            onScoreChange(score + 200);
            setTimeout(() => {
                startCinematic();
            }, 500);
        } else {
             const u = new SpeechSynthesisUtterance("Mmm, intenta ordenar mejor las palabras.");
             u.lang = 'es-ES';
             window.speechSynthesis.speak(u);
        }
    };

    const startCinematic = () => {
        setVictoryPhase('cinematic');
        
        const seq = async () => {
             // Step 0: Initial Scene (Landed)
            setCinematicStep(0);
            await new Promise(r => setTimeout(r, 1000));
            
            // Step 1: Laser Charge
            setCinematicStep(1);
            await new Promise(r => setTimeout(r, 1000));

            // Step 2: Fire Laser
            setCinematicStep(2);
            setCinematicText("¡PIU PIU!");
            // Play Laser Sound effect (simulated)
            const u = new SpeechSynthesisUtterance("Piu piu"); 
            u.rate = 2;
            window.speechSynthesis.speak(u);

            await new Promise(r => setTimeout(r, 1500)); // Laser travel time

            // Step 3: Explosion
            setCinematicStep(3);
            setCinematicText("¡BOOM!");
             const boom = new SpeechSynthesisUtterance("Boom"); 
             boom.rate = 0.5;
            window.speechSynthesis.speak(boom);
            await new Promise(r => setTimeout(r, 2000));

            // Step 4: Celebration
            setCinematicStep(4);
            setCinematicText("¡VIVA! ¡LO LOGRAMOS!");
            const yay = new SpeechSynthesisUtterance("¡Viva! Hemos salvado la tierra."); 
            window.speechSynthesis.speak(yay);
        };

        seq();
    };

    const handleFinishClick = () => {
        if (isCompleteTriggered) return;
        setIsCompleteTriggered(true);
        console.log("Finishing Level 6...");
        onComplete();
    };


    // --- RENDERERS ---

    const renderGame = () => (
        <div className="flex flex-col items-center justify-between h-full py-8 w-full max-w-4xl relative z-10">
            
            {/* Top: Slots */}
            <div className="w-full flex flex-col items-center gap-4">
                <h2 className="text-xl text-cyan-300 font-bold uppercase tracking-widest">Panel de Control del Láser</h2>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 bg-slate-800/50 p-6 rounded-2xl border-2 border-slate-600 w-full min-h-[120px]">
                    {slots.map((slot, idx) => {
                        const expectedWidth = WORDS_DATA.find(w => w.text === CORRECT_ORDER[idx])?.widthClass || 'w-24';

                        return (
                            <div 
                                key={idx}
                                onClick={() => handleSlotClick(idx)}
                                className={`h-24 sm:h-32 border-4 border-dashed rounded-xl flex items-center justify-center transition-all cursor-pointer relative
                                    ${slot ? 'bg-white border-yellow-400' : 'bg-slate-900/50 border-slate-500'}
                                    ${expectedWidth}
                                `}
                            >
                                {slot ? (
                                    <div className="flex flex-col items-center animate-bounce-short">
                                        <span className="text-2xl">{slot.image}</span>
                                        <span className="text-xl sm:text-2xl font-black text-slate-800">{slot.text}</span>
                                    </div>
                                ) : (
                                    <span className="text-slate-600 text-xs font-bold absolute bottom-2">{idx + 1}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom: Available Words */}
            <div className="w-full flex flex-wrap justify-center gap-4 sm:gap-8 p-4">
                {availableWords.map((word) => (
                    <button 
                        key={word.id}
                        onClick={() => handleWordClick(word)}
                        className={`${word.widthClass} h-24 sm:h-32 bg-white rounded-xl shadow-lg border-b-8 border-slate-300 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center justify-center gap-1 group hover:scale-105`}
                    >
                        <span className="text-3xl group-hover:animate-spin" style={{animationDuration:'2s'}}>{word.image}</span>
                        <span className="text-2xl font-black text-slate-800">{word.text}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderCinematic = () => (
        <div className="fixed inset-0 z-[9999] bg-slate-900 flex items-center justify-center overflow-hidden w-screen h-screen">
             
             {/* Background Sky/Space */}
             <div className="absolute inset-0 bg-gradient-to-b from-[#0B1026] via-[#2B32B2] to-[#1488CC]"></div>
             
             {/* Stars */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>

             {/* Earth (Bottom) */}
             <div className="absolute -bottom-[40vh] left-1/2 transform -translate-x-1/2 w-[150vw] h-[60vh] bg-green-600 rounded-[100%] border-t-8 border-blue-400 overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grass.png')] opacity-30"></div>
             </div>

             {/* Meteorite (Top Right) */}
             {cinematicStep < 3 && (
                 <div className="absolute top-10 right-10 w-32 h-32 sm:w-48 sm:h-48 animate-float">
                     <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                        <defs>
                            <radialGradient id="meteorMagma" cx="0.3" cy="0.3">
                                <stop offset="0%" stopColor="#fca5a5" />
                                <stop offset="100%" stopColor="#7f1d1d" />
                            </radialGradient>
                        </defs>
                        <path d="M50 0 L60 20 L90 10 L80 40 L100 60 L70 70 L60 100 L40 80 L10 90 L20 60 L0 40 L30 30 Z" fill="url(#meteorMagma)" className="animate-pulse" />
                     </svg>
                 </div>
             )}

             {/* Explosion (Replaces Meteorite) */}
             {cinematicStep === 3 && (
                 <div className="absolute top-0 right-0 w-64 h-64 flex items-center justify-center">
                      <div className="absolute w-full h-full bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                      <div className="absolute w-2/3 h-2/3 bg-orange-500 rounded-full animate-ping animation-delay-100 opacity-75"></div>
                      <div className="absolute w-1/3 h-1/3 bg-white rounded-full animate-ping animation-delay-200"></div>
                      {/* Dialogo visual de BOOM */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-xl border-4 border-black text-4xl font-black text-red-600 transform -rotate-12 animate-pulse whitespace-nowrap z-50">
                        {cinematicText}
                      </div>
                 </div>
             )}

             {/* Spaceship (Landed on Earth) */}
             <div className="absolute bottom-[5vh] left-[20%] w-48 h-48 sm:w-64 sm:h-64 transition-transform duration-1000 relative">
                <character.Component className="w-full h-full" />
                {/* Laser Beam Source */}
                {cinematicStep >= 1 && (
                    <div className={`absolute top-0 left-1/2 w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_red] ${cinematicStep === 1 ? 'animate-ping' : ''}`}></div>
                )}
                {/* Dialogo visual de Piu Piu */}
                {cinematicStep === 2 && cinematicText && (
                    <div className="absolute -top-10 left-10 bg-white px-3 py-1 rounded-lg border-2 border-black text-xl font-bold text-black transform rotate-6 z-50">
                        {cinematicText}
                    </div>
                )}
             </div>

             {/* Laser Beam */}
             {cinematicStep === 2 && (
                 <svg className="absolute inset-0 w-full h-full pointer-events-none z-40">
                     <line 
                        x1="28%" y1="70%" 
                        x2="85%" y2="15%" 
                        stroke="red" 
                        strokeWidth="8" 
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_15px_rgba(255,0,0,1)] animate-pulse"
                     />
                 </svg>
             )}

             {/* Celebration (Humans & Alien) */}
             {cinematicStep === 4 && (
                 <div className="absolute bottom-[5vh] left-1/2 transform -translate-x-1/2 flex flex-col items-center z-50">
                     {/* Dialogo visual de Viva */}
                     {cinematicText && (
                        <div className="mb-4 bg-white px-6 py-3 rounded-2xl border-4 border-yellow-400 text-2xl font-black text-slate-800 animate-bounce">
                            {cinematicText}
                        </div>
                     )}
                     <div className="flex items-end gap-4 animate-fade-in-up">
                        {/* Humans */}
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex flex-col items-center animate-bounce" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="w-8 h-8 bg-amber-200 rounded-full"></div>
                                <div className="w-1 h-8 bg-blue-500"></div>
                                <div className="w-8 h-1 bg-blue-500 -mt-6"></div> {/* Arms */}
                                <div className="flex gap-2 -mt-1">
                                    <div className="w-1 h-8 bg-slate-800 rotate-12"></div>
                                    <div className="w-1 h-8 bg-slate-800 -rotate-12"></div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Alien outside ship */}
                        <div className="w-24 h-24 animate-bounce">
                            <character.Component className="w-full h-full" />
                        </div>
                     </div>
                 </div>
             )}

            {/* Victory Message */}
            {cinematicStep === 4 && (
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center z-[10000] w-full px-4">
                    <button 
                        onClick={handleFinishClick}
                        className="bg-white text-blue-600 font-bold py-6 px-12 rounded-full shadow-2xl text-2xl md:text-4xl hover:scale-110 transition-transform animate-pulse border-4 border-blue-500 cursor-pointer pointer-events-auto"
                    >
                        Celebrar y Terminar Misión ➡️
                    </button>
                </div>
            )}

        </div>
    );

    return (
        <div className="w-full h-full flex flex-col p-4 bg-slate-900 rounded-2xl border border-slate-700 relative overflow-hidden">
             
             {/* Header */}
            <header className="w-full flex justify-between items-center p-4 bg-slate-800/80 rounded-xl mb-4 z-20">
                <div className="flex items-center gap-4">
                    <span className="text-cyan-300 font-bold text-xl">{student.name}</span>
                    <span className="bg-slate-700 px-3 py-1 rounded text-white font-mono">Nivel 6</span>
                </div>
                <Battery charge={progress} className="w-24 h-10" />
            </header>

            {/* Content */}
            <div className="flex-1 relative z-10">
                {victoryPhase === 'playing' ? renderGame() : renderCinematic()}
            </div>

            {/* Intro Dialog */}
            {showIntroDialog && victoryPhase === 'playing' && (
                 <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border-2 border-green-400 rounded-2xl p-8 max-w-md text-center shadow-2xl animate-fade-in-up">
                        <div className="text-6xl mb-4">📢</div>
                        <p className="text-xl text-white font-bold mb-6">
                            Ahora para activar el láser que destruirá el meteorito, tienes que formar la oración.
                        </p>
                        <button 
                            onClick={() => setShowIntroDialog(false)}
                            className="bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all"
                        >
                            ¡Entendido!
                        </button>
                    </div>
                 </div>
            )}
            
            {/* Quit */}
            {victoryPhase === 'playing' && (
                <div className="absolute top-4 right-4 md:static md:mt-4 md:flex md:justify-end z-20">
                    <button onClick={onQuit} className="text-slate-500 hover:text-red-400 text-sm font-bold flex items-center gap-1">
                        Salir
                    </button>
                </div>
            )}
        </div>
    );
};

export default LevelSix;
