
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
    userEmail?: string;
}

// --- Componentes SVG Auxiliares ---

// Marciano image-based component that uses PNG files
const Martian: React.FC<{ vowel: string, className?: string, onClick?: () => void }> = ({ vowel, className, onClick }) => {
    
    // Get image path based on vowel
    const getMarcianoImage = () => {
        const vowelLower = vowel.toLowerCase();
        // Handle special case for 'i' which is lowercase in filename
        if (vowelLower === 'i') {
            return `/img/Marciano i.png`;
        }
        return `/img/Marciano ${vowel.toUpperCase()}.png`;
    };

    return (
        <img 
            src={getMarcianoImage()}
            alt={`Marciano ${vowel}`}
            className={`cursor-pointer object-contain ${className}`}
            onClick={onClick}
        />
    );
};

const Crater: React.FC<{ isOpen: boolean, onClick: () => void, children?: React.ReactNode }> = ({ isOpen, onClick, children }) => (
    <div className="relative w-32 h-32 flex items-center justify-center cursor-pointer" onClick={onClick}>
        <img 
            src="/img/Crater.png"
            alt="Crater"
            className={`w-full h-full object-contain transition-all duration-300 ${isOpen ? 'opacity-50' : 'opacity-100'}`}
        />
        
        <div className={`absolute transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-50'} z-10`}>
            {children}
        </div>
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


const LevelTwo: React.FC<LevelTwoProps> = ({ student, score, progress, onScoreChange, onComplete, onQuit, userEmail }) => {
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


    // --- Helper function to get image path for Phase 3 items ---
    const getItemImagePath = (itemId: string): string => {
        const itemImageMap: Record<string, string> = {
            'anillo': '2.3ANILLO',
            'avion': '2.3AVION',
            'astronauta': '2.3ASTRONAUTA',
            'escalera': '2.3ESCALERA',
            'esponja': '2.3ESPONJA',
            'estrella': '2.3ESTRELLA',
            'iglu': '2.3IGLU',
            'insecto': '2.3INSECTO',
            'iman': '2.3IMAN',
            'oso': '2.3OSO',
            'ojo': '2.3OJO',
            'oveja': '2.3OVEJA',
            'uva': '2.3UVA',
            'unicornio': '2.3UNICORNIO',
            'uno': '2.3UNO',
        };
        return `/img/${itemImageMap[itemId] || itemId}.png`;
    };

    // --- RENDERERS ---

    const renderPhase1 = () => (
        <div className="flex flex-wrap justify-center items-end gap-8 h-full pb-20" style={{ marginTop: '190px' }}>
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
        <div className="w-full h-full flex flex-col justify-between py-12 px-4">
            
            {/* Containers - Positioned to align with background image */}
            <div className="flex justify-center w-full px-4" style={{ gap: '150px', marginTop: '-38px' }}>
                {vowels.map((vowel) => {
                    const filledItem = sortedItems[vowel];
                    return (
                        <div 
                            key={vowel} 
                            onClick={() => handleContainerClick(vowel)}
                            className="flex flex-col items-center cursor-pointer relative h-56 justify-end w-24 sm:w-32"
                        >
                            {filledItem ? (
                                <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center animate-bounce-short">
                                    <img src={getItemImagePath(filledItem.id)} alt={filledItem.name} className="w-full h-full object-contain" />
                                </div>
                            ) : (
                                <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-slate-400/30 text-xs text-center">
                                    {vowel.toUpperCase()}
                                </div>
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
                            className={`w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-all hover:scale-110 
                                ${isSelected ? 'ring-4 ring-yellow-400 scale-110 -translate-y-2' : ''}
                            `}
                        >
                            <img src={getItemImagePath(item.id)} alt={item.name} className="w-16 h-16 object-contain" />
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
        <div 
            className="w-full h-full flex flex-col p-4 rounded-2xl border border-slate-700 relative overflow-hidden"
            style={{
                backgroundImage: phase === 3 ? `url(/img/fondo_Nivel2.3.png)` : `url(/img/fondo_nivel2.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
             
             {/* Header */}
            <header className="w-full flex justify-between items-center p-4 bg-slate-800/80 rounded-xl mb-4">
                <div className="flex items-center gap-4">
                    <span className="text-cyan-300 font-bold text-xl">{student.name}</span>
                    <span className="bg-slate-700 px-3 py-1 rounded text-white font-mono">Fase {phase}/3</span>
                </div>
                <Battery charge={progress} className="w-24 h-10" />
            </header>

            {/* Game Area */}
            <div className="flex-1 relative bg-transparent">
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
            <div className="absolute top-4 right-4 md:static md:mt-4 md:flex md:justify-end md:gap-2">
                 <button onClick={onQuit} className="text-slate-500 hover:text-red-400 text-sm font-bold flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
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

export default LevelTwo;
