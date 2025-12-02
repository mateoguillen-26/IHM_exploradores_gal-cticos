import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string, password: string) => boolean;
}

const RocketIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.25c.586 0 1.162.034 1.726.1a.75.75 0 01.713.888 6.743 6.743 0 00-1.07 4.393c.117.375.25.741.399 1.095l.8-3.996a.75.75 0 01.748-.659h.01c.414 0 .75.336.75.75V15a.75.75 0 01-1.5 0v-4.432l-.636 3.182a.75.75 0 01-.703.55h-.01a.75.75 0 01-.702-.55L9.636 10.568V15a.75.75 0 01-1.5 0V8.25a.75.75 0 01.75-.75h.01a.75.75 0 01.748.659l.8 3.996A9.223 9.223 0 0010.5 7.63a6.743 6.743 0 00-1.07-4.393.75.75 0 01.713-.888c.564-.066 1.14-.1 1.726-.1zM12 9a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 0112 9z" />
    <path fillRule="evenodd" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 2.25c-6.213 0-11.25-5.037-11.25-11.25S5.787-1.5 12-1.5s11.25 5.037 11.25 11.25S18.213 23.25 12 23.25z" clipRule="evenodd" />
  </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" />
    </svg>
);

const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
);


const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === '' || password.trim() === '') {
      setError('Por favor, complete ambos campos.');
      return;
    }
    
    const loginSuccess = onLogin(email, password);
    if (!loginSuccess) {
      setError('Credenciales incorrectas. Inténtalo de nuevo, Comandante.');
    } else {
      setError('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-sm shadow-2xl shadow-cyan-500/10 rounded-2xl p-8 space-y-8 border border-slate-700">
        <div className="text-center">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300">
            Inicio Galáctico
          </h1>
          <p className="text-slate-400 mt-2">¡Bienvenido de nuevo, Comandante Espacial!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <UserIcon className="w-5 h-5 text-slate-500" />
            </div>
            <input
              type="email"
              placeholder="profesor@galaxia.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LockIcon className="w-5 h-5 text-slate-500" />
            </div>
            <input
              type="password"
              placeholder="Contraseña Súper Secreta"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-cyan-500/30 transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <RocketIcon className="w-6 h-6" />
            <span>Lanzar Misión</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;