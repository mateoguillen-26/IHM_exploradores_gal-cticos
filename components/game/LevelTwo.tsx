
import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Student } from '../../types';
import type { Character } from './gameData';
import { giftItems, GiftItem } from './gameData';
import Battery from './Battery';

interface LevelTwoProps {
    student: Student;
    character: Character;
    score: number;
    progress: number;
    onScoreChange: (newScore: number) => void;
    onComplete: () => void;
    onQuit: () => void;
}

// --- Componentes SVG Auxiliares ---

// Marciano dinámico que cambia según la vocal
const Martian: React.FC<{ vowel: string, className?: string, onClick?: () => void }> = ({ vowel, className, onClick }) => {
    
    // Configuración visual única para cada vocal
    const styles: Record<string, any> = {
        'a': { 
            body: '#ef4444', // Rojo
            belly: '#fecaca',
            stroke: '#b91c1c',
            type: 'one-eye-antenna' 
        },
        'e': { 
            body: '#3b82f6', // Azul
            belly: '#dbeafe',
            stroke: '#1d4ed8',
            type: 'two-eyes-ears' 
        },
        'i': { 
            body: '#fbbf24', // Amarillo
            belly: '#fef3c7',
            stroke: '#b45309',
            type: 'three-eyes' 
        },
        'o': { 
            body: '#22c55e', // Verde
            belly: '#dcfce7',
            stroke: '#15803d',
            type: 'classic' 
        },
        'u': { 
            body: '#a855f7', // Morado
            belly: '#f3e8ff',
            stroke: '#7e22ce',
            type: 'horns' 
        }
    };

    const s = styles[vowel.toLowerCase()] || styles['o'];

    return (
        <svg viewBox="0 0 100 100" className={`cursor-pointer ${className}`} onClick={onClick}>
            {/* Accesorios de cabeza (Antenas/Orejas/Cuernos) - Renderizados DETRÁS del cuerpo */}
            {s.type === 'one-eye-antenna' && (
                 <path d="M50 20 L50 5" stroke={s.stroke} strokeWidth="4" strokeLinecap="round" />
            )}
            {s.type === 'two-eyes-ears' && (
                <>
                    <path d="M30 25 L20 10" stroke={s.stroke} strokeWidth="4" strokeLinecap="round" />
                    <circle cx="20" cy="10" r="4" fill={s.stroke} />
                    <path d="M70 25 L80 10" stroke={s.stroke} strokeWidth="4" strokeLinecap="round" />
                    <circle cx="80" cy="10" r="4" fill={s.stroke} />
                </>
            )}
             {s.type === 'three-eyes' && (
                <>
                   <path d="M35 25 L30 15" stroke={s.stroke} strokeWidth="3" />
                   <path d="M50 20 L50 10" stroke={s.stroke} strokeWidth="3" />
                   <path d="M65 25 L70 15" stroke={s.stroke} strokeWidth="3" />
                </>
            )}
             {s.type === 'classic' && (
                 <>
                    <path d="M 35 25 L 25 15" stroke={s.stroke} strokeWidth="4" strokeLinecap="round" />
                    <path d="M 65 25 L 75 15" stroke={s.stroke} strokeWidth="4" strokeLinecap="round" />
                 </>
            )}
            {s.type === 'horns' && (
                 <>
                    <path d="M 35 25 Q 25 10 40 5" stroke="none" fill={s.stroke} />
                    <path d="M 65 25 Q 75 10 60 5" stroke="none" fill={s.stroke} />
                 </>
            )}

            {/* Cuerpo */}
            <ellipse cx="50" cy="60" rx="35" ry="38" fill={s.body} stroke={s.stroke} strokeWidth="3" />
            
            {/* Panza */}
            <ellipse cx="50" cy="70" rx="20" ry="12" fill={s.belly} opacity="0.7" />

            {/* Ojos */}
            {s.type === 'one-eye-antenna' && (
                <g>
                    <circle cx="50" cy="50" r="14" fill="white" stroke={s.stroke} strokeWidth="2" />
                    <circle cx="50" cy="50" r="6" fill="black" />
                    <circle cx="53" cy="47" r="2" fill="white" />
                    <circle cx="50" cy="5" r="5" fill="#fbbf24" /> {/* Bombilla antena */}
                </g>
            )}
            {s.type === 'two-eyes-ears' && (
                <g>
                    <circle cx="38" cy="50" r="10" fill="white" stroke={s.stroke} strokeWidth="2" />
                    <circle cx="38" cy="50" r="4" fill="black" />
                    <circle cx="62" cy="50" r="10" fill="white" stroke={s.stroke} strokeWidth="2" />
                    <circle cx="62" cy="50" r="4" fill="black" />
                </g>
            )}
             {s.type === 'three-eyes' && (
                <g>
                    <circle cx="35" cy="55" r="7" fill="white" stroke={s.stroke} strokeWidth="1" />
                    <circle cx="35" cy="55" r="2.5" fill="black" />
                    <circle cx="50" cy="45" r="9" fill="white" stroke={s.stroke} strokeWidth="1" />
                    <circle cx="50" cy="45" r="3.5" fill="black" />
                    <circle cx="65" cy="55" r="7" fill="white" stroke={s.stroke} strokeWidth="1" />
                    <circle cx="65" cy="55" r="2.5" fill="black" />
                </g>
            )}
            {s.type === 'classic' && (
                 <g>
                    <circle cx="38" cy="48" r="11" fill="white" stroke={s.stroke} strokeWidth="2" />
                    <circle cx="38" cy="48" r="4" fill="black" />
                    <circle cx="62" cy="48" r="11" fill="white" stroke={s.stroke} strokeWidth="2" />
                    <circle cx="62" cy="48" r="4" fill="black" />
                 </g>
            )}
            {s.type === 'horns' && (
                 <g>
                    <circle cx="50" cy="50" r="16" fill="white" stroke={s.stroke} strokeWidth="2" />
                    <circle cx="50" cy="50" r="5" fill="black" />
                    {/* Ceja enojada/seria */}
                    <path d="M 35 40 L 65 40" stroke={s.stroke} strokeWidth="3" />
                 </g>
            )}

            {/* Boca */}
            <path d="M 40 80 Q 50 88 60 80" stroke={s.stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
    );
};

const Crater: React.FC<{ isOpen: boolean, onClick: () => void, children?: React.ReactNode }> = ({ isOpen, onClick, children }) => (
    <div className="relative w-32 h-32 flex items-center justify-center">
        <div 
            onClick={onClick}
            className={`absolute bottom-0 w-32 h-12 bg-slate-700 rounded-[100%] border-4 border-slate-600 transition-all duration-300 cursor-pointer hover:bg-slate-600 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 z-20'}`}
        >
             <div className="w-full h-full bg-black/30 rounded-[100%] scale-90 blur-sm"></div>
        </div>
        
        <div className={`transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-50'} z-10`}>
            {children}
        </div>
        
        {/* Background Hole when open */}
        {isOpen && <div className="absolute bottom-0 w-28 h-8 bg-black/60 rounded-[100%] blur-md -z-0"></div>}
    </div>
);

const Sign: React.FC<{ text: string, color?: string, onClick?: () => void, isSelected?: boolean }> = ({ text, color = "bg-white", onClick, isSelected }) => (
    <div 
        onClick={onClick}
        className={`relative flex flex-col items-center group cursor-pointer ${isSelected ? 'scale-110' : ''}`}
    >
        <div className={`w-20 h-16 ${color} border-4 border-slate-300 rounded-lg flex items-center justify-center shadow-lg transition-all ${isSelected ? 'ring-4 ring-yellow-400 shadow-yellow-400/50' : ''}`}>
            <span className="text-3xl font-black text-slate-800 font-sans">{text}</span>
        </div>
        <div className="w-2 h-12 bg-slate-400"></div>
    </div>
);


const LevelTwo: React.FC<LevelTwoProps> = ({ student, score, progress, onScoreChange, onComplete, onQuit }) => {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const [phase, setPhase] = useState<1 | 2 | 3>(1);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogText, setDialogText] = useState("");
    
    // --- Phase 1 State ---
    const [cratersOpen, setCratersOpen] = useState<boolean[]>([false, false, false, false, false]);

    // --- Phase 2 State ---
    const [shuffledSigns, setShuffledSigns] = useState<string[]>([]);
    const [selectedAlienIndex, setSelectedAlienIndex] = useState<number | null>(null);
    const [matches, setMatches] = useState<{alienIdx: number, signIdx: number}[]>([]); // Pairs of indices

    // --- Phase 3 State ---
    const [gameItems, setGameItems] = useState<GiftItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<GiftItem | null>(null);
    const [sortedItems, setSortedItems] = useState<Record<string, GiftItem | null>>({ a: null, e: null, i: null, o: null, u: null });


    // --- Init Logic ---
    useEffect(() => {
        // Init Phase 2 shuffled signs
        setShuffledSigns([...vowels].sort(() => Math.random() - 0.5));
        
        // Init Phase 3 random items
        const selectedGifts: GiftItem[] = [];
        vowels.forEach(v => {
            const options = giftItems.filter(item => item.vowel === v);
            const random = options[Math.floor(Math.random() * options.length)];
            selectedGifts.push(random);
        });
        setGameItems(selectedGifts.sort(() => Math.random() - 0.5));
    }, []);

    // --- Phase 1 Handlers ---
    const handleCraterClick = (index: number) => {
        if (cratersOpen[index]) return;
        
        const newCraters = [...cratersOpen];
        newCraters[index] = true;
        setCratersOpen(newCraters);

        // Speak
        const v = vowels[index];
        const u = new SpeechSynthesisUtterance(v);
        u.lang = 'es-ES';
        window.speechSynthesis.speak(u);

        // Check completion
        if (newCraters.every(isOpen => isOpen)) {
            setTimeout(() => {
                setDialogText("¡Descubriste las vocales, que bien! Continua...");
                setShowDialog(true);
            }, 1000);
        }
    };

    const nextPhaseFromDialog = () => {
        setShowDialog(false);
        if (phase === 1) setPhase(2);
        if (phase === 2) {
             setDialogText("Los marcianos te han regalado objetos por ayudarles, ahora necesitas ordenar tus regalos");
             setPhase(3);
             setShowDialog(true); // Re-open for Phase 3 intro
        }
        if (phase === 3) {
            // Should not happen via dialog button, logic is handled in phase 3 completion
        }
    };

    // --- Phase 2 Handlers ---
    const handleAlienClickPhase2 = (index: number) => {
        // If already matched, ignore
        if (matches.find(m => m.alienIdx === index)) return;

        setSelectedAlienIndex(index);
        const v = vowels[index];
        const u = new SpeechSynthesisUtterance(v);
        u.lang = 'es-ES';
        window.speechSynthesis.speak(u);
    };

    const handleSignClickPhase2 = (signIndex: number) => {
        if (selectedAlienIndex === null) return;
        
        // Check if correct
        const alienVowel = vowels[selectedAlienIndex];
        const signVowel = shuffledSigns[signIndex];

        if (alienVowel === signVowel) {
            // Match!
            setMatches([...matches, { alienIdx: selectedAlienIndex, signIdx: signIndex }]);
            setSelectedAlienIndex(null);
            onScoreChange(score + 10);
            
            // Success sound or visual feedback could go here

            if (matches.length + 1 === 5) {
                 setTimeout(() => {
                    setDialogText("¡Excelente trabajo conectando!");
                    setShowDialog(true);
                 }, 500);
            }
        } else {
            // Error feedback
             const u = new SpeechSynthesisUtterance("Inténtalo de nuevo");
             u.lang = 'es-ES';
             window.speechSynthesis.speak(u);
             setSelectedAlienIndex(null);
        }
    };
    
    // --- Phase 3 Handlers ---
    const handleItemClick = (item: GiftItem) => {
        // Check if item is already sorted
        if ((Object.values(sortedItems) as (GiftItem | null)[]).some(i => i?.id === item.id)) return;
        setSelectedItem(item);
        
        const u = new SpeechSynthesisUtterance(item.name);
        u.lang = 'es-ES';
        window.speechSynthesis.speak(u);
    };

    const handleContainerClick = (vowel: string) => {
        if (!selectedItem) return;

        if (selectedItem.vowel === vowel) {
            // Correct placement
            setSortedItems(prev => ({ ...prev, [vowel]: selectedItem }));
            setSelectedItem(null);
            onScoreChange(score + 20);

            // Check completion
            const currentSortedCount = Object.values(sortedItems).filter(Boolean).length + 1;
            if (currentSortedCount === 5) {
                setTimeout(() => {
                    onComplete(); // End Level 2, go to map, recharge battery
                }, 1500);
            }

        } else {
             const u = new SpeechSynthesisUtterance("Ese no es su lugar");
             u.lang = 'es-ES';
             window.speechSynthesis.speak(u);
             setSelectedItem(null);
        }
    }


    // --- RENDERERS ---

    const renderPhase1 = () => (
        <div className="flex flex-wrap justify-center items-end gap-8 h-full pb-20">
            {vowels.map((vowel, index) => (
                <div key={index} className="flex flex-col items-center">
                    <Crater isOpen={cratersOpen[index]} onClick={() => handleCraterClick(index)}>
                        <div className="flex flex-col items-center animate-bounce-short">
                            <div className="bg-white border-2 border-slate-800 px-3 py-1 rounded-lg mb-1 shadow-md">
                                <span className="font-bold text-xl text-black">{vowel.toUpperCase()}{vowel}</span>
                            </div>
                            <Martian vowel={vowel} className="w-20 h-20" />
                        </div>
                    </Crater>
                </div>
            ))}
        </div>
    );

    const renderPhase2 = () => (
        <div className="w-full h-full flex flex-col justify-between py-10 px-4 relative">
             {/* Lines Overlay */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                {matches.map((m, i) => {
                     // Simple heuristic for positions: 
                     // Aliens are distributed evenly at bottom (approx Y=80%)
                     // Signs are distributed evenly at top (approx Y=20%)
                     // X positions depend on index (0 to 4)
                     const startX = `${(m.alienIdx * 20) + 10}%`; 
                     const startY = "80%";
                     const endX = `${(m.signIdx * 20) + 10}%`; 
                     const endY = "20%";
                     return (
                         <line key={i} x1={startX} y1={startY} x2={endX} y2={endY} stroke="#4ade80" strokeWidth="4" strokeDasharray="5,5" className="animate-pulse" />
                     );
                })}
                 {/* Temporary line for selection could be added here if we tracked mouse position, but simplified for now */}
             </svg>

            {/* Top Row: Signs (Shuffled) */}
            <div className="flex justify-around w-full z-20">
                {shuffledSigns.map((vowel, idx) => {
                    const isMatched = matches.some(m => m.signIdx === idx);
                    return (
                        <div key={idx} className={`transition-opacity ${isMatched ? 'opacity-50' : 'opacity-100'}`}>
                             <Sign 
                                text={`${vowel.toUpperCase()}${vowel}`} 
                                onClick={() => handleSignClickPhase2(idx)}
                                color={isMatched ? "bg-green-200" : "bg-white"}
                             />
                        </div>
                    );
                })}
            </div>

            {/* Bottom Row: Aliens (Ordered a,e,i,o,u for simplicity of logic, though visually just aliens) */}
            <div className="flex justify-around w-full z-20">
                {vowels.map((vowel, idx) => {
                    const isMatched = matches.some(m => m.alienIdx === idx);
                    const isSelected = selectedAlienIndex === idx;
                    return (
                        <div key={idx} className="flex flex-col items-center">
                             <Martian 
                                vowel={vowel}
                                className={`w-24 h-24 transition-transform ${isSelected ? 'scale-125 drop-shadow-[0_0_15px_rgba(74,222,128,0.8)]' : ''} ${isMatched ? 'opacity-50 grayscale' : ''}`} 
                                onClick={() => handleAlienClickPhase2(idx)} 
                             />
                             {isMatched && <div className="text-green-400 font-bold text-xl mt-2">✓</div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderPhase3 = () => (
        <div className="w-full h-full flex flex-col justify-between py-6 px-2">
            
            {/* Containers */}
            <div className="flex justify-around w-full mb-8">
                {vowels.map((vowel) => {
                    const filledItem = sortedItems[vowel];
                    return (
                        <div 
                            key={vowel} 
                            onClick={() => handleContainerClick(vowel)}
                            className={`w-16 h-24 sm:w-24 sm:h-32 border-4 border-dashed rounded-xl flex flex-col items-center justify-end p-2 transition-colors relative cursor-pointer
                                ${filledItem ? 'border-green-500 bg-green-500/10' : 'border-slate-500 bg-slate-800/50 hover:border-yellow-400'}
                            `}
                        >
                            <span className="absolute top-2 text-2xl font-black text-slate-400 uppercase">{vowel}</span>
                            {filledItem ? (
                                <div className="text-4xl animate-bounce-short">{filledItem.icon}</div>
                            ) : (
                                <div className="text-slate-600 text-xs text-center">Depositar aquí</div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Items Pool */}
            <div className="bg-slate-800/60 rounded-2xl p-6 flex flex-wrap justify-center gap-6 min-h-[150px]">
                {gameItems.map((item) => {
                    const isSorted = (Object.values(sortedItems) as (GiftItem | null)[]).some(i => i?.id === item.id);
                    if (isSorted) return null; // Hide if sorted
                    
                    const isSelected = selectedItem?.id === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={`w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-lg transform transition-all hover:scale-110 
                                ${isSelected ? 'ring-4 ring-yellow-400 scale-110 -translate-y-2' : ''}
                            `}
                        >
                            {item.icon}
                        </button>
                    );
                })}
                {Object.values(sortedItems).every(Boolean) && (
                    <div className="text-green-400 text-2xl font-bold animate-pulse">¡Nivel Completado! Recargando...</div>
                )}
            </div>
        </div>
    );

    return (
        <div className="w-full h-full flex flex-col p-4 bg-slate-900 rounded-2xl border border-slate-700 relative overflow-hidden">
             
             {/* Header */}
            <header className="w-full flex justify-between items-center p-4 bg-slate-800/80 rounded-xl mb-4">
                <div className="flex items-center gap-4">
                    <span className="text-cyan-300 font-bold text-xl">{student.name}</span>
                    <span className="bg-slate-700 px-3 py-1 rounded text-white font-mono">Fase {phase}/3</span>
                </div>
                <Battery charge={progress} className="w-24 h-10" />
            </header>

            {/* Game Area */}
            <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-repeat">
                {phase === 1 && renderPhase1()}
                {phase === 2 && renderPhase2()}
                {phase === 3 && renderPhase3()}
            </div>
            
            {/* Dialog Overlay */}
            {showDialog && (
                 <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border-2 border-green-400 rounded-2xl p-8 max-w-md text-center shadow-2xl animate-fade-in-up">
                        {/* Mostramos un marciano genérico o el "líder" en el diálogo */}
                        <Martian vowel="o" className="w-24 h-24 mx-auto mb-4" />
                        <p className="text-xl text-white font-bold mb-6">{dialogText}</p>
                        <button 
                            onClick={nextPhaseFromDialog}
                            className="bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all"
                        >
                            {phase === 3 ? "Ver mi regalo" : "Siguiente Fase"}
                        </button>
                    </div>
                 </div>
            )}

            {/* Footer / Quit */}
            <div className="absolute top-4 right-4 md:static md:mt-4 md:flex md:justify-end">
                 <button onClick={onQuit} className="text-slate-500 hover:text-red-400 text-sm font-bold flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    Salir
                </button>
            </div>
        </div>
    );
};

export default LevelTwo;
