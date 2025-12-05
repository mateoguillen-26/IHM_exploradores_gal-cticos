
import React, { useState, useEffect } from 'react';
import type { Student } from '../../types';
import type { Character } from './gameData';
import Battery from './Battery';

interface LevelFourProps {
    student: Student;
    character: Character;
    score: number;
    progress: number;
    onScoreChange: (newScore: number) => void;
    onComplete: () => void;
    onQuit: () => void;
    userEmail?: string;
}

// Data structure for the words
interface WordConfig {
    id: number;
    fullWord: string; 
    segments: {
        text: string; // Display text (e.g. 'E', 'LL') or empty for input
        isInput: boolean; // True if this is a meteorite that needs filling
        answer?: string; // Correct answer if isInput is true
    }[];
}

const WORDS: WordConfig[] = [
    {
        id: 1,
        fullWord: "Estrella",
        segments: [
            { text: "E", isInput: false },
            { text: "S", isInput: false },
            { text: "T", isInput: false },
            { text: "R", isInput: false },
            { text: "", isInput: true, answer: "E" },
            { text: "LL", isInput: false },
            { text: "", isInput: true, answer: "A" },
        ]
    },
    {
        id: 2,
        fullWord: "Nave",
        segments: [
            { text: "N", isInput: false },
            { text: "", isInput: true, answer: "A" },
            { text: "V", isInput: false },
            { text: "", isInput: true, answer: "E" },
        ]
    },
    {
        id: 3,
        fullWord: "Marciano",
        segments: [
            { text: "M", isInput: false },
            { text: "", isInput: true, answer: "A" },
            { text: "R", isInput: false },
            { text: "C", isInput: false },
            { text: "", isInput: true, answer: "I" },
            { text: "", isInput: true, answer: "A" },
            { text: "N", isInput: false },
            { text: "", isInput: true, answer: "O" },
        ]
    },
    {
        id: 4,
        fullWord: "Luna",
        segments: [
            { text: "L", isInput: false },
            { text: "", isInput: true, answer: "U" },
            { text: "N", isInput: false },
            { text: "", isInput: true, answer: "A" },
        ]
    }
];

// --- Meteorite Image Component ---
const Meteorite: React.FC<{ 
    content: string; 
    isInput: boolean; 
    isFilled?: boolean;
    isActiveInput?: boolean; 
    onClick?: () => void;
    isCorrect?: boolean;
}> = ({ content, isInput, isFilled, isActiveInput, onClick, isCorrect }) => {
    // Randomly select one of the 4 meteorite images
    const meteoriteImage = `/img/met${Math.floor(Math.random() * 4) + 1}.png`;
    
    return (
        <div 
            onClick={isInput ? onClick : undefined}
            className={`relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 transition-all duration-300 ${isInput ? 'cursor-pointer' : ''} ${isActiveInput ? 'scale-110 z-10 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : ''}`}
        >
             <img src={meteoriteImage} alt="meteorite" className="absolute inset-0 w-full h-full object-contain drop-shadow-md" />
             
             {/* Text Content */}
             <span className={`relative z-10 text-3xl sm:text-4xl font-black ${isInput ? "text-yellow-400" : "text-white"} drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}>
                 {content}
             </span>
        </div>
    );
};


const LevelFour: React.FC<LevelFourProps> = ({ student, score, progress, onScoreChange, onComplete, onQuit, userEmail }) => {
    // State stores answers as a 2D array: answers[wordIndex][inputIndex]
    const [answers, setAnswers] = useState<string[][]>(() => {
        return WORDS.map(word => 
            word.segments.filter(s => s.isInput).map(() => "")
        );
    });
    
    // Track which specific input is currently focused [wordIndex, inputIndex]
    // If null, no specific focus (or auto-focus first empty)
    const [focusedSlot, setFocusedSlot] = useState<[number, number] | null>([0, 0]);

    const [showDialog, setShowDialog] = useState(true);

    // Helper to find the next empty slot to focus on
    const focusNextEmpty = (currentAnswers: string[][]) => {
        for (let wIdx = 0; wIdx < WORDS.length; wIdx++) {
            for (let iIdx = 0; iIdx < currentAnswers[wIdx].length; iIdx++) {
                if (currentAnswers[wIdx][iIdx] === "") {
                    setFocusedSlot([wIdx, iIdx]);
                    return;
                }
            }
        }
        setFocusedSlot(null); // All filled
    };

    const handleVowelInput = (vowel: string) => {
        if (!focusedSlot) return; // No slot selected/available

        const [wIdx, iIdx] = focusedSlot;
        
        // Update answer
        const newAnswers = [...answers];
        newAnswers[wIdx] = [...newAnswers[wIdx]]; // Copy sub-array
        newAnswers[wIdx][iIdx] = vowel;
        setAnswers(newAnswers);

        // Speech
        const u = new SpeechSynthesisUtterance(vowel);
        u.lang = 'es-ES';
        window.speechSynthesis.speak(u);

        // Check if ALL are correct
        const allCorrect = checkAllCorrect(newAnswers);
        if (allCorrect) {
            onScoreChange(score + 100);
            const success = new SpeechSynthesisUtterance("¡Increíble! Has salvado la nave.");
            success.lang = 'es-ES';
            window.speechSynthesis.speak(success);
            setTimeout(() => {
                onComplete();
            }, 2000);
        } else {
            // Auto-advance focus to next empty
            focusNextEmpty(newAnswers);
        }
    };

    const handleDelete = () => {
        if (!focusedSlot) {
            // If nothing focused (maybe because everything full), focus last filled
            // Logic: find last non-empty
            for (let w = WORDS.length - 1; w >= 0; w--) {
                for (let i = answers[w].length - 1; i >= 0; i--) {
                    if (answers[w][i] !== "") {
                        const newAnswers = [...answers];
                        newAnswers[w][i] = "";
                        setAnswers(newAnswers);
                        setFocusedSlot([w, i]);
                        return;
                    }
                }
            }
            return;
        }

        const [wIdx, iIdx] = focusedSlot;
        // If current is empty, try to delete previous
        if (answers[wIdx][iIdx] === "") {
             // Logic to go back one step? Simplified: just clear current if filled, otherwise stay.
             // Better user experience for kids: Delete usually acts like backspace.
             // Let's implement backspace logic: Find previous slot from current focus.
             let prevW = wIdx;
             let prevI = iIdx - 1;
             if (prevI < 0) {
                 prevW = wIdx - 1;
                 if (prevW >= 0) {
                     prevI = answers[prevW].length - 1;
                 }
             }

             if (prevW >= 0 && prevI >= 0) {
                 const newAnswers = [...answers];
                 newAnswers[prevW][prevI] = "";
                 setAnswers(newAnswers);
                 setFocusedSlot([prevW, prevI]);
             }

        } else {
            const newAnswers = [...answers];
            newAnswers[wIdx][iIdx] = "";
            setAnswers(newAnswers);
        }
    };

    const handleSlotClick = (wIdx: number, inputIdx: number) => {
        setFocusedSlot([wIdx, inputIdx]);
    };

    const checkAllCorrect = (currentAnswers: string[][]) => {
        return WORDS.every((word, wIdx) => {
            const inputs = word.segments.filter(s => s.isInput);
            return inputs.every((seg, iIdx) => seg.answer === currentAnswers[wIdx][iIdx]);
        });
    };
    
    // Check individual word correctness for styling
    const isWordCorrect = (wIdx: number) => {
        const inputs = WORDS[wIdx].segments.filter(s => s.isInput);
        return inputs.every((seg, iIdx) => seg.answer === answers[wIdx][iIdx]);
    };


    return (
        <div className="w-full h-full flex flex-col p-4 rounded-2xl border border-slate-700 relative overflow-hidden" style={{ backgroundImage: "url('/img/fondo 1 4.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
             
             {/* Header */}
            <header className="w-full flex justify-between items-center p-4 bg-slate-800/80 rounded-xl mb-4 z-20">
                <div className="flex items-center gap-4">
                    <span className="text-cyan-300 font-bold text-xl">{student.name}</span>
                    <span className="bg-slate-700 px-3 py-1 rounded text-white font-mono">Nivel 4</span>
                </div>
                <Battery charge={progress} className="w-24 h-10" />
            </header>

            {/* Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 overflow-y-auto">
                {/* Background Animation */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-50 pointer-events-none"></div>
                
                {/* Words Container */}
                <div className="flex flex-col gap-4 items-center justify-center w-full max-w-4xl py-4">
                    {WORDS.map((word, wIdx) => {
                        let inputCounter = 0;
                        const wordCompleted = isWordCorrect(wIdx);
                        
                        return (
                            <div key={word.id} className="flex flex-wrap items-center justify-center gap-1">
                                {word.segments.map((seg, sIdx) => {
                                    let displayContent = seg.text;
                                    let isActive = false;
                                    let currentInputIdx = -1;

                                    if (seg.isInput) {
                                        currentInputIdx = inputCounter;
                                        displayContent = answers[wIdx][inputCounter];
                                        
                                        if (focusedSlot && focusedSlot[0] === wIdx && focusedSlot[1] === inputCounter) {
                                            isActive = true;
                                        }
                                        
                                        inputCounter++;
                                    }

                                    return (
                                        <Meteorite 
                                            key={`${wIdx}-${sIdx}`}
                                            content={displayContent} 
                                            isInput={seg.isInput}
                                            isFilled={!!displayContent}
                                            isActiveInput={isActive}
                                            isCorrect={wordCompleted}
                                            onClick={() => seg.isInput && handleSlotClick(wIdx, currentInputIdx)}
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>

                {/* Keyboard */}
                <div className="w-full max-w-2xl bg-slate-800/90 rounded-t-2xl p-4 border-t border-slate-600 flex flex-wrap justify-center gap-2 sm:gap-4 mt-auto shadow-2xl z-30">
                    {['A', 'E', 'I', 'O', 'U'].map(vowel => (
                        <button
                            key={vowel}
                            onClick={() => handleVowelInput(vowel)}
                            className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 rounded-xl shadow-[0_4px_0_rgb(30,58,138)] active:shadow-none active:translate-y-1 text-white font-black text-2xl flex items-center justify-center transition-all"
                        >
                            {vowel}
                        </button>
                    ))}
                    <button
                        onClick={handleDelete}
                        className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 rounded-xl shadow-[0_4px_0_rgb(153,27,27)] active:shadow-none active:translate-y-1 text-white flex items-center justify-center transition-all"
                        aria-label="Borrar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Dialog */}
            {showDialog && (
                 <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border-2 border-red-500 rounded-2xl p-8 max-w-md text-center shadow-2xl animate-bounce-short">
                        <div className="text-6xl mb-4">☄️</div>
                        <h2 className="text-2xl text-red-400 font-black mb-4">¡ALERTA!</h2>
                        <p className="text-lg text-white font-bold mb-6">
                            Oh no, ¡mira! una lluvia de meteoritos.<br/>
                            Completa todas las palabras para salvar la nave.
                        </p>
                        <button 
                            onClick={() => setShowDialog(false)}
                            className="bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all"
                        >
                            ¡Defender la Nave!
                        </button>
                    </div>
                 </div>
            )}

            {/* Quit */}
            <div className="absolute top-4 right-4 md:static md:mt-4 md:flex md:justify-end md:gap-2 z-20">
                 <button onClick={onQuit} className="text-slate-500 hover:text-red-400 text-sm font-bold flex items-center gap-1">
                    Salir
                </button>
                {userEmail === 'mateo@mateo' && (
                    <button onClick={onComplete} className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold text-sm">
                        Skip ⏭️
                    </button>
                )}
            </div>
        </div>
    );
};

export default LevelFour;
