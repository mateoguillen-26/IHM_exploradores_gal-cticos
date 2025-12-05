
import React, { useState, useEffect } from 'react';
import type { Student } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StartGame from './components/StartGame';
import EditStudent from './components/EditStudent';
import IntroVideo from './components/IntroVideo';
import VideoExplicacion from './components/VideoExplicacion';
import VowelGame from './components/game/VowelGame';
import LevelMap from './components/game/LevelMap';
import LevelTwo from './components/game/LevelTwo';
import LevelThree from './components/game/LevelThree';
import LevelFour from './components/game/LevelFour';
import LevelFive from './components/game/LevelFive';
import LevelSix from './components/game/LevelSix';
import CompletionScreen from './components/CompletionScreen';
import { characters, Character } from './components/game/gameData';


// Mock de datos de usuarios y estudiantes
const userCredentials: Record<string, string> = {
  'admin@admin': 'admin',
  'mateo@mateo': 'mateo',
};

const initialTeachersData: Record<string, Student[]> = {
  'admin@admin': [
    { id: 1, name: 'Luna', birthDate: '2018-05-20' },
    { id: 2, name: 'Leo', birthDate: '2018-08-15' },
  ],
  'mateo@mateo': [
    { id: 3, name: 'Mia', birthDate: '2019-01-10' },
    { id: 4, name: 'Zoe', birthDate: '2019-03-22' },
    { id: 5, name: 'Nova' },
  ],
};

type GameView = 'login' | 'dashboard' | 'editStudent' | 'selectCharacter' | 'introVideo' | 'videoExplicacion' | 'vowelGame' | 'levelTwo' | 'levelThree' | 'levelFour' | 'levelFive' | 'levelSix' | 'levelMap' | 'gameComplete';

const App: React.FC = () => {
  const [teachersData, setTeachersData] = useState(initialTeachersData);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [view, setView] = useState<GameView>('login');
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0); // This represents battery charge
  const [currentLevel, setCurrentLevel] = useState(1);
  const [errors, setErrors] = useState(0);


  const handleLogin = (email: string, password: string): boolean => {
    if (userCredentials[email] && userCredentials[email] === password) {
      setCurrentUserEmail(email);
      setView('dashboard');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUserEmail(null);
    setSelectedStudent(null);
    setEditingStudent(null);
    setSelectedCharacter(null);
    setScore(0);
    setProgress(0);
    setCurrentLevel(1);
    setErrors(0);
    setView('login');
  };

  const handleAddStudent = (name: string) => {
    if (!currentUserEmail || !name.trim()) return;

    const newStudent: Student = {
      id: Date.now(),
      name: name.trim(),
    };
    
    setTeachersData(prevData => ({
      ...prevData,
      [currentUserEmail]: [...(prevData[currentUserEmail] || []), newStudent],
    }));
  };
  
  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setView('selectCharacter');
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setView('editStudent');
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    if (!currentUserEmail) return;

    setTeachersData(prevData => ({
      ...prevData,
      [currentUserEmail]: prevData[currentUserEmail].map(s => 
        s.id === updatedStudent.id ? updatedStudent : s
      ),
    }));
    setEditingStudent(null);
    setView('dashboard');
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    setView('dashboard');
  };

  const handleBackToDashboard = () => {
    setSelectedStudent(null);
    setSelectedCharacter(null);
    setView('dashboard');
  };

  const handleGameStart = (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (character) {
      setSelectedCharacter(character);
      setScore(0);
      setProgress(0); // Reset battery
      setCurrentLevel(1);
      setErrors(0);
      setView('introVideo'); // Go to intro video first
    }
  };

  // Called when a level is completed (VowelGame, LevelTwo, LevelThree, LevelFour, LevelFive)
  const handleLevelWin = () => {
      // Increase Progress (Battery) - 1 bar per level (total 6 levels)
      const newProgress = Math.min(progress + 1, 6);
      setProgress(newProgress);
      
      // Move to map immediately
      setView('levelMap');
  };

  // Special handler for final game completion (Level 6)
  const handleFinalWin = () => {
     console.log("APP: Game Complete handler triggered");
     setProgress(6); // Force 100% battery
     setView('gameComplete');
  }

  // Called when intro video ends
  const handleIntroVideoEnd = () => {
    setView('videoExplicacion');
  };

  // Called when video explanation ends
  const handleVideoEnd = () => {
    setView('vowelGame');
  };

  // Called from LevelMap "Next Mission" button
  const handleNextLevel = () => {
      if (currentLevel === 1) {
          setCurrentLevel(2);
          setView('levelTwo');
      } else if (currentLevel === 2) {
          setCurrentLevel(3);
          setView('levelThree');
      } else if (currentLevel === 3) {
          setCurrentLevel(4);
          setView('levelFour');
      } else if (currentLevel === 4) {
          setCurrentLevel(5);
          setView('levelFive');
      } else if (currentLevel === 5) {
          setCurrentLevel(6);
          setView('levelSix');
      } else if (currentLevel === 6) {
          // If trying to go next from level 6 map position, go to win screen
          handleFinalWin();
      }
  };

  const handleQuitGame = () => {
      setView('selectCharacter');
  };
  
  const renderContent = () => {
    if (!currentUserEmail) {
      return <Login onLogin={handleLogin} />;
    }

    const currentStudents = teachersData[currentUserEmail] || [];

    switch (view) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      
      case 'dashboard':
        return <Dashboard 
          userEmail={currentUserEmail}
          students={currentStudents} 
          onAddStudent={handleAddStudent} 
          onSelectStudent={handleSelectStudent} 
          onEditStudent={handleEditStudent}
          onLogout={handleLogout}
        />;
      
      case 'editStudent':
        if (editingStudent) {
          return <EditStudent student={editingStudent} onUpdate={handleUpdateStudent} onCancel={handleCancelEdit} />;
        }
        setView('dashboard');
        return null;

      case 'selectCharacter':
        if (selectedStudent) {
          return <StartGame student={selectedStudent} onBack={handleBackToDashboard} onGameStart={handleGameStart} />;
        }
        setView('dashboard');
        return null;

      case 'introVideo':
        if (selectedCharacter) {
          return <IntroVideo character={selectedCharacter} onVideoEnd={handleIntroVideoEnd} />;
        }
        setView('dashboard');
        return null;

      case 'videoExplicacion':
        return <VideoExplicacion onVideoEnd={handleVideoEnd} onSkip={handleVideoEnd} />;

      case 'vowelGame':
        if (selectedStudent && selectedCharacter) {
          return <VowelGame 
            key="level1"
            student={selectedStudent}
            character={selectedCharacter}
            score={score}
            progress={progress}
            onScoreChange={setScore}
            onErrorChange={setErrors}
            onComplete={handleLevelWin}
            onQuit={handleQuitGame}
            userEmail={currentUserEmail || undefined}
          />;
        }
        setView('dashboard');
        return null;

      case 'levelTwo':
        if (selectedStudent && selectedCharacter) {
          return <LevelTwo 
            key="level2"
            student={selectedStudent}
            character={selectedCharacter}
            score={score}
            progress={progress}
            onScoreChange={setScore}
            onComplete={handleLevelWin}
            onQuit={handleQuitGame}
            userEmail={currentUserEmail || undefined}
          />
        }
        setView('dashboard');
        return null;

      case 'levelThree':
        if (selectedStudent && selectedCharacter) {
          return <LevelThree
            key="level3"
            student={selectedStudent}
            character={selectedCharacter}
            score={score}
            progress={progress}
            onScoreChange={setScore}
            onComplete={handleLevelWin}
            onQuit={handleQuitGame}
            userEmail={currentUserEmail || undefined}
          />
        }
        setView('dashboard');
        return null;

      case 'levelFour':
        if (selectedStudent && selectedCharacter) {
          return <LevelFour
            key="level4"
            student={selectedStudent}
            character={selectedCharacter}
            score={score}
            progress={progress}
            onScoreChange={setScore}
            onComplete={handleLevelWin}
            onQuit={handleQuitGame}
            userEmail={currentUserEmail || undefined}
          />
        }
        setView('dashboard');
        return null;

      case 'levelFive':
        if (selectedStudent && selectedCharacter) {
          return <LevelFive
            key="level5"
            student={selectedStudent}
            character={selectedCharacter}
            score={score}
            progress={progress}
            onScoreChange={setScore}
            onComplete={handleLevelWin}
            onQuit={handleQuitGame}
            userEmail={currentUserEmail || undefined}
          />
        }
        setView('dashboard');
        return null;

      case 'levelSix':
        if (selectedStudent && selectedCharacter) {
          return <LevelSix
            key="level6"
            student={selectedStudent}
            character={selectedCharacter}
            score={score}
            progress={progress}
            onScoreChange={setScore}
            onComplete={handleFinalWin}
            onQuit={handleQuitGame}
            userEmail={currentUserEmail || undefined}
          />
        }
        setView('dashboard');
        return null;

      case 'levelMap':
         if (selectedStudent && selectedCharacter) {
             return <LevelMap 
                key={`map-${currentLevel}`}
                currentLevel={currentLevel + 1} // Map shows moving TO next level (e.g. at lvl 1 complete, shows 2)
                character={selectedCharacter}
                energy={progress}
                onNextLevel={handleNextLevel}
             />
         }
         setView('dashboard');
         return null;
      
      case 'gameComplete':
          return <CompletionScreen key="complete" score={score} onReset={handleBackToDashboard} />;

      default:
        return <Dashboard 
          userEmail={currentUserEmail}
          students={currentStudents} 
          onAddStudent={handleAddStudent} 
          onSelectStudent={handleSelectStudent} 
          onEditStudent={handleEditStudent}
          onLogout={handleLogout}
        />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-4 sm:p-6 overflow-hidden">
       <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              animation: `twinkle ${Math.random() * 5 + 3}s linear infinite`,
            }}
          ></div>
        ))}
        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
      <main className="relative z-10 flex flex-col items-center justify-center w-full min-h-screen">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
