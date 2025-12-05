
import React, { useState, useEffect, useRef } from 'react';
import type { Student } from '../../types';
import type { Character } from './gameData';
import Battery from './Battery';

interface LevelThreeProps {
    student: Student;
    character: Character;
    score: number;
    progress: number;
    onScoreChange: (newScore: number) => void;
    onComplete: () => void;
    onQuit: () => void;
}

interface Point {
    x: number;
    y: number;
    id: number;
}

interface Connection {
    from: number;
    to: number;
}

interface LetterConfig {
    letter: string;
    points: Point[];
    requiredConnections: Connection[];
    pathD: string; // SVG path for the animation
}

// Coordenadas y configuración para cada letra (Escala 0-100)
const LETTERS: LetterConfig[] = [
    {
        letter: 'A',
        points: [
            { id: 1, x: 50, y: 15 }, // Top
            { id: 2, x: 20, y: 85 }, // Bottom Left
            { id: 3, x: 80, y: 85 }, // Bottom Right
            { id: 4, x: 35, y: 50 }, // Mid Left
            { id: 5, x: 65, y: 50 }, // Mid Right
        ],
        requiredConnections: [
            { from: 2, to: 1 }, { from: 1, to: 3 }, { from: 4, to: 5 }
        ],
        pathD: "M 20 85 L 50 15 L 80 85 M 35 50 L 65 50"
    },
    {
        letter: 'E',
        points: [
            { id: 1, x: 70, y: 15 }, { id: 2, x: 30, y: 15 }, // Top bar
            { id: 3, x: 30, y: 50 }, { id: 4, x: 60, y: 50 }, // Mid bar
            { id: 5, x: 30, y: 85 }, { id: 6, x: 70, y: 85 }, // Bot bar
        ],
        requiredConnections: [
            { from: 1, to: 2 }, { from: 2, to: 5 }, { from: 5, to: 6 }, { from: 3, to: 4 }
        ],
        pathD: "M 70 15 L 30 15 L 30 85 L 70 85 M 30 50 L 60 50"
    },
    {
        letter: 'I',
        points: [
            { id: 1, x: 30, y: 15 }, { id: 2, x: 70, y: 15 }, // Top
            { id: 3, x: 50, y: 15 }, { id: 4, x: 50, y: 85 }, // Mid
            { id: 5, x: 30, y: 85 }, { id: 6, x: 70, y: 85 }  // Bot
        ],
        requiredConnections: [
            { from: 1, to: 2 }, { from: 3, to: 4 }, { from: 5, to: 6 }
        ],
        pathD: "M 30 15 L 70 15 M 50 15 L 50 85 M 30 85 L 70 85"
    },
    {
        letter: 'O',
        points: [
            { id: 1, x: 50, y: 15 }, 
            { id: 2, x: 80, y: 50 }, 
            { id: 3, x: 50, y: 85 }, 
            { id: 4, x: 20, y: 50 }
        ],
        requiredConnections: [
            { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }, { from: 4, to: 1 }
        ],
        pathD: "M 50 15 L 80 50 L 50 85 L 20 50 L 50 15"
    },
    {
        letter: 'U',
        points: [
            { id: 1, x: 30, y: 15 }, 
            { id: 2, x: 30, y: 70 }, 
            { id: 3, x: 50, y: 85 }, 
            { id: 4, x: 70, y: 70 },
            { id: 5, x: 70, y: 15 }
        ],
        requiredConnections: [
            { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }, { from: 4, to: 5 }
        ],
        pathD: "M 30 15 L 30 70 Q 30 85 50 85 Q 70 85 70 70 L 70 15"
    }
];

const LevelThree: React.FC<LevelThreeProps> = ({ student, score, progress, onScoreChange, onComplete, onQuit }) => {
    const [phase, setPhase] = useState<'intro' | 'game'>('intro');
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [showDialog, setShowDialog] = useState(true);
    const [dialogContent, setDialogContent] = useState({ 
        text: "Mira estrellas fugaces, estan trazando las vocales que necesitamos aprender", 
        btn: "¡Observar!" 
    });
    
    // State for Game Phase
    const [lines, setLines] = useState<Connection[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [startPoint, setStartPoint] = useState<number | null>(null);
    const [currentDragPos, setCurrentDragPos] = useState<{x:number, y:number} | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    // State for Intro Animation
    const [introIndex, setIntroIndex] = useState(0); // 0 to 4 (A to U)
    const [animating, setAnimating] = useState(false);

    // --- LOGIC: INTRO PHASE ---
    const startIntroAnimations = () => {
        setShowDialog(false);
        setAnimating(true);
        setIntroIndex(0);
    };

    const handleIntroVideoEnded = () => {
        if (introIndex < LETTERS.length - 1) {
            setIntroIndex(prev => prev + 1);
        } else {
            setAnimating(false);
            setDialogContent({ 
                text: "Ahora nos toca trazar la letra para formar la constelación", 
                btn: "¡A Trazar!" 
            });
            setShowDialog(true);
            setPhase('game');
            setCurrentLetterIndex(0);
        }
    };

    useEffect(() => {
        if (animating) {
            const letter = LETTERS[introIndex];
            const utterance = new SpeechSynthesisUtterance(letter.letter);
            utterance.lang = 'es-ES';
            window.speechSynthesis.speak(utterance);
        }
    }, [introIndex, animating]);

    const handleDialogNext = () => {
        if (phase === 'intro') {
            startIntroAnimations();
        } else {
            setShowDialog(false);
        }
    };

    // --- LOGIC: GAME PHASE ---
    const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const CTM = svgRef.current.getScreenCTM();
        if (!CTM) return { x: 0, y: 0 };
        
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }
        
        return {
            x: (clientX - CTM.e) / CTM.a,
            y: (clientY - CTM.f) / CTM.d
        };
    };

    const handlePointDown = (id: number) => {
        setIsDragging(true);
        setStartPoint(id);
    };

    const handleSvgMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging) return;
        const coords = getCoordinates(e);
        setCurrentDragPos(coords);
    };

    const handlePointUp = (id: number) => {
        if (!isDragging || startPoint === null) return;
        
        if (startPoint !== id) {
            // Check if connection already exists
            const exists = lines.some(l => 
                (l.from === startPoint && l.to === id) || (l.from === id && l.to === startPoint)
            );
            
            // Allow connection if not exists and valid based on letter structure? 
            // For kids, maybe we check if it matches a 'requiredConnection' OR just let them draw any line between stars
            // To be strict: check if pair is in requiredConnections
            const isValid = LETTERS[currentLetterIndex].requiredConnections.some(rc => 
                (rc.from === startPoint && rc.to === id) || (rc.from === id && rc.to === startPoint)
            );

            if (!exists && isValid) {
                setLines([...lines, { from: startPoint, to: id }]);
                checkCompletion([...lines, { from: startPoint, to: id }]);
            } else if (!isValid) {
                 // Error feedback sound
            }
        }
        
        setIsDragging(false);
        setStartPoint(null);
        setCurrentDragPos(null);
    };

    const checkCompletion = (currentLines: Connection[]) => {
        const required = LETTERS[currentLetterIndex].requiredConnections;
        // Check if all required connections are present
        const allConnected = required.every(req => 
            currentLines.some(l => 
                (l.from === req.from && l.to === req.to) || (l.from === req.to && l.to === req.from)
            )
        );

        if (allConnected) {
            onScoreChange(score + 20);
            // Play sound
            const u = new SpeechSynthesisUtterance("¡Muy bien!");
            window.speechSynthesis.speak(u);

            setTimeout(() => {
                if (currentLetterIndex < LETTERS.length - 1) {
                    setCurrentLetterIndex(prev => prev + 1);
                    setLines([]);
                } else {
                    onComplete();
                }
            }, 1000);
        }
    };


    // --- RENDERERS ---

    const renderIntro = () => {
        const letter = LETTERS[introIndex];
        return (
            <div className="flex flex-col items-center justify-center h-full relative">
                <h2 className="text-4xl text-white font-bold mb-4 animate-pulse">Observa...</h2>
                <div className="relative w-80 h-80 bg-slate-900/20 rounded-xl border border-slate-600 overflow-hidden">
                    <video
                        key={introIndex}
                        src={`/img/anima${letter.letter}.mp4`}
                        className="w-full h-full rounded-xl object-cover"
                        autoPlay
                        muted
                        playsInline
                        onEnded={handleIntroVideoEnded}
                    />
                </div>
                <div className="mt-4 text-6xl font-black text-yellow-400">{letter.letter}</div>
            </div>
        )
    };

    const renderGame = () => {
        const letter = LETTERS[currentLetterIndex];
        return (
            <div className="flex flex-col items-center justify-center h-full w-full max-w-lg mx-auto">
                <h2 className="text-2xl text-cyan-300 font-bold mb-2">Traza la letra: {letter.letter}</h2>
                <div className="relative w-full aspect-square bg-slate-900/80 rounded-2xl border-2 border-slate-600 shadow-2xl overflow-hidden touch-none">
                     {/* Background Cosmos */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>

                    <svg 
                        ref={svgRef}
                        viewBox="0 0 100 100" 
                        className="w-full h-full absolute inset-0 z-10"
                        onMouseMove={handleSvgMove}
                        onTouchMove={handleSvgMove}
                        onMouseUp={() => { setIsDragging(false); setStartPoint(null); setCurrentDragPos(null); }}
                        onTouchEnd={() => { setIsDragging(false); setStartPoint(null); setCurrentDragPos(null); }}
                    >
                        {/* Drawn Lines */}
                        {lines.map((line, i) => {
                            const p1 = letter.points.find(p => p.id === line.from)!;
                            const p2 = letter.points.find(p => p.id === line.to)!;
                            return (
                                <line 
                                    key={i} 
                                    x1={p1.x} y1={p1.y} 
                                    x2={p2.x} y2={p2.y} 
                                    stroke="#4ade80" 
                                    strokeWidth="3" 
                                    strokeLinecap="round"
                                    className="drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]"
                                />
                            );
                        })}

                        {/* Dragging Line */}
                        {isDragging && startPoint !== null && currentDragPos && (
                            <line 
                                x1={letter.points.find(p => p.id === startPoint)!.x}
                                y1={letter.points.find(p => p.id === startPoint)!.y}
                                x2={currentDragPos.x}
                                y2={currentDragPos.y}
                                stroke="#fbbf24"
                                strokeWidth="2"
                                strokeDasharray="4"
                                strokeLinecap="round"
                            />
                        )}

                        {/* Stars (Touch Points) */}
                        {letter.points.map(p => {
                            const isConnected = lines.some(l => l.from === p.id || l.to === p.id);
                            const isStart = startPoint === p.id;
                            return (
                                <g 
                                    key={p.id} 
                                    onMouseDown={() => handlePointDown(p.id)}
                                    onTouchStart={() => handlePointDown(p.id)}
                                    onMouseUp={() => handlePointUp(p.id)}
                                    onTouchEnd={() => handlePointUp(p.id)}
                                    className="cursor-pointer"
                                >
                                    {/* Star Image */}
                                    <image 
                                        x={p.x - 6} 
                                        y={p.y - 6} 
                                        width="12" 
                                        height="12" 
                                        href="/img/estrella nivel 3.png"
                                        className={`transition-all ${isStart ? 'filter drop-shadow-[0_0_8px_rgba(251,191,36,1)]' : ''}`}
                                        style={{ opacity: isConnected ? 0.8 : 1 }}
                                    />
                                    
                                    {/* Hit Area (Larger) */}
                                    <circle cx={p.x} cy={p.y} r="8" fill="transparent" />
                                </g>
                            )
                        })}
                    </svg>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col p-4 rounded-2xl border border-slate-700 relative overflow-hidden" style={{ backgroundImage: "url('/img/fondo3.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
             
            {/* Header */}
            <header className="w-full flex justify-between items-center p-4 bg-slate-800/80 rounded-xl mb-4 z-20">
                <div className="flex items-center gap-4">
                    <span className="text-cyan-300 font-bold text-xl">{student.name}</span>
                    <span className="bg-slate-700 px-3 py-1 rounded text-white font-mono">Nivel 3</span>
                </div>
                <Battery charge={progress} className="w-24 h-10" />
            </header>

            {/* Content */}
            <div className="flex-1 relative z-10">
                {phase === 'intro' ? renderIntro() : renderGame()}
            </div>

            {/* Dialog Overlay */}
            {showDialog && (
                 <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border-2 border-yellow-400 rounded-2xl p-8 max-w-md text-center shadow-2xl animate-fade-in-up">
                        <div className="text-6xl mb-4">🌠</div>
                        <p className="text-xl text-white font-bold mb-6">{dialogContent.text}</p>
                        <button 
                            onClick={handleDialogNext}
                            className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all"
                        >
                            {dialogContent.btn}
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

export default LevelThree;
