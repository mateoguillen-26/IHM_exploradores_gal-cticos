import React, { useState } from 'react';
import type { Character } from './game/gameData';

interface IntroVideoProps {
  character: Character;
  onVideoEnd: () => void;
}

const IntroVideo: React.FC<IntroVideoProps> = ({ character, onVideoEnd }) => {
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  // Determine video path based on character color
  const getVideoPath = () => {
    if (character.color === 'yellow') {
      return '/img/intro_amarillo.mp4';
    } else if (character.color === 'purple') {
      return '/img/intro_morado.mp4';
    }
    return '/img/intro_amarillo.mp4'; // Default fallback
  };

  const handleVideoEnd = () => {
    setIsVideoEnded(true);
    setTimeout(onVideoEnd, 500);
  };

  const handleSkip = () => {
    onVideoEnd();
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-900/90 relative overflow-hidden">
      {/* Video Container */}
      <div className="w-full max-w-4xl h-full md:h-auto md:max-h-[80vh] flex items-center justify-center p-4">
        <video
          src={getVideoPath()}
          controls
          autoPlay
          onEnded={handleVideoEnd}
          className="w-full h-full md:h-auto rounded-2xl shadow-2xl"
          style={{ maxWidth: '100%', maxHeight: '100vh' }}
        >
          Tu navegador no soporta videos HTML5.
        </video>
      </div>

      {/* Skip Button */}
      {!isVideoEnded && (
        <button
          onClick={handleSkip}
          className="absolute bottom-8 right-8 px-6 py-3 bg-slate-700/80 hover:bg-slate-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Saltar →
        </button>
      )}

      {/* Continue Button (appears when video ends) */}
      {isVideoEnded && (
        <button
          onClick={onVideoEnd}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-8 py-4 bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white font-black text-lg rounded-2xl transition-all duration-200 transform hover:scale-110 shadow-2xl animate-bounce"
        >
          Siguiente →
        </button>
      )}
    </div>
  );
};

export default IntroVideo;
