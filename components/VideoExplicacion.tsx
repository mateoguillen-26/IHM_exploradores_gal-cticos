import React, { useState } from 'react';

interface VideoExplicacionProps {
  onVideoEnd: () => void;
  onSkip: () => void;
}

const VideoExplicacion: React.FC<VideoExplicacionProps> = ({ onVideoEnd, onSkip }) => {
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  const handleVideoEnd = () => {
    setIsVideoEnded(true);
    setTimeout(onVideoEnd, 1000); // Wait 1 second before proceeding
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-900/90 relative overflow-hidden">
      {/* Video Container */}
      <div className="w-full max-w-4xl h-full md:h-auto md:max-h-[80vh] flex items-center justify-center p-4">
        <video
          src="/img/explicacion.mp4"
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
          ¡A Jugar! →
        </button>
      )}
    </div>
  );
};

export default VideoExplicacion;
